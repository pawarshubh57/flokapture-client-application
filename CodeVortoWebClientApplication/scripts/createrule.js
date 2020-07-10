var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
$(document).ready(function () {
    var checkedRows = window.localStorage.getItem("selectedRows");
    var rowData = JSON.parse(checkedRows);
    var table = $("#tblSelectedRows");
    table.html('');
    //var tableNotes = $("#tblStatementNotes");
    //tableNotes.html('');
    $.each(rowData,
        function (i, row) {
            drawRowStmt((i + 1), table, row);
        });
    $("#rteStatementsNote").ejRTE({ width: "100%", isResponsive: true });
    bindCatalogs();

    $("#btnSubmitCatalog").click(function () {
        var catalogName = $("#txtCatalogName").val();
        if (catalogName === "") {
            document.getElementById("tdError").innerHTML = "Please enter Catalog name";
            $("#txtCatalogName").focus();
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CatalogMaster/AddCatalog?catalogName=" + catalogName,
            success: function (cData) {
                if (cData != null) {
                    bindCatalogs();
                    $("#dvCatalog").modal("hide");
                }
            },
            statusCode: {
                400: function (response) {
                    document.getElementById("tdError").innerHTML = response.responseJSON.Message;
                }
            },
            error: function () {
                document.getElementById("tdError").innerHTML = "Error while connecting to API";
                //net::ERR_CONNECTION_REFUSED
            }
        });
        return true;
    });

    $("#btnSubmitRule").click(function () {
        createRuleForSelectedStatements();
    });
});



function createRuleForSelectedStatements() {
    var ruleSummaryAndAssociations = [];
    var statementRuleReference = [];
    var statementTbl = $("#tblSelectedRows");
    /*
    statementTbl.find('tr').each(function() {
        ruleSummaryAndAssociations.StatementIds.push($(this)[0].id);
        var tds = $(this).find('td').last();
        statementRuleReference.push({StatementId:  tds[0].innerHTML});
    });   
    var statementNotesTbl = $("#tblStatementNotes");
    statementNotesTbl.find('tr').each(function () {
        var tds = $(this).find('td').find('input');
        statementRuleReference.StatementNotes.push(tds[0].value);
    });
    */
    //$("#rteStatementsNote").ejRTE();
    var rteHtml = $("#rteStatementsNote").ejRTE("getHtml");
    //statementRuleReference.push({ StatementNotes: rteHtml });
    var startId = statementTbl.find('tr').first();
    //statementRuleReference.push({ StatementIdFrom: startId[0].id });
    var startEndId = statementTbl.find('tr').last();
    //statementRuleReference.push({ StatementIdTo: startEndId[0].id });
    //var dt = new Date().getUTCDate();
    
    statementRuleReference.push({
        StatementIdFrom: startId[0].id.split("_")[1],
        StatementIdTo: startEndId[0].id.split("_")[1],
        StatementNotes: rteHtml,
        CreatedOn: getTodaysDate(),
        CreatedBy: 1
    });
    ruleSummaryAndAssociations.push({
        RuleCatalogId: $("#ddlCatalogs").val(),
        RuleName: $("#txtRuleName").val(),
        RuleSummary: $("#txtRuleDescription").val(),
        CreatedOn: getTodaysDate(),
        CreatedBy: 1,
        StatementRuleReference: statementRuleReference
    });

    //ruleSummaryAndAssociations.RuleSummaryAndAssociations = ruleSummaryAndAssociations[0];
    //ruleSummaryAndAssociations.StatementNotes = ruleSummaryAndAssociations.StatementNotes[0];
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "StatementRule/AddStatementRules",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(ruleSummaryAndAssociations[0]),
        success: function (result) {
            if (result !== null) {
                document.getElementById("tdError1").innerHTML = "Business Function created for selected statements";
                document.getElementById("tdError1").style.color = "green";
            }
        },
        statusCode: {
            400: function (response) {
                document.getElementById("tdError1").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError1").innerHTML = "User " + response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError1").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError1").innerHTML = "Error while connecting to API";
        }
    });
}

function getTodaysDate() {
    var fullDate = new Date();
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
    var twoDigitDate = fullDate.getDate() + "";
    if (twoDigitDate.length === 1)
        twoDigitDate = "0" + twoDigitDate;

    return twoDigitMonth + "/" + twoDigitDate + "/" + fullDate.getFullYear();
}

function bindCatalogs() {
    $('#ddlCatalogs').empty().append('<option selected="selected" value="0">Select</option>');
    $.get(baseAddress + "CatalogMaster/GetAllCatalogs", function (cData) {
        if (cData != null) {
            $.each(cData, function (i, item) {
                $('#ddlCatalogs').append($('<option>', {
                    value: item.CatalogId,
                    text: item.CatalogName
                }));
            });
        }
    });
}

function drawRowStmt(id, table, row) {
    var trRow =
        $("<tr id='tr" + row.StatementId + "'><td style='background-color: #0000FF; width: 5px;'></td><td style='width: 12px; background-color: #f0f0f0;'></td>" +
            "<td bgcolor='#f0f0f0'><font color='blue'>" + id + "</font></td> <td width='8'></td>" +
            "<td>" + row.GraphName + "</td></tr>");
    /*
    var notesRow = $(" <tr><td style='background-color: #0000FF; width: 5px;'></td>" +
        "<td style='background-color: #f0f0f0; width: 12px;'></td><td style='background-color: #f0f0f0; color: blue;'>" + id + "</td>" +
        "<td style='width: 8px;'></td><td><input type='text' id='txt" + row.StatementId + "' class='form-control'></td></tr>");
    tableNotes.append(notesRow);
    */
    table.append(trRow);
}

function showCatalogDialog() {
    document.getElementById("tdError").innerHTML = "";
    document.getElementById("txtCatalogName").value = "";
    $("#txtCatalogName").focus();
    $("#dvCatalog").modal("show");
}