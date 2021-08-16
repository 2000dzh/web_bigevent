$(function () {
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $(".layui-input-block [name=old_pwd]").val()) {
                return '你搁这你搁这呢'
            }
        },
        rePwd: function (value) {
            if (value !== $(".layui-input-block [name=new_pwd]").val()) {
                return '给爷爬'
            }
        }
    })

    //监听表单默认行为
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'PATCH',
            url: "/my/updatepwd ",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.code !== 0) return layui.layer.msg('更新密码失败')
                layui.layer.msg('更新密码成功')
                //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})