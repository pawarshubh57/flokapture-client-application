var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectId = getParameterByName("pid");
var pageNumber = window.localStorage.getItem("gridPageNumber") || 1;
var projectIdList = window.localStorage.getItem("projectIds");
var mainDataForVba = window.localStorage.getItem("mainDataForVba");
var childDataForVba = window.localStorage.getItem("childDataForVba");
var searchKeyWord = window.localStorage.getItem("searchKeyWord");
var mainData = window.localStorage.getItem("mainData");
var projectName = window.localStorage.getItem("projectName");
var prajId = window.localStorage.getItem("projectId");

$.fn.getUserProjectDetails(projectId);

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("userRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;

    /*
    // Tatpurta section...
    var link = document.querySelector('link[data-name="modal-popups"]');
    if (!link.import) return;
    var modal = link.import.querySelector("#modal-popup");
    document.querySelector("body").appendChild(modal);
    $("#modal-popup").modal("show");
    */
});

$(document).ready(function () {
    var prjName;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetProjectDetail?projectId=" + projectId,
        success: function (data) {
            if (data !== null) {
                prjName = data.ProjectName;
                var firstTab = "Discovered Workflows for Project: " + prjName;
                $("#projectName")[0].innerHTML = firstTab;
                window.localStorage.setItem("projectName", prjName);
            }
        }
    });

    $("#li_1").hover(function () {
        prjName = window.localStorage.getItem("projectName");
        var firstTab = "Discovered Workflows for Project: " + prjName;
        $(this).css('cursor', 'pointer').attr('title', firstTab);

    }, function () {
        $(this).css('cursor', 'auto');
    });

    $("#li_2").hover(function () {
        prjName = window.localStorage.getItem("projectName");
        var secondTab = "Project Dashboard: " + prjName;
        $(this).css('cursor', 'pointer').attr('title', secondTab);

    }, function () {
        $(this).css('cursor', 'auto');
    });
});

$(document).ready(function () {
    window.localStorage.setItem("projectId", projectId);
    if (prajId === projectId) {
        var mainData = window.localStorage.getItem("mainData");
        if (typeof mainData !== "undefined" && mainData !== null && mainData !== "null")
            loadDataLocalStorage();
        else
            loadDataWithProjectIds(projectId);
    } else {
        loadDataWithProjectIds(projectId);
    }
    loadDataForGraph(projectId);
    $("#txtSearchGrid").keypress(function (event) {
        if (event.which === 13) {
            $("#btnSearchGrid").click();
        }
    });

    $("#btnSearchGrid").click(function () {
        loadDataWithProjectIds(projectId);
    });

    $("#txtSearch").keypress(function (event) {
        if (event.which === 13) {
            var searchTerm = document.getElementById("txtSearch").value;
            var projectId = getParameterByName("pid");
            jQuery.ajax({
                type: "GET",
                url: baseAddress +
                    "FileMaster/CustomWorkflowObjectSearch?searchTerm=" +
                    searchTerm +
                    "&projectId=" +
                    parseInt(projectId),
                success: function (result) {
                    $("#ddlJclName").empty();
                    $.each(result,
                        function (key, value) {
                            $("#ddlJclName").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                        });
                }
            });
        }
    });

    $("#btnGo").click(function () {
        var result = $("#ddlSelectOption").val();
        if (result !== "0") {
            window.location = result;
        }
    });

    $("#li_1").click(function () {
        var prjName = window.localStorage.getItem("projectName");
        var firstTab = "Discovered Workflows for Project: " + prjName;
        $("#projectName")[0].innerHTML = firstTab;
    });

    $("#li_2").click(function () {
        var prjName = window.localStorage.getItem("projectName");
        var secondTab = "Project Dashboard: " + prjName;
        $("#projectName")[0].innerHTML = secondTab;
    });

    $("#li_3").click(function () {
        getMenuFileRevisedData(projectId, "");
    });

    $("#btnMenuSearch").click(function () {
        getMenuFileRevisedData(projectId, "");
    });

    $("#txtMenuSearch").keypress(function (event) {
        if (event.which === 13) {
            $("#btnMenuSearch").click();
        }
    });
});

