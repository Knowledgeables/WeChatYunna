(function () {
    if (window.utils) {
        return;
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

    //ajax请求 json
    function ajaxJson(requestUrl, requestParams, callback) {
        console.log("-----------------------------------------------------");
        console.log("请求接口地址：" + requestUrl);
        console.log("请求入参：");
        console.log(requestParams);
        console.log("-----------------------------------------------------");
        $.ajax({
            type: "POST",
            url: requestUrl,
            data: requestParams,
            dataType: "json",
            success: function (msg) {
                console.log("接口数据回传：" + JSON.stringify(msg));
                return callback(msg);
            },
            error: function (err) {
                alert("系统繁忙!"); //调用接口失败
                console.log("系统繁忙：" + err);
                console.log(err);
            }
        });
    }


    //ajax请求上传文件
    function ajaxFile(requestUrl, requestParams, progress,callback) {
        console.log("-----------------------------------------------------");
        console.log("请求接口地址：" + requestUrl);
        console.log("请求入参：");
        console.log(JSON.stringify(requestParams));
        console.log("-----------------------------------------------------");
        $.ajax({
            type: "POST",
            url: requestUrl,
            dataType: "json",
            processData: false,  // 注意：让jQuery不要处理数据
            contentType: false,  // 注意：让jQuery不要设置contentType
            data: requestParams,
            success: function (msg) {
                console.log("接口数据回传：" + JSON.stringify(msg));
                return callback(msg);
            },
            error: function (err) {
                console.log("系统繁忙" + JSON.stringify(err));
            }
            ,
            xhr: function () {
                myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // check if upload property exists
                    myXhr.upload.addEventListener('progress', function (e) {
                        var loaded = e.loaded;                  //已经上传大小情况
                        var total = e.total;                      //附件总大小
                        var percent = Math.floor(100 * loaded / total) + "%";     //已经上传的百分比
                        return progress(percent);
                    }, false); // for handling the progress of the upload
                }
                return myXhr;
            },
        });
    }


    /**
     *
     * @param title 标题可传 undefined
     * @param content 内容 不能为空
     * @param click_bg 是否可点击可传 undefined
     */
    function toast(title, content, click_bg) {
        let thisTitle;
        if (title === null || title === undefined || title.length === 0) {
            thisTitle = "系统提示"
        }
        jqalert({
            title: thisTitle,
            content: content,
            click_bg: false,
        })
    }

    function isPhone(mobile) {
        console.log("mobile--" + mobile.length);
        if (mobile && mobile.length === 11) {
            var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
            return myreg.test(mobile);
        } else {
            return false;
        }
    }

    /**
     *
     * @param content 密码
     */
    function validatePwd(content) {
        console.log("pwd--" + content.length);
        return content !== undefined && content.length >= 6 && content.length < 24;
    }


    window.utils =
        {
            GetQueryString: GetQueryString,
            AjaxJson: ajaxJson,
            AjaxFile: ajaxFile,
            Toast: toast,
            IsPhone: isPhone,
            ValidatePwd: validatePwd
        };
})();