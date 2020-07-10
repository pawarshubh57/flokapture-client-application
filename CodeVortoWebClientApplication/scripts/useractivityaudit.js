var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
var userId = window.localStorage.getItem("userId");

$(document).ready(function () {
    bindLoadData();
});

function bindLoadData() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserActivityAudit/GetAllItems",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var width = "100%";
            if (data.length === 0) {
                width = "80%";
            }

            if (data.length > 0) {
                $("#activityAudit").ejGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    allowResizeToFit: true,
                    allowScrolling: true,
                    scrollSettings: { width: width },
                    allowSearching: true,
                    allowResizing: true,
                    toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Search] },
                    columns: [
                        { headerText: 'UserId', visible: false, field: 'UserId' },
                        { headerText: 'UserActivityAuditId', visible: false, field: 'UserActivityAuditId' },
                        { headerText: 'ProcessActivity', field: 'ProcessActivity' },
                        { headerText: 'UserName', field: 'UserName' },
                        { headerText: 'ActivityDate', field: 'ActivityDate' },
                        { headerText: 'ActivityTime', field: 'ActivityTime' }
                    ],
                    rowSelected: function (args) {
                        //  var userId = args.data.UserId;

                    }
                });
            }
        }
    });
}