function loadDataForGraph(projectId) {
    // Get all ticker counts for selected project...
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectTickersCount?projectId=" + projectId,
        success: function (tickerCount) {
            if (tickerCount !== null) {
                var t = tickerCount[0];
                $("#pClassesScreens")[0].innerHTML = t.NoOfClsses;
                $("#pNoOfPackgesLines")[0].innerHTML = t.NoOfLines;
                $("#pNoOfActionWorkflows")[0].innerHTML = t.NoOfWorkflows;  // + " / ";
                $("#pNoOfEntities")[0].innerHTML = t.NoOfEntities + " / " + t.NoOfAttributes;
                // var businessFun = t.businessFun ? t.businessFun : "";
                var businessFun = t.NoOfBusinessFuns === 0 ? "0" : t.NoOfBusinessFuns;
                $("#cntBusinessFunctions")[0].innerHTML = businessFun;
                var noOfTags = t.NoOfTags === 0 ? "0" : t.NoOfTags;
                // var noOfTags = t.NoOfTags ? t.NoOfTags :0;
                $("#pNoOfTags")[0].innerHTML = noOfTags;
                var noOfAnnotation = t.NoOfAnnotation === 0 ? "0" : t.NoOfAnnotation;
                // var noOfAnnotation = t.NoOfAnnotation ? t.NoOfAnnotation : "";
                $("#pNoOfAnnotation")[0].innerHTML = noOfAnnotation;
                var noOfDeavtivate = t.NoOfDeavtivate === 0 ? "0" : t.NoOfDeavtivate;
                //  var noOfDeavtivate = t.NoOfDeavtivate ? t.NoOfDeavtivate : "";
                $("#pNoOfDeactivated")[0].innerHTML = noOfDeavtivate;


                //$("#pNoOfTags")[0].innerHTML = t.NoOfTags; // + " / " + t.NoOfScreens;
                //$("#pNoOfAnnotation")[0].innerHTML = t.NoOfAnnotation;
                //$("#pNoOfDeactivated")[0].innerHTML = t.NoOfDeavtivate;
                //var businessFun = t.NoOfBusinessFuns ? 0 : "";
                //$("#cntBusinessFunctions")[0].innerHTML = businessFun;
                $body.removeClass("loading");
            }
        }
    });
    // Pie Chat for the for the Project Wise
    $.get(baseAddress + "ProjectMaster/GetApplicationPieChart?projectId=" + projectId, function (data) {
        if (data !== null && data.Charts !== null) {
            $.plot($("#demo-flot-donutProject"), data.Charts, {
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

    // MORRIS BAR CHART
    // =================================================================
    // Require MorrisJS Chart
    // -----------------------------------------------------------------
    // http://morrisjs.github.io/morris.js/
    // =================================================================
    //$.get(baseAddress + "ProjectMaster/GetApplicationChart", function (data) {

    $.get(baseAddress + "ProjectMaster/GetApplicationChart?projectId=" + projectId + "",
        function (data) {
            if (data !== null && data.Charts !== null) {
                var dtTable = data.Charts;
                window.Morris.Bar({
                    element: 'demo-morris-barProject',
                    data: dtTable,
                    xkey: 'label',
                    ykeys: ['data'],
                    labels: ["Count "],
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
            }
        });

    $.get(baseAddress + "ProjectMaster/GetApplicationLOCChart?projectId=" + projectId + "", function (data) {
        if (data !== null && data.Charts !== null) {
            var dtTable = data.Charts;
            window.Morris.Bar({
                element: 'demo-morris-barLocProject',
                data: dtTable,
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
            // funLocPerByPackage(data);
            $.plot($("#demo-flot-donutProjectLoc"), data.Charts, {
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

    $.get(baseAddress + "ProjectMaster/GetApplicationActionWorkflowChart?projectId=" + projectId + "", function (data) {
        if (data !== null && data.Charts !== null) {
            window.Morris.Bar({
                element: 'demo-morris-barProjectActionWorkFlow',
                data: data.Charts,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['#Actions/Workflow'],
                gridEnabled: false,
                gridLineColor: 'transparent',
                barColors: ['#66ff66'],
                resize: true,
                hideHover: 'auto'
            });
        }
    });

    $.get(baseAddress + "ProjectMaster/GetAllDashBoardCoverage?projectId=" + projectId + "", function (data) {
        if (data !== null) {
            var sampleData = [];
            if (data.Charts.length === 0) return false;
            var workflows = data.Charts[0].data;
            for (var i = 1; i < data.Charts.length; i++) {
                sampleData.push(data.Charts[i]);
            }
            var settings = {
                title: "Workflow(s) summary",
                description: "Total Workflows: " + workflows,
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
                        visible: false
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
            $('#barAppCoverage').jqxChart(settings);
        }
    });
}

function loadDataWithProjectIds(projectId) {
    var searchKeyWord = $("#txtSearchGrid").val();
    window.localStorage.setItem("searchKeyWord", searchKeyWord);
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId,
        success: function (projectDetails) {
            if (typeof projectDetails !== "undefined" && projectDetails !== null && projectDetails.length > 0) {
                var languageId = projectDetails[0].LanguageMaster.LanguageId;
                if (languageId === 5) {
                    $("#li_4").css("display", "inline");
                    $("#li_1").css("display", "none");
                    $("#tblSecondTab").css("display", "none");
                    $("#revisedTreeMenu").css('display', "block");
                    $("#demo-tabs2-box-1").addClass("tab-pane fade in");
                    $("#treeTab").addClass("tab-pane fade in active");
                } else {
                    $("#li_4").css("display", "none");
                    $("#li_1").css("display", "inline");
                    $("#tblSecondTab").css("display", "inline");
                    $("#revisedTreeMenu").css('display', "none");
                    $("#li_1").addClass("active");
                    $("#li_4").removeClass("active");
                    $("#demo-tabs2-box-1").addClass("tab-pane fade in active");
                    $("#treeTab").addClass("tab-pane fade in");
                }
                if (languageId === 6) {
                    jQuery.ajax({
                        type: "GET",
                        url: baseAddress +"WorkspaceWorkflow/GetActionWorkflows?projectId=" + projectId + "&keyWord=" + searchKeyWord,
                        success: function (entryPoints) {
                            var gridDes = $("#tblEntryPoints").data("ejGrid");
                            if (typeof gridDes !== 'undefined' && gridDes !== null)
                                gridDes.destroy();
                            if (entryPoints !== null) {
                                var firstTab = $("#tabTitle").val();
                                $("#projectName")[0].innerHTML = firstTab + " " + projectDetails[0].ProjectName;
                                var mainData = entryPoints.ActionWorkFlowFrmName;
                                var childData = entryPoints.WorkflowDetailsForProject;
                                var srcMainDataResults = JSON.stringify(mainData);
                                window.localStorage.setItem("mainDataForVba", srcMainDataResults);
                                window.localStorage.setItem("childDataForVba", JSON.stringify(childData));
                                window.localStorage.setItem("searchKeyWord", searchKeyWord);
                                window.localStorage.setItem("projectName", projectDetails[0].ProjectName);
                                window.localStorage.removeItem("mainData");
                                $("#tblEntryPoints").ejGrid({
                                    width: "99%",
                                    dataSource: mainData,
                                    allowPaging: true,
                                    pageSettings: {
                                        pageSize: 20,
                                        currentPage: parseInt(pageNumber)
                                    },
                                    allowSorting: true,
                                    showHeader: false,
                                    allowResizing: true,
                                    allowResizeToFit: true,
                                    isResponsive: true,
                                    enableResponsiveRow: true,
                                    columns: [
                                        { field: "ActionWorkFlowName", headerText: "OriginObject", width: "85%" },
                                        { field: "ActionId", visible: false, headerText: "Id" }
                                    ],
                                    create: "create",
                                    rowSelected: function (args) {
                                        document.getElementById("hdnActionWkId").value = args.data.ActionId;
                                        if (args.target[0].className === "btn btn-mint btn-icon icon-lg fa fa-upload") {
                                            var actionWflowId = args.data.ActionId;
                                            var wflowName = args.data.OriginObject;
                                            document.getElementById("hdnActionWkId").value = actionWflowId;
                                            // document.getElementById("hdnOriginObject").value = wflowName;
                                            uploadFilePopupShow(wflowName, actionWflowId);
                                        }
                                        if (args.target[0].className ===
                                            "btn btn-primary btn-icon icon-lg fa fa-download") {
                                            var actionWflowId1 = args.data.ActionId;
                                            downloadRequirementDoc(actionWflowId1);
                                        }
                                    },
                                    queryCellInfo: function (args) {
                                        $($(args.cell).parent()).css("color", "#000000").css('font-weight', 'bold');
                                    },
                                    childGrid: {
                                        dataSource: childData,
                                        queryString: "RowId",
                                        allowScrolling: true,
                                        scrollSettings: { height: 400, frozenRows: 0 },
                                        allowResizing: true,
                                        allowSorting: true,
                                        allowResizeToFit: true,
                                        isResponsive: true,
                                        enableResponsiveRow: true,
                                        columns: [
                                            {
                                                field: "ProjectId",
                                                headerText: "ProjectId",
                                                visible: false,
                                                template: "<span>{{:ProjectId}}</span>"
                                            },
                                            { field: "TechnicalAndBusinessName", headerText: "Name", width: "60%" },
                                            { field: "ObjectType", headerText: "Object Type", width: "10%" },
                                            //{ field: "ExtrernalCalls", headerText: "External<br /> Calls?", width: "9%" },
                                            //{ field: "InternalCalls", headerText: "Internal<br /> Calls?", width: "9%" },
                                            //{ field: "DecisionCount", headerText: "MCC", width: "6%" },
                                            {
                                                field: "View",
                                                headerText: "Action",
                                                width: "24%",
                                                textAlign: ej.TextAlign.Center
                                            },
                                            {
                                                field: "Disable",
                                                headerText: "Disable",
                                                width: "6%",
                                                textAlign: ej.TextAlign.Center
                                            },
                                            { field: "IsDeleted", headerText: "IsDeleted", width: "0%" }
                                        ],
                                        rowSelected: function (args) {
                                            var gridObj = $("#tblEntryPoints").data("ejGrid");
                                            // Gets grid pager of grid control
                                            var pagerInfo = gridObj.model.pageSettings.currentPage;
                                            window.localStorage.setItem("gridPageNumber", pagerInfo);
                                            var value = args.target[0].innerHTML;
                                            var actionWorkFlowId = args.data.ActionWorkflows.ActionWorkflowId;
                                            if (value === "Rename") {
                                                document.getElementById("hdnActionWkId").value = actionWorkFlowId;
                                                var workflowName = args.data.WorkflowName;
                                                // $('#txtCurrentWorkflowName').text(workflowName);
                                                //$("#dvWorkflowRename").modal("show");
                                                funWorkflowRename(workflowName, actionWorkFlowId);
                                            }
                                        },
                                        queryCellInfo: function (args) {
                                            var value = args.text.replace(",", "");
                                            switch (args.column.headerText) {
                                                case "IsDeleted":
                                                    if (parseFloat(value) <= 0) {
                                                        $($(args.cell).parent()).css("color", "#000000");
                                                    } else {

                                                        $($(args.cell).parent()).css("color", "#d0d0d0");
                                                    }
                                                    break;
                                            }
                                        }
                                    }

                                });
                            }
                            var gridObj = $("#tblEntryPoints").data("ejGrid");
                            gridObj.refreshContent(); // Refreshes the grid contents only
                            gridObj.refreshContent(true); // Refreshes the template and grid contents
                        }
                    });
                } else {
                    jQuery.ajax({
                        type: "GET",
                        url: baseAddress +
                            "WorkspaceWorkflow/GetActionWorkflowsDetails?projectId=" +
                            projectId +
                            "&keyWord=" +
                            searchKeyWord +
                            "&opt=opt",
                        success: function (entryPoints) {
                            if (entryPoints !== null) {
                                var sourceNew =
                                {
                                    dataType: "json",
                                    dataFields: [
                                        { name: 'SrNo', type: 'integer' },
                                        { name: 'GraphId', type: 'string' },
                                        { name: 'ParentId', type: 'string' },
                                        { name: 'View', type: 'string' },
                                        { name: "OriginObject", type: "string" },
                                        { name: "ObjectType", type: "string" },
                                        { name: "WorkflowName", type: "string" },
                                        { name: "Disable", type: "string" },
                                        { name: "ExtrernalCalls", type: "string" },
                                        { name: "InternalCalls", type: "string" },
                                        { name: "DecisionCount", type: "integer" },
                                        { name: "ProjectId", type: "interger" },
                                        { name: "Disable", type: "string" },
                                        { name: "ActionWorkflowId", type: "integer" }
                                    ],
                                    hierarchy:
                                    {
                                        keyDataField: { name: 'GraphId' },
                                        parentDataField: { name: 'ParentId' }
                                    },
                                    id: 'GraphId',
                                    localData: entryPoints
                                };

                                var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                                $("#tblEntryPoints").jqxTreeGrid(
                                    {
                                        width: "100%",
                                        height: 600,
                                        source: dataAdapter,
                                        autoRowHeight: true,
                                        altRows: true,
                                        showHeader: true,
                                        sortable: true,
                                        pageable: true,
                                        pagerPosition: 'both',
                                        pagerMode: "advanced",
                                        pageSize: 10,
                                        columnsResize: true,
                                        columns: [
                                            { text: 'Name', dataField: 'OriginObject', width: '30%' },
                                            { dataField: "ObjectType", text: "Object Type", width: "20%" },
                                            { dataField: 'WorkflowName', text: 'Title / Description', width: '35%' },
                                            // { text: 'External Calls?', dataField: 'ExtrernalCalls', width: '8%' },
                                            // { text: 'Internal Calls?', dataField: 'InternalCalls', width: '8%' },
                                            // { text: 'MCC', dataField: 'DecisionCount', width: '5%' },
                                            { text: 'Action', dataField: 'View', width: '15%' },
                                            // { text: 'Disable', dataField: 'Disable', width: '5%', visible: false }
                                        ]
                                    });
                                $('#tblEntryPoints').on('rowSelect',
                                    function (event) {
                                        var currentPage = $(".jqx-grid-pager-input")[0].value;
                                        pageNumber = parseInt(currentPage);
                                        window.localStorage.setItem("gridPageNumber", pageNumber);
                                    });
                                $('#tblEntryPoints').jqxTreeGrid('goToPage', parseInt(pageNumber) - 1);
                            }
                        }
                    });
                }
            } else {
                $("#li_4").css("display", "none");
                $("#li_1").css("display", "inline");
            }
        },
        statusCode: {
            400: function () {
                $("#li_4").css("display", "none");
                $("#li_1").css("display", "inline");
            }
        },
        error: function (e) {
            console.log(e);
            $("#li_4").css("display", "none");
            $("#li_1").css("display", "inline");
            // document.getElementById("tdError").innerHTML = "Error while connecting to API";
            //net::ERR_CONNECTION_REFUSED
        }
    });
}

function create(args) {
    this.getHeaderContent().hide();
}

function loadDataLocalStorage() {
    var mainDataForVba = window.localStorage.getItem("mainDataForVba");
    var childDataForVba = window.localStorage.getItem("childDataForVba");
    var mainData = window.localStorage.getItem("mainData");
    var projectName = window.localStorage.getItem("projectName");
    $("#txtSearchGrid").val(searchKeyWord);
    if (typeof mainDataForVba !== 'undefined' && mainDataForVba !== "null" && mainDataForVba !== null) {
        var gridDes = $("#tblEntryPoints").data("ejGrid");
        if (typeof gridDes !== 'undefined' && gridDes !== null)
            gridDes.destroy();
        if (typeof searchKeyWord !== 'undefined' && searchKeyWord !== null) {
            var mainDataVba = JSON.parse(mainDataForVba);
            var childData = JSON.parse(childDataForVba);
            var firstTab = $("#tabTitle").val();
            $("#projectName")[0].innerHTML = firstTab + " " + projectName;
            //$("#projectName")[0].innerHTML = "Project: " + projectName;
            $("#pName")[0].innerHTML = projectName;
            $("#tblEntryPoints").ejGrid({
                width: "99%",
                dataSource: mainDataVba,
                allowPaging: true,
                pageSettings: { pageSize: 20 },
                showHeader: false,
                allowSorting: true,
                allowResizing: true,
                allowResizeToFit: true,
                columns: [
                    { field: "ActionWorkFlowName", headerText: "OriginObject", width: "85%" },
                    { field: "ActionId", visible: false, headerText: "Id" }
                ],
                create: "create",
                rowSelected: function (args) {
                    document.getElementById("hdnActionWkId").value = args.data.ActionId;
                    if (args.target[0].className === "btn btn-mint btn-icon icon-lg fa fa-upload") {
                        var actionWflowId = args.data.ActionId;
                        var wflowName = args.data.OriginObject;
                        document.getElementById("hdnActionWkId").value = actionWflowId;
                        // document.getElementById("hdnOriginObject").value = wflowName;
                        uploadFilePopupShow(wflowName, actionWflowId);
                    }
                    if (args.target[0].className === "btn btn-primary btn-icon icon-lg fa fa-download") {
                        var actionWflowId1 = args.data.ActionId;
                        downloadRequirementDoc(actionWflowId1);
                    }
                },
                queryCellInfo: function (args) {
                    $($(args.cell).parent()).css("color", "#000000").css('font-weight', 'bold');
                },
                childGrid: {
                    dataSource: childData,
                    queryString: "RowId",
                    allowScrolling: true,
                    scrollSettings: { height: 400, frozenRows: 0 },
                    allowResizing: true,
                    allowSorting: true,
                    allowResizeToFit: true,
                    columns: [
                        { field: "ProjectId", headerText: "ProjectId", visible: false, template: "<span>{{:ProjectId}}</span>" },
                        { field: "TechnicalAndBusinessName", headerText: "Name", width: "60%" },
                        //{ field: "ExtrernalCalls", headerText: "External<br /> Calls?", width: "9%" },
                        //{ field: "InternalCalls", headerText: "Internal<br /> Calls?", width: "9%" },
                        //{ field: "DecisionCount", headerText: "MCC", width: "6%" },
                        { field: "View", headerText: "Action", width: "32%", textAlign: ej.TextAlign.Center },
                        { field: "Disable", headerText: "Disable", width: "6%", textAlign: ej.TextAlign.Center },
                        { field: "IsDeleted", headerText: "IsDeleted", width: "0%" }
                    ],
                    rowSelected: function (args) {
                        var value = args.target[0].innerHTML;
                        var actionWorkFlowId = args.data.ActionWorkflows.ActionWorkflowId;
                        if (value === "Rename") {
                            document.getElementById("hdnActionWkId").value = actionWorkFlowId;
                            var workflowName = args.data.WorkflowName;
                            // $('#txtCurrentWorkflowName').text(workflowName);
                            //$("#dvWorkflowRename").modal("show");
                            funWorkflowRename(workflowName, actionWorkFlowId);
                        }
                    },

                    queryCellInfo: function (args) {
                        var value = args.text.replace(",", "");
                        switch (args.column.headerText) {
                            case "IsDeleted":
                                if (parseFloat(value) <= 0) {
                                    $($(args.cell).parent()).css("color", "#000000");
                                } else {

                                    $($(args.cell).parent()).css("color", "#d0d0d0");
                                }
                                break;
                        }
                    }
                }
            });
        }
        var gridObj = $("#tblEntryPoints").data("ejGrid");
        gridObj.refreshContent(); // Refreshes the grid contents only
        gridObj.refreshContent(true); // Refreshes the template and grid contents
    }
    else if (typeof mainData !== 'undefined' && mainData !== null && mainData !== "null") {
        var mData = JSON.parse(mainData);
        var fTab = $("#tabTitle").val();
        $("#projectName")[0].innerHTML = fTab + " " + projectName;
        $("#tblEntryPoints").ejGrid({
            width: "80%",
            dataSource: mData,
            allowPaging: true,
            allowScrolling: true,
            allowSorting: true,
            scrollSettings: { height: 500, frozenRows: 0 },
            pageSettings: { pageSize: 20 },
            allowResizing: true,
            allowResizeToFit: true,
            columns: [
                { field: "SrNo", headerText: "Sr#", width: "3%" },
                {
                    field: "ProjectId",
                    headerText: "ProjectId",
                    visible: false,
                    template: "<span>{{:ProjectId}}</span>"
                },
                { field: "OriginObject", headerText: "Name", width: "36%" },
                // { field: "WorkflowName", headerText: "Technical Starting Point", width: "22%" },
                //{ dataField: "ObjectType", text: "Object Type", width: "9%" },
                //{ field: "ExtrernalCalls", headerText: "External<br /> Calls?", width: "6%" },
                //{ field: "InternalCalls", headerText: "Internal<br/> Calls?", width: "6%" },
                //{ field: "DecisionCount", headerText: "MCC", width: "4%" },
                { field: "View", headerText: "Action", width: "32%", textAlign: ej.TextAlign.Center },
                // { field: "Disable", headerText: "Disable", width: "8%", textAlign: ej.TextAlign.Center, visible: false,},
                { field: "IsDeleted", headerText: "IsDeleted", width: "0%" }
            ],
            rowSelected: function (args) {
                var value = args.target[0].innerHTML;
                var actionWflowId = args.data.ActionWorkflows.ActionWorkflowId;
                var wflowName = args.data.OriginObject;
                document.getElementById("hdnActionWkId").value = actionWflowId;
                document.getElementById("hdnOriginObject").value = wflowName;
                if (value === "Rename") {
                    document.getElementById("hdnActionWkId").value = args.data.ActionWorkflows.ActionWorkflowId;
                    var workflowName = args.data.OriginObject;
                    //$("#dvWorkflowRename").modal("show");
                    funWorkflowRename(workflowName, actionWflowId);
                } else if (args.target[0].className === "btn btn-mint btn-icon icon-lg fa fa-upload") {
                    uploadFilePopupShow(wflowName, actionWflowId);
                } else if (args.target[0].className === "btn btn-primary btn-icon icon-lg fa fa-download") {
                    downloadRequirementDoc(actionWflowId);
                }
            },
            queryCellInfo: function (args) {
                var value = args.text.replace(",", "");
                switch (args.column.headerText) {
                    case "IsDeleted":
                        if (parseFloat(value) <= 0) {
                            $($(args.cell).parent()).css("color", "#000000");
                        } else {
                            $($(args.cell).parent()).css("color", "#d0d0d0");
                        }
                        break;
                }
            }
        });
    } else {
        var projectId = getParameterByName("pid");
        loadDataWithProjectIds(projectId);
    }
}

function drawTable(data, tableName) {
    if (tableName === "tblEntryPoints") {
        if (data.length <= 0) {
            var row = $("<tr><td colspan='3'>No records found</td></tr>");
            $("#" + tableName).append(row);
        } else {
            for (var i = 0; i < data.length; i++) {
                drawRow(data[i], tableName, '', (i + 1));
            }
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, 'pointer', (j + 1));
        }
    }
}

function drawRow(rowData, tableName, css, srNo) {
    var row = $("<tr title='record_" + rowData.ActionWorkflowId + "' id='projectTr_" + rowData.ActionWorkflowId + "' />");
    $("#" + tableName).append(row);
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.OriginObject + "." + rowData.OriginEventMethod + "() </td>"));
    var a = $('<a />').prop("href", "workflow_workspace.html?prjId=" + rowData.ProjectId + "&stId=" + rowData.MethodStatementId + "")
        .append('<button class="btn btn-warning">Open</button>');
    row.append($("<td />").append(a));
}

function projectWorkspace() {
    location.href = "projects_workspace.html?pid=" + projectId;
}

var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var Shape = MindFusion.Diagramming.Shape;
var Rect = MindFusion.Drawing.Rect;
var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var TreeLayout = MindFusion.Graphs.TreeLayout;
var TreeLayoutLinkType = MindFusion.Graphs.TreeLayoutLinkType;
var LayoutDirection = MindFusion.Graphs.LayoutDirection;
var FractalLayout = MindFusion.Graphs.FractalLayout;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var diagram = $.fn.floKaptureDiagram("diagram-workflow", false, "#FFFFFF");
var treeviewObj;
var decision1In3Out, apat2;

function showPortfolioDialog() {
    var projectId = getParameterByName("pid");
    window.location.href = "portfolioworkflow.html?pId=" + projectId;
}

function loadData(projectId, stmtId) {
    $.get(baseAddress + "PostProcess/GetAlternateWorkflow?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            var nodes = tData[0].PortfolioWorkflowNodes;
            var links = tData[0].PortfolioWorkflowLinks;
            buildDiagram(nodes, links);
        });
}

function buildDiagram(lstNodes, lstLinks) {
    var diagram = $find("dvPortfolioWorkflow");
    diagram.clearAll();
    diagram.setShowGrid(false);
    diagram.setLinkHeadShapeSize(2);
    diagram.setBackBrush("#FFFFFF");
    var nodeMap = [];
    var nodes = lstNodes;
    Array.forEach(nodes, function (node) {
        var nodewidth = 0;
        if (node.Width == null) {
            nodewidth = 55;
        } else {
            nodewidth = parseInt(node.Width);
        }
        var diagramNode = diagram.getFactory().createShapeNode(new Rect(10, 15, parseInt(nodewidth), 15));
        diagramNode.shadowOffsetX = 0;
        diagramNode.shadowOffsetY = 0;
        diagramNode.setStroke("Transparent");
        nodeMap[node.Id] = diagramNode;
        diagramNode.id = node.Id;
        diagramNode.width = node.Width;
        diagramNode.jsonId = node.Id;
        diagramNode.setText(node.Name);
        diagramNode.setShape(node.ShapeId);
        diagramNode.setBrush(node.Color);
    });

    var links = lstLinks;
    Array.forEach(links, function (link) {
        var link1 = diagram.getFactory().createDiagramLink(
            nodeMap[link.Origin],
            nodeMap[link.Target]);
        link1.text = link.LinkText;
        link1.route();
    });

    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 8;
    diagram.setZoomFactor(80);
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    diagram.font.size = 5;
    diagram.enabled = true;
    diagram.width = 500;
}

function addWorkflowProcess(projectId, statementId, workflowId, name) {
    var workflowProcess = [];
    workflowProcess.push({
        "ProjectId": projectId,
        "WorlflowId": workflowId,
        "StatementId": statementId,
        "Processed": 0,
        "Name": name,
        "UserId": userId
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
    window.open(path, "_self");
}

function removeWorkflow(id) {
    $("#btnRemoveWorkflow").click(function () {
        if ($("#txtDisableReason").val() === "") {
            document.getElementById("tdError").innerHTML = "Please enter reason for disabling this workflow";
            $("#txtDisableReason").focus();
            $("#txtDisableReason").on("keypress", function () {
                $(this).css("border-color", "");
                document.getElementById("tdError").innerHTML = "";
            });
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "WorkspaceWorkflow/RemoveWorkflow?actionWorkFlowId=" + id + "&data=" + $("#txtDisableReason").val(),
            success: function (result) {
                if (result != null) {
                    $("#removeWorkflow").modal("hide");
                    // var gridObj = $("#tblEntryPoints").data("ejGrid");
                    document.getElementById("txtDisableReason").value = "";
                }
            }
        });
        return false;
    });
};

function workFlowDisable(id) {
    $("#removeWorkflow").modal("show");
    document.getElementById("txtDisableReason").value = "";
    removeWorkflow(id);
}

function rowSelected() {
    var obj = $("#tblEntryPoints").ejGrid("getSelectedRecords");
}

function queryCellInfo(args) {
    if (args.column.field === "EmployeeID" && args.data.EmployeeID > 3 && args.data.EmployeeID < 6)
        $($(args.cell).parent()).css("backgroundColor", "yellow").css("color", "red"); /*custom css applied to the row */
}

function fillJclfDropDown() {
    $.ajaxSetup({ cache: false });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetEntity?entity=FileMaster&id=" + projectId,
        success: function (result) {
            $("#ddlJclName").empty();
            $.each(result, function (key, value) {
                $("#ddlJclName").append("<option value=" + value.Value + ">" + value.Name + "</option>");
            });
        }
    });
}

$("#btnViewSourceFile").click(function () {
    var fileId = $("#ddlJclName").val();
    jQuery.ajax({
        url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?projectId=" + projectId + "&fileId=" + fileId,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            if (tData != null) {
                document.getElementById("treeViewSource1").value = tData;
            }
        }
    });

});

$("#btnSaveViewSource").click(function () {
    var fileName = $("#ddlJclName option:selected").text();
    var cccc = $("#treeViewSource1").val();
    var fileLines = [];
    var lines = cccc.split('\n');
    for (var i = 0; i < lines.length; i++) {
        fileLines.push(lines[i]);
    }
    jQuery.ajax({
        type: "post",
        data: { "FileLineList": fileLines, "FileName": fileName },
        url: baseAddress + "Test/readFile",
        success: function (statements) {
            saveFileMasterData(statements);
        }
    });
});

function saveFileMasterData(path) {
    var fileName = $("#ddlJclName option:selected").text();
    var fileId = $("#ddlJclName").val();
    var fileMaster = {
        FileId: fileId,
        ProjectId: projectId,
        SolutionId: 5,
        FileName: fileName,
        FilePath: path,
        Processed: 0,
        FileTypeExtensionId: 10
    }
    jQuery.ajax({
        type: "POST",
        data: fileMaster,
        url: baseAddress + "FileMaster/Post",
        success: function (statements) {

        }
    });
}

function includeStateDialog(fileId) {
    var projectId = 0;
    $('#ViewSourceInputBody').hide();

    var hitHighlighter = new Hilitor("ViewSourceInputBody");
    hitHighlighter.setMatchType("left");

    $("#ViewSourceInputModal_SearchButton").off();
    $("#ViewSourceInputModal_SearchBox").off();
    $("#ViewSourceInputModal_SearchPrev").off();
    $("#ViewSourceInputModal_SearchNext").off();

    $("#ViewSourceInputModal_SearchBox").val("");
    $("#ViewSourceInputModal_SearchNav").hide();
    $("#ViewSourceInputModal_SearchHitCount").text("");

    $("#ViewSourceInputModal_SearchButton").click(
        function () {
            hitHighlighter.apply($("#ViewSourceInputModal_SearchBox").val());
            if (hitHighlighter.hitCount === 0) {
                $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
            } else {
                $("#ViewSourceInputModal_SearchNav").show();
                $("#ViewSourceInputModal_SearchHitCount").text(hitHighlighter.hitCount + (hitHighlighter.hitCount == 1 ? " match" : " matches"));
            }
        });

    $("#ViewSourceInputModal_SearchBox").keypress(
        function (e) {
            if (e.keyCode === 13) {
                hitHighlighter.apply($("#ViewSourceInputModal_SearchBox").val());
                if (hitHighlighter.hitCount === 0) {
                    $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
                } else {
                    $("#ViewSourceInputModal_SearchNav").show();
                    $("#ViewSourceInputModal_SearchHitCount").text(hitHighlighter.hitCount + (hitHighlighter.hitCount === 1 ? " match" : " matches"));
                }
            }
        });

    $("#ViewSourceInputModal_SearchPrev").click(
        function () {
            hitHighlighter.prevHit();
        });

    $("#ViewSourceInputModal_SearchNext").click(
        function () {
            hitHighlighter.nextHit();
        });

    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        jQuery.ajax({
            url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?projectId=" + projectId + "&fileId=" + fileId,
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSource1").innerHTML = tData;
                    $('#ViewSourceInputBody').show();
                    $("#viewSourceDialog").modal("show");
                }
            }
        });
    }

}

function Hilitor(id, tag) {
    var targetNode = document.getElementById(id) || document.body;
    var hiliteTag = tag || "EM";
    var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
    var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
    var wordColor = [];
    var colorIdx = 0;
    var matchRegex = "";

    this.setMatchType = function (type) {
        switch (type) {
            case "left":
                this.openLeft = false;
                this.openRight = true;
                break;
            case "right":
                this.openLeft = true;
                this.openRight = false;
                break;
            case "open":
                this.openLeft = this.openRight = true;
                break;
            default:
                this.openLeft = this.openRight = false;
        }
    };

    this.setRegex = function (input) {
        input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'-]+/g, "|");
        input = input.replace(/^\||\|$/g, "");
        if (input) {
            var re = "(" + input + ")";
            if (!this.openLeft) re = "\\b" + re;
            if (!this.openRight) re = re + "\\b";
            matchRegex = new RegExp(re, "i");
            return true;
        }
        return false;
    };

    this.getRegex = function () {
        var retval = matchRegex.toString();
        retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
        retval = retval.replace(/\|/g, " ");
        return retval;
    };

    // recursively apply word highlighting
    this.hiliteWords = function (node) {
        if (node === undefined || !node) return;
        if (!matchRegex) return;
        if (skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i]);
        }
        if (node.nodeType == 3) { // NODE_TEXT
            if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
                if (!wordColor[regs[0].toLowerCase()]) {
                    wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
                }

                var match = document.createElement(hiliteTag);
                match.appendChild(document.createTextNode(regs[0]));
                //match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
                match.style.backgroundColor = "#ff6";
                match.style.fontStyle = "inherit";
                match.style.color = "#000";

                var after = node.splitText(regs.index);
                after.nodeValue = after.nodeValue.substring(regs[0].length);
                node.parentNode.insertBefore(match, after);

                this.hitCount++;
            }
        };
    };

    // remove highlighting
    this.remove = function () {
        var arr = document.getElementsByTagName(hiliteTag);
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };

    // start highlighting at target node
    this.apply = function (input) {
        this.hitCount = 0;
        this.currHitIdx = 0;
        this.remove();
        if (input === undefined || !input) return;
        if (this.setRegex(input)) {
            this.hiliteWords(targetNode);
            this.hits = $("#ViewSourceInputBody em");
            if (this.hits.length > 0) {
                this.hits[0].scrollIntoView();
                this.hits[0].style.backgroundColor = "#a0ffff";
            }
        }
    };

    this.nextHit = function () {
        if (this.currHitIdx < this.hits.length - 1) {
            this.currHitIdx++;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx - 1].style.backgroundColor = "#ff6";
            currHit.scrollIntoView();
        }
    };

    this.prevHit = function () {
        if (this.currHitIdx != 0) {
            this.currHitIdx--;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx + 1].style.backgroundColor = "#ff6";
            currHit.scrollIntoView();
        }
    }
}

