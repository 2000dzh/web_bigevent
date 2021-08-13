$(function () {
    //点击去注册
    // $("#link_reg").on('click', function () {
    //     $(".reg-box").show().siblings(".login-box").hide()
    // })
    // //点击去登录
    // $("#link_login").on('click', function () {
    //     $(".reg-box").hide().siblings(".login-box").show()
    // })
    // 登录注册页面切换
    $(".submit-box").on('click', 'a', function () {
        $(this).parents(".submit-box").hide().siblings('div').show()
    })

    //从Layui 获取form元素
    //通过form.verify() 函数自定义校验规则
    let form = layui.form
    form.verify({
        //自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
    })
})