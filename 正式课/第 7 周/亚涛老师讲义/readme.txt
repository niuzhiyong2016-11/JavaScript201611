张亚涛

第一天上午 http协议相关
第一天下午 原生ajax
第二天上午 jquery
第二天下午 跨域

URL
名称：统一资源定位符
作用：标识某一个资源在整个互联网上的唯一位置

URN：统一资源名称

URI：统一资源标识符

URI是URL和URN的超集
URI组件：:/@?=&#

URL请求参数的value里不能存在URL组件，如果必须存在那么一定要使用encodeURIComponent方法进行格式化

encodeURI encodeURIComponent
相同点：都可以把非英文字符格式化给URI字符串格式
不同点：encodeURIComponent可以格式化URI组件，而encodeURI不可以

URL的组成结构
<方案>://<用户名>:<密码>@<域名>:<端口>/<路径>?<请求参数>#<锚点>

方案：如果在浏览器不输入方案进行url请求时，那么浏览器会自动设置一个默认的方案->http
端口：如果在浏览器请求url时不输入端口，那么浏览器会根据方案自定义设置默认端口
http的默认端口为80
https的默认端口为443
ftp的默认端口为21
请求参数：请求参数的格式是固定的，key1=value1&key2=value2&key3=value3
URL中不能存在非英文字符

HTTPS = http + ssl/tls（加密方法）

ssl/tls是一种加密方式，使用公私密钥的方式来实现。基于非对称加密算法中的RSA算法来实现。

DNS解析
domain naming service 域名名称服务
把域名解析为一个ip地址

网络七层协议

1、物理层 网卡
2、数据链路层 网卡驱动
3、网络层 ip
4、传输层 TCP/IP udp
5、会话层 断开会话/保持会话
6、表示层 加密解密
7、应用层 http https ftp ftp mailto telnet smtp

网页从访问到显示的过程：
1、DNS解析
2、根据ip和端口连接服务器
3、发送请求报文
4、等待服务器响应
5、接收服务器响应
6、断开连接
7、显示数据

HTTP
超文本传输协议

作用：负责连接并传输http客户端和http服务器之间的数据。

http由两部分组成“请求（发送给服务器）”和“响应（返回给客户端）”。
注意：必须现有请求后有响应并且一个请求对应一个响应。

事务：事务由n+1个事件组成，只有当包含所有事件都完成时，该事务才算成功，否则失败。
http协议是一个事务。它包含两个事件“请求”和“响应”，当“请求”和“响应”都完成时，该http交互才算完成，否则失败。并且每一个http事务只能使用一次不可复用，第二次http交互必须是一个全新的http事务。

当http客户端接收到服务器返回的响应报文完成时，http事务才算完成。

http请求和响应的数据内容叫做“报文”。

http请求的数据格式

http请求报文的第一行也就是第一部分叫做“起始行”。
一） 请求起始行：请求的基本信息
http请求方式、请求地址、http版本号
二） 请求首部：请求的附属信息
cookie：保持网站登录状态
user-agent: 自动适配客户端

PC: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2679.0 Safari/537.36
mobile: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1
三） 请求主体：存放发送给服务器的数据
文件上传

http响应
一） 响应起始行
http版本号（必须和请求起始行中的版本号一样）、服务器状态码、状态码描述符
二） 响应首部
date：获取服务器时间
content-length：获取资源大小
三）响应主体
存放http服务器发送给http客户端的数据。


http request method：
表示当前http请求使用什么方式去发送数据。

GET 从服务器获取资源
POST 往服务器发送资源
DELETE 通知服务器删除某个资源
HEAD http响应报文只需包含起始行和首部，不需要返回响应主体
PUT 往服务器发送资源