function CloseObjectConnectivity() {
    $("#dvObjectConnectivity").modal("hide");
    return;
}

/*Workflow Rename */

function renameWorkflow(actionWorkflowId) {
    document.getElementById("hdnActionWkId").value = actionWorkflowId;
    document.getElementById("dvError1").innerHTML = "";
    $("#txtRenameWorkflowName").val("");
    var actionWorkflowName;
    var obj = $("#tblEntryPoints").ejGrid("instance");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId + "",
        success: function (laungaugeId) {
            if (laungaugeId !== null) {
                if (laungaugeId === "6") {
                    actionWorkflowName = obj.getSelectedRecords()[0].WorkflowName;
                } else {
                    actionWorkflowName = obj.getSelectedRecords()[0].OriginObject;
                }
            }
            $('#txtCurrentWorkflowName').text(actionWorkflowName);
            $("#dvWorkflowRename").modal("show");
        }
    });
}

$("#btnRenameWorkflowName").click(function () {
    var actionworkflowId = document.getElementById("hdnActionWkId").value;
    if ($("#txtRenameWorkflowName").val() === "") {
        document.getElementById("dvError1").innerHTML = "Please enter workflowname.";
        $("#txtRenameWorkflowName").focus();
        $("#txtRenameWorkflowName").css("border-color", "red");
        $("#txtRenameWorkflowName").on("keypress", function () {
            document.getElementById("dvError1").innerHTML = "";
            $(this).css("border-color", "");
        });
        return false;
    }

    var renameWorkflowName = $("#txtRenameWorkflowName").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/RenameWorkflowName?actionWorkflowId=" + actionworkflowId + "&workflowName=" + renameWorkflowName + "&projectId=" + projectId,
        success: function (cData) {
            if (cData !== null) {
                loadDataWithProjectIds(projectId);
                document.getElementById("dvError1").innerHTML = "Record updated successfully";
                document.getElementById("dvError1").style.color = "green";
                $("#txtRenameWorkflowName").val("");
                $("#dvWorkflowRename").modal("hide");
            }
        }
    });
});

