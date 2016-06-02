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
 * ȫѡ��ѡ��
 * �ؼ����ƣ�data-act="select"
 * �ؼ�������data-param="class=@class&type=@type"
 *
 * @class����Ҫȫѡ�ĸ�ѡ��ť���class����
 * @type��ȫѡ����  1��ֻ��ȫ����ťѡ�У�ȫѡ��ť�ŻṴ�ϣ�|2��ֻҪ��һ����ťѡ�У�ȫѡ��ť�ͻṴ�ϣ�
 */
ExBind.register('select', 'load', function(e) {
    var elem = $(this),
        inputGroup,
        name = e.param['class'],
        type = e.param['type'];

    if(name){
        inputGroup = $('input[type="checkbox"].' + name);

        // �󶨵���¼�
        elem.off('click.select-down')
            .on('click.select-down', function() {
                var isChecked = $(this).prop('checked');

                // ��������ȫѡ�¼�
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

                // ��������ѡ���¼�
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


