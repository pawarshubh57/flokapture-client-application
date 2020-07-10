var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");

$(document).ready(function() {
    fillUserDetails(userId);
    $("#btnChangePassword").click(function() {
        $("#changePasswordDialog").modal("show");
        return false;
    });
    $("#btnPassword").click(function() {
        var error = document.getElementById("tdError");
        if ($("#txtOldPassword").val() === "") {
            error.innerHTML = "Please enter old password";
            $("#txtOldPassword").focus();
            $("#txtOldPassword").css("border-color", "red");
            $("#txtOldPassword").on("keypress", function() {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtOldPassword").val() !== $("#password")[0].innerHTML) {
            error.innerHTML = "Old password & entered password do not match";
            $("#txtOldPassword").focus();
            $("#txtOldPassword").css("border-color", "red");
            $("#txtOldPassword").on("keypress", function() {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtNewPassowrd").val() === "") {
            error.innerHTML = "Please enter new password";
            $("#txtNewPassowrd").focus();
            $("#txtNewPassowrd").css("border-color", "red");
            $("#txtNewPassowrd").on("keypress", function() {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtNewPassowrd").val() !== $("#txtConfirmPassword").val()) {
            error.innerHTML = "Passwords do not match";
            $("#txtConfirmPassword").focus();
            $("#txtConfirmPassword").css("border-color", "red");
            $("#txtConfirmPassword").on("keypress", function() {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtConfirmPassword").val() !== "" && $("#txtNewPassowrd").val() === $("#txtConfirmPassword").val()) {
            if (!checkPassword($("#txtNewPassowrd").val())) {
                error.innerHTML = "Password must be at least 6 characters long, contains 1 upper case 1 lower case and 1 special character";
                $("#txtNewPassowrd").focus();
                $("#txtNewPassowrd").css("border-color", "red");
                $("#txtNewPassowrd").on("keypress", function() {
                    $(this).css("border-color", "");
                });
                return false;
            }
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "UserMaster/UpdatePassword?UserId=" + userId + "&password=" + $("#txtConfirmPassword").val() + "",
            contentType: "application/json;charset=utf-8",
            success: function(result) {
                if (result === "Password updated successfully.") {
                    $("#changePasswordDialog").modal("hide");
                    document.getElementById("tdError1").innerHTML = "Password updated successfully.";
                } else {
                    error.innerhtml = "Please try again.";
                }
            }
        });
    });
});

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return re.test(str);
}

function fillUserDetails(userId) {
    $.ajaxSetup({ cache: false });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserMaster/GetItemsUserProfile?tKey=" + userId,
        contentType: "application/json; charset=utf-8",
        success: function(userData) {
            if (userData !== "undefined") {
                var userDetails = userData.UserDetails[0];
                $("#userProfileName")[0].innerHTML = userDetails.UserName;
                $("#lnkUserName")[0].innerHTML = userDetails.UserName;
                $("#name")[0].innerHTML = userDetails.UserName;
                $("#contactno")[0].innerHTML = userDetails.ContactNumber;
                $("#emailId").html('');
                $("#emailId").append($("<a />").append(userDetails.EmailId).prop("href", "mailto:" + userDetails.EmailId));
                $("#status")[0].innerHTML = userDetails.Status;
                $("#username")[0].innerHTML = userData.UserName;
                $("#password")[0].innerHTML = userData.Password;
                $("#defaultLandingPage")[0].innerHTML = userDetails.DefualtLandingPage;
                $("#projectName")[0].innerHTML = userDetails.ProjectIds;
            }
        },
        statusCode: {
            200: function() {
            },
            201: function() {
            },
            400: function() {
            },
            404: function() {
            }
        },
        error: function() {
        }
    });
}

$("#btnSetLandingPage").click(function() {
    $("#divSetDefaultlandingPage").modal("show");
    fillProjectDropDown();
    return false;
});

$("#ddllandingpage").on('change', function () {
    var defualtLanding = $("#ddllandingpage option:selected").text();
    if (defualtLanding === "Project Dashboard") {
        $('#ddlSelectProject').attr('disabled', false);
    }
});

$("#btnSave").click(function () {
    var defualtLanding = $("#ddllandingpage option:selected").text();
    if (defualtLanding === "Project Dashboard") {
        if ($("#ddlSelectProject").val() === "Select" || $("#ddlSelectProject").val() === "0") {
            document.getElementById("dvError").innerHTML = "Please select project";
            $("#ddlSelectProject").focus();
            $("#ddlSelectProject").css("border-color", "red");
            $("#ddlSelectProject").on("click", function () {
                $(this).css("border-color", "");
                document.getElementById("dvError").innerHTML = "";
            });
            return false;
        }
    }
    var projectId = $("#ddlSelectProject").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserMaster/UpdateDefaultLandingPage?option=" + defualtLanding + "&projectId=" + projectId + "&userId=" + userId + "",
        success:function(result) {
            document.getElementById("dvError").innerHTML = result;
            document.getElementById("dvError").style.color = "green";
        },
        statusCode: {
            200: function () {
            },
            201: function () {
            },
            400: function (response) {
                document.getElementById("dvError").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("dvError").innerHTML = response.statusText;
            },
             500: function(response) {
                 document.getElementById("dvError").innerHTML = response.statusText;
        }
        },
        error: function (data) {
            document.getElementById("dvError").innerHTML = "Error while connecting to API";
          
        }
    });
});

function fillProjectDropDown() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetNameValue?entity=ProjectMaster&id=0&pids=" + projectIdList+"",
        success: function (result) {
            if (result !== null) {
                $.each(result, function (key, value) {
                    $("#ddlSelectProject").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                });
            }
        }
    });
    document.getElementById("ddlSelectProject").style.font = "Verdana";
}