function saveActionWorkflowfileUpload(path, fileName) {
    var fileUploadDetails = [];
    fileUploadDetails.push({
        "ActionWorkflowId": document.getElementById("hdnActionWkId").value,
        "ProgramId": 0,
        "UploadedBy": userId,
        "FileName": fileName,
        "FilePath": path,
        "FileDescription": $("#txtFileUploaddescription").val(),
        "DownloadPath": "",
        "IsDeleted": 0
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkspaceWorkflow/AddUploadFile",
        data: fileUploadDetails[0],
        success: function (result) {
            if (result !== null) {
            }
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                document.getElementById("tdError3").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError3").innerHTML = response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError3").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError3").innerHTML = "Error while connecting to API";
        }
    });
}

function getCurrentAttachement(actionWorkflowId) {
    $.ajaxSetup({
        async: false
    });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetCurrentAttachment?actionworkflowId=" + actionWorkflowId,
        success: function (data) {
            $('#divAttachementFiles').jqxGrid('clear');
            if (data !== null && typeof data !== 'undefined') {
                var l = 1;
                for (var k = 0; k < data.length; k++) {
                    data[k].SrNo = l;
                    data[k].Delete = false;
                    l++;
                }
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'SrNo', type: 'int' },
                        { name: 'RowId', type: 'int' },
                        { name: 'FileDescription', type: 'string' },
                        { name: 'FileName', type: 'string' },
                        { name: 'UploadedDate', type: 'date' },
                        { name: 'Delete', type: 'bool' }
                    ],
                    id: 'RowId',
                    localdata: data
                };
                var dataAdapter = new $.jqx.dataAdapter(source);

                $("#divAttachementFiles").jqxGrid({
                    width: "99%",
                    height: "150px",
                    source: dataAdapter,
                    columnsresize: true,
                    selectionmode: 'checkbox',
                    columns: [
                        { text: '#', datafield: 'RowId', hidden: true, width: 0 },
                        { text: '#', datafield: 'SrNo', width: "7%" },
                        { text: 'Title', datafield: 'FileDescription', width: "38%" },
                        { text: 'File Name', datafield: 'FileName', width: "30%" },
                        { text: 'Uploaded On', datafield: 'UploadedDate', width: "15%", cellsformat: 'd' }
                    ]
                });
                $('#divAttachementFiles').jqxGrid('refresh');
                $('#divAttachementFiles').jqxGrid('render');
            } else {
                $('#divAttachementFiles').jqxGrid('clear');
            }
        }
    });
}

function deleteUploadedFile() {
    document.getElementById("tdError3").innerHTML = "";
    var rowIndexes = $('#divAttachementFiles').jqxGrid('getselectedrowindexes');
    var actionWorkflowFileUploadDetails = [];
    for (var r = 0; r < rowIndexes.length; r++) {
        var rowid = $('#divAttachementFiles').jqxGrid('getrowid', rowIndexes[r]);
        var data = $('#divAttachementFiles').jqxGrid('getrowdatabyid', rowid);
        actionWorkflowFileUploadDetails.push({
            RowId: data.RowId,
            FileName: data.FileName,
            ActionWorkflowId: 0,
            ProgramId: 0,
            UploadedBy: 0,
            IsDeleted: 0
        });
    }
    if (actionWorkflowFileUploadDetails.length <= 0) return false;
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "ActionWorkflowsReference/DeleteAttachedments",
        data: { ActionWorkflowFileUpload: actionWorkflowFileUploadDetails },
        success: function (data) {
            if (data !== null) {
                document.getElementById("tdError3").innerHTML = "Files deleted successfully";
                document.getElementById("tdError3").style.color = "green";
                var actionWorkflowId = document.getElementById("hdnActionWkId").value;
                getCurrentAttachement(actionWorkflowId);
                return true;
            }
            return false;
        }
    });
    return true;
}

function uploadFilePopupShow(workflowName, actionId) {
    console.log(actionId);
    var workFlowName = workflowName;
    var actionWorkflowId = document.getElementById("hdnActionWkId").value;
    document.getElementById("hdnActionWkId").value = actionWorkflowId;
    document.getElementById("oName").innerHTML = workFlowName;
    $("#selectedFiles").val("");
    $("#txtFileUploaddescription").val("");
    document.getElementById("tdError3").innerHTML = "";
    getCurrentAttachement(actionWorkflowId);
    $('#jqxFileUpload').ejUploadbox({
        width: "75px",
        height: "26px",
        multipleFilesSelection: true,
        dialogText: { title: "Upload Files" },
        dialogAction: { closeOnComplete: true, modal: true },
        buttonText: { browse: "Browse...", upload: "Upload", cancel: "Cancel" },
        customFileDetails: { title: true, name: true, size: true, status: true, action: true },
        saveUrl: "handlers/ActionWorkflowUploadFile.ashx",
        removeUrl: "",
        showBrowseButton: true,
        begin: function (args) {
            var saveUrl = "handlers/ActionWorkflowUploadFile.ashx?actionWorkflowId=" + actionWorkflowId;
            args.model.saveUrl = saveUrl;
        },
        complete: function (args) {
            var fileName = args.files.name;
            var serverResponce = args.responseText;
            var allUploadedFiles = "";
            for (var k = 0; k < args.success.length; k++) {
                allUploadedFiles += args.success[k].name + ",";
            }
            if (serverResponce.indexOf(fileName) !== -1) {
                saveActionWorkflowfileUpload(serverResponce, allUploadedFiles);
                document.getElementById("tdError3").innerHTML = "File uploaded successfully";
                document.getElementById("tdError3").style.color = "green";
            } else {
                document.getElementById("tdError3").innerHTML = "Error occured. Please try again";
                $("#selectedFiles").val("");
            }
            getCurrentAttachement(actionWorkflowId);
        },
        error: function (args) {

        },
        fileSelect: function (args) {
            var files = "";
            for (var zzz = 0; zzz < args.files.length; zzz++) {
                files = args.files[zzz].name + ",";
            }
            $("#selectedFiles").val(files);
        }
    });

    $('#jqxFileUpload').on('uploadStart', function (event) {
        document.getElementById("tdError3").innerHTML = "";
        var fileName = event.args.file;
        $("#selectedFiles").val(fileName);
    });

    $('#jqxFileUpload').on('select', function (event) {
        var args = event.args;
        $("#selectedFiles").val(args.file);
    });

    $("#dvFileUpload").modal("show");
}

function funWorkflowRename(workflowName, actionWorkflowId) {
    console.log(actionWorkflowId);
    $('#txtCurrentWorkflowName').text(workflowName);
    $("#dvWorkflowRename").modal("show");
}

function downloadRequirementDoc(actionWorkFlowId) {
    var projectId = getParameterByName("pid");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ExportWordDocument/GenerateRequirementDoc?projectId=" + projectId + "&actionWorkflowId=" + actionWorkFlowId,
        success: function (data) {
            downloadFile(data);
        }
    });
}

$("#btnSaveSystemDescription").click(function () {
    document.getElementById("tdError102").innerHTML = "";
    if ($("#txtSystemDescription").val() === "") {
        document.getElementById("tdError102").innerHTML = "Please enter system description".
            $("#txtSystemDescription").focus();
        $("#txtSystemDescription").css("border-color", "red");
        $("#txtSystemDescription").on("keypress", function () {
            $(this).css("border-color", "green");
        });
        return false;
    }
    var systemDescription = $("#txtSystemDescription").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/AddSystemDescription?projectId=" + projectId + "&systemDescription=" + systemDescription,
        success: function (result) {
            if (result != null) {
                $("#dvSystemDescription").modal("hide");
            }
        }
    });
    return true;
});

function getFileTypeExtension() {
    var projectId = getParameterByName("pid");
    $('#tblLegend').html('');
    jQuery.ajax({
        url: baseAddress + "General/GetFileTypeExtension?projectId=" + projectId,
        type: "GET",
        success: function (tData) {
            $('#tblLegend').html('');
            if (tData !== null) {
                var row = $("<tr />");
                $("#tblLegend").append(row);
                row.append("<td><div class='divDynamic' style='padding-right: 4px;padding-top: 5px;'><span style='background-color: #ababab;' >Entity</span></div></td>");
                for (var i = 0; i < tData.length; i++) {
                    var color = tData[i].Color;
                    var fileTypeName = tData[i].FileTypeName;
                    row.append("<td><div class='divDynamic' style='padding-right: 4px;padding-top: 5px;'><span style='background-color:" + color + ";' >" + fileTypeName + "</span></div></td>");
                }

            }
        }
    });
}

function downloadObjectConnectivityIndividualFlowchart(fileId, actionId) {
    $('#tblLegend').html('');
    getFileTypeExtension();
    var projectId = getParameterByName("pid");
    jQuery.ajax({
        url: baseAddress +
            "FileObjectReference/GetLinkToDownloadObjectDictionaryIndividualFlowChart?" +
            "projectId=" + parseInt(projectId) + "&fileId=" + fileId + "&actionId=" + actionId,
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (tData) {
            if (tData != null) {
                var nodes = tData.Nodes;
                var links = tData.Links;
                //buildDiagram(nodes, links);
                //$("#dvObjectConnectivity").modal("show");

                if (nodes.length >= 50) {
                    downloadObjectConnectivityFromData(nodes, links);
                } else {
                    buildDiagram(nodes, links);
                    $("#dvObjectConnectivity").modal("show");
                }
            }
        }
    });
}

function downloadObjectConnectivityIndividualFlowchartUniverse(fileId, actionId) {
    $('#tblLegend tr').html('');
    getFileTypeExtension();
    var projectId = getParameterByName("pid");
    jQuery.ajax({
        url: baseAddress +
            "FileObjectReference/GetLinkToDownloadObjectDictionaryIndividualFlowChartUniverse?" +
            "projectId=" + parseInt(projectId) + "&fileId=" + fileId + "&actionId=" + actionId,
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (tData) {
            if (tData != null) {
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes.length >= 51 || links.length >= 50) {
                    downloadObjectConnectivityFromData(nodes, links);
                } else {
                    buildDiagram(nodes, links);
                    $("#dvObjectConnectivity").modal("show");
                }
            }
        }
    });
}

function downloadObjectConnectivityFromData(nodes, links) {
    var gNodes = [];
    var gLinks = [];
    $.each(nodes, function (i, node) {
        gNodes.push({
            Id: node.Id,
            Name: node.Name,
            ProgramId: node.ProgramId,
            ActionWorkflowId: node.ActionWorkflowId,
            GroupId: node.GroupId,
            GroupName: node.GroupName,
            StatementId: node.StatementId,
            ShapeId: node.ShapeId,
            Color: node.Color,
            JsonId: node.Id
        });
    });

    $.each(links, function (i, link) {
        var lineTp = "";
        var lineCl = "";
        if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
            lineTp = link.LineType;
            lineCl = link.lineColor;
        }
        gLinks.push({
            LinkText: link.LinkText,
            StatementId: link.StatementId,
            ProgramId: link.ProgramId,
            Origin: link.Origin,
            Target: link.Target,
            ActionWorkflowId: link.ActionWorkflowId,
            LineType: lineTp,
            LineColor: lineCl
        });
    });

    var workFlowData = { Nodes: gNodes, Links: gLinks };
    var prjId = getParameterByName("pid");
    jQuery.ajax({
        //  url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
        url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraphObjectConnectivity?projectId=" + prjId,
        type: 'POST',
        data: JSON.stringify(workFlowData),
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            downloadFile(tData);
        }
    });
}

