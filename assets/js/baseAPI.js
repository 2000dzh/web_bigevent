// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
   console.log( options.url);
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3008' + options.url;

    //统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ''
        };
    }

    //全局同意挂载 complete函数
    // 无论成功还是失败，都会调用 complete函数
    options.complete = function (res) {
        if (res.responseJSON.code === 1) {
            //清空 token 数据 防止坏蛋手写一个token
            localStorage.removeItem('token');
            //强制跳回登录页面
            location.href = '/login.html'
        }
        // console.log(res);
    }

})