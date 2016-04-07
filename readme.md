事件通用方法
=================

定义一个控件
---------------
```
$.register(@name, @event, @handler);
```
> 定义一个click事件控件
```
$.register('my-click', 'click', function(e) {
    var param = e.param;
});
```
定义一个load事件控件
```
$.register('my-load', 'load', function(e) {
    var param = e.param;
});
```

绑定控件
---------------
```
<button data-act="@nameString" data-param="@paramStr=param">按钮</button>
```

> 绑定一个控件
```
<button data-act="my-click" data-param="name=test">按钮</button>
```
绑定多个控件
```
<button data-act="my-click my-load" data-param="name=test&value=1">按钮</button>
```
       
参数详解
---------------
>- name [String] 控件名称
>- nameString [String] 控件名称，多个控件名用空格隔开，根据排序执行控件事件
>- event  [String] 控件触发事件
>- handler [Function] 控件触发事件回调函数
>- param [Object] 控件传递参数
>- paramStr [String] 控件传递参数字符串，多个参数用&拼接
>- event [Object] 回调函数event对象
>- event.next [Function] 手动执行下一个相同事件的控件回调
>- event.stop [Function] 停止执行下一个控件回调
>- event.param [Object] 控件传递参数 @param