function downloadObjectConnectivity() {
    var gDiagram = Diagram.find("diagram");
    var gNodes = [];
    var gLinks = [];
    $.each(gDiagram.nodes, function (i, node) {
        gNodes.push({
            Id: node.id,
            Name: node.nodeName,
            ProgramId: node.programId,
            ActionWorkflowId: node.actionWorkflowId,
            GroupId: node.groupId,
            GroupName: node.groupName,
            StatementId: node.statementId,
            ShapeId: node.shapeId,
            Color: node.nodeColor,
            JsonId: node.id
        });
    });

    $.each(gDiagram.links, function (i, link) {
        var lineTp = "";
        var lineCl = "";
        if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
            lineTp = link.lineType;
            lineCl = link.lineColor;
        }
        gLinks.push({
            LinkText: link.linkText,
            StatementId: link.statementId,
            ProgramId: link.programId,
            Origin: link.originId,
            Target: link.targetId,
            ActionWorkflowId: link.actionWorkflowId,
            LineType: lineTp,
            LineColor: lineCl
        });
    });

    var workFlowData = { Nodes: gNodes, Links: gLinks };
    var prjId = getParameterByName("pid");
    jQuery.ajax({
        // url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
        url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraphObjectConnectivity?projectId=" + prjId,
        type: 'POST',
        data: JSON.stringify(workFlowData),
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            downloadFile(tData);
        }
    });
}

function showCustomView() {
    var projectId = getParameterByName("pid");
    var fileId = 0;
    window.open("customview.html?prjId=" + projectId + "&fileId=" + fileId, '', "width=" + screen.availWidth + ",height=" + screen.availHeight);
}
/* Diagram / canvas functions... */

function onZoomInProcF() {
    var diagram = $find("diagram");
    if (diagram.zoomFactor > 200) return;
    diagram.setZoomFactor(diagram.zoomFactor + 10);
}

function onZoomOutProcF() {
    var diagram = $find("diagram");
    if (diagram.zoomFactor < 19) return;
    diagram.setZoomFactor(diagram.zoomFactor - 10);
}

function onResetZoom() {
    var diagram = $find("diagram");
    diagram.setZoomFactor(100);
}

function applyTreeLayoutProcF() {
    var diagram = $find("diagram");
    var treeLayout = new TreeLayout();
    treeLayout.linkType = TreeLayoutLinkType.Straight;
    treeLayout.levelDistance = treeLayout.nodeDistance = 16;
    diagram.arrange(treeLayout);
}

function applyTopToBottomProcF() {
    var diagram = $find("diagram");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 8;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    document.getElementById("TBProcF").checked = true;
    document.getElementById("LRProcF").checked = false;

    if (document.getElementById("OrthogonalRoutingProcF").checked === true) {
        layout.anchoring = MindFusion.Graphs.Anchoring.Reassign;
        for (var l = 0; l < diagram.links.length; l++) {
            diagram.routeAllLinks();
        }
        document.getElementById("OrthogonalRoutingProcF").checked = true;
        document.getElementById("DirectRoutingProcF").checked = false;
    } else {
        document.getElementById("OrthogonalRoutingProcF").checked = false;
        document.getElementById("DirectRoutingProcF").checked = true;
    }

}

function applyLeftToRightProcF() {
    var diagram = $find("diagram");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.LeftToRight;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 8;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    document.getElementById("TBProcF").checked = false;
    document.getElementById("LRProcF").checked = true;
    if (document.getElementById("OrthogonalRoutingProcF").checked === true) {
        layout.anchoring = MindFusion.Graphs.Anchoring.Reassign;
        for (var l = 0; l < diagram.links.length; l++) {
            diagram.routeAllLinks();
        }
        document.getElementById("OrthogonalRoutingProcF").checked = true;
        document.getElementById("DirectRoutingProcF").checked = false;
    } else {
        document.getElementById("OrthogonalRoutingProcF").checked = false;
        document.getElementById("DirectRoutingProcF").checked = true;
    }

}

function applyLayeredLayoutProcF() {
    var diagram = $find("diagram");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 8;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    document.getElementById("TBProcF").checked = true;
    document.getElementById("LRProcF").checked = false;
}

function applyFractalLayoutProcF() {
    var diagram = $find("diagram");
    var layout = new FractalLayout();
    layout.root = diagram.nodes[0];
    diagram.arrange(layout);
    fitItemsProcF(diagram);
}

function applyDirectRoutingProcF() {
    var diagram = $find("diagram");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 40;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    document.getElementById("DirectRoutingProcF").checked = true;
    document.getElementById("OrthogonalRoutingProcF").checked = false;

    if (document.getElementById("TBProcF").checked === true) {
        applyTopToBottomProcF();
    } else {
        applyLeftToRightProcF();
    }
}

function applyOrthogonalRoutingProcF() {
    var diagram = $find("diagram");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 40;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    layout.anchoring = MindFusion.Graphs.Anchoring.Reassign;
    for (var l = 0; l < diagram.links.length; l++) {
        diagram.routeAllLinks();
    }
    document.getElementById("OrthogonalRoutingProcF").checked = true;
    document.getElementById("DirectRoutingProcF").checked = false;

    if (document.getElementById("TBProcF").checked === true) {
        applyTopToBottomProcF();
    } else {
        applyLeftToRightProcF();
    }
}

function funShowWorkflows(fileId, prjId) {
    $("#tblWorkflows").html('');
    var flowchart = window.localStorage.getItem("flowChartData");
    var mainFlowChart = JSON.parse(flowchart);
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetAllActionWorkflowsData?fileId=" + fileId + "&projectId=" + prjId + "&option=new&flowChart=" +
            mainFlowChart,
        success: function (data) {
            if (data !== null && typeof data !== 'undefined') {
                var methodList = data.MethodList;
                var flowChartData = { Nodes: data.Nodes, Links: data.Links };
                window.localStorage.setItem("flowChartData", JSON.stringify(flowChartData));
                drawTable(methodList, "tblWorkflows");
            }
            $("#dvActionWorkflows").modal("show");
            /*
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
            $("#divWorkflows").jqxTreeGrid(
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
                });*/

        }
    });
}

function drawWorkflowsRow(rowData, tableName) {
    var row = $("<tr />");
    $("#" + tableName).append(row);
    row.append($("<td>" + rowData + "</td>"));
}

function funAppendNextLevel(projectId, statementId, fileId, ctrlId) {
    var b = document.getElementById(ctrlId);
    $("#tblWorkflows").html('');
    var flowchart = window.localStorage.getItem("flowChartData");
    var mainFlowChart = JSON.parse(flowchart);
    var links = mainFlowChart.Links;
    links.push({
        Origin: 1,
        Target: 2,
        LinkText: b.lang
    });
    jQuery.ajax({
        type: "POST",
        data: { Nodes: mainFlowChart.Nodes, Links: links },
        url: baseAddress + "WorkspaceWorkflow/AppendNextLevelWorkflows?projectId=" + projectId + "&statementId=" + statementId + "&fileId=" + fileId,
        success: function (data) {
            if (data !== null && typeof data !== 'undefined') {
                var methodList = data.MethodList;
                var flowChartData = {
                    Nodes: data.Nodes,
                    Links: data.Links
                };
                window.localStorage.setItem("flowChartData", JSON.stringify(flowChartData));
                drawTable(methodList, "tblWorkflows");
            }
            $("#dvActionWorkflows").modal("show");
        }
    });
}

function funAppendGenerateLevel() {
    var flowchart = window.localStorage.getItem("flowChartData");
    var mainFlowChart = JSON.parse(flowchart);
    var nodes = mainFlowChart.Nodes;
    var links = mainFlowChart.Links;
    var gNodes = [];
    var gLinks = [];
    $.each(nodes, function (i, node) {
        gNodes.push({
            Id: node.Id,
            Name: node.Name,
            ProgramId: node.ProgramId,
            ActionWorkflowId: node.ActionWorkflowId,
            GroupId: node.GroupId,
            GroupName: node.GroupName,
            StatementId: node.StatementId,
            ShapeId: node.ShapeId,
            Color: node.Color,
            JsonId: node.Id
        });
    });
    $.each(links, function (i, link) {
        var lineTp = "";
        var lineCl = "";
        if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
            lineTp = link.lineType;
            lineCl = link.lineColor;
        }
        gLinks.push({
            LinkText: link.LinkText,
            StatementId: link.StatementId,
            ProgramId: link.ProgramId,
            Origin: link.Origin,
            Target: link.Target,
            ActionWorkflowId: link.ActionWorkflowId,
            LineType: lineTp,
            LineColor: lineCl
        });
    });
    // var workFlowData = { Nodes: gNodes, Links: gLinks };

    var graphString = "";
    graphString += getGraphHeader();
    $.each(gNodes, function (i, node) {
        graphString += createNode(node);
    });
    $.each(gLinks, function (i, link) {
        var linkId = "edge_" + (i + 1);
        graphString += createLink(linkId, link);
    });
    graphString += closeGraph();
    graphString = graphString.replace(/ /g, "%20");
    var fileName = gNodes[0].Name;
    fileName = fileName + ".graphml";
    this.download(fileName, graphString);
}

function funOpenWindow(prjId, stmtId, aId, fileId) {
    jQuery.ajax({
        url: baseAddress +
            "FileObjectReference/GetLinkToDownloadObjectDictionaryIndividualWorkflowFlowChart?" +
            "projectId=" + parseInt(prjId) + "&fileId=" + fileId + "&actionId=" + aId + "&statementId=" + stmtId,
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (tData) {
            if (tData !== null) {
                var nodes = tData.Nodes;
                var links = tData.Links;
                buildDiagramCustom(nodes, links);
                $("#dvObjectConnectivityIndividualWorkflow").modal("show");
            }
        }
    });

}

function showEntitiesList() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ActionWorkflowsReference/GetEnitityList?projectId=" + projectId,
        success: function (data) {
            if (data !== null) {
                $("#divEntitiesList").ejGrid({
                    width: "99%",
                    dataSource: data,
                    allowPaging: true,
                    pageSettings: { pageSize: 20 },
                    allowSorting: true,
                    showHeader: false,
                    allowResizing: true,
                    allowResizeToFit: true,
                    columns: [
                        { field: "Entity", headerText: "Entity", width: "40%" },
                        { field: "Attributes", headerText: "Attributes", width: "60%" }
                    ]
                });
                $("#divEntities").modal("show");
            }
        }

    });

    /*
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ActionWorkflowsReference/GetAllEntities?projectId=" + projectId,
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
    */

}

//----------------------------- Functions -------------------------------//

/* system description*/

function showCustomWorkflow() {
    document.getElementById("dvError101").innerHTML = "";
    $("#divCustomWorkflow").modal("show");
}

function bindObjectDictionaryData(classes, methods, combineList) {
    var tblPreviousData = $("#objectDictionaryData").html();
    $("#objectDictionaryData").html('');
    var tblCurrent = $("#objectDictionaryData");
    if (classes.length > 0) {
        var tr1 = $("<tr />").append($("  <td colspan='4'> Classes </td>"));
        $("#objectDictionaryData").append(tr1);
        for (var i = 0; i < classes.length; i++) {
            var tr = $("<tr title='trClass_" + classes[i] + "' id='trClass_" + classes[i] + "' />");
            tr.append($("<td >" + classes[i] + " </td>"));
            tr.append($("<td> Class </td>"));
            tr.append($("<td />")
                .append($("<input type='text' style='border-color: green;' id='txtClassBui_" +
                    classes[i] +
                    "' placeholder='business name' value='" +
                    classes[i] +
                    "' class='form-control' />")));
            tr.append($("<td />")
                .append($("<input type='text' style='border-color: green;' id='txtClassDesc_" +
                    classes[i] +
                    "' placeholder='business description' value='" +
                    classes[i] +
                    "' class='form-control' />")));
            $("#objectDictionaryData").append(tr);
        }
    }
    if (methods.length > 0) {
        var tr2 = $("<tr />").append($("<td colspan='4'> Methods / Functions </td>"));
        $("#objectDictionaryData").append(tr2);
        for (var j = 0; j < methods.length; j++) {
            var tr3 = $("<tr title='trClass_" + methods[j] + "' id='trClass_" + methods[j] + "' />");
            tr3.append($("<td >" + methods[j] + " </td>"));
            tr3.append($("<td> Method / Function </td>"));
            tr3.append($("<td />")
                .append($("<input type='text' style='border-color: green;' id='txtClassBui_" +
                    methods[j] +
                    "' placeholder='business name' value='" +
                    methods[j] +
                    "' class='form-control' />")));
            tr3.append($("<td />")
                .append($("<input type='text' style='border-color: green;' id='txtClassDesc_" +
                    methods[j] +
                    "' placeholder='business description' value='" +
                    methods[j] +
                    "' class='form-control' />")));
            $("#objectDictionaryData").append(tr3);
        }
    }
    $(tblCurrent).append(tblPreviousData);
}

