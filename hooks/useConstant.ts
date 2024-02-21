
// 描述
// 创建一个常量值，并在多次渲染中保持不变。该 Hook 接受一个函数 fn，该函数返回一个值，用于创建常量。
// 具体实现如下：

// 1、定义了一个泛型类型 ResultBox<T>，用于包装常量值。
// 2、在 useConstant 函数中，使用 React.useRef 创建一个 ref 对象 ref，用于存储常量值。
// 3、在 if 语句中，判断 ref.current 是否为 undefined，如果是，则调用 fn 函数创建常量值，并将其存储在 ref.current.v 中。
// 4、最后，返回 ref.current.v，即常量值。

// how to use
// import useConstant from './useConstant';

// function MyComponent() {
//   const constantValue = useConstant(() => {
//     // 创建常量值的代码
//     return 'constant value';
//   });

//   // 使用常量值
//   return <div>{constantValue}</div>;
// }

import * as React from 'react'

type ResultBox<T> = { v: T }

export default function useConstant<T>(fn: () => T): T {
  const ref = React.useRef<ResultBox<T>>()

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}
