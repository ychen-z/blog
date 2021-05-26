
### keyof 用法

#### 操作接口
```
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string | number
```

#### keyof 也可以用于操作类



```
class Person {
  name: string = "Semlinker";
}

let sname: keyof Person; // name
sname = "name";

// set sname = "age"  // Type '"age"' is not assignable to type '"name"'.
```
