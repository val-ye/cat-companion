import AppKit
import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation
import UniformTypeIdentifiers
import Vision

struct Args {
  let input: URL
  let output: URL
  let mode: String
}

func parseArgs() -> Args {
  let raw = CommandLine.arguments
  guard raw.count >= 3 else {
    fputs("usage: swift scripts/extract-pet.swift <input-image> <output-png> [photo|soft]\n", stderr)
    exit(2)
  }
  return Args(
    input: URL(fileURLWithPath: raw[1]),
    output: URL(fileURLWithPath: raw[2]),
    mode: raw.count >= 4 ? raw[3] : "soft"
  )
}

func loadCGImage(_ url: URL) -> CGImage {
  guard let image = NSImage(contentsOf: url) else {
    fputs("Could not read image: \(url.path)\n", stderr)
    exit(1)
  }
  var rect = NSRect(origin: .zero, size: image.size)
  guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
    fputs("Could not create CGImage: \(url.path)\n", stderr)
    exit(1)
  }
  return cgImage
}

func foregroundMask(for image: CGImage) throws -> CIImage {
  let request = VNGenerateForegroundInstanceMaskRequest()
  let handler = VNImageRequestHandler(cgImage: image, options: [:])
  try handler.perform([request])
  guard let observation = request.results?.first else {
    throw NSError(domain: "extract-pet", code: 1, userInfo: [NSLocalizedDescriptionKey: "No foreground mask found"])
  }
  let instances = observation.allInstances
  let mask = try observation.generateScaledMaskForImage(forInstances: instances, from: handler)
  return CIImage(cvPixelBuffer: mask)
}

func stylize(_ image: CIImage, mode: String) -> CIImage {
  if mode == "photo" { return image }

  let color = CIFilter.colorControls()
  color.inputImage = image
  color.saturation = 1.08
  color.contrast = 1.08
  color.brightness = 0.015

  let sharpen = CIFilter.sharpenLuminance()
  sharpen.inputImage = color.outputImage ?? image
  sharpen.sharpness = 0.18

  let exposure = CIFilter.exposureAdjust()
  exposure.inputImage = sharpen.outputImage ?? image
  exposure.ev = 0.05
  return exposure.outputImage ?? image
}

func cropToVisibleAlpha(_ image: CIImage, context: CIContext) -> CIImage {
  guard let cg = context.createCGImage(image, from: image.extent),
        let data = cg.dataProvider?.data,
        let bytes = CFDataGetBytePtr(data)
  else { return image }

  let width = cg.width
  let height = cg.height
  let bytesPerRow = cg.bytesPerRow
  var minX = width
  var minY = height
  var maxX = 0
  var maxY = 0

  for y in 0..<height {
    for x in 0..<width {
      let alpha = bytes[y * bytesPerRow + x * 4 + 3]
      if alpha > 12 {
        minX = min(minX, x)
        minY = min(minY, y)
        maxX = max(maxX, x)
        maxY = max(maxY, y)
      }
    }
  }

  if minX >= maxX || minY >= maxY { return image }
  let pad = 36
  let cropX = max(0, minX - pad)
  let cropY = max(0, minY - pad)
  let cropW = min(width - cropX, maxX - minX + pad * 2)
  let cropH = min(height - cropY, maxY - minY + pad * 2)
  return image.cropped(to: CGRect(x: cropX, y: cropY, width: cropW, height: cropH))
}

func drawRGBA(_ image: CGImage) -> (data: Data, width: Int, height: Int, bytesPerRow: Int) {
  let width = image.width
  let height = image.height
  let bytesPerRow = width * 4
  var data = Data(repeating: 0, count: bytesPerRow * height)
  data.withUnsafeMutableBytes { ptr in
    guard let base = ptr.baseAddress else { return }
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    let ctx = CGContext(
      data: base,
      width: width,
      height: height,
      bitsPerComponent: 8,
      bytesPerRow: bytesPerRow,
      space: colorSpace,
      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    )!
    ctx.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  }
  return (data, width, height, bytesPerRow)
}

