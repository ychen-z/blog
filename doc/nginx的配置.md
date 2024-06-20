## Nginx基础配置
``` bash
#全局块
#user  nobody;
worker_processes  1;

#event块
events {
    worker_connections  1024;
}

#http块
http {
    #http全局块
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    #server块
    server {
        #server全局块
        listen       8000;
        server_name  localhost;
        #location块
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    #这边可以有多个server块
    server {
      ...
    }
}
```
###  server块
listen指令
server块中最重要的指令就是listen指令，这个指令有三种配置语法。
```
//第一种
listen address[:port] [default_server] [ssl] [http2 | spdy] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on|off] [reuseport] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];

//第二种
listen port [default_server] [ssl] [http2 | spdy] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on|off] [reuseport] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];

//第三种（可以不用重点关注）
listen unix:path [default_server] [ssl] [http2 | spdy] [proxy_protocol] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];
```

举例
+ listen 127.0.0.1:8000;  #只监听来自127.0.0.1这个IP，请求8000端口的请求
+ listen 127.0.0.1; #只监听来自127.0.0.1这个IP，请求80端口的请求（不指定端口，默认80）
+ listen 8000; #监听来自所有IP，请求8000端口的请求
+ listen *:8000; #和上面效果一样
+ listen localhost:8000; #和第一种效果一致
+ address：监听的IP地址（请求来源的IP地址），如果是IPv6的地址，需要使用中括号“[]”括起来，比如[fe80::1]等。
+ port：端口号，如果只定义了IP地址没有定义端口号，就使用80端口。这边需要做个说明：要是你压根没配置listen指令，那么如果nginx以超级用户权限运行，则使用*:80，否则使用*:8000
+ default_server：假如通过Host没匹配到对应的虚拟主机，则通过这台虚拟主机处理
+ server_name指令
用于配置虚拟主机的名称。语法是：
server_name name ...
对于name来说，可以只有一个名称，也可以由多个名称并列，之间用空格隔开。每个名字就是一个域名，由两段或者三段组成
server_name myserver.com www.myserver.com
在该例中，此虚拟主机的名称设置为myserver.com或www. myserver.com
在name 中可以使用通配符“*”，但通配符只能用在由三段字符串组成的名称的首段或尾段，或者由两段字符串组成的名称的尾段，如：
server_name myserver.* *.myserver.com
3.2 location块
每个server块中可以包含多个location块。在整个Nginx配置文档中起着重要的作用，而且Nginx服务器在许多功能上的灵活性往往在location指令的配置中体现出来。
location块的主要作用是，基于Nginx服务器接收到的请求字符串（例如， server_name/uri-string），对除虚拟主机名称之外的字符串（前例中“/uri-string”部分）进行匹配，对特定的请求进行处理。地址定向、数据缓存和应答控制等功能都是在这部分实现。许多第三方模块的配置也是在location块中提供功能。
在Nginx的官方文档中定义的location的语法结构为：
location [ = | ~ | ~* | ^~ ] uri { ... }
其中，uri变量是待匹配的请求字符串，可以是不含正则表达的字符串，如/myserver.php等；也可以是包含有正则表达的字符串，如 .php$（表示以.php结尾的URL）等。为了下文叙述方便，我们约定，不含正则表达的uri称为“标准uri”，使用正则表达式的uri称为“正则uri”。
其中方括号里的部分，是可选项，用来改变请求字符串与 uri 的匹配方式。在介绍四种标识的含义之前，我们需要先了解不添加此选项时，Nginx服务器是如何在server块中搜索并使用location块的uri和请求字符串匹配的。
在不添加此选项时，Nginx服务器首先在server块的多个location块中搜索是否有标准uri和请求字符串匹配，如果有多个可以匹配，就记录匹配度最高的一个。然后，服务器再用location块中的正则uri和请求字符串匹配，当第一个正则uri匹配成功，结束搜索，并使用这个location块处理此请求；如果正则匹配全部失败，就使用刚才记录的匹配度最高的location块处理此请求。
了解了上面的内容，就可以解释可选项中各个标识的含义了：
“=”，用于标准uri前，要求请求字符串与uri严格匹配。如果已经匹配成功，就停止继续向下搜索并立即处理此请求。
“^～”，用于标准uri前，要求Nginx服务器找到标识uri和请求字符串匹配度最高的location后，立即使用此location处理请求，而不再使用location块中的正则uri和请求字符串做匹配。
“～”，用于表示uri包含正则表达式，并且区分大小写。
“～*”，用于表示uri包含正则表达式，并且不区分大小写。注意如果uri包含正则表达式，就必须要使用“～”或者“～*”标识。
优先级："=" > "^~" > "~*" > "~"

