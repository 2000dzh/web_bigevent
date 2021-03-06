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
    let layer = layui.layer
    form.verify({
        //自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
})

//监听注册表单的提交事件
// $("#form_reg").on('submit', function (e) {
//     //阻止表单默认行为
//     e.preventDefault()
//     //发起Ajax的POST请求
//     $.post('/api/reg',
//         {
//             username: $("#form_reg [name=username]").val(),
//             password: $("#form_reg [name=password]").val(),
//             repassword: $("#form_reg [name=repassword").val()

//         },
//         function (res) {
//             console.log(res);
//             if (res.code !== 0) return layer.msg(res.message);
//             layer.msg('注册成功');
//             //注册成功 自动跳到登录模块
//             $("#link_login").click()
//         }
//     )
// })

$("#form_reg").on('submit', function (e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/api/reg',
        data: $(this).serialize(),
        success: function (res) {
            if (res.code !== 0) return layer.msg(res.message);
            layer.msg('注册成功');
            $("#link_login").click()
        }
    })
})


// 监听登录表单的提交事件
$("#form_login").submit(function (e) {
    //阻止表单默认行为
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/api/login',
        //获取表单数据
        data: $(this).serialize(),
        success: function (res) {
            // console.log(res);
            if (res.code !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('登录成功');
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token);
            // 跳转到后台主页
            location.href = '/index.html'

        }
    })
})

