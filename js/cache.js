//测试服务
//var BaseUrl="https://www.easyitom.com:443";
(function () {
    if (window.cache) {
        return;
    }

    function jumpLogin() {
        // window.location.href = "login.html";
    }


    function getCompanyType() {
        return localStorage.getItem("companyType") == null ? "service" : localStorage.getItem("companyType");
    }


    /**
     * 设置当前公司为服务商公司
     */
    function setCompanyServiceSelcted() {
        localStorage.setItem("companyType", "service");
    }

    /**
     * 设置当前公司为业主公司
     */
    function setCompanyOwnerSelected() {
        localStorage.setItem("companyType", "owner");
    }


    /**
     * 存储 服务商用户信息
     * @param user 服务商用户对象
     */
    function setServiceUserInfo(user) {
        console.warn("业主公司信息保存成功")
        localStorage.setItem("serviceInfo", JSON.stringify(user));
    }

    /**
     * 存储 业主用户信息
     * @param user 业主用户对象
     */
    function setOwnerUserInfo(user) {
        console.warn("服务商公司信息保存成功")
        localStorage.setItem("ownerInfo", JSON.stringify(user));
    }


    /**
     * 读取服务商用户对象信息
     * @returns {any}
     */
    function getServiceUserInfo() {
        let info = localStorage.getItem("serviceInfo") == null ? "" : localStorage.getItem("serviceInfo");
        try {
            return JSON.parse(info);
        } catch (SyntaxError) {
            return null;
        }

    }


    /**
     * 读取 业主用户对象信息
     * @returns {any}
     */
    function getOwnerUserInfo() {
        let info = localStorage.getItem("ownerInfo") == null ? "" : localStorage.getItem("ownerInfo");
        try {
            return JSON.parse(info);
        } catch (SyntaxError) {
            return null;
        }
    }


    /**
     * 存储企业信息
     * @param info json类型企业信息
     */
    function setCompanyInfo(info) {
        console.warn("存储当前企业信息")
        localStorage.setItem("currentCompanyInfo", JSON.stringify(info));
    }

    /**
     * 读取企业信息
     * @returns {*} 对象类型企业信息
     */
    function getCompanyInfo() {
        let info = localStorage.getItem("currentCompanyInfo") == null ? "" : localStorage.getItem("currentCompanyInfo");
        try {
            return JSON.parse(info);
        } catch (SyntaxError) {
            return null;
        }
    }

    /**
     * 存储企业员工信息
     * @param info json类型企业信息
     */
    function setEmployeeInfo(info) {
        console.warn("存储当前企业信息");
        localStorage.setItem("currentEmployeeInfo", JSON.stringify(info));
    }

    /**
     * 读取企业员工信息
     * @returns {*} 对象类型企业信息
     */
    function getEmployeeInfo() {
        let info = localStorage.getItem("currentEmployeeInfo") == null ? "" : localStorage.getItem("currentEmployeeInfo");
        try {
            return JSON.parse(info);
        } catch (SyntaxError) {
            return null;
        }
    }


    function clearInfo() {
        localStorage.removeItem("serviceInfo");
        localStorage.removeItem("ownerInfo");
        localStorage.removeItem("currentCompanyInfo");
        localStorage.removeItem("currentEmployeeInfo");
        sessionStorage.clear();
    }


    window.cache =
        {
            getCompanyType: getCompanyType,
            setCompanyServiceSelcted: setCompanyServiceSelcted,
            setCompanyOwnerSelected: setCompanyOwnerSelected,
            setServiceUserInfo: setServiceUserInfo,
            setOwnerUserInfo: setOwnerUserInfo,
            getServiceUserInfo: getServiceUserInfo,
            getOwnerUserInfo: getOwnerUserInfo,
            setCompanyInfo: setCompanyInfo,
            getCompanyInfo: getCompanyInfo,
            setEmployeeInfo: setEmployeeInfo,
            getEmployeeInfo: getEmployeeInfo,
            clearInfo: clearInfo
        };
})();