server {
    listen       80;
    server_name  test.netease.com;

    location / {
        return 200 'all';
    }

    location = /hello {
    return 200 'hello';
    }

    location ^~ /hello/name {
    return 200 'hello name';
    }

    location ~ hello$ {        // (?-i)
    return 200 'Hello ^';
    }

    location ~* world$ {
    return 200 'world ^';
    }
    
    location ~* ld$ {
    return 200 'ld ^';
    }
    
    location ~* abcld$ {
    return 200 'ld ^';
    }
}

示例1
curl -i "http://127.0.0.1/abc/WorlD" -H "Host: test.netease.com"
curl -i "http://127.0.0.1/abc/world" -H "Host: test.netease.com"
curl -i "http://127.0.0.1/abc/abclD" -H "Host: test.netease.com"

注意：~在linux是区分大小写，但在其他系统如mac是不区分大小写
curl -i "http://127.0.0.1:80/abcjs" -H "Host: test-dev.netease.com"
curl -i "http://127.0.0.1:80/abcJs" -H "Host: test-dev.netease.com"
3.3 root指令
location /a {
    root   /var/www;
}
root：用于指定文件系统中某个目录作为请求的根目录，Nginx会在该目录下寻找请求的文件
/a/hello.png -> /var/www/a/hello.png
3.4 alias指令
location /a {
    alias   /var/www;
}
alias：用于将请求映射到另一个目录或文件上(用于将请求的URL路径与文件系统路径进行映射)，常用于处理静态资源的请求，这个指令的功能类似于root
/a/hello.png -> /var/www/hello.png
3.5 rewrite指令
    location /break/ {
        rewrite ^/break/(.*) /test/$1 break;
        return 402;
    }

    location /last/ {
         rewrite ^/last/(.*) /test/$1 last;
         return 403;
    }

    location /test/ {
         return 508;
    }
该指令是通过正则表达式的使用来改变URI。可以同时存在一个或多个指令。需要按照顺序依次对URL进行匹配和处理。
该指令可以在server块或location块中配置，其基本语法结构如下：
rewrite regex replacement [flag];
rewrite的含义：该指令是实现URL重写的指令。
regex的含义：用于匹配URI的正则表达式。
replacement：将regex正则匹配到的内容替换成 replacement。
flag: flag标记。
last: 本条规则匹配完成后，继续向下匹配新的location URI 规则。(不常用)
break: 本条规则匹配完成即终止，不再匹配后面的任何规则(不常用)。
redirect: 返回302临时重定向，浏览器地址会显示跳转新的URL地址。
permanent: 返回301永久重定向。浏览器地址会显示跳转新的URL地址。

server {
    listen       80;
    server_name  testrewrite.netease.com;

    location /hello {
    return 200 'oh hello';
    }

    location /last {
    rewrite /last/(.*) /$1 last;
    root /opt/homebrew/etc/nginx/html;
    }

    location /break {
    rewrite /break/(.*) /$1 break;
    root /opt/homebrew/etc/nginx/html;
    }
    
    location /redirect {
    rewrite /redirect/(.*) /$1 redirect;
    root /opt/homebrew/etc/nginx/html;
    }

    location /permanent {
        rewrite /permanent/(.*) /$1 permanent;
        root /opt/homebrew/etc/nginx/html;
    }

}

