$(document).ready(function() {
    jQuery.ajax({
        type: "GET",
        url: "http://localhost:8888/Api/Home/GetStatus",
        success: function (cData) {
            console.log(cData);
        },
        statusCode: {
            400: function (response) {
                document.getElementById("tdError").innerHTML = response.responseJSON.Message;
            }
        },
        error: function () {
            document.getElementById("tdError").innerHTML = "Error while connecting to API";
            //net::ERR_CONNECTION_REFUSED
        }
    });
});