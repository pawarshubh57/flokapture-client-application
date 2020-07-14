document.addEventListener("DOMContentLoaded", function () {
    var checkBrowser = function () {
        var errMsg =
            "<p style='color: red;'> Please use certified browsers to use this product.<br /><br /> Valid browsers are Microsoft Edge and Chrome.</ p> ";
        var isOpera = (!!window.opr && !!window.opr.addons) ||
            !!window.opera ||
            navigator.userAgent.indexOf(" OPR/") >= 0;
        if (isOpera) $("#LoginForm").html("").html(errMsg);
        // var isFirefox = typeof window.InstallTrigger !== "undefined";
        // if (isFirefox) $("#LoginForm").html("").html(errMsg);
        var isSafari = /constructor/i.test(window.HTMLElement) ||
            (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
                (!window['safari'] || window.safari.pushNotification);
        if (isSafari) $("#LoginForm").html("").html(errMsg);
        var isIe = false || !!document.documentMode;
        if (isIe) $("#LoginForm").html("").html(errMsg);
        // var isEdge = !isIE && !!window.StyleMedia;
        // var isChrome = !!window.chrome && !!window.chrome.webstore;
        // if (isChrome) $("#LoginForm").html("").html(errMsg);
        // var isBlink = (isChrome || isOpera) && !!window.CSS;
    };
    checkBrowser();
});
var baseAddress = $.fn.baseAddress();
window.localStorage.clear();

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    $("#LoginForm").keypress(function (event) {
        if (event.which === 13) {
            $("#BtnLogin").click();
        }
    });
    $("#BtnLogin").click(function () {
        if ($("#TxtUserName").val() === "") {
            document.getElementById("tdError").innerHTML = "Please enter username";
            $("#TxtUserName").focus();
            return;
        }
        if ($("#TxtPassword").val() === "") {
            document.getElementById("tdError").innerHTML = "Please enter password";
            $("#TxtPassword").focus();
            return;
        }
        document.getElementById("tdError").innerHTML = "";
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "UserMaster/UserLogin",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "UserName": document.getElementById("TxtUserName").value,
                "Password": document.getElementById("TxtPassword").value
            }), // {"UserName": userName, "Password": password},
            success: function (result) {
                if (result !== null) {
                    $.fn.actionAuditLog(result[0].UserId, 'User Login', '0').then(function () {
                        var userInfo = result[0];
                        var loginUserInfo = {
                            UserName: userInfo.UserName,
                            UserId: userInfo.UserId,
                            UserRoleId: userInfo.RoleId,
                            AssignedProjects: userInfo.ProjectIds
                        };
                        window.localStorage.setItem("tabs", JSON.stringify(userInfo.Tabs));
                        window.localStorage.setItem("login-user-info", JSON.stringify(loginUserInfo));
                        window.localStorage.setItem("userId", result[0].UserId);
                        window.localStorage.setItem("uName", result[0].UserName);
                        window.localStorage.setItem("orgId", result[0].OrgnizationId);
                        window.localStorage.setItem("projectIds", result[0].ProjectIds);
                        window.localStorage.setItem("userRoleMenu", result[0].UserRoleMenu);
                        window.localStorage.setItem("landingRoleMenu", result[0].LandingRoleMenu);
                        var defualtLandingPage = result[0].DefualtLandingPage;
                        if (defualtLandingPage === "Portfolio - Default") {
                            window.location = "landing.html";
                        } else if (defualtLandingPage === "Project Dashboard") {
                            window.localStorage.setItem("prjctId", result[0].DefualtProjectId);
                            window.location = "projects_workspace.html?pid=" + result[0].DefualtProjectId + "";
                        } else if (defualtLandingPage === "Search - Query Console") {
                            window.location = "query_console.html";
                        } else {
                            window.location = "landing.html";
                        }
                    }).catch(function (e) {
                        console.log(e);
                    });
                }
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    document.getElementById("tdError").innerHTML = response.responseJSON.Message;
                },
                404: function (response) {
                    document.getElementById("tdError").innerHTML = "User " + response.statusText;
                },
                500: function (response) {
                    document.getElementById("tdError").innerHTML = response.statusText;
                }
            },
            error: function (e) {
                console.log(e);
                document.getElementById("tdError").innerHTML = "Error while connecting to API";
                //net::ERR_CONNECTION_REFUSED
            }
        });
    });

    $("#TxtUserName").focus();

    $("#lnkWhatsNew").click(function () {
        $('#treeViewSourceNew').html('');
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "UserMaster/GetAddNewItems",
            success: function (data) {
                $('#treeViewSourceNew').html('');
                var types = [];
                if (data != null) {
                    var name = "<ul>";
                    var counter = 1;
                    for (var k = 0; k < data.length; k++) {
                        if (types.indexOf(data[k].Type) === -1) {
                            name += "<h4>" + data[k].Type + "</h4>";
                            counter = 1;
                        }
                        var newLine = data[k].NewItem.replace(/  +/g, ' ');
                        name += "<li style='padding-left: 10px;'>" + counter + ". " + newLine + "</li>";
                        types.push(data[k].Type);
                        counter++;
                    }
                    name += "</ul>";
                    $('#treeViewSourceNew').append(name);
                    $("#whatsNewDialog").modal("show");
                }
            }
        });

    });
    $("#btnResetPassword").click(function () {
        $("#tdMsg").html("");
        var userName = $("#txtUserName").val();
        var email = $("#txtEmail").val();
        var newPass = $("#txtNewPassowrd").val();
        var confirmPass = $("#txtConfirmPassoword").val();
        if (newPass !== confirmPass) {
            $("#tdMsg").attr("style", "color: red;");
            $("#tdMsg").html("Password and Confirm Password do not match.");
            return false;
        } else {
            forgotPassword.checkDetails(userName, email, newPass);
        }
        return true;
    });
    // $("#trForgotPass").hide();
});

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

function showForgotPassword() {
    $(forgotPasswordDialog).modal("show");
}

var forgotPassword = function () { };
forgotPassword.checkDetails = function (userName, email, newPass) {
    var postData = {
        UserName: userName,
        Email: email,
        NewPassword: newPass
    };
    $.ajax({
        url: baseAddress + "UserMaster/ForgotPassword",
        type: "POST",
        data: postData,
        success: function () {
            $("#tdMsg").html("");
            $("#tdMsg").attr("style", "color: green;");
            $("#tdMsg").html("Password reset successfully.");
        },
        error: function (e) {
            $("#tdMsg").attr("style", "color: red;");
            $("#tdMsg").html(e.responseJSON.Message);
        }
    });
};