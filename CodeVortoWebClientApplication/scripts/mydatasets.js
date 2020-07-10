var baseAddress = $.fn.baseAddress();
//var rCount = 0;
//window.localStorage.setItem("rLoad", rCount);
$(window).ready(function () {
    $.get(baseAddress + "ProjectMaster/GetProjectWorkSpaces",
        function (projectData) {
            if (projectData != null) {
                $("#myProjectDatasets").html('');
                drawTable(projectData, 'myProjectDatasets');
            }
        });
    $("#fromDate").jqxDateTimeInput({ formatString: 'd' });
    $('#fromDate ').jqxDateTimeInput('setDate', new Date());
    $("#toDate").jqxDateTimeInput({ formatString: 'd' });
    $('#toDate ').jqxDateTimeInput('setDate', new Date());
});
$(function () {
    // declaration
    $("#UploadDefault").ejUploadbox({
        saveUrl: "SaveFiles.ashx",
        removeUrl: "RemoveFiles.ashx",
        fileSelect: "fileselect",
        begin: "fileuploadbegin",
        complete: "fileuploadcomplete",
        showFileDetails: true,
        buttonText: {
            browse: "Browse"
        },
        dialogText: {
            title: "Upload Document",
            name: "File Name",
            size: "File Size",
            status: "File Status"
        }
    });
});
var fileUpload = {
    fileUploads: []
};
var srNo = 1;

function fileselect(e, ui) {
    $("#docName").val(e.files[0].name);
}

function fileuploadcomplete() {
    var projectDocuments = [];
    var date = new Date();
    projectDocuments.push({
        ProjectDocumentId: 0,
        ProjectId: window.localStorage.getItem("pId"),
        DocumentTitle: $("#docName")[0].value,
        DocumentName: $("#docTitle")[0].value,
        DocumentPath: "",
        UploadedOn: (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear(),
        UserId: window.localStorage.getItem("userId")
    });
    $.post(baseAddress + "ProjectMaster/UploadProjectDocuments",
         projectDocuments[0] ,
        function(projectData) {
            if (projectData != null) {
                $("#projectDocuments").html('');
                drawProjectDocsTable(projectData, 'projectDocuments');
            }
        });
}

function drawProjectDocsTable(data, tableName) {
    if (tableName === "projectDocuments") {
        if (data.length <= 0) {
            $("#projectDocuments").html('No records found');
        } else {
            for (var i = 0; i < data.length; i++) {
                drawDocsRow(data[i], tableName, (i+1));
            }
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawDocsRow(data[j], tableName, 'pointer');
        }
    }
}

function drawDocsRow(rowData, tableName, srNo) {
    var docId = rowData.ProjectDocumentId;
    var row = $("<tr class='footable-even footable-detail-show' style='display: table-row;'" +
        " title='record_" + docId + "' id='projectTr_" + docId + "' />");
    $("#" + tableName).append(row);
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.DocumentTitle + "</td>"));
    row.append($("<td>" + rowData.DocumentName + " </td>"));
    row.append($("<td>" + rowData.UploadedOn + " </td>"));
}

function drawTable(data, tableName) {
    if (tableName === "myProjectDatasets") {
        if (data.length <= 0) {
            $("#myProjectDatasets").html('No records found');
        } else {
            for (var i = 0; i < data.length; i++) {
                drawRow(data[i], tableName, '');
            }
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, 'pointer');
        }
    }
}