function updateBusinessDetails() {
    document.getElementById("tdMessage").innerHTML = "";
    document.getElementById("tdMessage").style.color = "green";
    var tblCurrent = $("#objectDictionaryData");
    var pClasses = [];
    var pMethods = [];
    tblCurrent.find('tr').each(function (i, el) {
        var tds = $(this).find('td');
        if (tds.length === 4) {
            if (tds[1].innerText === "Class") {
                pClasses.push(tds[0].innerText + "~" + tds[2].children[0].value + "~" + tds[3].children[0].value);
            } else if (tds[1].innerText === "Method / Function") {
                pMethods.push(tds[0].innerText + "~" + tds[2].children[0].value + "~" + tds[3].children[0].value);
            }
        }
    });
    var dictionaryData = { Classes: [], Methods: [] };
    dictionaryData.Classes.push(pClasses);
    dictionaryData.Methods.push(pMethods);
    dictionaryData.Classes = dictionaryData.Classes[0];
    dictionaryData.Methods = dictionaryData.Methods[0];
    var projectId = getParameterByName("pid");
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/PostObjectDictionaryData?projectId=" + parseInt(projectId),
        type: 'POST',
        data: JSON.stringify(dictionaryData),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data !== null) {
                document.getElementById("tdMessage").innerHTML = "Dictionary data updated successfully";
                document.getElementById("tdMessage").style.color = "green";
            }
        }
    });
}

$(document).ready(function () {
    $('#menuTreeView').on('expand', function (event) {
        $body.addClass("loading");
        var htmlTreeGrid = new HtmlTreeGrid();
        var $element = $(event.args.element);
        var topMenuId = $element.prop("id");
        var fileMenuId = topMenuId.split("_")[1];
        var dataObject = $element.prop("data-object");
        var menuObject = $element.prop("menu-object");
        var children = $element.find('ul:first').children();
        var child = children[0];
        if (!child) return;
        var loader = false;
        var loaderItem = null;
        var loadObject = false;
        var loaderObject = null;
        var item = $('#menuTreeView').jqxTree('getItem', child);
        if (item && item.label === 'Loading...' && !dataObject && !menuObject) {
            loaderItem = item;
            loader = true;
        }
        else if (dataObject && !menuObject && item && item.label === 'Loading...') {
            loadObject = true;
            loaderObject = item;
        }
        else if (menuObject && item && item.label === 'Loading...') {
            $body.addClass("loading");
            var actionExecuted = menuObject.ActionExecuted;
            var flMenuId = menuObject.FileMenuId.split("_")[1];
            loaderItem = item;
            var configUrl = {
                url: "WorkspaceWorkflow/GetMenuByActionExecuted?projectId=" + projectId + "&actionExecuted=" + actionExecuted + "&fileMenuId=" + parseInt(flMenuId)
            }
            htmlTreeGrid.getMenuData(configUrl).then((actions) => {
                var actData = actions.data;
                if (actData.length > 0) {
                    var itemId = 0;
                    actData.forEach(function (m) {
                        var newId = m.FileMenuId + "-" + itemId++;
                        var childItem = htmlTreeGrid.prepareItem(newId, m);
                        m.tempId = newId;
                        $('#menuTreeView').jqxTree('addTo', childItem, $element[0]);
                        var lastLi = $element.find('ul li:last');
                        $('#menuTreeView').jqxTree('addTo', { label: "Loading..." }, lastLi);
                        $(lastLi).prop({ "id": m.FileMenuId });
                        if (m.ActionExecuted === "FileObject")
                            $(lastLi).prop({ "data-object": m, "value": m.ActionExecuted });
                        else
                            $(lastLi).prop({ "menu-object": m, "value": m.ActionExecuted });
                    });
                    $('#menuTreeView').jqxTree('removeItem', loaderItem.element);
                } else {
                    $body.removeClass("loading");
                    $(loaderItem.element).prop({ "innerText": "Not found" });
                    loaderItem.label = "Not found";
                }
                $body.removeClass("loading");
            }).catch(r => { console.log(r); $body.removeClass("loading"); });
        }

        if (loader) {
            var config = {
                url: "WorkspaceWorkflow/GetMenuFileById?projectId=" + projectId + "&fileMenuId=" + parseInt(fileMenuId)
            }
            htmlTreeGrid.getMenuData(config).then((actions) => {
                var actData = actions.data;
                if (actData.length > 0) {
                    var itemId = 0;
                    actData.forEach(function (m) {
                        var newId = m.FileMenuId + "-" + itemId++;
                        var childItem = htmlTreeGrid.prepareItem(newId, m);
                        m.tempId = newId;
                        $('#menuTreeView').jqxTree('addTo', childItem, $element[0]);
                        var lastLi = $element.find('ul li:last');
                        $('#menuTreeView').jqxTree('addTo', { label: "Loading..." }, lastLi);
                        $(lastLi).prop({ "id": m.FileMenuId });
                        if (m.ActionExecuted === "FileObject")
                            $(lastLi).prop({ "data-object": m, "value": m.ActionExecuted });
                        else
                            $(lastLi).prop({ "menu-object": m, "value": m.ActionExecuted });
                    });
                    $('#menuTreeView').jqxTree('removeItem', loaderItem.element);
                } else {
                    $(loaderItem.element).prop({ "innerText": "Not found" });
                    loaderItem.label = "Not found";
                }
                $body.removeClass("loading");
            }).catch(r => { $body.removeClass("loading"); console.log(r); });
        }

        if (loadObject) {
            console.log(dataObject);
            var fileId = dataObject.FileMenuId.split("_")[1];
            var dtConfig = {
                url: "WorkspaceWorkflow/GetMenuForObject?projectId=" + projectId + "&objectId=" + parseInt(fileId)
            }
            htmlTreeGrid.getMenuData(dtConfig).then((actions) => {
                var actData = actions.data;
                if (actData.length > 0) {
                    var itemId = 0;
                    actData.forEach(function (m) {
                        var newId = m.FileMenuId + "-" + itemId++;
                        var childItem = htmlTreeGrid.prepareObject(newId, m);
                        m.tempId = newId;
                        $('#menuTreeView').jqxTree('addTo', childItem, $element[0]);
                        var lastLi = $element.find('ul li:last');
                        $('#menuTreeView').jqxTree('addTo', { label: "Loading..." }, lastLi);
                        $(lastLi).prop({ "id": m.FileMenuId, "data-object": m });
                    });
                    $('#menuTreeView').jqxTree('removeItem', loaderObject.element);
                } else {
                    $(loaderObject.element).prop({ "innerText": "Not found" });
                    loaderObject.label = "Not found";
                }
                $body.removeClass("loading");
            }).catch(r => { $body.removeClass("loading"); console.log(r); });
        }

        if (!loader && !loadObject && !item) $body.removeClass("loading");

        return;
    });
});

var openWin = function (link) {
    window.open(link, '', "width=" + screen.availWidth + ", height=" + screen.availHeight);
};

var showTreePopup = function (m) {
    $body.addClass("loading");
    $('#menuTreeView').jqxTree('clear');
    var htmlTreeGrid = new HtmlTreeGrid();
    var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + m.id;
    htmlTreeGrid.getMenuData({ url: endPoint }).then((d) => {
        var menuData = d.data;
        var loopCnt = "fileMenuId_";
        menuData.forEach(function (n) {
            n.FileMenuId = loopCnt + n.FileMenuId;
        });
        var mainData = htmlTreeGrid.prepareParentChild(menuData);
        htmlTreeGrid.bindTree(mainData);
        $body.removeClass("loading");
        $("#divMenuTree").modal("show");
    }).catch((e) => {
        console.log(e);
        $body.removeClass("loading");
        $("#divMenuTree").modal("hide");
    });
}

function getMenuFileRevisedData(projectId) {
    $body.addClass("loading");
    $('#menuTreeView').jqxTree('clear');
    var htmlTreeGrid = new HtmlTreeGrid();
    var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + $("#txtMenuSearch").val();
    htmlTreeGrid.getMenuData({ url: endPoint }).then((d) => {
        var menuData = d.data;
        var loopCnt = "fileMenuId_";
        menuData.forEach(function (m) {
            m.FileMenuId = loopCnt + m.FileMenuId;
            m.showButton = "<button id=" + m.MenuId + " value=" + m.FileMenuId + " onclick='showTreePopup(this);' class='btn btn-primary'>Show</button>";
        });
        htmlTreeGrid.bindMenuTable(menuData);
        $body.removeClass("loading");
    }).catch((e) => {
        console.log(e);
        $body.removeClass("loading");
    });
};

var HtmlTreeGrid = function () {
    this.ajax = window.axios.create({
        baseURL: $.fn.baseAddress()
    });

    this.getMenuData = async function (config) {
        return await this.ajax.get(config.url);
    };

    this.createHtml = function (m) {
        var objectType = m.LevelNumber === 9997
            ? "Menu"
            : m.LevelNumber === 9998
                ? "JCL"
                : m.LevelNumber === 9999
                    ? "Missing"
                    : "";
        m.MenuId = m.MenuId ? m.MenuId.trim() : "None";
        m.MenuTitle = m.MenuTitle ? m.MenuTitle.trim() : "None";
        var html = "";
        if (m.MenuId) html += m.MenuId;
        if (m.MenuTitle) html += ` | ${objectType} | ${m.MenuTitle}`;
        return html;
    };

    this.createObjectHtml = function (m) {
        var html = "";
        var objectType = "";
        if (m.MenuId.endsWith(".pgm")) objectType = "Program";
        if (m.MenuId.endsWith(".sbr")) objectType = "Subroutine";
        if (m.MenuId.endsWith(".jcl")) objectType = "JCL";
        if (m.MenuId.endsWith(".icd")) objectType = "Include";
        if (objectType === "")
            objectType = m.LevelNumber === 9997
                ? "Menu"
                : m.LevelNumber === 9998
                    ? "JCL"
                    : m.LevelNumber === 9999
                        ? "Missing"
                        : "";
        if (m.MenuId) html += m.MenuId + " | " + objectType + " | " + m.MenuLevel;

        var fileId = m.FileMenuId.split('_')[1]; //     color: blue; padding - left: 10px;
        var url = `customview.html?prjId=${projectId}&fileId=${fileId}`;
        if (objectType !== "Menu") html += "<a style='color: blue; padding-left: 10px; cursor: pointer; text-decoration: none;' onclick=openWin('" + url + "'); href='#'>View</a>";
        return html;
    };

    this.prepareItem = function(id, item) {
        item.FileMenuId = "parentMenuId_" + item.FileMenuId;
        item.Id = id;
        item.Html = item.ActionExecuted === "FileObject" ? this.createObjectHtml(item) : this.createHtml(item);
        item.ParentId = item.Id;
        item.label = item.Html;
        return item;
    };

    this.prepareObject = function(id, item) {
        item.FileMenuId = "parentMenuId_" + item.FileMenuId;
        item.Id = id;
        item.Html = this.createObjectHtml(item);
        item.ParentId = item.Id;
        item.label = item.Html;
        return item;
    };

    this.prepareParentChild = function (data) {
        var id = 0;
        data.forEach((menu) => {
            menu.Id = "" + ++id;
            menu.Html = this.createHtml(menu);
            menu.ParentId = "-1";
        });
        var mainData = data;
        data.forEach(function (menu) {
            mainData.push({
                Id: "" + ++id,
                Html: "Loading...",
                ParentId: menu.Id,
                MenuTitle: "Loading..."
            });
        });
        return mainData;
    };

    this.bindTree = function (data) {
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'ParentId' }, { name: "MenuTitle" }, { name: "Html" }, { name: "Id" }, { name: "ActionExecuted" },
                { name: "FileMenuId" }
            ],
            id: 'Id',
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy('Id',
            'ParentId',
            'items',
            [
                { name: 'Html', map: 'label' },
                { name: "FileMenuId", map: "id" }, { name: "ActionExecuted", map: "value" },
                { name: "ActionExecuted", map: "actionExecuted" }
            ]);
        $('#menuTreeView').jqxTree('clear');
        $('#menuTreeView').jqxTree({ source: records, width: "100%;", height: 450 });
        $('#menuTreeView').jqxTree('expandAll');
    };

    this.bindMenuTable = function (menuData) {
        $('#menuTable').DataTable({
            data: menuData,
            pagingType: "full_numbers",
            destroy: true,
            columns: [
                { data: 'MenuId' },
                { data: 'MenuTitle' },
                //{ data: 'MenuDescription' },
                { data: 'showButton' }
            ]
        });
    };
};

HtmlTreeGrid.prototype = {
    search: async function (searchKey, config) {
        config.url = config.url + "&keyword=" + searchKey;
        return await new Promise((resolve, reject) => {
            return this.ajax.get(config.url).then((res) => { resolve(res); }).catch((e) => { reject(e); });
        });
    }
};


