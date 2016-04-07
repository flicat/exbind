/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/4/1
 * @version 1.0.0
 * @description description 
 */

/**
 * ȫѡ��ѡ��
 * �ؼ����ƣ�data-act="select"
 * �ؼ�������data-param="class=@class&type=@type"
 *
 * @class����Ҫȫѡ�ĸ�ѡ��ť���class����
 * @type��ȫѡ����  1��ֻ��ȫ����ťѡ�У�ȫѡ��ť�ŻṴ�ϣ�|2��ֻҪ��һ����ťѡ�У�ȫѡ��ť�ͻṴ�ϣ�
 */
$.register('select', 'load', function(e) {
    var elem = this,
        inputGroup,
        name = e.param.class,
        type = e.param.type;

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

// ������ʾ
/**
 * ������ʾ
 * �ؼ����ƣ�data-act="input-tip"
 * �ؼ�������data-param="url=@url"
 *
 * @url����ʾ��������Դ����url
 */

$.register('input-tip', 'load', function(e) {
    var input = $(this),
        name = input.attr('name'),
        url = e.param.url,
        tipElem = $('<div>').appendTo('body').hide(),
        inputWidth = input.outerWidth(),
        inputLeft = input.offset().left,
        inputTop = input.offset().top + input.outerHeight();

    $(window).on('resize', function() {
        inputWidth = input.outerWidth();
        inputLeft = input.offset().left;
        inputTop = input.offset().top + input.outerHeight();

        tipElem.css({
            'width': inputWidth,
            'left': inputLeft,
            'top': inputTop
        });
    });

    input.attr('autocomplete', 'off');
    tipElem.css({
        'box-sizing': 'border-box',
        'position': 'absolute',
        'border': '1px solid #999',
        'background': '#fff',
        'z-index': 99999999
    });

    var renderTip = function(list) {
        if(list && list.length){
            var listHtml = '';
            $.each(list, function(i, item) {
                listHtml += '<span data-value="' + item.name + '" style="display: block;' +
                'font: 400 12px/1.5em serif;' +
                'padding: 0 10px;' +
                'cursor: pointer;">' + item.name +
                '</span>';
            });
            tipElem.css({
                'display': 'block',
                'width': inputWidth,
                'left': inputLeft,
                'top': inputTop
            }).html(listHtml);
        } else {
            tipElem.hide();
        }
    };

    tipElem.on('click.select', '[data-value]', function(e) {
        e.stopPropagation();
        e.preventDefault();
        input.val($(this).attr('data-value'));
        tipElem.hide();
    }).on('mouseover.select', '[data-value]', function(e) {
        $(this).css('background', '#aaa');
    }).on('mouseout.select', '[data-value]', function(e) {
        $(this).css('background', 'none');
    });

    if(url){
        input.off('input.tips').on('input.tips', function() {
            var value = $.trim($(this).val());
            if(value){
                var data = {};
                data[name] = value;

                $.ajax({
                    type: 'get',
                    url: url,
                    async: true,
                    data: data,
                    dataType: 'json',
                    success: function(data) {
                        if(data && data.code === 'success'){
                            renderTip(data.list || []);
                        } else {
                            tipElem.hide();
                        }
                    },
                    error: function() {}
                })
            }

        });
    }
});

