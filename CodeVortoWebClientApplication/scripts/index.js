
var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
window.localStorage.setItem("prjctId", 0);
var projectId = 0;

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("landingRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});

$(document).ready(function () {
    window.localStorage.setItem("searchResults", null);
    window.localStorage.setItem("selectedExtensionIds", null);
    window.localStorage.setItem("selectedProjectIds", null);
    /*
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/CheckLinesCount?projectIds=" + projectIdList,
        success: function (result) {

        }
    });
    */
    tickersBinds();
    loadDataForGraph();
    $("#btnGo").click(function () {
        var result = $("#ddlSelectOption").val();
        if (result !== "0") {
            window.location = result;
        }
    });
});

function tickersBinds() {
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectTickersCount?projectId=" + projectIdList,
        success: function (tickerCount) {
            if (tickerCount != null) {
                var t = tickerCount[0];
                $("#pClassesScreens")[0].innerHTML = t.NoOfClsses; //+ " / " + t.NoOfScreens;
                $("#pNoOfPackgesLines")[0].innerHTML = t.NoOfLines;
                $("#pNoOfActionWorkflows")[0].innerHTML = t.NoOfWorkflows; // + " / ";
                $("#pNoOfEntities")[0].innerHTML = t.NoOfEntities + " / " + t.NoOfAttributes;
                var businessFun = (t.NoOfBusinessFuns && t.NoOfBusinessFuns) === 0 ? "0" : t.NoOfBusinessFuns;
                $("#cntBusinessFunctions")[0].innerHTML = businessFun;
                var noOfTags = t.NoOfTags === 0 ? "0" : t.NoOfTags;
                $("#pNoOfTags")[0].innerHTML = noOfTags;

                var noOfAnnotation = t.NoOfAnnotation === 0 ? "0" : t.NoOfAnnotation;
                $("#pNoOfAnnotation")[0].innerHTML = noOfAnnotation;
                var noOfDeavtivate = t.NoOfDeavtivate === 0 ? "0" : t.NoOfDeavtivate;
                $("#pNoOfDeactivated")[0].innerHTML = noOfDeavtivate;
                $body.removeClass("loading");
            }
        }
    });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/Get?UserId=" + userId,
        success: function (data) {
            if (data !== null) {
                drawTable(data, "tblAllProjects");
                /*
                $("#tblAllProjects").ejGrid({
                    width: "100%",
                    dataSource: data,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    allowScrolling: false,
                    columns: [
                        { field: "ProjectId", headerText: "ProjectId", visible: false, template: "<span>{{:ProjectId}}</span>" },
                        { field: "ProjectName", headerText: "Project Name", width: 130 },
                        {
                            headerText: "Action",
                            isUnbound: true,
                            width: 70,
                            template: "<button id='Btn_{{:ProjectId}}' class='btn btn-mint'>Load</button>"
                        }
                    ],
                    rowSelected: function (args) {
                        var value = args.target[0].innerHTML;
                        if (value === "Load") {
                            var prjctId = args.data.ProjectId;
                            $.fn.actionAuditLog(userId, 'Project Load', prjctId).then(function () {
                                window.localStorage.setItem("prjctId", prjctId);
                                window.localStorage.setItem("gridPageNumber", 1);
                                window.location = "projects_workspace.html?pid=" + prjctId;
                            }).catch(function (e) {
                                console.log(e);
                            });
                        }
                    }
                });
                */
            }
        }
    });
}