// -------------------------------------- Revised Menu Starts -----------------------------------

var downloadRevisedInventory = async function (fileMenuId, menu) {
    var revisedMenu = new RevisedMenu();
    await revisedMenu.invertoryMenu(fileMenuId, menu);
};

var downloadReqDoc = function (aId) {
    var revisedMenu = new RevisedMenu();
    revisedMenu.downloadReqDoc(aId);
}

var displayWizard = function (actionExecuted) {
    var revisedMenu = new RevisedMenu();
    revisedMenu.customImpact(actionExecuted);
};

var RevisedMenu = function () {
    this.id = 0;
    this.ajax = window.axios.create({
        baseURL: $.fn.baseAddress()
    });
    this.bootBox = window.bootbox;

    this.setId = function (data) {
        data.forEach((menu) => {
            menu.Id = `${++this.id}`;
        });
    };

    this.prepareParentChild = function (data) {
        data.forEach((menu) => {
            // menu.Id = `${++this.id}`;
            menu.Html = this.createHtml(menu);
            menu.ParentId = "-1";
        });
        var mainData = data;
        return mainData;
    };

    this.createHtml = function (m) {
        var objectType = this.getObjectType(m);
        m.MenuId = m.MenuId ? m.MenuId.trim() : "None";
        m.MenuTitle = m.MenuTitle ? m.MenuTitle.trim() : "None";
        var html = "";
        if (m.MenuId) html += m.MenuId;
        if (m.MenuTitle) html += ` | ${objectType} | ${m.MenuTitle}`;
        return html;
    };
};

