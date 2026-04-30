# Cat Companion 🐈

让 **馍馍**(布偶)和 **Java**(俄罗斯蓝)住进你的 macOS Dock。

## 功能

- 🪟 **桌面漫游**:小猫从 Dock 跳出,在屏幕底部随机走动、坐下、打盹。
- 🖱️ **可拖拽**:鼠标按住即可把它拎到任意位置,松手后继续自己玩。
- 🛌 **Dock 即猫窝**:没在桌面活跃的时候,Dock 图标变成蜷成一团睡觉的小猫。
- ⏰ **定时提醒 + 倒计时**:每隔自定义间隔(默认 45 分钟),猫的形象会放大铺满屏幕,
  显示自定义文字提醒你喝水/活动。屏幕中央有一圈倒计时(默认 2 分钟),走完会
  自动收起,不锁屏不抢鼠标 —— 你想立刻关掉就按 `Esc` 或点空白处。
- 🐾 **多猫共存**:可以一只,也可以两只同时在桌面。
- 🆕 **可扩展**:加新猫只需加一个 JS 文件,见 [`docs/ADDING_CATS.md`](docs/ADDING_CATS.md)。

## 角色

| ID | 名字 | 品种 | 体重 | 特征 |
|---|---|---|---|---|
| `momo` | 馍馍 | 布偶 (Ragdoll) | ~8.4 斤 | 蓝眼睛、粉鼻子、大爪子,背上翅膀状色块,尾巴有浅棕条纹 |
| `java` | Java | 俄罗斯蓝 (Russian Blue) | ~13.5 lb | 黑鼻子、圆眼睛、小爪子,腰宽呈三角形 |

## 运行

只需要 Node.js (≥ 18) 和 Electron。

```bash
cd cat-companion
npm install            # 同时会自动把 SVG 图标渲染成 PNG
npm start              # 启动应用
```

第一次启动后,Dock 里会出现猫咪图标。右键 / 长按 Dock 图标可以快速切换活跃的猫,
或者打开「设置…」修改提醒文字、间隔、缩放等。

## 打包成 .app

```bash
npm run dist:mac       # 生成 .dmg + .zip,产物在 dist/ 下
```

如果你只想本地试用而不签名/分发,`npm start` 已经足够。

## 操作速查

| 操作 | 行为 |
|---|---|
| 拖拽小猫 | 任意移动位置 |
| 双击小猫 | 立即触发一次提醒 |
| ⌘/Ctrl 点击小猫 | 让它回 Dock 睡觉 |
| 右键 Dock 图标 | 快速切换活跃的猫 / 打开设置 / 立即提醒 |
| Esc(提醒页面) | 关闭提醒 |

## 设置文件位置

`~/Library/Application Support/cat-companion/cat-companion-settings.json`

直接编辑也可以,改完重启 app 生效。

## 加新猫

见 [`docs/ADDING_CATS.md`](docs/ADDING_CATS.md)。简而言之,每只猫就是一个
导出 `id / name / poses` 的 JS 模块,加进 `src/cats/index.js` 注册一行就能用。
