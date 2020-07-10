var baseAddress = $.fn.baseAddress();

$(document).ready(function() {
    $.get(baseAddress + "StatementReference/Get?bCommandId1=8&bCommandId2=19", function(dData) {
        if (dData != null) {
            var allMethods = dData.Methods;
            var allClasses = dData.Classes;
            if (allMethods.length > 0) {
                $("#tdAllMethods").html('');
                drawMethodsTable(allMethods, 'tdAllMethods');
            }
            if (allClasses.length > 0) {
                $("#tdAllClasses").html('');
                drawClassTable(allClasses, 'tdAllClasses');
            }
        }
    });
});

function showDialog(tag) {
    $("#currentClassName").val(tag.title);
    var tempId = tag.id;
    var stmtId = tempId.split('_')[1];
    $("#DivShowNotes").modal("show");
}

function showMethodDialog(tag) {
    $("#txtCurrentMethodName").val(tag.title);
    var tempId = tag.id;
    var stmtId = tempId.split('_')[1];
    $("#showMethodDialog").modal("show");
}

function drawClassTable(classData, tblId) {
    //var tbl = $("<table />").prop("id", "tblAllClassNames");
    var tbl = $("#" + tblId);
    for (var i = 0; i < classData.length; i++) {
        var tr = $("<tr style='cursor: pointer'  onclick='changeBg(this);';/>").prop("id", "trStatement_" + classData[i].Value);
        tr.append("<td>" + (i + 1) + "</td>");
        tr.append("<td id='tdStmt_"+classData[i].Value + "'>" +
            classData[i].Name +
            "<i id= 'iStmt_" + classData[i].Value+"' class='fa fa-pencil-square fa-2x' style='cursor: pointer; position: absolute; right: 30px; " +
            " height: 0; overflow: visible; margin: -4px;' title='" + classData[i].Name + "'" +
            " onclick='showDialog(this);'></i></td>");
        tbl.append(tr);
    }
    $("#tdAllClasses").append(tbl);
}

function drawMethodsTable(allMethods, tblId) {
    //var tbl = $("<table />").prop("id", "tblAllMethodNames");
    var tbl = $("#" + tblId);
    for (var i = 0; i < allMethods.length; i++) {
        var tr = $("<tr style='cursor: pointer'  onclick='changeBg(this);';/>").prop("id", "trStatement_" + allMethods[i].Value);
        tr.append("<td>" + (i + 1) + "</td>");
        tr.append("<td id='tdStmt_" + allMethods[i].Value + "'>" +
             allMethods[i].Name +
             "<i id= 'iStmt_" + allMethods[i].Value + "' class='fa fa-pencil-square fa-2x' style='cursor: pointer; position: absolute; right: 30px; " +
             " height: 0; overflow: visible; margin: -4px;' title='" + allMethods[i].Name + "'" +
             " onclick='showMethodDialog(this);'></i></td>");
        tbl.append(tr);
    }
    $("#tdAllMethods").append(tbl);
}

function changeBg(parameters) {
    $(parameters).closest('table').removeClass("table table-striped table-bordered");
    var tbl = $(parameters).closest('table');
    tbl.find('tr').each(function () {
        $(this).css("background-color", "");
    });
    $(parameters).css("background-color", "#e0e5ec");
    $(parameters).closest('table').addClass("table table-striped table-bordered");
}
