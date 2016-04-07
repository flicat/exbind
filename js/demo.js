/*!
 * @author liyuelong1020@gmail.com
 * @date 2016/4/1
 * @version 1.0.0
 * @description description 
 */

/**
 * 全选复选框
 * 控件名称：data-act="select"
 * 控件参数：data-param="class=@class&type=@type"
 *
 * @class：需要全选的复选框按钮组的class名称
 * @type：全选类型  1（只有全部按钮选中，全选按钮才会勾上）|2（只要有一个按钮选中，全选按钮就会勾上）
 */
$.register('select', 'load', function(e) {
    var elem = this,
        inputGroup,
        name = e.param.class,
        type = e.param.type;

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

// 输入提示
/**
 * 输入提示
 * 控件名称：data-act="input-tip"
 * 控件参数：data-param="url=@url"
 *
 * @url：提示的数据来源请求url
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