function drawRow(rowData, tableName, css) {
    var projectId = rowData.ProjectId;
    var row = $("<tr class='footable-even footable-detail-show' style='display: table-row;' title='record_" + projectId + "' id='projectTr_" + projectId + "' />");
    $("#" + tableName).append(row);
    //row.append($("<td />").append($("<label class='form-checkbox form-icon'><input type='checkbox' id='chk_" + projectId + "'></label>")));
    row.append('<td class="footable-visible footable-first-column"><span class="footable-toggle"></span>' +
        '<label class="form-checkbox form-icon"><input type="checkbox"></label></td>');
    row.append($("<td>" + rowData.UploadedDate + "</td>"));
    row.append($("<td>" + rowData.ProjectName + " </td>"));
    row.append($("<td>" + rowData.PhysicalPath + " </td>"));
    row.append($("<td />").append($("<span class='label label-table label-success'>Successful</span></td>")));

    var hiddenRow = $("<tr class='footable-row-detail' style='display: table-row;' /> ");
    var td = $("<td class='footable-row-detail-cell' colspan='5' />");
    var div = $("<div class='footable-row-detail-inner' />");
    div.append('<div class="footable-row-detail-row"><div class="footable-row-detail-name">Project Size:</div><div class="footable-row-detail-value">120MB</div></div>');
    div.append('<div class="footable-row-detail-row"><div class="footable-row-detail-name">Number of Files:</div><div class="footable-row-detail-value">104</div></div>');
    div.append('<div class="footable-row-detail-row"><div class="footable-row-detail-name">Number of Classes:</div><div class="footable-row-detail-value">88</div></div>');
    div.append('<div class="footable-row-detail-row"><div class="footable-row-detail-name">Number of Screens:</div><div class="footable-row-detail-value">22</div></div>');
    div.append('<div class="footable-row-detail-row"><div class="footable-row-detail-name">Processed On:</div><div class="footable-row-detail-value">01/01/2015</div></div>');
    div.append('<div class="footable-row-detail-row"><div class="footable-row-detail-name">Business Rules Collected:</div><div class="footable-row-detail-value">10</div></div>');
    div.append("<div class='footable-row-detail-row'><div class='footable-row-detail-name'></div><div class='footable-row-detail-value' data-bind-value='bind-1465388296770-11'><div class='col-sm-12'>" +
        "<div class='col-sm-6'><a href='projects_workspace.html?pid=" + projectId + "'><button class='btn btn-mint'>Load in Workspace</button></a></div>" +
        "<div class='col-sm-4'><button class='btn btn-warning'>View Business Functions</button> </div>" +
        //"<div class='col-sm-3'><button class='btn btn-danger'>Share Project</button></div>" +
        //"<div class='col-sm-3'><button class='btn btn-success' data-toggle='modal' onclick='fillDocsData(" + projectId + ");' data-target='#addDocs'>Add Documentation</button></div>" +
        "</div></div></div>");
    td.append(div);
    hiddenRow.append(td);
    $("#" + tableName).append(hiddenRow);
}

function fillDocsData(projectId) {
    $("#docName")[0].value = "";
    $("#docTitle")[0].value = "";
    window.localStorage.setItem("pId", projectId);
    $.get(baseAddress + "ProjectMaster/GetProjectDocuments?projectId=" + projectId,
    function (projectData) {
        if (projectData != null) {
            $("#projectDocuments").html('');
            drawProjectDocsTable(projectData, 'projectDocuments');
        }
    });
}

function searchProjects() {
    var fromDate = $('#fromDate')[0].value;
    var toDate = $('#toDate')[0].value;
    if (fromDate === "" || toDate === "" || fromDate === null || toDate === null) {
        return false;
    }
    $.get(baseAddress + "ProjectMaster/SearchProjects?fromDate=" + fromDate + "&toDate=" + toDate + " ",
        function (projectData) {
            if (projectData != null) {
                $("#myProjectDatasets").html('');
                drawTable(projectData, 'myProjectDatasets');
            }
        });
    return true;
}

function OkSaveFile(saveFilePath) {
    $("#UploadDefault").focus();
    $("#UploadDefault").ejUploadbox({
        saveUrl: "Content/AjaxFileUploader.ashx?" +
            "flagSave=true&SaveFileUrl=" + saveFilePath + "" +
            "&selectedProgramID=" + 1
    });
}

function DoNotSaveFile() {
    $("#UploadDefault").focus();
    $("#UploadDefault").ejUploadbox({
        saveUrl: "Content/AjaxFileUploader.ashx?flagSave=false&selectedProgramID=" + 1
    });
}
