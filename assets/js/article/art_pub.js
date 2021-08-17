$(function () {
    // 初始化富文本编辑器
    initEditor()
    initCate()
    //定义记载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                console.log(res);
                if (res.code !== 0) return layui.layer.msg(res.message)
                //模范引擎渲染页面
                let htmlStr = template('tplcate', res)
                $("[name=cate_id]").html(htmlStr)

                //通知 layui 重新渲染表单区域的UI结构
                layui.form.render()

                layui.layer.msg(res.message)
            }
        })
    }



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //未选择封面按钮绑定 点击事件处理函数
    $("#btnChooseImage").on('click', function () {
        $('#coverFile').click()
    })


    //监听 coverFile 的 change 事件，获取用户选择的文件列表
    $("#coverFile").on('change', function (e) {
        //获取文件的列表数组
        let files = e.target.files
        //判断用户是否真的选择了图片
        if (files.length <= 0) return layui.layer.msg('请选择图片')
        //拿到用户选择的文件
        let file = e.target.files[0];

        //根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(file);

        //先销毁旧的裁剪区域，再`重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    //定义文章的发布状态
    let art_state = '已发布'

    $("#btnSave2").on('click', function () {
        art_state = '草稿'
    })

    $("#form-pub").on('submit', function (e) {
        //1.阻止表单的默认行为
        e.preventDefault()

        //2.创建 FormDate 对象保存表单里面的数据
        let fd = new FormData($(this)[0])

        //3.将文章的发布状态，存到fd中
        fd.append('state', art_state)
        // console.log(fd);
        // k是属性 v是值
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })

        //4.将封面裁剪过后的图片，输出Wie一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                //6.发起Ajax请求
                publishArticle(fd)

            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意： 如果向服务器提交的是 FormDAta 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            // 告诉jQuery不要去设置Content-Type请求头
            processData: false,
            // 告诉jQuery不要去处理发送的数据
            success: function (res) {
                if (res.code !== 0) return layui.layer.msg(res.message);
                layui.layer.msg(res.message);
                location.href = '/article/art_list.html'
            }
        })
    }
})