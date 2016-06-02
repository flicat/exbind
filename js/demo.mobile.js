/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/6/1
 * @version 1.0.0
 * @description exbind demo
 */

var log = (function() {
    var text = document.getElementById('log'), index = 1;
    return function() {
        var old_val = text.value, new_val = '\n';
        [].slice.call(arguments).forEach(function(obj) {
            new_val += String(obj) + '\n';
        });
        text.value = new_val + '\n' + (index++) + '  ------------------------------------\n' + old_val;
    }
})();

/**
 * 全选复选框
 * 控件名称：data-act="select"
 * 控件参数：data-param="class=@class&type=@type"
 *
 * @class：需要全选的复选框按钮组的class名称
 * @type：全选类型  1（只有全部按钮选中，全选按钮才会勾上）|2（只要有一个按钮选中，全选按钮就会勾上）
 */
ExBind.register('select', 'load', function(e) {
    var elem = this,
        inputGroup,
        name = e.param['class'],
        type = e.param['type'];

    if(name){
        inputGroup = [].slice.call(document.querySelectorAll('input[type="checkbox"].' + name));

        elem.__select_down__ = function(isChecked) {
            // 向下全选事件
            inputGroup.forEach(function(input) {
                input.checked = isChecked;
                // 向下全选事件
                input.__select_down__ &&  input.__select_down__(isChecked);
            });
        };

        // 绑定点击事件
        elem.addEventListener('click', function() {
            var isChecked = this.checked;
            // 向下全选事件
            elem.__select_down__ &&  elem.__select_down__(isChecked);
            // 向上全选事件
            elem.__select_up__ &&  elem.__select_up__(isChecked);
        });

        inputGroup.forEach(function(input) {
            input.__select_up__ = function(isChecked) {
                var isSelectAll = isChecked;
                if(type == '1'){
                    inputGroup.forEach(function(input) {
                        if(!input.checked){
                            isSelectAll = false;
                        }
                    });
                } else if(type == '2'){
                    inputGroup.forEach(function(input) {
                        if(input.checked){
                            isSelectAll = true;
                        }
                    });
                }
                elem.checked = isSelectAll;

                // 向上全选事件
                elem.__select_up__ &&  elem.__select_up__(isSelectAll);
            };
            input.addEventListener('click', function() {
                var isChecked = this.checked;
                // 向下全选事件
                input.__select_down__ &&  input.__select_down__(isChecked);
                // 向上全选事件
                input.__select_up__ &&  input.__select_up__(isChecked);
            });

            input.__select_up__(input.checked);
        });
    }
});


/*
* test
*/
ExBind.register('tip', 'load', function(data, e) {
    log('load: tip', this);
});

ExBind.register('validate', 'load', function(data, e) {
    var self = this;
    data.stop();
    setTimeout(function() {
        log('load: validate', self);
        data.next();
    }, 1000);
});

ExBind.register('change', 'load', function(data, e) {
    log('load: change', this);
});

setTimeout(function() {
    ExBind.register('later', 'load', function(data, e) {
        log('load: later', this);
    });
}, 3000);

ExBind.register('popup', 'click', function(data, e) {
    data.stop();
    var self = this;
    setTimeout(function() {
        log('click: popup', self);
        data.next();
    }, 1000);
});

ExBind.register('widget', 'click', function(data, e) {
    log('click: widget', this);
});

ExBind.registerNode(document.getElementById('submit'),
    ['later', 'change', 'validate', 'tip', 'widget', 'select', 'popup'], {});


