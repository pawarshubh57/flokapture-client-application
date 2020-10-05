$(document).ready(function () {
    jQuery.ajax({
        url: baseAddress + "Report/EntityUsesCobol?projectId=2",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            var data = tData;
            if (data != null) {
                var l = 1;
                for (var k = 0; k < data.length; k++) {
                    data[k].SrNo = l;
                    l++;
                }
                $("#divEntity").ejGrid({
                        width: "100%",
                        dataSource: data,
                        allowPaging: true,
                        allowSearching: true,
                        allowResizing: true,
                        allowResizeToFit: true,
                        scrollSettings: { height: 500, frozenRows: 0 },
                        pageSettings: { pageSize: 20 },
                        //toolbarSettings: {
                        //    showToolbar: true,
                        //    toolbarItems: [
                        //        ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                        //    ]

                        //},
                        allowScrolling: false,
                        columns: [
                            { field: "SrNo", headerText: "Sr#", width: "5%" },
                            { field: "EntityName", headerText: "Entity Name", width: "40%" },
                            { field: "AttributeName", headerText: "Attribute Name", width: "30%" },
                            { field: "AttributeDescription", headerText: "Action", width: "25%" }
                        ],
                        toolbarClick: function (e) {
                            var gridObj = $("#divEntity")[0];
                            if (e.itemName === "Excel Export") {
                                exportGrid(gridObj);
                                return false;
                            }
                            return true;
                        },
                        queryCellInfo: function (args) {
                            $(args.cell).attr({
                                "data-toggle": "tooltip",
                                "data-container": "body",
                                "title": args.data[args.column.field]
                            });
                        }
                    });
                return true;
            }
            return true;
        }
    });
    /*
    jQuery.ajax({
        // this is for cobol varibale tree
        url: baseAddress + "Test/WorkingStorageTree?fileId=169", 
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function(tData) {
            var secondTab = tData;
            var sourceSecondTab =
            {
                dataType: "json",
                dataFields: [
                    { name: "GraphId", type: "string" },
                    { name: "ParentId", type: "string" },
                    { name: "VariableName", type: "string" }
                ],
                hierarchy:
                {
                    keyDataField: { name: "GraphId" },
                    parentDataField: { name: "ParentId" }
                },
                id: "GraphId",
                localData: secondTab
            };
            var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
            $("#divTree").jqxTreeGrid(
                {
                    width: "100%",
                    height: 600,
                    source: dataAdapterSecondTab,
                    showHeader: false,
                    columns: [
                        { text: "Variable Name", dataField: "VariableName" }
                    ]

                });
           
        }
    });
    */
});

function showData(dvCtrl) {
    $("#dvData").html(dvCtrl.innerHTML);
    var ctrlId = dvCtrl.id;

    if (ctrlId.startsWith("dvAttri_")) {
        $("#ViewDataHeader").html("Attributes");
    }
    if (ctrlId.startsWith("dvAction_")) {
        $("#ViewDataHeader").html("Used in...");
    }
    $("#viewData").modal("show");
    return false;
}

function includeStateDialog(fileId) {
    $("#ViewSourceInputBody").hide();
    document.getElementById("subRoutineprogramId").value = fileId;
    var hitHighlighter = new Hilitor("ViewSourceInputBody");
    hitHighlighter.setMatchType("left");
    $("#ViewSourceInputModal_SearchButton").off();
    $("#ViewSourceInputModal_SearchBox").off();
    $("#ViewSourceInputModal_SearchPrev").off();
    $("#ViewSourceInputModal_SearchNext").off();
    $("#ViewSourceInputModal_SearchBox").val("");
    $("#ViewSourceInputModal_SearchNav").hide();
    $("#ViewSourceInputModal_SearchHitCount").text("");

    $("#ViewSourceInputModal_SearchButton").click(function () {
        hitHighlighter.remove();
        var keywords = $("#ViewSourceInputModal_SearchBox").val();
        var words = keywords.split(",").sort(function (a, b) {
            return b.length - a.length;
        });
        var hitCount = 0;
        $.each(words, function () {
            hitHighlighter.apply(this);
            hitCount += hitHighlighter.hitCount;
        });

        if (hitCount === 0) {
            $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
        } else {
            $("#ViewSourceInputModal_SearchNav").show();
            $("#ViewSourceInputModal_SearchHitCount").text(hitCount + (hitCount === 1 ? " match" : " matches"));
        }
    });

    $("#ViewSourceInputModal_SearchBox").keypress(function (e) {
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

    $("#ViewSourceInputModal_SearchPrev").click(function () {
        hitHighlighter.prevHit();
    });

    $("#ViewSourceInputModal_SearchNext").click(function () {
        hitHighlighter.nextHit();
    });

    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        var pId = getParameterByName("prjId");
        jQuery.ajax({
            url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?projectId=" + pId + "&fileId=" + fileId,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSource").innerHTML = tData.SourceData;
                    $("#ViewSourceInputBody").show();
                    $("#viewSourceDialog").modal("show");

                    // Log this action...
                    var audit = {
                        postData: {
                            OptionUsed: "Object Details from Inventory",
                            PrimaryScreen: "Object Details from Inventory",
                            UserId: userId,
                            ProjectId: pId,
                            BriefDescription: "Inventory Object: <b>" + tData.FileMaster.FileName + "</ b>"
                        }
                    };
                    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
                        console.log(e);
                    });
                }
            }
        });
    }
}

function exportGrid(tableName) {
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);
    var rows = gridObj.model.dataSource;
    var tblData = $("#tblData");
    tblData.html("");
    var tableHeaders = [];
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        tableHeaders.push(headerDetails.HeadersText[k]);
    }
    var htmlTable = {
        Rows: [],
        Headers: tableHeaders
    };
    for (var i = 0; i < rows.length; i++) {
        var row = [];
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var fieldName = rows[i][field];
            row.push(fieldName);
        }
        htmlTable.Rows.push({ RowCells: row });
    }
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "FileObjectMethodReference/ExportToExcelFromData",
        data: { TableHeaders: htmlTable.Headers, HtmlTableRows: htmlTable.Rows },
        success: function (path) {
            var element = document.createElement('a');
            element.href = path;
            element.target = "_blank";
            window.open(path, "_self");
            $body.removeClass("loading");
        },
        error: function () {
            $body.removeClass("loading");
        }
    });
}