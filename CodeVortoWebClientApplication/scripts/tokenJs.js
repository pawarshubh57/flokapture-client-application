
$(document).ready(function () {
    document.getElementById("txtTokenData").value = "";
    document.getElementById("tdApiResult").innerHTML = "";
    document.getElementById("tdError").innerHTML = "";
    executeToken();
});

function executeToken() {
    document.getElementById("tdApiResult").innerHTML = "";
    document.getElementById("txtTokenData").value = "";

    jQuery.ajax({
        type: "POST",
        dataType: "application/json",
        contentType: "application/x-www-form-urlencoded",  // <=== Added
        url: "https://127.0.0.1:8888/Token",
        data: {
            "grant_type": "password",
            "username": "yogeshs@floKapture.com",
            "password": "asdfghjkl@12345"
        },
        statusCode: {
            200: function (result) {
                var ss = result.responseText;
                var dd = JSON.parse(ss);
                document.getElementById("txtTokenData").value = ss;
                var token = dd["access_token"];
                getValues(token);
                document.getElementById("tdError").innerHTML = "";
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

        error: function () {
            document.getElementById("tdError").innerHTML = "Error while connecting to API";
            // net::ERR_CONNECTION_REFUSED
        }
    });
}

function getValues(token) {
    jQuery.ajax({
        type: "Get",
        dataType: "application/json",
        contentType: "application/json;",  // <=== Added
        url: "https://127.0.0.1:8888/api/Values/GetValue",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "bearer " + token);
        },
        statusCode: {
            200: function (result) {
                document.getElementById("tdApiResult").innerHTML = result.responseText;
            },
            201: function () {

            },
            401: function (response) {
                document.getElementById("tdError").innerHTML = response.responseText;
            },
            400: function (response) {
                document.getElementById("tdError").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError").innerHTML = "User " + response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError").innerHTML = "Error while connecting to API";
            }
        }
    });
}

$("#loginForm").submit(function () {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    var txtUserName = document.getElementById("Username").value;
    var txtPassword = document.getElementById("Password").value;
    var encryptedUsername = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txtUserName), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    document.getElementById("DecUsername").value = encryptedUsername;
    var encryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txtPassword), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    document.getElementById("DecPassword").value = encryptedPassword;

    var data = $('#loginForm').serialize();
    $.post('https://127.0.0.1:8888/api/User/PostUser', data)
        .success(function (d) {
            var s = d;
            alert(s);
        })
        .error(function () {
            $('#message').html("Error posting the update.");
        });
    return false;
});