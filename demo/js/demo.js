/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/4/1
 * @version 1.0.0
 * @description description 
 */

var log = (function() {
    var text = $('#log'), index = 1;
    return function() {
        var old_val = text.val(), new_val = '\n';
        $.each(arguments, function(i, obj) {
            new_val += String(obj) + '\n'; 
        });
        text.val(new_val + '\n' + (index++) + '  ------------------------------------\n' + old_val);
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
    var elem = $(this),
        inputGroup,
        name = e.param['class'],
        type = e.param['type'];

    if(name){
        inputGroup = $('input[type="checkbox"].' + name);

        // 绑定点击事件
        elem.off('click.select-down')
            .on('click.select-down', function() {
                var isChecked = $(this).prop('checked');

                // 触发向下全选事件
                inputGroup.trigger('select-down', {
                    checked: isChecked
                });
            })
            .off('select-up')
            .on('select-up', function(e, data) {
                var that = $(this),
                    isSelectAll = !!data.checked;
                if(type == '1'){
                    inputGroup.each(function() {
                        if(!this.checked){
                            isSelectAll = false;
                        }
                    });
                } else if(type == '2'){
                    inputGroup.each(function() {
                        if(this.checked){
                            isSelectAll = true;
                        }
                    });
                }
                that.prop('checked', isSelectAll).triggerHandler('click.select-up', {
                    checked: isSelectAll
                });
            });

        inputGroup.off('click.select-up')
            .on('click.select-up', function() {
                var isChecked = $(this).prop('checked');

                // 触发向上选择事件
                setTimeout(function() {
                    elem.trigger('select-up', {
                        checked: isChecked
                    });
                }, 10);
            })
            .off('select-down')
            .on('select-down', function(e, data) {
                $(this).prop('checked', !!data.checked).triggerHandler('click.select-down', {
                    checked: !!data.checked
                });
            });
            inputGroup.triggerHandler('click.select-up');
            inputGroup.triggerHandler('click.select-down');

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
    var self = this;
    data.stop();
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