function loadDataForGraph() {
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetNameValue?entity=ProjectMaster&id=0&pids=" + projectIdList + "",
        success: function (result) {
            if (result != null) {
                var sampleData = [];
                for (var i = 1; i < result.length; i++) {
                    sampleData.push(result[i]);
                }
                $.each(sampleData, function (key, value) {
                    $("#ddlProjectType").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                });
                var prjId = document.getElementById("ddlProjectType").value;
                prjId = prjId || 0;
                $.get(baseAddress + "ProjectMaster/GetAllDashBoardCoverage?projectId=" + prjId + "", function (data) {
                    var sampleData = [];
                    var workflows = data.Charts[0].data;
                    for (var i = 1; i < data.Charts.length; i++) {
                        sampleData.push(data.Charts[i]);
                    }
                    var settings = {
                        title: "Workflow(s) summary",
                        description: "Total Workflows: " + data.Charts[0].data,
                        showLegend: true,
                        enableAnimations: true,
                        padding: { left: 1, top: 1, right: 1, bottom: 1 },
                        titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                        source: sampleData,
                        xAxis:
                        {
                            unitInterval: 1,
                            dataField: 'label',
                            gridLines: { visible: true },
                            flip: false
                        },
                        valueAxis:
                        {
                            unitInterval: workflows / 10,
                            minValue: 0,
                            maxValue: workflows,
                            flip: true,
                            labels: {
                                visible: true
                            }
                        },
                        colorScheme: 'scheme01',
                        seriesGroups:
                            [
                                {
                                    type: 'column',
                                    orientation: 'horizontal',
                                    columnsGapPercent: 50,
                                    toolTipFormatSettings: { thousandsSeparator: ',' },
                                    series: [
                                        { dataField: 'data', displayText: 'Percentage(%)' }
                                    ]
                                }
                            ]
                    };
                    // setup the chart
                    $('#barAppCoverageDashboard').jqxChart(settings);
                });
            }
        }
    });
    $.get(baseAddress + "ProjectMaster/GetApplicationPieChart?projectId=" + projectIdList + "&opt=opt", function (data) {
        if (typeof data !== "undefined") {
            var dataSet = data;
            $.plot($("#demo-flot-donutApp"), dataSet.Charts, {
                series: { pie: { show: true } },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 0,
                        y: 0
                    },
                    defaultTheme: true
                }
            });

            var dtTable = data.Charts;
            window.Morris.Bar({
                element: 'demo-morris-barApp123',
                data: data.Charts,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['Count'],
                gridEnabled: true,
                gridLineColor: 'transparent',
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable.length; i++) {
                        if (dtTable[i].label !== row.label) {
                            continue;
                        } else {
                            clr = dtTable[i].color;
                        }
                    }
                    return clr;
                },
                resize: true,
                hideHover: 'auto'
            });
            /*
            window.Morris.Bar({
                element: 'demo-morris-barApp123',
                data: dtTable,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['Count'],
                gridEnabled: true,
                gridLineColor: 'transparent',
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable.length; i++) {
                        if (dtTable[i].label === row.label) {
                            clr = dtTable[i].color;
                            break;
                        }
                    }
                    return clr;
                },
                resize: false,
                hideHover: 'auto'
            });
            */
        }
    });

    $.get(baseAddress + "ProjectMaster/GetApplicationLOCChart?projectId=" + projectIdList + "&opt=opt", function (data2) {
        if (data2 !== null) {
            var dataSet2 = data2;
            var dtTable = data2.Charts;
            window.Morris.Bar({
                element: 'demo-morris-barAppLOC',
                data: dataSet2.Charts,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['Lines of Code (LoC)'],
                gridEnabled: false,
                gridLineColor: 'transparent',
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable.length; i++) {
                        if (dtTable[i].label !== row.label) {
                            continue;
                        } else {
                            clr = dtTable[i].color;
                        }
                    }
                    return clr;
                },
                resize: true,
                hideHover: 'auto'
            });
            $.plot($("#demo-morris-barAppActionWorkFlow"), dataSet2.Charts, {
                series: {
                    pie: {
                        show: true
                    }
                },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 0,
                        y: 0
                    },
                    defaultTheme: true
                }
            });
        }
    });
    /*
    $.get(baseAddress + "ProjectMaster/GetApplicationActionWorkflowChart?projectId=" + projectIdList + "&opt=opt", function (data3) {
        if (data3 != null) {
            var dataSet3 = data3;
            var colorList = ["#BEABF2"];
            var clrCnt = 0;
            window.Morris.Bar({
                element: 'demo-morris-barAppActionWorkFlow',
                data: dataSet3.Charts,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['#Actions/Workflow'],
                gridEnabled: false,
                gridLineColor: 'transparent',
                barColors: function () {
                    var clrColor = colorList[clrCnt];
                    clrCnt++;
                    if (clrCnt >= colorList.length)
                        clrCnt = 0;
                    return clrColor;
                },
                resize: true,
                hideHover: 'auto'
            });

        }
    });
    */
}

function drawTable(data, tableName) {
    if (tableName === "tblAllProjects") {
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i], tableName, '', (i + 1));
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, 'pointer', (j + 1));
        }
    }
}

function drawRow(rowData, tableName, css, srNo) {
    var row = $("<tr title='record_" + rowData.ProjectId + "' id='projectTr_" + rowData.ProjectId + "' />");
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.ProjectName + " </td>"));
    row.append($("<td>" + rowData.LanguageMaster.LanguageName + " </td>"));
    row.append($("<td>" + rowData.TotalFiles + " </td>"));
    row.append($("<td>" + Math.round(rowData.ProjectSize) + " MB </td>"));
    row.append($("<td>" + rowData.UploadedDate + " </td>"));
    row.append($("<td>" + rowData.ProcessedDate + " </td>"));
    row.append($("<td><a href='#' onclick='setLocalStorage(" + rowData.ProjectId + ", " + rowData.LanguageMaster.LanguageId + ");'><button class='btn btn-mint'>Load</button></a></td>"));
    $("#" + tableName).append(row);
}

 var setLocalStorage = function (prjId, languageId) {
    $.fn.actionAuditLog(userId, 'Project Load', prjId).then(function () {
        window.localStorage.setItem("prjctId", prjId);
        window.localStorage.setItem("gridPageNumber", 1);
        window.localStorage.setItem("languageId", languageId);
        window.location = "projects_workspace.html?pid=" + prjId;
    }).catch(function (e) {
        console.log(e);
    });
};

