(function($) {
    $.fn.actionAuditLog = function(userId,rptName,projectId) {
        var url = (window.location !== window.parent.location)
            ? document.referrer
            : document.location.href;
        var fileName = url.substring(url.lastIndexOf('/') + 1).split("?")[0];
        jQuery.ajax({
            url: baseAddress + "General/ActionAuditLog",
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("UserId", userId);
                xhr.setRequestHeader("FromPage", fileName);
                xhr.setRequestHeader("ReportName", rptName);
                xhr.setRequestHeader("ProjectId", projectId);
            },
            success: function () {
            }
        });
    }
})(jQuery);