func pawFixedCutout(source: CIImage, mask: CIImage, context: CIContext) throws -> CIImage {
  guard let sourceCG = context.createCGImage(source, from: source.extent),
        let maskCG = context.createCGImage(mask, from: source.extent)
  else {
    throw NSError(domain: "extract-pet", code: 3, userInfo: [NSLocalizedDescriptionKey: "Could not render paw-fix inputs"])
  }

  var sourceRGBA = drawRGBA(sourceCG)
  let maskRGBA = drawRGBA(maskCG)
  let width = sourceRGBA.width
  let height = sourceRGBA.height

  sourceRGBA.data.withUnsafeMutableBytes { outPtr in
    guard let out = outPtr.bindMemory(to: UInt8.self).baseAddress else { return }
    maskRGBA.data.withUnsafeBytes { maskPtr in
      guard let maskBytes = maskPtr.bindMemory(to: UInt8.self).baseAddress else { return }
      for y in 0..<height {
        for x in 0..<width {
          let idx = y * sourceRGBA.bytesPerRow + x * 4
          let r = out[idx]
          let g = out[idx + 1]
          let b = out[idx + 2]
          let brightness = (Int(r) + Int(g) + Int(b)) / 3
          var alpha = maskBytes[idx]

          // Vision sometimes drops white paws touching dark furniture. In paw-fix
          // mode, union bright lower-center pixels back into the foreground mask.
          let inLowerBody = y > Int(Double(height) * 0.66)
          let inCenterBand = x > Int(Double(width) * 0.26) && x < Int(Double(width) * 0.70)
          let likelyWhiteFur = brightness > 145 && r > 130 && g > 125 && b > 115
          if inLowerBody && inCenterBand && likelyWhiteFur {
            alpha = max(alpha, 235)
          }

          if alpha < 16 {
            out[idx] = 0
            out[idx + 1] = 0
            out[idx + 2] = 0
            out[idx + 3] = 0
          } else {
            out[idx + 3] = alpha
          }
        }
      }
    }
  }

  let provider = CGDataProvider(data: sourceRGBA.data as CFData)!
  let fixedCG = CGImage(
    width: width,
    height: height,
    bitsPerComponent: 8,
    bitsPerPixel: 32,
    bytesPerRow: sourceRGBA.bytesPerRow,
    space: CGColorSpace(name: CGColorSpace.sRGB)!,
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
    provider: provider,
    decode: nil,
    shouldInterpolate: true,
    intent: .defaultIntent
  )!
  return CIImage(cgImage: fixedCG)
}

let args = parseArgs()
let cgImage = loadCGImage(args.input)
let context = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
let input = CIImage(cgImage: cgImage)

do {
  let mask = try foregroundMask(for: cgImage)
  let styled = stylize(input, mode: args.mode)
  let clear = CIImage(color: .clear).cropped(to: input.extent)

  let cutout: CIImage
  if args.mode.contains("pawfix") {
    cutout = try pawFixedCutout(source: styled, mask: mask, context: context)
  } else {
    let blend = CIFilter.blendWithMask()
    blend.inputImage = styled
    blend.backgroundImage = clear
    blend.maskImage = mask

    guard let output = blend.outputImage else {
      throw NSError(domain: "extract-pet", code: 2, userInfo: [NSLocalizedDescriptionKey: "Blend failed"])
    }
    cutout = output
  }

  let cropped = cropToVisibleAlpha(cutout, context: context)
  try FileManager.default.createDirectory(at: args.output.deletingLastPathComponent(), withIntermediateDirectories: true)
  try context.writePNGRepresentation(
    of: cropped,
    to: args.output,
    format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!
  )
  print("wrote \(args.output.path)")
} catch {
  fputs("extract-pet failed: \(error.localizedDescription)\n", stderr)
  exit(1)
}
