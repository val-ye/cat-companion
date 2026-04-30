# 加一只新猫

每只猫就是 `src/cats/<id>.js` 里的一个模块。三步搞定。

## 1. 复制一个现有的猫做模板

最快的办法是复制 `src/cats/momo.js` 或 `src/cats/java.js`:

```bash
cp src/cats/momo.js src/cats/<新猫id>.js
```

文件结构是这样的(必须导出的字段):

```js
module.exports = {
  id: 'biscuit',                      // 唯一,字母数字下划线
  name: '饼干',                        // 显示名
  species: '英短 / British Shorthair', // 品种(随便写,会显示在设置页)
  description: '一句话外形描述',
  weightKg: 4.5,                      // 可选,显示用
  accentColor: '#c08a5a',             // UI 主色调,选个能配合毛色的
  defaultSize: { width: 160, height: 140 },
  poses: {
    idle:  '<svg ...> ... </svg>',    // 必须
    walk:  '<svg ...> ... </svg>',    // 走路时用
    sleep: '<svg ...> ... </svg>',    // 在 Dock / 偶尔趴下时用
    alert: '<svg ...> ... </svg>',    // 提醒页面放大时用
  },
};
```

四个 pose 都可以是同一张 SVG —— 但建议至少 `idle` 和 `sleep` 不同,看起来更
活泼。

## 2. SVG 怎么画?

- viewBox 用 `0 0 160 140`(或者自定义,但要和 `defaultSize` 一致)。
- 整张 SVG 默认朝右,程序会通过 CSS `scaleX(-1)` 翻转。
- 不要在 SVG 里加动画 —— 走路、呼吸、打盹的动画都由
  `src/renderer/pet/pet.css` 提供,套到 `<div class="cat">` 上。
- 想画得简单又好看,可以参考 momo.js 里的 `linearGradient` 用法。

如果你不想自己画,把猫的照片喂给任意 AI 生图工具,让它出 SVG / PNG 也行 ——
PNG 也能塞进 `<svg>` 里:

```js
const idle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140">
  <image href="data:image/png;base64,..." width="160" height="140"/>
</svg>`;
```

## 3. 注册

打开 `src/cats/index.js`:

```js
const momo    = require('./momo');
const java    = require('./java');
const biscuit = require('./biscuit');   // ← 新增

register(momo);
register(java);
register(biscuit);                      // ← 新增
```

重启 app,新猫会自动出现在 Dock 菜单和设置页里。

## 升级 / 修改已有的猫

直接改对应的 `src/cats/<id>.js`,然后重启即可。**不要换 `id`**,否则用户的
「活跃名单」会找不到这只猫。

## 想给猫加新动作 / 状态怎么办?

- 把新 pose(比如 `eat`、`stretch`)加进 `poses`。
- 在 `src/renderer/pet/pet.js` 的 `scheduleNextAction()` 里安排什么时候触发。
- 在 `src/renderer/pet/pet.css` 里加对应的 `.cat[data-pose="eat"]` 动画。

## 程序更新流程

1. 拉最新代码:`git pull`
2. 重装依赖(如果 package.json 变了):`npm install`
3. 重新生成图标(可选):`npm run build:icons`
4. 启动:`npm start`

发版给别人用就 `npm run dist:mac`,把 `dist/` 里的 `.dmg` 给他们就行。
