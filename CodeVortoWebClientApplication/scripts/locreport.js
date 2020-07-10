var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");

var orgId = window.localStorage.getItem("orgId");
var projectIdList = window.localStorage.getItem("projectIds");

$(document).ready(function () {
    allProjectWithLoc();
    allLicenseDetails();
});

function allProjectWithLoc() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "LocReport/GetAllProjects?pids=" + projectIdList + "&orgId=" + orgId,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var dataDetails = data;
            var ProjectsDetailsNew = [];
            for (var i = 0; i < dataDetails.length; i++) {
                ProjectsDetailsNew.push({
                    "ProjectId": data[i].ProjectId,
                    "ProjectName": data[i].ProjectName,
                    "Loc": data[i].LinesCount
                });
            }
            if (data.length > 0) {
                $("#divProject").ejGrid(
                {
                    dataSource: ProjectsDetailsNew,
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    allowResizeToFit: true,
                    allowScrolling: true,
                    allowSearching: true,
                    allowResizing: true,
                    toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Search] },
                    columns: [
                        { headerText: 'ProjectId', visible: false, field: 'ProjectId' },
                        { headerText: 'Project Name', field: 'ProjectName', width: "30%" },
                        { headerText: 'LoC', field: 'Loc', width: "70%" }
                    ]
                });
            }
        }
    });
}

function allLicenseDetails() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "LocReport/TotalLocCount?pids=" + projectIdList + "&orgId=" + orgId,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data !== null) {
                document.getElementById("divTotalLoc").innerHTML = "Total LoC:  <b>" + data.TotalLoc + "</b>";
                document.getElementById("divCurrentMaxLocCnt").innerHTML = "Current Maximum LoC:  <b>" + data.MaxLoC + "</b>";
                document.getElementById("divRemainingLoc").innerHTML = "Remaining LoC: <b>" + data.RemainingLoc + "</b>";
                if (data.Overage !== null) {
                    document.getElementById("divAverageLocCnt").innerHTML = "Any Overage: <b>" + data.Overage + "</b>";
                }
            }
        }
    });
}

/*
function currentMaxLoc() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "LocReport/CurrentMaxLocCount",
        success:function(data) {
            if (data !== null) {
                document.getElementById("divCurrentMaxLocCnt").innerHTML = "Current Maximum loc allows per license  <b>" + data + "</b>";
            }
        }
    });
}

function remainingLocCount() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "LocReport/GetRemainingLoc?pids=" + projectIdList,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data !== null) {
                document.getElementById("divRemainingLoc").innerHTML = "Amount of loc remaining for current license tier <b>" + data + "</b>";
            }
        }
    });
}
*/