get方法:
html中所有通过href、src属性以及地址栏访问的资源，全部都是get方法请求。
1、没有请求主体
因为get方法的目的是获取服务器资源，而请求主体是用来存放发送给服务器的数据，所以get方法不需要请求主体。
2、有大小限制
因为get方法没有请求主体，所以发送的参数只能先格式化为querystring（请求参数）的格式,然后拼接到url后面。但是浏览器对url的长度有大小限制，所以造成了get方法有大小限制（IE 2k、CHROME 8k、FIREFOX 7k），一般URL的长度最长为2k。
3、可以被浏览器缓存
4、明文发送数据

post方法：
1、有请求主体
2、没有大小限制
因为post方法会把数据存在请求主体中，而请求主体是没有大小限制的。
3、永远不会被浏览器缓存
4、不是明文发送

delete方法：
和get方法特点一模一样，唯一不一样的是该方法的响应状态码为202

head方法：
和get方法特点一模一样，唯一不一样的是该方法不会返回响应主体，只会返回响应其实行和响应首部。也就是说该方法既没有请求主体也没有响应主体。

put方法：
和post方法特点一模一样，但是有2点不同
1、该方法的响应状态码为202
2、该方法有幂等性（必须服务器实现之后，才可用），而post没有。

x^N === x

http状态码：
标识服务器该请求的接口
状态码有3个数字组成，一共分为5类
1xx http请求正在初始化
101 切换协议 websocket(html5)

2xx http客户端请求成功
200 ok 服务器处理成功
202 服务器接收该请求

3xx 重定向和缓存
301 永久移动
302 临时移动
301和302它们的作用是相同的，都是服务器用来将请求重定向到指定的网站或页面。
注意事项：服务器返回301或者302之后，必须在响应首部中设置一个Location首部，它是用来告诉浏览器重定向的地址。
demo：360buy.com -> jd.com（301）  登录（302）
301和302的区别：
301标识源网站永久转移到新网站，意味着老的域名已经不再使用，所以会降低搜索引擎的权重。而302不会存在这种情况。

304 资源未改变，缓存静态资源时使用。
304是通过2个响应首部和2个请求首部来实现的。
响应首部：
last-modified（标识请求的资源在服务器最后一次修改的时间，格式为GMT）
etag（标识请求的资源在服务器上最后一次的实体标签）MD5

请求首部：
last-modified-since（和last-modified对应）
if-none-match（和etag对应）

前端浏览器缓存的方式：
1、强缓存（通过2个响应首部来实现的）
expire：静态资源的缓存过期时间，单位为秒，相对于浏览器时间。
cache-control：静态资源缓存多少秒，相对于浏览器时间。
注意事项：在缓存没有过期之前，浏览器不会去服务器请求新的资源。

2、304缓存
涉及到4个首部，和强缓存不同的是每次浏览器在访问静态资源都会先去服务器校验该资源是否已过期。


4xx http客户端请求失败
400 错误的请求，出现的请求有以下几种：
1、url中缺少参数
2、url方案错误
3、url方法错误
4、url的长度超过服务器限制
5、请求的端口错误

401 未认证，没有登录
403 禁止访问，没有权限
404 该资源未找到

5xx http服务器错误

MIME Type：
多用途因特网邮件扩展
作用：标识数据的类型。

在http协议中，使用通用首部Content-Type（请求和响应都存在）来表示MIME Type。

html text/html
css text/css
js text/javascript application/x-javascript
jpg image/jpeg
png image/png
gif image/gif
json application/json
pdf application/pdf

格式是固定：父类型/子类型
注意事项：当发送或响应的内容为文本格式时，可以通过content-type来执行内容的编码格式。例如：content-type：text/html; charset=utf-8

因为content-type是通用首部，所以在请求和响应中都存在。
请求首部中的content-type是告诉服务器，浏览器发送的内容格式。
响应首部中的content-type是告诉浏览器，服务器发送的内容格式。

表单提交有一个特殊的MIME TYPE:
content-type：application/x-www-form-urlencoded; charset=utf-8


http 1.1和2.0的区别：
1、多路复用
2、首部压缩
3、服务器推送
4、报文使用二进制数据帧实现，不再使用字符串。



















