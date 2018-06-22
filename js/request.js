(function () {

        if (window.request) {
            return;
        }

        /**
         * 登陆方法
         * @param username 用户名
         * @param pwd 密码
         */
        function doLogin(username, pwd) {
            sessionStorage.clear();//清楚用户信息
            var companyType = cache.getCompanyType();
            var url = null;
            var user = {
                jsonBean:
                    JSON.stringify({
                        userName: username,
                        password: pwd
                    })
            };
            if (companyType === "service") {
                console.warn("选择公司类型" + companyType);
                url = SERVICE_LOGIN_URL;
            } else {
                url = OWNER_LOGIN_URL;
            }
            utils.AjaxJson(url, user, function (result) {
                console.warn(result);
                switch (result.message.code) {
                    case 200:
                        utils.Toast(undefined, "登陆成功");
                        if (companyType === "service") {//存储服务商用户信息
                            cache.setServiceUserInfo({
                                userName: username,
                                password: pwd
                            })
                        } else {
                            cache.setOwnerUserInfo({//存储业主用户信息
                                userName: username,
                                password: pwd
                            })
                        }
                        console.log("登陆之后企业信息存储");
                        console.log(result.rows);
                        cache.setCompanyInfo(result.rows.company);
                        cache.setEmployeeInfo(result.rows.employee);
                        window.location.href = "order.html";
                        break;
                    case 1001:
                        utils.Toast(undefined, "", "账号或密码为空");
                        break;
                    case 201:
                        utils.Toast(undefined, "系统执行异常");
                        break;
                    case 1004:
                        utils.Toast(undefined, "用户不存在");
                        break;
                    case 1014:
                        utils.Toast(undefined, "用户名不存在");
                        break;
                    case 1015:
                        utils.Toast(undefined, "用户密码错误");
                        break;
                    case 1016:
                        utils.Toast(undefined, "用户已被企业移除");
                        break;
                    default:
                        utils.Toast(undefined, data.message.message);
                        break;
                }
            })
        };

        /**
         * 请求业主公司列表
         */
        function reqCompanyInfo(searchName, call) {
            let params;
            let api;
            let currentCompanyInfo = cache.getCompanyInfo();
            console.log("currentCompanyInfo");
            console.log(currentCompanyInfo);
            let currentEmployeeInfo = cache.getEmployeeInfo();
            console.log("currentEmployeeInfo");
            console.log(currentEmployeeInfo);
            if (cache.getCompanyType() === "service") {
                api = SERVICE_QUERY_COMPANY_URL;
                params = {
                    jsonBean:
                        JSON.stringify({
                            useFlag: "1",
                            type: "1",
                            serviceProviderCode: currentEmployeeInfo.serviceProviderCode,
                            currentUserId: currentEmployeeInfo.employeeId,
                            serverName: searchName == null ? "" : searchName
                        })
                };
            } else {
                api = OWNER_QUERY_COMPANY_URL;
                params = {
                    jsonBean: JSON.stringify({
                        exeType: "1",
                        ownerCode: currentEmployeeInfo.ownerCode,
                        currentUserId: currentEmployeeInfo.employeeId,
                        serverName: searchName == null ? "" : searchName
                    })
                }
            }
            utils.AjaxJson(api, params, function (result) {
                if (result != null && result.message != null && result.message.code == 200) {
                    console.warn("数据不为空");
                    console.warn(result.rows);
                    call(result.rows);
                } else {
                    utils.Toast("", "未查询到相关信息", "");
                }

            });

        }


        /**
         * 请求发起人列表
         */
        function reqOrderPerson(synCode, serviceProviderCode, call) {
            var params = {
                jsonBean:
                    JSON.stringify({
                        synCode: synCode,
                        serviceProviderCode: serviceProviderCode,
                    })
            };
            utils.AjaxJson(SERVICE_QUERY_PERSON_URL, params, function (result) {
                if (result != null && result.rows != null && result.message.code === 200) {
                    console.warn("数据不为空");
                    console.warn(result.rows);
                    call(result.rows);
                } else {
                    utils.Toast("", "未查询到相关信息", "");
                }

            });

        }

        /**
         * 获取Sla数据
         */
        function reqSlaMinute(call) {
            let params;
            let url;
            let currentCompanyInfo = cache.getCompanyInfo();
            console.log("currentCompanyInfo");
            console.log(currentCompanyInfo);
            let currentEmployeeInfo = cache.getEmployeeInfo();
            console.log("currentEmployeeInfo");
            console.log(currentEmployeeInfo);
            if (cache.getCompanyType() === "service") {
                params = {
                    jsonBean:
                        JSON.stringify({
                            serviceProviderCode: currentEmployeeInfo.serviceProviderCode,
                            contractId: currentEmployeeInfo.contractId == null ? "" : currentEmployeeInfo.contractId
                        })
                };
                url = SERVICE_MINUTE_URL;
            } else {
                params = {
                    jsonBean:
                        JSON.stringify({
                            ownerCode: currentEmployeeInfo.ownerCode
                        })
                };
                url = OWNER_MINUTE_URL;
            }
            utils.AjaxJson(url, params, function (result) {
                if (result != null && result.message != null && result.message.code === 200) {
                    console.warn("数据不为空");
                    console.warn(result.rows);
                    call(result.rows);
                } else {
                    utils.Toast("", "未查询到相关sla信息", "");
                }

            });
        }

        function upLoadFile(companyType, versionCode, companyCode, file, call) {
            let url;
            if (companyType === "service") {
                url = SERVICE_UPLOAD_FILE;
            } else {
                url = OWNER_UPLOAD_FILE;
            }
            if (file == null) {
                utils.Toast("", "上传文件不能为空", "");
                return;
            }
            let file_data = new FormData();
            file_data.append("versionCode", versionCode);
            file_data.append("companyCode", companyCode);
            file_data.append("fileuploadFileName", file.name);
            file_data.append("fileupload", file);
            file_data.append("isControl", '1');
            utils.AjaxFile(url, file_data, function (result) {
                if (result != null && result.attachName != null && result.msg === "上传成功！") {
                    call(result);
                } else {
                    utils.Toast("", "文件上传失败", "");
                }

            });
        }

        //发工单 -发送验证码
        function sendVercode(companyType, phone, call) {
            let url;
            if (companyType === "service") {
                url = SERVICE_SEND_CODE;
            } else {
                url = OWNER_SEND_CODE;
            }
            params = {jsonBean: phone};
            utils.AjaxJson(url, params, function (result) {
                if (result != null && result.message != null && result.message.code === 200) {
                    call(result);
                } else {
                    utils.Toast("", "获取验证码失败", "");
                }

            });
        }

        //发工单 -重置密码
        function resetPwd(companyType, phone, verCode, pwd, call) {
            let url;
            if (companyType === "service") {
                url = SERVICE_RESET_PWD;
            } else {
                url = OWNER_RESET_PWD;
            }
            params = {
                jsonBean: JSON.stringify({
                        mobilePhone: phone,
                        newPwd: pwd,
                        vercode: verCode,
                    }
                )
            }
            ;
            utils.AjaxJson(url, params, function (result) {
                console.log("重置密码");
                console.log(result);
                if (result != null && result.message != null && result.message.code === 200) {
                    call(result);
                } else {
                    switch (result.message.code) {
                        case 1111:
                            utils.Toast("", "验证码错误", "");
                            break;
                        default:
                            utils.Toast("", "重置密码失败", "");
                            break;

                    }
                }

            });
        }

        //发工单
        function sendWokOrder(companyType, orderInfo, call) {
            let url;
            if (companyType === "service") {
                url = SERVICE_SEND_ORDER;
                params = {jsonBean: JSON.stringify(orderInfo)}
            } else {
                url = OWNER_SEND_ORDER;
                params = {jsonBean: JSON.stringify(orderInfo)}
            }
            console.log("发送工单信息");
            console.log(params);
            utils.AjaxJson(url, params, function (result) {
                if (result != null && result.message != null && result.message.code === 200) {
                    call(result.rows);
                } else {
                    utils.Toast("", "发送工单失败", "");
                }

            });
        }

        window.request =
            {
                doLogin: doLogin,
                reqCompanyInfo: reqCompanyInfo,
                reqOrderPerson: reqOrderPerson,
                reqSlaMinute: reqSlaMinute,
                sendWokOrder: sendWokOrder,
                upLoadFile: upLoadFile,
                sendVercode: sendVercode,
                resetPwd: resetPwd
            };
    }

)
();