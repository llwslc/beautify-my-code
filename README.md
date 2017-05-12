# beautify-my-code-atom

> atom 代码美化插件, 基于 [js-beautify](https://github.com/beautify-web/js-beautify) 封装

## 功能设置

* * [x] 文件保存时格式化代码

## 缩进类型设置
* * [x] 使用 tab 缩进代码
* 代码缩进的长度为几个字母
  * 默认: 2
## 缩进风格设置
* 大括号缩进风格 [collapse, expand, end-expand, none]
  * 默认: expand
```
// 之前
var foo = function () {
  console.log('hello');
}
// 之后
var foo = function ()
{
  console.log('hello'); 
}
```
* * [x] 保留内联代码的缩进
```
// 之前
foo({k: v});
// 保留
foo({ k: v });
// 不保留
foo(
{
  k: v
});
```
* * [x] object 大括号缩进风格为 collapse
```
// 之前
foo(
{
  k: v
});
// 之后
foo({
  k: v
});
```
* * [ ] 大括号前后填充空格
```
// 之前
var o = { k: v };
// 之后
var o = {k: v};
```
* * [ ] 保留代码中 array 的缩进
```
// 之前
var arr = [1,
  2,
3, 4];
// 之后
var arr = [1,
  2,
  3, 4
];
```
* * [ ] 链式函数另起一行
```
// 之前
foo().send().end();
// 之后
foo()
  .send()
  .end();
```
## 空行相关设置
* * [x] 以空行为文件开头
* * [x] 以空行为文件结尾
* 保留最多的空白行数
  * 默认: 3
## 其他设置
* * [x] 匿名函数和括号之间加一个空格
```
// 之前
var foo = function() {};
// 之后
var foo = function () {};
```
* * [x] 连续行代码注释对齐
```
// 之前
var obj = {
  k1: vv,      // k1
  k2: vvvvvv,  // //k1
  k2: vvv,     // k2
  k3: vvv,     //
  // none

//
//none
//

  // none
  k4: v        // k3
};
// 之后
var obj = {
  k1: vv,      // k1
  k2: vvvvvv,  // //k1
  k2: vvv,     // k2
  k3: vvv,     //
               // none

  //
  // none
  //

         // none
  k4: v  // k3
};
```
## 未提供的设置
* 单行注释格式化
```
// 之前
//one
//  two
////one
////    two
// 之后
// one
// two
// //one
// //    two
```
