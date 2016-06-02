/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/6/1
 * @version 1.0.0
 */

var ExBind = (function() {

    // 判断是否是对象
    var isObject = function (obj) {
        return ({}).toString.call(obj) === "[object Object]"
    };
    // 判断是否是数组
    var isArray = Array.isArray || function (obj) {
            return ({}).toString.call(obj) === '[object Array]';
        };
    // 判断是否是字符串
    var isString = function (obj) {
        return ({}).toString.call(obj) === "[object String]"
    };
    // 判断是否是函数
    var isFunction = function (obj) {
        return ({}).toString.call(obj) === "[object Function]"
    };

    // 获取节点方法
    var getAct = function(str) {
        var actArr = String(str || '').split(',');
        return $.map(actArr, function(item) {
            return $.trim(item);
        });
    };

    // 获取节点参数
    var getParam = function(str) {
        var param = {};
        $.each((str || '').split('&'), function(i, paramStr) {
            var index = paramStr.indexOf('=', 0);
            if(index > 0 && index < paramStr.length - 1){
                var name = $.trim(paramStr.substring(0, index));
                param[name] = $.trim(paramStr.substring(index + 1, paramStr.length));
            }
        });
        return param;
    };

    // HTML节点控件对象
    var Act = function(node, actArr, param) {
        this.node = $(node);                               // 绑定控件的节点
        this.actArr = actArr;                           // 控件数组
        this.param = isObject(param) ? param : null;    // 节点参数
        this.isLock = false;                            // 是否锁定
    };
    Act.prototype.bind = function(event, eventMap) {
        var that = this;

        // 执行事件链
        var execute = function(e) {
            var index = 0;

            var data = {
                // 停止执行事件链
                stop: function() {
                    that.isLock = true;
                },
                // 继续执行事件链
                next: function() {
                    that.isLock = false;
                    next();
                },
                param: that.param
            };

            // 执行下一个事件
            var next = function() {
                while(!eventMap[that.actArr[index]] && index < that.actArr.length) {
                    index++;
                }

                if(index < that.actArr.length){
                    eventMap[that.actArr[index]].call(that.node, data, e);

                    if(event === 'load'){
                        that.actArr.splice(index, 1);
                    } else {
                        index++;
                    }

                    if(!that.isLock){
                        next();
                    }
                }
            };

            if(!that.isLock){
                next();
            }
        };

        if(event === 'load'){
            // 如果是load事件则立刻执行
            setTimeout(function() {
                execute();
            }, 0);
        } else if(!that.event){
            // 避免重复绑定
            that.event = true;
            that.node.on(event, execute);
        }
    };

    //
    var ExBindFrame = function () {
        this.actMap = {};            // 控件对应NODE节点字典
        this.eventMap = {};          // 事件对应控件回调字典
        this.scan();
    };
    ExBindFrame.prototype = {
        constructor: ExBindFrame,

        // 注册控件
        register: function(actName, event, call) {
            var that = this;
            if(isString(actName) && isString(event) && isFunction(call)){
                if(!that.eventMap[event]){
                    that.eventMap[event] = {};
                }
                // 将控件回调方法存根据事件存储在字典
                if(!that.eventMap[event][actName]){
                    that.eventMap[event][actName] = call;
                    // 绑定事件
                    if(that.actMap[actName] && that.actMap[actName].length){
                        $.each(that.actMap[actName], function(i, nodeObj) {
                            nodeObj.bind(event, that.eventMap[event]);
                        });
                    }
                }
            }
        },

        // 注册节点
        registerNode: function(node, actArr, param) {
            var that = this;

            if(isArray(actArr)){
                // 创建控件对象
                var nodeObj = new Act(node, actArr, param);

                // 将控件存储在控件字典
                $.each(actArr, function(i, act) {
                    if(isString(act)){
                        if(!that.actMap[act]){
                            that.actMap[act] = [];
                        }
                        that.actMap[act].push(nodeObj);

                        // 绑定事件
                        $.each(that.eventMap, function(event, eventMap) {
                            if(eventMap[act]){
                                nodeObj.bind(event, eventMap);
                            }
                        });
                    }
                });
            }
        },

        // 扫描节点
        scan: function(elem) {
            var that = this;

            // 遍历节点
            var nodes = $(elem || document).find('[data-act]');

            // 获取节点绑定的控件名称和参数
            nodes.each(function() {
                var node = $(this);
                // 控件名称数组
                var actArr = getAct(node.attr('data-act') || '');
                // 参数
                var param = getParam(node.attr('data-param') || '');

                that.registerNode(node, actArr, param);
                node.removeAttr('data-act data-param');
            });
        }
    };

    return new ExBindFrame();
})();