function showPortfolioDialog() {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, "Overall Workflow", prjctId).then(function () {
        $.get(baseAddress + "FileObjectReference/GetGroupedFlowChart?" +
            "projectId=" + projectIdList + "&stmtId=0" +
            "&saveUrlPath=&flag=0&userId=" + userId,
            function (tData) {
                if (tData !== null) {
                    downloadFile(tData);
                }
            });
    }).catch(function (e) {
        console.log(e);
    });

}

$("#ddlProjectType").click(function () {
    $.ajaxSetup({
        async: false
    });
    var prjId = $("#ddlProjectType").val();
    prjId = prjId || 0;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetAllDashBoardCoverage?projectId=" + prjId,
        success: function (data) {
            var sampleData = [];
            var workflows = data.Charts[0].data;
            for (var i = 1; i < data.Charts.length; i++) {
                sampleData.push(data.Charts[i]);
            }
            var settings = {
                title: "Workflow(s) summary",
                description: "Total WorkFlows: " + data.Charts[0].data,
                showLegend: true,
                enableAnimations: true,
                padding: { left: 1, top: 1, right: 1, bottom: 1 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: sampleData,
                xAxis:
                {
                    unitInterval: 1,
                    dataField: 'label',
                    gridLines: { visible: true },
                    flip: false
                },
                valueAxis:
                {
                    unitInterval: workflows / 10,
                    minValue: 0,
                    maxValue: workflows,
                    flip: true,
                    labels: {
                        visible: true
                    }
                },
                colorScheme: 'scheme01',
                seriesGroups:
                    [
                        {
                            type: 'column',
                            orientation: 'horizontal',
                            columnsGapPercent: 50,
                            toolTipFormatSettings: { thousandsSeparator: ',' },
                            series: [
                                { dataField: 'data', displayText: 'Percentage(%)' }
                            ]
                        }
                    ]
            };
            $('#barAppCoverageDashboard').jqxChart(settings);
        }
    });
});

function showPortfolioDialogConnectivity() {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, "Overall Connectivity", prjctId).then(function () {
        var opt = 1;
        jQuery.ajax({
            url: baseAddress + "FileObjectReference/GetObjectReference?" +
                "projectId=" +
                projectIdList +
                "&saveUrlPath=&opt=" + opt + "&userId=" + userId,
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data !== null) {
                    downloadFile(data);
                }
            }
        });
    }).catch(function (e) {
        console.log(e);
    });
}

function addWorkflowProcess(projectId, statementId, workflowId, name, nodeCount) {
    var workflowProcess = [];
    workflowProcess.push({
        "ProjectId": projectId,
        "WorlflowId": workflowId,
        "StatementId": statementId,
        "Processed": 0,
        "Name": name,
        "NodeCount": nodeCount
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkflowProcess/Post",
        data: workflowProcess[0],
        success: function (result) {
            if (result !== null) {

            }
        }
    });
}

function downloadFile(path) {
    var element = document.getElementById("a123456");
    element.href = path;
    element.target = "_blank";
    var myWindow = window.open(path, "_self");
    myWindow.close();
}

function fillProjectTypeDropdown() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetNameValue?entity=ProjectMaster&id=0&pids=" + projectIdList + "",
        success: function (result) {
            if (result != null) {
                $.each(result, function (key, value) {
                    $("#ddlProjectType").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                });
            }
        }
    });
}

function showAllProjectEntitiesList() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ActionWorkflowsReference/GetAllProjectEntities?userId=" + userId,
        success: function (data) {
            if (data !== null) {
                // drawTable(data, "tblWorkflows");
                var sourceNew =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'GraphId', type: 'string' },
                        { name: 'ParentId', type: 'string' },
                        { name: 'GraphName', type: 'string' }
                    ],
                    hierarchy:
                    {
                        keyDataField: { name: 'GraphId' },
                        parentDataField: { name: 'ParentId' }
                    },
                    id: 'GraphId',
                    localData: data
                };
                var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                $("#divEntitiesList").jqxTreeGrid(
                    {
                        width: "100%",
                        height: 850,
                        // checkboxes: true,
                        source: dataAdapter,
                        // hierarchicalCheckboxes: true,
                        showHeader: false,
                        sortable: true,
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ]
                    });
            }
            $("#divEntities").modal("show");
        }
    });

}

$("#aLogout").click(function () {
    userLogout(userId);
});

function userLogout(userId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserMaster/UserLogout?userId=" + userId + "",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data === "Ok") {
                window.localStorage.removeItem("userId");
                window.localStorage.removeItem("uName");
                window.localStorage.setItem("userId", "");
                window.localStorage.setItem("uName", "");
                window.location = "index.html";
            }
        },
        error: function (e) {
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("uName");
            window.localStorage.setItem("userId", "");
            window.localStorage.setItem("uName", "");
            window.location = "index.html";
        }
    });
}