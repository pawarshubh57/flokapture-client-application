var baseAddress = $.fn.baseAddress();
var prjctId = window.localStorage.getItem("prjctId");

var $body = $("body");

$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    if (prjctId === 0 || prjctId === "0" || prjctId === null || typeof prjctId === "undefined") {
        return false;
    }

    $("#divStepFirst").modal("show");
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).parent().find(".fa-angle-right").removeClass("fa-angle-right").addClass("fa-angle-down");
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
    });

    $("#btnNextStepFirst").click(function () {
        if ($("#txtTitle").val() === "") {
            document.getElementById("tdError").innerHTML = "Please enter title";
            $("#txtTitle").focus();
            $("#txtTitle").css("border-color", "red");
            $("#txtTitle").on("keypress", function () {
                $(this).css("border-color", "");
                document.getElementById("tdError").innerHTML = " ";
            });
            return false;
        }
        if ($("#txtDescription").val() === "") {
            document.getElementById("tdError").innerHTML = "Please enter description";
            $("#txtDescription").focus();
            $("#txtDescription").css("border-color", "red");
            $("#txtDescription").on("keypress", function () {
                $(this).css("border-color", "");
                document.getElementById("tdError").innerHTML = " ";
            });
            return false;
        }
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");
        $("#acc2").click();
        // clearAllListBoxes();
        funEntityObject();
    });


    $("#btnNextStepSecond").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#acc3").click();
        fillJclObjects();
    });

    $("#btnNextStepThird").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#collapseThree").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseThree").removeClass("collapse in").addClass("collapse");
        $("#acc4").click();
        fillProgramsObjects();
    });

    $("#btnNextStepForth").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#collapseThree").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseThree").removeClass("collapse in").addClass("collapse");
        $("#collapseForth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseForth").removeClass("collapse in").addClass("collapse");
        $("#acc5").click();
        fillSubRoutinesObjects();
    });

    $("#btnNextStepFifth").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#collapseThree").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseThree").removeClass("collapse in").addClass("collapse");
        $("#collapseForth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseForth").removeClass("collapse in").addClass("collapse");
        $("#collapseFifth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseFifth").removeClass("collapse in").addClass("collapse");
        $("#acc6").click();
        fillIncludesObjects();
    });
    $("#btnNextStepFifth").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#collapseThree").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseThree").removeClass("collapse in").addClass("collapse");
        $("#collapseForth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseForth").removeClass("collapse in").addClass("collapse");
        $("#collapseFifth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseFifth").removeClass("collapse in").addClass("collapse");
        $("#collapseSixth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseSixth").removeClass("collapse in").addClass("collapse");
        $("#acc7").click();
    });
    $("#btnNextStepSixth").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#collapseThree").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseThree").removeClass("collapse in").addClass("collapse");
        $("#collapseForth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseForth").removeClass("collapse in").addClass("collapse");
        $("#collapseFifth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseFifth").removeClass("collapse in").addClass("collapse");
        $("#collapseSixth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseSixth").removeClass("collapse in").addClass("collapse");
        $("#collapseSeven").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseSeven").removeClass("collapse in").addClass("collapse");

        $("#acc7").click();
    });

    $("#btnGenerateDocument").click(function () {
        $("#collapseOne").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseOne").removeClass("collapse in").addClass("collapse");

        $("#collapseTwo").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseTwo").removeClass("collapse in").addClass("collapse");
        $("#collapseThree").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseThree").removeClass("collapse in").addClass("collapse");
        $("#collapseForth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseForth").removeClass("collapse in").addClass("collapse");
        $("#collapseFifth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseFifth").removeClass("collapse in").addClass("collapse");
        $("#collapseSixth").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseSixth").removeClass("collapse in").addClass("collapse");
        $("#collapseSeven").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseSeven").removeClass("collapse in").addClass("collapse");
        $("#collapseSeven").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseSeven").removeClass("collapse in").addClass("collapse");
        $("#collapseEight").parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
        $("#collapseEight").removeClass("collapse in").addClass("collapse");
        $("#acc8").click();
        documentGeneration();
    });

    $("#btnDownloadRequirements").click(function () {
        var path = document.getElementById("hdnDownloadPath").value;
        window.open(path, "_self");
    });
});

/***********   */


/* Step Second  Entity Object */
function funEntityObject(entityObject) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetEntityObject?projectId=" + prjctId,
        success: function (result) {
            if (result !== null) {
                $("#listEntityObjects").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'RowId',
                    width: 250,
                    source: result,
                    checkboxes: true,
                    height: 200
                });
            }
        }
    });
    $("#listSelectedEntityObject").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'RowId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 200
    });
    $("#listEntityObjects").jqxListBox('refresh');
    $("#listJclObjects").jqxListBox('refresh');
    $("#listProgramsObjects").jqxListBox('refresh');
    $("#listSubroutinesObjects").jqxListBox('refresh');
    $("#listIncludesObjects").jqxListBox('refresh');
    $("#listSelectedEntityObject").jqxListBox('refresh');
    $("#listSelectedJclObject").jqxListBox('refresh');
    $("#listSelectedProgramsObject").jqxListBox('refresh');
    $("#listSelectedSubroutinesObject").jqxListBox('refresh');
    $("#listSelectedIncludesObject").jqxListBox('refresh');
}

function clearAllListBoxes() {
    $("#listSelectedEntityObject").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'RowId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 200
    });
    $("#listEntityObjects").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'RowId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 200
    });
    $("#listSelectedJclObject").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
    $("#listJclObjects").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
    $("#listProgramsObjects").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
    $("#listSelectedProgramsObject").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });

    $("#listSubroutinesObjects").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
    $("#listSelectedSubroutinesObject").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
    $("#listIncludesObjects").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
    $("#listSelectedIncludesObject").jqxListBox({
        displayMember: 'FileName',
        valueMember: 'FileId',
        width: 250,
        source: [],
        checkboxes: true,
        height: 250
    });
}

