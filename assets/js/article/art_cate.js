$(function () {
    let layer = layui.layer

    initArtCateList()
    //获取文章列表信息
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                //获取请求返回的数据
                let htmlStr = template('tpl-table', res);
                //把数据渲染到页面上去
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    let indexAdd = null
    $("#btnAddCate").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })


    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $("body").on('submit', "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg(res.message)
                //把用户提交的信息 渲染到页面上
                initArtCateList()
                layer.msg(res.message)
                //提交成功隐藏弹出框
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式,为 btn-edit 按钮绑定点击事件
    let indexEdit = null
    $("tbody").on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        });
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/cate/info?id=' + id,
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                layui.form.val("form-edit", res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定 submit 事件
    $("body").on('submit', "#form-edit", function (e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            method: 'PUT',
            url: '/my/cate/info',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                //把用户修改的信息 渲染到页面上
                initArtCateList()

                layer.msg(res.message)

                //提交成功隐藏弹出框
                layer.close(indexEdit)

            }
        })
    })

    //通过代理的形式，为删除按钮绑定点击事件
    $("body").on('click', ".btn-delete", function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id=' + id,
                success: function (res) {
                    if (res.code !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })
})