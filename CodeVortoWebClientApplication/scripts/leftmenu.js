var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var prjctId = window.localStorage.getItem("prjctId");

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function() {
    $("#aQueryConsole").click(function () {
        $.fn.actionAuditLog(userId, "Keyword Search", prjctId);
        var pid = getParameterByName("pid") || 0;
        window.open("query_console.html?pid=" + pid, '', "width=" + screen.availWidth + ",height=" + screen.availHeight);
    });
});
function showSideAdminPages(pageName, rptName) {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, rptName, prjctId);
    location.href = pageName;
}

function showCustomView(rptName) {
    var fileId = 0;
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, rptName, prjctId);
    window.open("customview.html?prjId=" + projectId + "&fileId=" + fileId, '', "width=" + screen.availWidth + ",height=" + screen.availHeight);
}

function showTagSearch(rptName) {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, rptName, prjctId);
    window.open("search-tags.html", "width=" + screen.availWidth + ",height=" + screen.availHeight);
}

function projectWorkspace() {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, 'Project Workspace', prjctId);
    location.href = "projects_workspace.html?pid=" + prjctId;
}

/* Inventory Menu */
function viewInventory() {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, 'View Inventory', prjctId);
    window.open("view-inventory.html?prjId=" + projectId, '', "width=" + screen.availWidth + ",height=" + screen.availHeight);
}

function portfolioDownloadFlowChart(rptName) {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, rptName, prjctId);
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/PortfolioDownloadFlowChart?projectId=" + parseInt(prjctId) + "&stmtId=0&saveUrlPath=&flag=0&userId=" + userId,
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (data) {
            downloadFile(data);
        }
    });
}

function downloadObjectConnectivityFlowchart() {
    var opt = 1;
    jQuery.ajax({
        url: baseAddress + "ObjectConnectivity/GetLinkToDownloadObjectDictionaryFlowChart?" +
            "projectId=" + parseInt(projectId) + "&saveUrlPath=&opt=" + opt + "&userId=" + userId,
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (data) {
            downloadObjectConnectivityFromData(data.Nodes, data.Links);
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
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraphObjectConnectivity?projectId=" + projectId,
        type: 'POST',
        data: JSON.stringify(workFlowData),
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            downloadFile(tData);
        }
    });
}

function downloadFile(path) {
    var element = document.createElement('a');
    element.href = path;
    element.target = "_blank";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadInventoryPopup() {
    $("#dvDownloadInventory").modal("show");
}

function downloadInventory() {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, 'Download Inventory', prjctId);
    var skipSame = document.getElementById("chkSkipSame").checked;
    var businessName = document.getElementById("chkBusinessSame").checked;
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/ExportInventoryToExcel?projectId=" + parseInt(prjctId) + "&skipSame=" + skipSame + "&businessName=" + businessName,
        type: 'GET',
        contentType: "application/xlsx; charset=utf-8",
        headers: "Content-Type: application/xlsx",
        success: function (data) {
            downloadFile(data);
        }
    });
}

function viewDbSchema() {
    var prjctId = window.localStorage.getItem("prjctId");
    $.fn.actionAuditLog(userId, 'View DB Schema', prjctId);
    window.open("view-database-schema.html?prjId=" + prjctId, '', "width=" + screen.availWidth + ",height=" + screen.availHeight);
}

/* Work Product*/
function showDictionaryDialog() {
    var url = (window.location !== window.parent.location)
        ? document.referrer
        : document.location.href;
    var fileName = url.substring(url.lastIndexOf('/') + 1).split("?")[0];
    document.getElementById("tdMessage").innerHTML = "";
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/GetObjectDictionaryData",
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("UserId", userId);
            xhr.setRequestHeader("FromPage", fileName);
            xhr.setRequestHeader("ReportName", "Object Dictionary");
        },
        data: { "projectId": projectId },
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != null) {
                var classes = data.Classes;
                window.localStorage.setItem("Classes", classes);
                var methods = data.Methods;
                window.localStorage.setItem("Methods", methods);
                var combineList = data.CombineList;
                window.localStorage.setItem("CombineList", combineList);
                bindObjectDictionaryData(classes, methods, combineList);
                $("#showDictionaryDialog").modal("show");
            }
        }
    });
}

