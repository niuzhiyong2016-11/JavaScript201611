ajax
异步javascript和xml

ajax的作用：让浏览器可以异步的进行http(s)的请求。

ajax的实现方式
利用浏览器提供的API（应用程序编程接口），进行异步http请求。

处理兼容性的方式有两种：
1、优雅降级 优先保证高级浏览器
2、渐进增强 优先保证低版本浏览器


高级浏览器
XMLHttpRequest
低版本ie
ActiveXObject
