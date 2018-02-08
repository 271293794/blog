
$(function () {
    var loginBox = $('#loginBox')
    var registerBox = $('#registerBox')
    var userInfoBox = $('#userInfo')
    var btn_postComment = $('.J_PostBtn')
    //
    registerBox.hide();
    // userInfoBox.hide();
    loginBox.find('a').on('click', () => {
        loginBox.hide();
        registerBox.show();
    })
    registerBox.find('a').on('click', () => {
        loginBox.show();
        registerBox.hide();
    })
    /**
     * 注册事件
     */
    registerBox.find('button').on('click', () => {
        var username = registerBox.find('[name="username"]').val();
        var password = registerBox.find('[name="password"]').val();


        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'api/register',
            data: { username: username, password: password },
            success: (data) => {
                registerBox.find('#colWarning').html(data.msg)
                // 如果注册成功
                if (data.code === 1) {
                    ajaxLogin(username, password);

                    setTimeout(() => {
                        loginBox.show()
                        registerBox.hide()
                    }, 1000)
                }
            }
        })
    })
    /**
 * 登录事件
 */
    loginBox.find('button').on('click', () => {
        var username = loginBox.find('[name="username"]').val();
        var password = loginBox.find('[name="password"]').val();


        ajaxLogin(username, password);
    })
    userInfoBox.find('button').on('click', () => {
        $.ajax({
            url: 'api/logout',
            success: (data) => {
                console.log('已退出')
                window.location.reload()
            }

        })
    })
    function ajaxLogin(username, password) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'api/login',
            data: { username: username, password: password },
            success: (data) => {
                loginBox.find('#colWarning').html(data.msg);
                // 如果注册成功
                if (data.code === 1) {
                    setTimeout(() => {
                        $('#userInfo').show();
                        window.location.reload();
                    }, 1000);
                }
            }
        });
    }
    /**
     * 提交评论
     */
    btn_postComment.on('click', () => {
        var comment = $.trim($('.box-textarea').val());
        var lid = $.trim($('#entityId').val());
        var isLogin= $.trim($('#btn_comment').text())
        if (isLogin=='登录') {
            alert('还没有登录')
            return;
        }
        if (!comment) {
            alert('评论不能为空')
            return;
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'api/comment/post',
            data: { comment: comment, lid: lid },
            success: (data) => {
                console.log(data.data.comments)

                refurbishComment(data.data)
                // alert(data.msg)
            }
        })
    })
    // 刷新评论
    function refurbishComment(comment) {

        var html = `
            <div class="media">
            <div class="media-left">
                <a href="#">
                    <img class="media-object" src="public/commenter.png" style="width:80px" >
                </a>
            </div>
            <div class="media-body">
                <h4 class="media-heading"> ${comment.username} &nbsp;
                    <span class="comment-time" style="font-size:3px"> ${new Date(comment.time).toLocaleDateString()}</span>
                </h4>
                ${comment.comment}
            </div>
        </div>
        `

        $('.commenters').prepend(html)
    }


})