function addSystemDescription() {
    var url = (window.location !== window.parent.location)
        ? document.referrer
        : document.location.href;
    var fileName = url.substring(url.lastIndexOf('/') + 1).split("?")[0];
    $("#txtSystemDescription").val("");
    document.getElementById("tdError102").innerHTML = "";
    jQuery.ajax({
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("UserId", userId);
            xhr.setRequestHeader("FromPage", fileName);
            xhr.setRequestHeader("ReportName", "System Description");
        },
        url: baseAddress + "ProjectMaster/GetProjectDetail?projectId=" + projectId,
        success: function (result) {
            if (result != null) {
                $("#txtSystemDescription").val(result.SystemDescription);
                $("#dvSystemDescription").modal("show");
            } else {
                $("#dvSystemDescription").modal("show");
            }
        }
    });
}

function showCustomWorkflow() {
    document.getElementById("dvError101").innerHTML = "";
    fillJclfDropDown();
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
    tblCurrent.find('tr')
        .each(function (i, el) {
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

$("#btnSaveWorkflowName").click(function () {
    if ($("#txtWorkFlowName").val() === "") {
        document.getElementById("dvError101").innerHTML = "Please enter workflowname";
        $("#txtWorkFlowName").focus();
        $("#txtWorkFlowName").css("border-color", "red");
        $("#txtWorkFlowName").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#ddlJclName").val() === "Select" || $("#ddlJclName").val() === "0") {
        document.getElementById("dvError101").innerHTML = "Please select filename";
        $("#ddlJclName").focus();
        $("#ddlJclName").css("border-color", "red");
        $("#ddlJclName").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    var actionWorkflowMaster = {
        ProjectId: projectId,
        WorkflowName: $("#txtWorkFlowName").val(),
        OriginFileName: $("#ddlJclName").val(),
        OriginFilePath: "",
        OriginEventMethod: "",
        MethodStatementId: "",
        CreatedBy: userId,
        EndPointOrService: "Batch",
        WorkflowBusinessName: $("#txtWorkFlowName").val(),
        Processed: 1,
        IsDeleted: 0,
        OriginObject: "Custom Workflow",
        WorkflowBusinessDescription: document.getElementById("txtWorkFlowDesc").value
    }
    var url = (window.location !== window.parent.location)
        ? document.referrer
        : document.location.href;
    var fileName = url.substring(url.lastIndexOf('/') + 1).split("?")[0];
    jQuery.ajax({
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("UserId", userId);
            xhr.setRequestHeader("FromPage", fileName);
            xhr.setRequestHeader("ReportName", "Custom Workflow");
        },
        data: actionWorkflowMaster,
        url: baseAddress + "WorkspaceWorkflow/AddCustomWorkflowName",
        success: function (result) {
            if (result != null) {
                document.getElementById("dvError101").innerHTML = "Workflow saved successfully.";
                document.getElementById("dvError101").style.color = "green";
            }
            return false;
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                document.getElementById("dvError101").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("dvError101").innerHTML = response.statusText;
            },
            500: function (response) {
                document.getElementById("dvError101").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("dvError101").innerHTML = "Error while connecting to API";
        }
    });
    return false;
});

$("#btnSearchObjects").click(function () {
    var searchTerm = document.getElementById("txtSearch").value;
    if (searchTerm === "") {
        fillJclfDropDown();
        return;
    } else {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "FileMaster/CustomWorkflowObjectSearch?searchTerm=" + searchTerm + "&projectId=" + parseInt(projectId),
            success: function (result) {
                $("#ddlJclName").empty();
                $.each(result, function (key, value) {
                    $("#ddlJclName").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                });
            }
        });
    }
});

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