示例1
curl -i "http://127.0.0.1/last/hello" -H "Host: testrewrite.netease.com"

示例2
curl -i "http://127.0.0.1/break/world" -H "Host: testrewrite.netease.com"

示例3
curl -i "http://127.0.0.1/redirect/hello" -H "Host: testrewrite.netease.com"

示例4
curl -i "http://127.0.0.1/permanent/hello" -H "Host: testrewrite.netease.com"

永久重定向（301）：浏览器会缓存永久重定向的DNS解析记录。 即域名永远跳转至另外一个新的域名，之前的域名再也不使用，跳转记录可以缓存到客户端浏览器。 
临时重定向（302）：浏览器不会缓存当前域名的解析记录。
3.6 index指令
location /a {
    alias   /opt/homebrew/etc/nginx/html;
    index index.html index;
}

/opt/homebrew/etc/nginx/html下有index、hello、world文件
index：当用户请求没有指定资源时，会根据index设置的文件进行查找（目录是alias或root结合location确定），直到找到为止（如果都找不到则返回403）
请求最终资源备注/a/a/当我们访问URI时，如果访问资源为一个目录，并且URI没有以正斜杠（/）结尾，Nginx 服务就会返回一个301跳转，目标地址就是要加一个正斜杠。/a//var/www/index.php/a/没有指定资源，则走index逻辑，查/opt/homebrew/etc/nginx/html/index.html是否存在，不存在则找/opt/homebrew/etc/nginx/html/index，存在则返回/a/hello/var/www/hello存在资源

server {
    listen       80;
    server_name  testindex.netease.com;

    location /a {
        alias   /opt/homebrew/etc/nginx/html;
        index index.html index.php;
    }

}

curl -i "http://127.0.0.1/a" -H "Host: testindex.netease.com"
curl -i "http://127.0.0.1/a/" -H "Host: testindex.netease.com"
curl -i "http://127.0.0.1/a/index" -H "Host: testindex.netease.com"

3.7 try_files指令
location / {
  root /opt/project/;
  index index.html index.htm;
}
location /main {
  root /opt/project/;
  try_files $uri /index.html;
}
访问/main/index.html
匹配到location /main
第一种情况
$uri = /main/index.html
try_files 查找 root + $uri => /opt/project/main/index.html
找到内容，返回结果
第二种情况假如
/main/index.html不存在
$uri 规则查找失败，查找/index.html
内部重定向到location /
关键点：try_files xxx yyy zzz中匹配到最后zzz，会重新做一次内部重定向

server {
    listen       80;
    server_name  testtry.netease.com;

    location / {
    root /opt/homebrew/etc/nginx/html;
      try_files /world /index.htm;
    }

    location /main {
      root /opt/homebrew/etc/nginx/html;
      try_files /$uri /index;
    }

}

示例
curl -i "http://127.0.0.1/main/index" -H "Host: testtry.netease.com"
curl -i "http://127.0.0.1/main/indexabc" -H "Host: testtry.netease.com"
4. 经典案例
4.1 nginx健康探测导致的问题
现象：添加archive-xxx域名配置后，在ehr-nginx上配置的域名都无法访问（时间：2022.6.9）
原因分析：
ehr-nginx作为 sa-nginx的后端结点，sa-nginx会对ehr-nginx定时发起健康探测（/health/status），探测失败会将异常结点踢掉
ehr-nginx没有指定默认域名，所以当sa-nginx发起健康探测时（没有带域名），ehr-nginx会根据默认规则，将请求转到第一个server上（即以目录名称按字母排序，取第一个）。在没有加archive-xxx域名时，默认第一个域名是有/health/status的转发，返回200。当加完archive-xxx配置后，由于archive-xxx域名没有配置/health/status，返回404， sa-nginx认为当前结点有问题，所以将结点全踢掉了。
解决方案：增加default_server标记
