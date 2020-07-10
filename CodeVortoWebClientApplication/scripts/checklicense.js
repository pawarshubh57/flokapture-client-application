var baseAddress = $.fn.baseAddress();
var projectIdList = window.localStorage.getItem("projectIds");
var orgId = window.localStorage.getItem("orgId");

(function ($) {
    $.fn.getLicenseDetails = function (option) {
        var message;
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "UserMaster/GetLicenseInfo?projectIds=" + projectIdList + "&option=" + option + "&orgId=" + orgId,
            success: function (result) {
                if (result != null) {
                    if (result === "1") {
                        window.location = "licensedetails.html";
                        return false;
                    }
                    if (option === "yes") {
                        if (result === "2") {
                            message = "You are running on Overage per your current license." +
                                " Your overage is XXX lines which is greater than 10% of maximum allowed. To stop seeing this message," +
                                " please contact your reseller or Flokapture support at <a dir='ltr' href='mailto:support@flokapture.solutions' target='_blank' " +
                                "style='text-decoration:underline; color: #15c'>support@flokapture.solutions</a> . Thank you. ";
                            displayMessage(message, "medium");
                            return true;
                        }
                    }
                }
                return true;
            }
        });
    }
}(jQuery));



function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

//(function ($) {
//    $.fn.license = function () {


//        //var hostName = window.location.hostname;
//        //var baseUrl = window.location.protocol + "//" + hostName + ":8888/api/";
//        //return baseUrl;

//    };
//}(jQuery));