RevisedMenu.prototype = {
    getBaseMenuData: async function (searchKey) {
        var key = searchKey || "";
        var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + key;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach(function (n) {
                var action = n.ActionExecuted ? n.ActionExecuted.trim().split(" ")[0] : "123$123";
                if (action === "") action = "123$123";
                var inventoryUrl = "downloadRevisedInventory('" + n.FileMenuId + "',true)";
                n.FileMenuId = loopCnt + n.FileMenuId;
                n.ObjectType = 'Menu';
                var pUrl = "displayWizard('" + action + "')";
                n.Actions = "<a data-action=" + action + " onclick=" + pUrl + " style='cursor: pointer;' title='Download impacts document'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>Download</button> </a>";
                n.Actions += "&nbsp; <a data-action=" + action + " onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                if (n.ActionExecuted === "FileObject")
                    n.dataObject = "data-Object";
                else
                    n.dataObject = "menu-Object";
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuFileById: async function (expandedRecord) {
        var fileMenuId = expandedRecord.FileMenuId.split("_")[1];
        var endPoint = `WorkspaceWorkflow/GetMenuFileById?projectId=${projectId}&fileMenuId=${parseInt(fileMenuId)}`;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach(function (n) {
                var menuId = n.MenuLevel;
                n.FileMenuId = loopCnt + n.FileMenuId;
                n.ObjectType = n.LevelNumber === 9998
                    ? "JCL"
                    : n.LevelNumber === 9999
                        ? "Missing"
                        : n.LevelNumber === 0
                            ? " - "
                            : "Menu";
                if (n.ActionExecuted === "FileObject")
                    n.dataObject = "data-Object";
                else
                    n.dataObject = "action-Object";

                if (n.ObjectType === "JCL" || n.ObjectType === "jcl") {
                    var pUrl = `openWin('customview.html?prjId=${n.ProjectId}&fileId=${menuId}');`;
                    var inventoryUrl = "downloadRevisedInventory('" + menuId + "',false)";
                    n.Actions = "<a onclick=" + pUrl +
                        " style='cursor: pointer;' title='Object explorer view'><button  style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                    n.Actions += "&nbsp; <a  href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    n.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        n.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                }
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuByActionExecuted: async function (menuObject) {
        var actionExecuted = menuObject.ActionExecuted;
        var fileMenuId = menuObject.FileMenuId.split("_")[1];
        var endPoint =
            `WorkspaceWorkflow/GetMenuByActionExecuted?projectId=${projectId}&actionExecuted=${actionExecuted
            }&fileMenuId=${parseInt(fileMenuId)}`;
        return await this.ajax.get(endPoint).then((actions) => {
            var actData = actions.data;
            this.setId(actData);
            var loopCnt = "fileMenuId_";
            actData.forEach((m) => {
                var menuId = m.FileMenuId;
                if (m.ActionExecuted === "FileObject") {
                    m.dataObject = "data-Object";
                    var pUrl = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${m.FileMenuId}');`;
                    var inventoryUrl = "downloadRevisedInventory('" + m.FileMenuId + "',false)";
                    m.Actions = "<a onclick=" +
                        pUrl + " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";

                    m.Actions += "&nbsp; <a  &nbsp; href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        m.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                } else
                    m.dataObject = "action-Object";
                m.FileMenuId = loopCnt + m.FileMenuId;
                m.ObjectType = this.getObjectType(m);
                if (m.ObjectType === "JCL" || m.ObjectType === "jcl") {
                    var inventoryUrl12 = "downloadRevisedInventory('" + menuId + "',false)";
                    var pUrl12 = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${menuId}');`;
                    m.Actions = "<a onclick=" +
                        pUrl12 +
                        " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                    m.Actions += "&nbsp; <a  &nbsp; href='#' onclick=" + inventoryUrl12 + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        m.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                }
                m.MenuId = m.MenuId.replace(/.pgm|.sbr|.jcl|.icd|.JCL/g, "");
            });
            var mainData = this.prepareParentChild(actData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuForObject: async function (expRecord) {
        var fileId = expRecord.FileMenuId.split("_")[1];
        var endPoint = "WorkspaceWorkflow/GetMenuForObject?projectId=" + projectId + "&objectId=" + fileId;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach((m) => {
                var pUrl = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${m.FileMenuId}');`;
                var inventoryUrl = "downloadRevisedInventory('" + m.FileMenuId + "',false)";
                m.Actions = "<a onclick=" +
                    pUrl +
                    " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                m.Actions += "&nbsp; <a href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                    m.Id +
                    ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                m.MenuTitle = m.MenuLevel;
                m.FileMenuId = loopCnt + m.FileMenuId;
                m.ObjectType = this.getObjectType(m);
                m.MenuId = m.MenuId.replace(/.pgm|.sbr|.jcl|.icd|.JCL/g, "");
                if (m.LevelNumber === 9999) m.Actions = "";
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getObjectType: function (m) {
        var objectType = "";
        if (m.MenuId.endsWith(".pgm")) objectType = "Program";
        if (m.MenuId.endsWith(".sbr")) objectType = "Subroutine";
        if (m.MenuId.endsWith(".jcl")) objectType = "JCL";
        if (m.MenuId.endsWith(".icd")) objectType = "Include";
        if (objectType === "")
            objectType = m.LevelNumber === 9997
                ? "Menu"
                : m.LevelNumber === 9998
                    ? "JCL"
                    : m.LevelNumber === 9999
                        ? "Missing"
                        : "-";
        return objectType;
    },

    downloadReqDoc: function (aId) {
        console.log(aId);
        /*
        var projectId = getParameterByName("pid");
        var endPoint = "ExportWordDocument/GenerateRequirementDoc?projectId=" + projectId + "&actionWorkflowId=" + aId;
        this.ajax.get(endPoint).then((res) => {
            this.downloadFile(res.data);
        }).catch(e => {
            console.log(e);
        });
        */
    },

    downloadFile: (path) => {
        if (typeof path === "undefined") {
            return false;
        }
        var element = document.createElement("a");
        element.href = path;
        element.target = "_blank";
        element.click();
        document.removeElement(element);
        return true;
    },

    getNodeColor: function (m) {
        var nodeColor = { color: "#ffcc00", shape: "Ellipse" }
        if (m.ObjectType === "Program") nodeColor = { color: "#FFF78C", shape: "RoundRect" }
        if (m.ObjectType === "Subroutine") nodeColor = { color: "#66ab8c", shape: "RoundRect" }
        if (m.ObjectType === "JCL") nodeColor = { color: "#6ec4db", shape: "RoundRect" }
        if (m.ObjectType === "Include") nodeColor = { color: "#7d5ba6", shape: "RoundRect" }
        return nodeColor;
    },

    prepareNodes: function (menuId, nodes) {
        var row = $("#revisedTreeMenu").jqxTreeGrid('getRow', menuId);
        var node = this.getNodeColor(row);
        nodes.push({
            Id: row.Id,
            Width: "150px",
            Name: row.MenuTitle,
            ShapeId: node.shape,
            Color: node.color
        });
        var parent = row.parent;
        if (parent) return this.prepareNodes(parent.Id, nodes);
        else return nodes;
    },

    prepareLinks: function (nodes, links) {
        for (var i = 1; i < nodes.length; i++) {
            links.push({
                Origin: nodes[i - 1].Id,
                Target: nodes[i].Id,
                LinkText: ""
            });
        }
        return links;
    },

    invertoryMenu: async function (fileMenuId, menu) {
        /*
        var endPoint = baseAddress + "WorkspaceWorkflow/GetFileIdsForMenuInventory?projectId=" + projectId + "&fileMenuId=" + fileMenuId + "&menuType=" + menu;
        // var endPoint = baseAddress + "WorkspaceWorkflow/GetFileIdsForMenuInventory?projectId=" + projectId + "&fileMenuId=12598&menuType=false";
        $.ajax({
            type: "get",
            url: endPoint,
            success: function (d) {
                downloadFile(d);
            },
            error: function (e) {
                console.log(e);
            }
        });
        */
        $body.addClass("loading");
        var endPoint = baseAddress + "WorkspaceWorkflow/GetFileIdsForMenuInventory?projectId=" + projectId + "&fileMenuId=" + fileMenuId + "&menuType=" + menu;
        await this.ajax.get(endPoint).then((res) => {
            var path = res.data;
            this.downloadFile(path);
            $body.removeClass("loading");
        }).catch((e) => {
            $body.removeClass("loading");
        });
    },

    customImpact: function (actionExecuted) {
        actionExecuted = actionExecuted || "";
        var jclAction = actionExecuted.trim();
        if (jclAction === "") return;
        var jclName = jclAction.split(" ")[0];
        var endPoint = "CustomRequirment/GetJclObjects?projectId=" + projectId + "&jclName=" + jclName;
        this.ajax.get(endPoint).then((jclData) => {
            this.fillJclObjects(jclData.data);
            var options = {
                contentWidth: 850,
                contentHeight: 450,
                showCancel: false,
                progressBarCurrent: true
            };
            var wizard = $("#revised-menu-wizard").wizard(options);
            wizard.show();
            var _self = this;
            wizard.on('incrementCard', function () {
                var currentCard = this.getActiveCard();
                if (currentCard.alreadyVisited()) return;

                var cardName = currentCard.name;
                // console.log(cardName);
                _self.fillObjects(cardName);
            });
            wizard.on('decrementCard', function () {
                // console.log(this.getActiveCard());
            });
            wizard.on('submit', function (w) {
                w.submitSuccess();
                w.hideButtons();
                w.updateProgressBar(0);
            });
        }).catch((err) => {
            this.bootBox.alert("There is no JCL file associated with this Menu!");
            console.log(err);
        });
    },

    fillObjects: function (cardName) {
        if (cardName === "Programs") {
            var items = $("#listSelectedJclObject").jqxListBox('getItems');
            var jclFile = [];
            items.forEach(function (item) {
                jclFile.push(item.value);
            });
            var fileIds = jclFile.join(",");
            var endPoint = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + fileIds;
            this.ajax.get(endPoint).then((res) => {
                var fileMaster = res.data;
                this.fillProgramObjects(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillProgramObjects(empty);
            });
        } else if (cardName === "Subroutines" /* || cardName === "Includes" */) {
            var pItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
            var pFile = [];
            pItems.forEach(function (item) {
                pFile.push(item.value);
            });
            var pFileIds = pFile.join(",");
            var endPoint1 = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + pFileIds;
            this.ajax.get(endPoint1).then((res) => {
                var fileMaster = res.data;
                this.fillSubroutinesAndIncludes(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillSubroutinesAndIncludes(empty);
            });
        } else if (cardName === "Summary") {
            this.generateSummary();
        } else if (cardName === "Download") {
            this.generateImpactDocument();
        }
    },

    fillJclObjects: function (jcls) {
        $("#listJclObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: jcls,
            checkboxes: true,
            height: 200
        });

        $("#listSelectedJclObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    fillProgramObjects: function (programs) {
        $("#listProgramsObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: programs,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedProgramsObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    fillSubroutinesAndIncludes: function (result) {
        var subRoutines = result.filter(function (element) {
            return element.FileTypeExtensionId === 17;
        });
        $("#listSubroutinesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: subRoutines,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedSubroutinesObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });

        var includes = result.filter(function (element) {
            return element.FileTypeExtensionId === 12;
        });
        $("#listIncludesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: includes,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedIncludesObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    generateSummary: function () {
        $("#tblSummary").html('');
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();
        /* Jcl Object */
        var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
        var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
        var chkJclSource = document.getElementById("chkSourceJCL").checked;
        var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
        var jFileName = [];
        $.each(jclItems, function (i, item) {
            jFileName.push(item.label);
        });
        var jclOjbectDet = {
            "Object Name": jFileName,
            "Entity Schema": chkJclDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkJclPseudo === true ? "Yes" : "No",
            "Source Code": chkJclSource === true ? "Yes" : "No"
        };
        /* Program Object */
        var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
        var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
        var chkPrgSource = document.getElementById("chkSourceProg").checked;
        var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
        var pFileName = [];
        $.each(programItems, function (i, item) {
            pFileName.push(item.label);
        });
        var programOjbectDet = {
            "Object Name": pFileName,
            "Entity Schema": chkPrgDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkPrgPseudo === true ? "Yes" : "No",
            "Source Code": chkPrgSource === true ? "Yes" : "No"
        };
        /* SubRoutine Object */
        var chkSubDbAct = document.getElementById("chkDBActSub").checked;
        var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
        var chkSubSource = document.getElementById("chkSourceSub").checked;
        var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
        var sFileName = [];
        $.each(subRoutineItems, function (i, item) {
            sFileName.push(item.label);
        });
        var subRoutineOjbectDet = {
            "Object Name": sFileName,
            "Entity Schema": chkSubDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkSubPseudo === true ? "Yes" : "No",
            "Source Code": chkSubSource === true ? "Yes" : "No"
        };
        /* Include Object */
        var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
        var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
        var chkIncludeSource = document.getElementById("chkSourceInc").checked;
        var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
        var iFileName = [];
        $.each(includeItems, function (i, item) {
            iFileName.push(item.label);
        });
        var includeOjbectDet = {
            "Object Name": iFileName,
            "Entity Schema": chkIncludeDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkIncludePseudo === true ? "Yes" : "No",
            "Source Code": chkIncludeSource === true ? "Yes" : "No"
        };
        var customRequirmentDocDetails = {
            Title: title,
            Description: description,
            /*
                "Entity Objects": entityOjbectDet,
                "I-Descriptors": iDescptOjbectDet,
            */
            "JCL Objects": jclOjbectDet,
            "Program Objects": programOjbectDet,
            "Sub-Routine Objects": subRoutineOjbectDet,
            "Include Objects": includeOjbectDet
        };
        var html = "";
        html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
        html += "<tr><td>Description</td><td>" + customRequirmentDocDetails["Description"] + "</td></tr>";
        $.each(customRequirmentDocDetails, function (i, item) {
            if (typeof item === "object")
                html += drawSummaryRow(i, item);
        });
        $("#tblSummary").append(html);
    },

    generateImpactDocument: function () {
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();

        /* Entity */
        /*
        var entityObject = [];
        var chkEntitySchema = document.getElementById("chkEntitySchema").checked;
        var entityItems = $("#listSelectedEntityObject").jqxListBox('getItems');
        $.each(entityItems, function (i, item) {
            entityObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 100
            });
        });
        */
        var entityOjbectDet = {
            ObjDetailsLst: [], // entityObject,
            EntitySchema: false, // chkEntitySchema,
            PseudoCode: false,
            SourceCode: false
        };
        /* IDescriptor */
        /*
        var iDescriptorObject = [];
        var iDescriptorItems = $("#listSelectedIDescriptor").jqxListBox('getItems');
        $.each(iDescriptorItems, function (i, item) {
            iDescriptorObject.push({
                FileName: item.label,
                FileId: item.value
            });
        });
        */
        var iDescriptorOjbectDet = {
            ObjDetailsLst: [], // iDescriptorObject,
            EntitySchema: false,
            PseudoCode: false,
            SourceCode: false
        };

        /* Jcl Object */
        var jclObject = [];
        var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
        var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
        var chkJclSource = document.getElementById("chkSourceJCL").checked;
        var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
        $.each(jclItems, function (i, item) {
            jclObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 10
            });
        });
        var jclOjbectDet = {
            ObjDetailsLst: jclObject,
            EntitySchema: chkJclDbAct,
            PseudoCode: chkJclPseudo,
            SourceCode: chkJclSource
        };
        /* Program Object */
        var programObject = [];
        var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
        var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
        var chkPrgSource = document.getElementById("chkSourceProg").checked;
        var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
        $.each(programItems, function (i, item) {
            programObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 9
            });
        });
        var programOjbectDet = {
            ObjDetailsLst: programObject,
            EntitySchema: chkPrgDbAct,
            PseudoCode: chkPrgPseudo,
            SourceCode: chkPrgSource
        };
        /* SubRoutine Object */
        var subRoutineObject = [];
        var chkSubDbAct = document.getElementById("chkDBActSub").checked;
        var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
        var chkSubSource = document.getElementById("chkSourceSub").checked;
        var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
        $.each(subRoutineItems, function (i, item) {
            subRoutineObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 17
            });
        });
        var subRoutineOjbectDet = {
            ObjDetailsLst: subRoutineObject,
            EntitySchema: chkSubDbAct,
            PseudoCode: chkSubPseudo,
            SourceCode: chkSubSource
        };
        /* Include Object */
        var includeObject = [];
        var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
        var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
        var chkIncludeSource = document.getElementById("chkSourceInc").checked;
        var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
        $.each(includeItems, function (i, item) {
            includeObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 17
            });
        });
        var includeOjbectDet = {
            ObjDetailsLst: includeObject,
            EntitySchema: chkIncludeDbAct,
            PseudoCode: chkIncludePseudo,
            SourceCode: chkIncludeSource
        };
        var customRequirmentDocDetails = {
            ProjectId: projectId,
            Title: title,
            Description: description,
            EntityObject: entityOjbectDet,
            DescriptorObject: iDescriptorOjbectDet,
            JclObject: jclOjbectDet,
            ProgramObject: programOjbectDet,
            SubRoutineObject: subRoutineOjbectDet,
            IncludeObject: includeOjbectDet
        };
        document.getElementById("tdError123").innerHTML = "Please wait... Generating custom impacts document...";
        document.getElementById("tdError123").style.color = "green";
        var endPoint = "ExportWordDocument/GenerateCustomReqDocument";
        this.ajax.post(endPoint, customRequirmentDocDetails).then((res) => {
            document.getElementById("hdnDownloadPath").value = res.data;
            document.getElementById("tdError123").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
            document.getElementById("tdError123").style.color = "green";
            document.getElementById("btnDownload").disabled = false;
        }).catch((e) => {
            document.getElementById("tdError123").innerHTML = "Something went wrong, please try again.";
            document.getElementById("tdError123").style.color = "red";
        });

        /*
        jQuery.ajax({
            type: "POST",
            data: customRequirmentDocDetails,
            contenttype: "application/json",
            url: baseAddress + "ExportWordDocument/GenerateCustomReqDocument",
            success: function (data) {
                document.getElementById("hdnDownloadPath").value = data;
                document.getElementById("tdError").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError").style.color = "green";
            },
            error: function () {
                $body.removeClass("loading");
            }
        });
        */
    }
};

$(document).ready(function () {
    $("#btnIncludeJcl").click(function () {
        $('#listSelectedJclObject').jqxListBox('refresh');
        var items = $("#listJclObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveJcl").click(function () {
        var items = $("#listSelectedJclObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludePrograms").click(function () {
        $('#listSelectedProgramsObject').jqxListBox('refresh');
        var items = $("#listProgramsObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedProgramsObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemovePrograms").click(function () {
        var items = $("#listSelectedProgramsObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedProgramsObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludeSubroutines").click(function () {
        $('#listSelectedSubroutinesObject').jqxListBox('refresh');
        var items = $("#listSubroutinesObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveSubroutines").click(function () {
        var items = $("#listSelectedSubroutinesObject").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('removeItem', item);
            }); return false;
    });

    $("#btnIncludeIncludes").click(function () {
        $('#listSelectedIncludesObject').jqxListBox('refresh');
        var items = $("#listIncludesObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveIncludes").click(function () {
        var items = $("#listSelectedIncludesObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnDownload").click(function () {
        var dPath = document.getElementById("hdnDownloadPath").value;
        window.open(dPath, "_self");
        setTimeout(function () {
            window.location.reload(true);
        }, 2500);
    });
});

var showObjConnectivity = function (menuId) {
    var revisedMenu = new RevisedMenu();
    var nodes = [];
    revisedMenu.prepareNodes(menuId, nodes);
    var reversedNodes = nodes.reverse();
    var links = [];
    revisedMenu.prepareLinks(reversedNodes, links);
    var diaLegends = [];

    diaLegends.push({});
    $("#div-revised-tree-dia").modal("show");
    $("#div-revised-tree-diagram").html("");
    var diagram = new DiagramUtility("#div-revised-tree-diagram", {
        width: 5000,
        height: 360,
        backBrush: "#FFFFFF",
        gridLines: true,
        nodes: nodes,
        links: links,
        legends: [{ title: "Starting Point", bgColor: "#ffcc00" }, { title: "JCL", bgColor: "#6ec4db" }, { title: "Program", bgColor: "#FFF78C" },
        { title: "Subroutine", bgColor: "#66ab8c" }, { title: "Include", bgColor: "#7d5ba6" }]
    });
    diagram.setTitle("Objects Connectivity");
};

$(document).ready(function () {
    $("#searchMenuItems").click(async function () {
        var searchKey = $("#txtSearchMenu").val();
        initializeMenuGrid(searchKey);
    });

    initializeMenuGrid("");
});

var initializeMenuGrid = function (searchKey) {
    var revisedMenu = new RevisedMenu();
    var key = searchKey || "";
    $("#revisedTreeMenu").jqxTreeGrid(
        {
            width: "100%",
            height: "700px",
            sortable: true,
            columnsResize: true,
            altRows: true,
            pageSize: 20,
            pageSizeOptions: ['15', '20', '30'],
            pageable: true,
            pagerPosition: 'both',
            pagerMode: "advanced",
            pageSizeMode: "root",
            virtualModeCreateRecords: async function (expandedRecord, done) {
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'ParentId' }, { name: "MenuTitle" }, { name: "Html" }, { name: "Id" }, { name: "ActionExecuted" }, { name: "FileMenuId" },
                        { name: "MenuId" }, { name: "MenuDescription" }, { name: "MenuLevel" }, { name: "LevelNumber" }, { name: "WorkflowMenuName" },
                        { name: "ProjectId" }, { name: "ObjectType" }, { name: "dataObject" }, { name: "Actions" }
                    ],
                    id: 'Id',
                    localData: await (async function (expRecord) {
                        if (expRecord === null) {
                            return await revisedMenu.getBaseMenuData(key);
                        } else if (expRecord && expRecord.dataObject === "menu-Object") {
                            return await revisedMenu.getMenuFileById(expRecord);
                        } else if (expRecord && expRecord.dataObject === "action-Object") {
                            return await revisedMenu.getMenuByActionExecuted(expRecord);
                        } else {
                            return await revisedMenu.getMenuForObject(expRecord);
                        }
                    })(expandedRecord)
                };
                var dataAdapter = new $.jqx.dataAdapter(source,
                    {
                        loadComplete: function () {
                            done(dataAdapter.records);
                        }
                    });
                dataAdapter.dataBind();
            },
            virtualModeRecordCreating: function (record) {
                record.rObject = record;
            },
            columns: [
                { text: 'Object Name', columnGroup: 'MenuId', dataField: 'MenuId', width: "25%" },
                { text: "Object Type", dataField: "ObjectType", width: "8%" },
                { text: 'Object Description', dataField: 'MenuTitle', width: "40%" },
                { text: "Actions", dataField: 'Actions', width: "27%" }
            ]
        });
};

var drawSummaryRow = function (enities, cObject) {
    var html = "";
    html += "<tr>";
    html += "<td>" + enities + "</td>";
    html += "<td><table style='width: 100%;' class='table-bordered table-striped table table-hover'>";
    html += "<tr>";
    var entString = "";
    for (var k = 0; k <= cObject["Object Name"].length - 1; k++) {
        entString += cObject["Object Name"][k] + ", ";
    }
    entString = entString.trim();
    var lastChar = entString.slice(-1);
    if (lastChar === ',') {
        entString = entString.slice(0, -1);
    };
    html += "<td style='width: 23%;'>Objects</td><td>" + entString + "</td></tr>";
    var entitySchema = cObject["Entity Schema"];
    if (entitySchema)
        html += "<tr><td>Entity Schema</td><td>" + entitySchema + "</td></tr> ";
    var pseudoCode = cObject["Pseudo Code"];
    if (pseudoCode)
        html += "<tr><td>Pseudo Code</td><td>" + pseudoCode + "</td></tr> ";
    var sourceCode = cObject["Source Code"];
    if (sourceCode)
        html += "<tr><td>Source Code</td><td>" + sourceCode + "</td></tr> ";

    html += "</td></table>";
    return html;
};

// -------------------------------------- Revised Menu Ends -----------------------------------