$(function () {
    //调用 getUserInfo 获取用户的基本信息
    getUserInfo()

    let layer = layui.layer
    //点击按钮 实现退出功能
    $("#btnLogout").on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something

            //清空本地存储中的 token
            localStorage.removeItem('token')
            //返回登录页
            location.href = '/login.html'

            layer.close(index);
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem("token") || '';
        // },
        success: function (res) {
            if (res.code !== 0) return layui.layer.msg(res.message);

            //调用 renderAvatat 渲染用户的头像
            renderAvatar(res.data)
        },
        // 无论成功还是失败，都会调用 complete函数
        // complete: function (res) {
        //     if (res.responseJSON.code === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //清空 token 数据 防止坏蛋手写一个token
        //         localStorage.removeItem('token');
        //         //强制跳回登录页面
        //         location.href = '/login.html'
        //     }
        //     console.log(res);
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的名称
    let name = user.nickname || user.username
    //2.设置欢迎的文本
    $("#welcome").text('欢迎  ' + name);
    //3.按需渲染头像
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        let first = name[0].toUpperCase()
        $(".text-avatar").text(first).show()
        $(".layui-nav-img").hide()
    }
}