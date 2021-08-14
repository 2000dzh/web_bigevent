$(function () {
    //调用 getUserInfo 获取用户的基本信息
    getUserInfo()
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
        }
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