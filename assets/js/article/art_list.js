$(function () {
    let layer = layui.layer
    let layapge = layui.laypage

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()//年 padZero(dt.getSeconds())
        let m = padZero(dt.getMonth()) //月
        let d = padZero(dt.getDate()) //日

        let hh = padZero(dt.getHours()) //时
        let mm = padZero(dt.getMinutes()) //分
        let ss = padZero(dt.getSeconds()) //秒

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章发类的 id
        stare: '' //文章的发布状态
    }

    initTable()
    //定义获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.code !== 0) return layer.msg(res.message)
                console.log(res);
                //使用模版引擎渲染页面
                let htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
                layer.msg(res.message)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    //初始化文章分类的方法
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                console.log(res);
                if (res.code !== 0) return layer.msg(res.message)

                //调用模版引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                // console.log(htmlStr );
                $('[name=cate_id]').html(htmlStr)
                layer.msg(res.message);
                //通知 layui 重新渲染表单区域的UI结构
                layui.form.render()
            }
        })
    }

    //为筛选表单绑定 submit 事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=stare]').val();
        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.stare = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })



    // 定义渲染分页的方法
    function renderPage(total) {
        //调用layapge.render() 方法来渲染分页的结构
        layapge.render({
            elem: 'pageBox', //分页容器的 id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            //自定义页码格式
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //每页展示数据
            limits: [2, 3, 5, 10],
            //当分页发生切换的时候，触发 jump 回调
            //触发 jump 回调的方式有两种
            //1.点击页码的时候，会触发 jump 回调
            //2.只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                //可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                //如果 first 的值为 true 证明是方式2触发的
                console.log(first);
                // console.log(obj);
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的条目数，赋值到q这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }


    //通过代理的形式为删除按钮，绑定事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取要删除文章的id
        let id = $(this).attr('data-id')
        //获取页面数据个数
        let len = $(".btn-delete").length
        console.log(len);
        //询问用户是否要删除数据
        layer.confirm('确认要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success: function (res) {
                    if (res.code !== 0) return layui.layer.msg(res.message)
                    // console.log(res);

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()

                    layui.layer.msg(res.message)
                }
            })
            layer.close(index);
        })

    })
})