### 元祖的使用方式

// 参考  https://github.com/ant-design/ant-design/blob/b837ecd95079f316d4008687fd31bbcd7361e8fd/components/button/button.tsx#L159

```

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text');
export type ButtonType = typeof ButtonTypes[number];
const ButtonShapes = tuple('circle', 'round');
export type ButtonShape = typeof ButtonShapes[number];
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

```