function fillSelectedEntityObject() {
    $('#listSelectedEntityObject').jqxListBox('refresh');
    var items = $("#listEntityObjects").jqxListBox('getCheckedItems');
    var entityObjects = [];
    $.each(items, function (i, item) {
        entityObject.push({
            FileName: item.originalItem.FileName,
            FileId: item.originalItem.RowId,
        });
        $("#listSelectedEntityObject").jqxListBox('addItem',
            {
                label: item.originalItem.FileName,
                value: item.originalItem.RowId
            });
    });

}

function removeSelectedEntityObject() {
    var items = $("#listSelectedEntityObject").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedEntityObject").jqxListBox('removeItem', item);
    });
}

/* Step Third Jcl Object */
function fillJclObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetJclObject?projectId=" + prjctId,
        success: function (result) {
            if (result !== null) {
                $("#listJclObjects").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: result,
                    checkboxes: true,
                    height: 250
                });
                $("#listSelectedJclObject").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: [],
                    checkboxes: true,
                    height: 250
                });
            }
        }
    });
}

function fillSelectedJclObject() {
    $('#listSelectedJclObject').jqxListBox('refresh');
    var items = $("#listJclObjects").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedJclObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
    });
}

function removeSelectedJclObject() {
    var items = $("#listSelectedJclObject").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedJclObject").jqxListBox('removeItem', item);
    });
}

/* Step Forth Programs Object */

function fillProgramsObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetProgramsObject?projectId=" + prjctId,
        success: function (result) {
            if (result !== null) {
                $("#listProgramsObjects").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: result,
                    checkboxes: true,
                    height: 250
                });
                $("#listSelectedProgramsObject").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: [],
                    checkboxes: true,
                    height: 250
                });
            }
        }
    });
}

function fillSelectedProgramsObject() {
    $('#listSelectedProgramsObject').jqxListBox('refresh');
    var items = $("#listProgramsObjects").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedProgramsObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
    });
}

function removeSelectedProgramsObject() {
    var items = $("#listSelectedProgramsObject").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedProgramsObject").jqxListBox('removeItem', item);
    });
}

/* Step Fifth SubRoutines Object */
function fillSubRoutinesObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetSubRoutinesObject?projectId=" + prjctId,
        success: function (result) {
            if (result !== null) {
                $("#listSubroutinesObjects").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: result,
                    checkboxes: true,
                    height: 250
                });
                $("#listSelectedSubroutinesObject").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: [],
                    checkboxes: true,
                    height: 250
                });
            }
        }
    });
}

function fillSelectedSubroutinesObject() {
    $('#listSelectedSubroutinesObject').jqxListBox('refresh');
    var items = $("#listSubroutinesObjects").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedSubroutinesObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
    });
}

function removeSelectedSubroutinesObject() {
    var items = $("#listSelectedSubroutinesObject").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedSubroutinesObject").jqxListBox('removeItem', item);
    });
}


/* Step Fifth Includes Object */
function fillIncludesObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetIncludesObject?projectId=" + prjctId,
        success: function (result) {
            if (result !== null) {
                $("#listIncludesObjects").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: result,
                    checkboxes: true,
                    height: 250
                });
                $("#listSelectedIncludesObject").jqxListBox({
                    displayMember: 'FileName',
                    valueMember: 'FileId',
                    width: 250,
                    source: [],
                    checkboxes: true,
                    height: 250
                });
            }
        }
    });
}

function fillSelectedIncludesObject() {
    $('#listSelectedIncludesObject').jqxListBox('refresh');
    var items = $("#listIncludesObjects").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedIncludesObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
    });
}

function removeSelectedIncludesObject() {
    var items = $("#listSelectedIncludesObject").jqxListBox('getCheckedItems');
    $.each(items, function (i, item) {
        $("#listSelectedIncludesObject").jqxListBox('removeItem', item);
    });
}

/* Document Genration Summary */

function documentGeneration() {
    var title = $("#txtTitle").val();
    var description = $("#txtDescription").val();
    /* Entity */
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
    var entityOjbectDet = {
        ObjDetailsLst: entityObject,
        EntitySchema: chkEntitySchema,
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
    var chkincludeDbAct = document.getElementById("chkDBActSub").checked;
    var chkincludePseudo = document.getElementById("chkPseudoSub").checked;
    var chkincludeSource = document.getElementById("chkSourceSub").checked;
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
        EntitySchema: chkincludeDbAct,
        PseudoCode: chkincludePseudo,
        SourceCode: chkincludeSource
    };

    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        Description: description,
        EntityObject: entityOjbectDet,
        JclObject: jclOjbectDet,
        ProgramObject: programOjbectDet,
        SubRoutineObject: subRoutineOjbectDet,
        IncludeObject: includeOjbectDet
    };
    jQuery.ajax({
        type: "POST",
        data: customRequirmentDocDetails,
        contenttype: "application/json",
        url: baseAddress + "ExportWordDocument/GenerateCustomReqDocument",
        success: function (data) {
            //   console.log(data);
            document.getElementById("hdnDownloadPath").value = data;
        }
    });
}


/* Document Download */
/*
function documentDownload() {
    var path = document.getElementById("hdnDownloadPath").value;
    downloadFile(path);
}

function downloadFile(path) {
    var element = document.createElement('a');
    element.href = path;
    element.target = "_blank";
    element.click();
    window.open(path, "_self");
}
*/