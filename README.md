## TS 重构 axios

### 获取响应数据

res对象应该包括：
- 服务器返回的数据 data
- HTTP状态码 status
- 状态消息 statusText
- 响应头 headers
- 请求配置对象 config
- 请求的XMLHttpRequest对象实例 request


## 错误处理

### 处理网络错误
当网络出现异常(比如不通)的时候发送请求会触发 ```XMLHttpRequest```对象实例的```error```事件，于是我们可以在```onerror```的事件回调函数中捕获此类错误。

我们在```xhr```函数中添加如下代码:
```ts
request.onerror = function handleError(){
  reject(new Error('Network Error'))
}
```
### 处理超时错误
我们可以设置某个请求的超时时间```timeout```,也就是当请求发送后超过某个时间后仍然没有收到响应，则请求自动终止，并触发```timeout```事件。

请求默认的超时时间是0，即永不超时。所以我们首先需要允许程序可以配置超时时间：
```ts
export interface AxiosRequestConfig {
  //...
  timeout?:number
}
```
接着在xhr 函数中添加如下代码
```ts
const {/*...*/ timeout} = config

if(timeout){
  request.timeout = timeout
}

...

request.ontimeout = function handleTimeout(){
      reject(new Error(`Timeout of ${timeout} ms extceeded`))
    }
```

### 处理非200状态码
对于一个正常的请求，往往会返回200-300之间的HTTP状态码，对于不在这个区间的状态码，我们也把它们认为是一种错误的情况做处理。
当 request.readyState = 4的时候 表示已经接收所有响应
-  0 : 未初始化，尚未调用open()方法
-  1 : 已打开(open)。已调用open()方法，尚未调用send()方法
-  2 : 已发送(Send)。已调用send()方法，尚未收到响应。
-  3 : 接收中(Receiving)。已经收到部分响应。
-  4 : 完成(Complete)。 已经收到所有响应，可以使用了。

在xhr.ts文件中，对负责处理ajax请求的xhr函数我们做了一层Promise,在readyState为4的时候，把服务器返回的信息 通过resolve()方法 返回出来。
这样便可以在 axios() 后通过.then的方式对返回的数据进行处理。

在处理异常HTTP状态码的时候，我们简单封装一层处理逻辑，代码如下：

```ts

    const response: AxiosResponse = {
        data: responseData, //获取request.response 或者 request.responseText
        status: request.status, // 获取返回过来的状态码
        statusText: request.statusText, // 获取返回过来的状态文字
        headers: reponseHeaders, // 获取返回头信息
        config, // axios()传递的参数 
        request // request对象本身
      }
      handleResponse(response)

      //处理正常和异常状态码
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }


```

## 错误信息增强

### 需求分析
上文我们已经捕获了几类AJAX的错误，但是对于错误信息提供的非常有限，我们希望对外提供的信息不仅仅包含错误文本信息，还包括了请求对象配置 ```config```,错误代码```code```,```XMLHttpRequest```对象实例request，以及自定义响应对象```response```
