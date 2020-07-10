
var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("yes");
var projectId = getParameterByName("prjId");
var userId = window.localStorage.getItem("userId");
//var projectIdList = window.localStorage.getItem("projectIds");
$.fn.getUserProjectDetails(projectId);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var LayoutDirection = MindFusion.Graphs.LayoutDirection;
var FractalLayout = MindFusion.Graphs.FractalLayout;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var diagram = null;
var treeviewObj;
var decision1In3Out, apat2;
var strWorkflowFor = "";

var clickedDefineFunction = "";

//$body = $("body");
//$(document).on({
//    ajaxStart: function () { $body.addClass("loading"); },
//    ajaxStop: function () { $body.removeClass("loading"); },
//    ajaxError: function () { $body.removeClass("loading"); }
//});


function openUrl() {
    window.open("http://regexr.com/");
}

var nodesCount = 0;
$(document).ready(function () {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "FileObjectReference/GetNodesCount",
        success: function (nodecount) {
            if (nodecount != null) {
                nodesCount = nodecount;
            }
        }
    });

    function removeHighlighting(highlightedElements) {
        highlightedElements.each(function () {
            var element = $(this);
            element.replaceWith(element.html());
        });
    }

    function addHighlighting(element, textToHighlight) {
        var text = element.text().trim();
        var newText = highlightWords(text, textToHighlight);
        element.html(newText);
    }

    function highlightWords(line, word) {
        var regex = new RegExp("(" + word + ")", "gi");
        return line.replace(regex, "<em>$1</em>");
    }

    $("#txtSearch").on("keyup", function () {
        var value = $(this).val();
        if (value === "") return;
        removeHighlighting($("treeExpandedSecondTab div em"));
        var secondTab = $("#treeExpandedSecondTab span");
        var allBoldSpans = secondTab.find("span");
        allBoldSpans.each(function (i) {
            var row = $(this);
            addHighlighting(row, value);
        });
        $("#txtFirstSearch").val(value);
    });

    $("#txtFirstSearch").on("keyup", function () {
        var value = $(this).val();
        if (value === "") return;
        removeHighlighting($("jqTreeFirstTab div em"));
        var secondTab = $("#jqTreeFirstTab span");
        var allBoldSpans = secondTab.find("span");
        allBoldSpans.each(function (i) {
            var row = $(this);
            addHighlighting(row, value);
        });
        $("#txtSearch").val(value);
    });
});

var observer = new MutationObserver(function () {
    $("#txtSearch").keyup();
});

var mutationObserver = new MutationObserver(function () {
    $("#txtFirstSearch").keyup();
});

$(document).ready(function () {
    window.localStorage.setItem("projectId", projectId);
    $("#li_1").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Complete View of the Workflow');
    }, function () {
        $(this).css('cursor', 'auto');
    });
    $("#li_2").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'External and Internal View of the Workflow(flat view)');
    }, function () {
        $(this).css('cursor', 'auto');
    });
    $("#li_4").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Decision Chart');
    }, function () {
        $(this).css('cursor', 'auto');
    });
});

$(document).ready(function () {
    $("#rteStatementsNote").ejRTE({ width: "100%", isResponsive: true });
});

$(document).ready(function () {
    var checkedRows = window.localStorage.getItem("selectedRows");
    var rowData = JSON.parse(checkedRows);
    var table = $("#tblSelectedRows");
    table.html('');
    if (rowData !== null) {
        $.each(rowData,
            function (i, row) {
                drawRowStmt((i + 1), table, row);
            });
    }

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
        if ($("#ddlCatalogs").val() === "0") {
            $("#tdError12")[0].innerHTML = "Please select catalog";
            $("#ddlCatalogs").focus();
            return false;
        }
        if ($("#txtRuleName").val() === "") {
            $("#tdError12")[0].innerHTML = "Please enter Business name";
            $("#txtRuleName").focus();
            return false;
        }
        createRuleForSelectedStatements();
        return false;
    });
});

function getTodaysDate() {
    var fullDate = new Date();
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
    var twoDigitDate = fullDate.getDate() + "";
    if (twoDigitDate.length === 1)
        twoDigitDate = "0" + twoDigitDate;

    return twoDigitMonth + "/" + twoDigitDate + "/" + fullDate.getFullYear();
}

function createRuleForSelectedStatements() {
    var ruleSummaryAndAssociations = [];
    var statementRuleReference = [];
    var rteHtml = $("#rteStatementsNote").ejRTE("getHtml");
    var actionWorkflowId = getParameterByName("aId");
    statementRuleReference.push({
        StatementIdFrom: document.getElementById("hdnstatementId").value,
        StatementIdTo: document.getElementById("hdnstatementId").value,
        StatementNotes: rteHtml,
        CreatedOn: getTodaysDate(),
        CreatedBy: 1,
        ProjectId: projectId,
        ActionWorkflowId: actionWorkflowId
    });
    ruleSummaryAndAssociations.push({
        RuleCatalogId: $("#ddlCatalogs").val(),
        RuleName: $("#txtRuleName").val(),
        RuleSummary: $("#txtRuleDescription").val(),
        CreatedOn: getTodaysDate(),
        CreatedBy: 1,
        ProjectId: projectId,
        StatementRuleReference: statementRuleReference,
        ActionWorkflowId: actionWorkflowId
    });
    var startMethodId = getParameterByName('stmtId');
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "StatementRule/AddStatementRules?startMethodId=" + startMethodId + "&projectId=" + projectId,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(ruleSummaryAndAssociations[0]),
        success: function (result) {
            if (result !== null) {
                document.getElementById("tdError12").innerHTML = "Business Function created for selected statements";
                document.getElementById("tdError12").style.color = "green";
                $("#txtRuleName")[0].value = "";
                $("#txtRuleDescription")[0].value = "";
                $("#ddlCatalogs").val("0");
                $("#btnSubmitRule").attr("disabled", "disabled");
                $("#" + clickedDefineFunction).html('');
                $("#" + clickedDefineFunction).css('background-color', '#800000');
                return false;
            }
            return false;
        },
        statusCode: {
            400: function (response) {
                document.getElementById("tdError12").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError12").innerHTML = "User " + response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError12").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError12").innerHTML = "Error while connecting to API";
            return false;
        }
    });
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
        $("<tr id='tr_" + row.StatementId + "'><td style='background-color: #0000FF; width: 5px;'></td><td style='width: 12px; background-color: #f0f0f0;'></td>" +
            "<td bgcolor='#f0f0f0'><font color='blue'>" + id + "</font></td> <td width='8'></td>" +
            "<td>" + row.GraphName + "</td></tr>");
    table.append(trRow);
}

function showCatalogDialog() {
    document.getElementById("tdError").innerHTML = "";
    document.getElementById("txtCatalogName").value = "";
    $("#txtCatalogName").focus();
    $("#dvCatalog").modal("show");
}

function funDefineBusinessRule(parentId, statementId) {
    var actionWorkflowId = getParameterByName("aId");
    $("#btnSubmitRule").removeAttr("disabled", "");
    $("#txtRuleDescription").val("");
    $("#txtRuleName").val("");
    $("#dvRuleDetails")[0].innerHTML = "";
    document.getElementById("tdError12").innerHTML = "";
    var rows = [];
    $.get(baseAddress +
        "WorkspaceWorkflow/GetStatementsChildItemsUpdated" +
        "?parentStatementId=" + parentId,
        function (data) {
            if (data !== null) {
                for (var i = 0; i < data.length; i++) {
                    rows.push({
                        "StatementId": 0,
                        "GraphName": data[i]
                    });
                }
                var rowData = JSON.stringify(rows);
                window.localStorage.setItem("selectedRows", rowData);
                var table = $("#tblSelectedRows");
                table.html('');
                $.each(rows,
                    function (i, r) {
                        drawRowStmt((i + 1), table, r);
                    });
                document.getElementById("hdnstatementId").value = statementId;
                $("#dvCreateBusinessFunc").modal("show");
            }
        });
    $.get(baseAddress + "WorkspaceWorkflow/GetBusinessFunction?projectId=" + projectId + "&actionId=" + actionWorkflowId + "&statementId=" + statementId,
      function (data) {
          if (data !== null) {
              var ruleData = data[0];
              if (typeof ruleData !== "undefined" && ruleData !== null) {
                  // ReSharper disable once QualifiedExpressionMaybeNull
                  $("#txtRuleName").val(ruleData.RuleName);
                  $("#txtRuleDescription").val(ruleData.RuleSummary);
                  $("#dvRuleDetails")[0].innerHTML = "Business function name: " + ruleData.RuleName;
                  $("#dvRuleDetails")[0].style.color = "green";
                  $("#ddlCatalogs").val(ruleData.CatalogMaster.CatalogId);
              }
          }
      });
}

$("#btnRemoveBusinessFun").click(function () {
    if ($("#txtRuleName").val() === "") {
        $("#tdError12")[0].innerHTML = "Business function is not available";
        $("#txtRuleName").focus();
        return false;
    }
    RemoveBusinessFunction();
    return false;
});

function RemoveBusinessFunction() {
    var ruleSummaryAndAssociations = [];
    var statementRuleReference = [];
    var rteHtml = $("#rteStatementsNote").ejRTE("getHtml");
    var actionWorkflowId = getParameterByName("aId");
    statementRuleReference.push({
        StatementIdFrom: document.getElementById("hdnstatementId").value,
        StatementIdTo: document.getElementById("hdnstatementId").value,
        StatementNotes: rteHtml,
        CreatedOn: getTodaysDate(),
        CreatedBy: userId,
        ProjectId: projectId,
        //  IsDeleted :0,
        ActionWorkflowId: actionWorkflowId
    });
    ruleSummaryAndAssociations.push({
        RuleCatalogId: $("#ddlCatalogs").val(),
        RuleName: $("#txtRuleName").val(),
        RuleSummary: $("#txtRuleDescription").val(),
        CreatedOn: getTodaysDate(),
        CreatedBy: userId,
        ProjectId: projectId,
        IsDeleted: 1,
        StatementRuleReference: statementRuleReference,
        ActionWorkflowId: actionWorkflowId
    });

    var startMethodId = getParameterByName("stmtId");
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "StatementRule/RemoveBusinessFunction?startMethodId=" + startMethodId + "&projectId=" + projectId,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(ruleSummaryAndAssociations[0]),
        success: function (result) {
            if (result !== null) {
                document.getElementById("tdError12").innerHTML = "Business Function removed for selected statements";
                document.getElementById("tdError12").style.color = "green";
                $("#txtRuleName")[0].value = "";
                $("#txtRuleDescription")[0].value = "";
                $("#ddlCatalogs").val("0");
                $("#btnSubmitRule").attr("disabled", "disabled");
                $("#" + clickedDefineFunction).html('');
                $("#" + clickedDefineFunction).css('background-color', '#800000');
                return false;
            }
            return false;
        },
        statusCode: {
            400: function (response) {
                document.getElementById("tdError12").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError12").innerHTML = "User " + response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError12").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError12").innerHTML = "Error while connecting to API";
            return false;
        }
    });
}

$(document).ready(function () {
    diagram = $create(Diagram, null, null, null, window.$get("diagram"));
    diagram.addEventListener(Events.nodeCreated, onNodeCreated);
    diagram.setLinkHeadShapeSize(2);
    diagram.setRouteLinks(true);
    diagram.setRoundedLinks(true);
    diagram.setShowGrid(false);
});

$(document).ready(function () {
    var projectId = getParameterByName('prjId');
    window.localStorage.setItem("projectId", projectId);
    var prgmId = getParameterByName('prgmId');
    var tab = getParameterByName("tab");
    if (tab === "2") {
        $(('#li_2')).addClass('active');
        $(('#demo-tabs2-box-2')).addClass('tab-pane fade in active');
        $(('#demo-tabs2-box-1')).addClass('tab-pane fade in');
        secondTabClickEvent(projectId, prgmId);
    } else if (tab === "1") {
        $(('#li_1')).addClass('active');
        $(('#demo-tabs2-box-1')).addClass('tab-pane fade in active');
        $(('#demo-tabs2-box-2')).addClass('tab-pane fade in');
        firstTabClickEvent(projectId, prgmId);
    }
});

function firstTabClickEventTreeFormat(programId) {
    $.get(baseAddress + "StatementRule/GetDataForFirstTabTreeFormat?programId=" + programId,
        function (tData) {
            if (tData !== null) {
                var sourceFirstTab = tData[0].TreeViewListFirstTab;
                var firstTabSrc =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'GraphId', type: 'string' },
                        { name: 'ParentId', type: 'string' },
                        { name: 'GraphName', type: 'string' },
                        { name: "ActualStatementId", type: 'string' },
                        { name: "NodeId", type: "integer" }
                    ],
                    hierarchy:
                    {
                        keyDataField: { name: 'GraphId' },
                        parentDataField: { name: 'ParentId' }
                    },
                    id: 'GraphId',
                    localData: sourceFirstTab
                };
                var adp = new $.jqx.dataAdapter(firstTabSrc);

                $("#divFirstOld")[0].style.display = "inline";
                $("#divFirstNew")[0].style.display = "none";
                //$body.removeClass("loading");
                $("#firstTabOld")
                    .jqxTreeGrid(
                    {
                        width: "100%",
                        height: 850,
                        source: adp,
                        showHeader: false,
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ]
                    });
            }
        });
}

function loadTreeFormatData(projectId, stmtId) {
    $.get(baseAddress + "StatementRule/GetPseudoCodeDataTreeFormat?programId=" + stmtId,
        function (tData) {
            var secondTab = tData[0].TreeViewListSecondTab;
            var sourceSecondTab =
            {
                dataType: "json",
                dataFields: [
                    { name: 'GraphId', type: 'string' },
                    { name: 'ParentId', type: 'string' },
                    { name: 'GraphName', type: 'string' },
                    { name: "ActualStatementId", type: 'string' },
                    { name: "NodeId", type: "integer" },
                    { name: "StatementId", type: "interger" }
                ],
                hierarchy:
                {
                    keyDataField: { name: 'GraphId' },
                    parentDataField: { name: 'ParentId' }
                },
                id: 'GraphId',
                localData: secondTab
            };
            document.getElementById("divOld").style.display = "inline";
            document.getElementById("divPre").style.display = "none";
            var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
            $("#divSecTreeFormat").jqxTreeGrid(
                {
                    width: "100%",
                    height: 850,
                    source: dataAdapterSecondTab,
                    showHeader: false,
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ]
                });
        });
    $('#divSecTreeFormat').on('rowDoubleClick', function (event) {
        var args = event.args.row;
        var statementId = args.StatementId;
        var graphName = args.GraphName;
        annotateStatement(statementId, graphName);
    });
}

function showFilterDialog() {
    $("#filterDialog").modal("show");
}

$(document).ready(function () {
    var source = [
        {
            label: "If",
            value: "If"
        }, {
            label: "Declaration",
            value: "Declaration"
        }, {
            label: "Try",
            value: "Try"
        }
    ];
    $("#LstLeftSteps")
        .jqxListBox({
            multiple: true,
            source: source,
            displayMember: "label",
            valueMember: "value",
            width: 300,
            height: 300
        });
    $("#LstRightSteps")
        .jqxListBox({
            multiple: true,
            source: null,
            displayMember: "label",
            valueMember: "value",
            width: 300,
            height: 300
        });

    $("#BtnAddToRightOne")
        .click(function () {
            var item = $("#LstLeftSteps").jqxListBox('getSelectedItem');
            var item1 = $("#LstRightSteps").jqxListBox('getItemByValue', item.value);
            if (typeof item1 === "undefined" || item1 === null) {
                $("#LstRightSteps").jqxListBox('addItem', { label: item.label, value: item.value });
                $("#LstLeftSteps").jqxListBox('removeItem', item);
            }
        });

    $("#BtnAddToLeftOne")
        .click(function () {
            var item = $("#LstRightSteps").jqxListBox('getSelectedItem');
            var item1 = $("#LstLeftSteps").jqxListBox('getItemByValue', item.value);
            if (typeof item1 === "undefined" || item1 === null) {
                $("#LstLeftSteps").jqxListBox('addItem', { label: item.label, value: item.value });
                $("#LstRightSteps").jqxListBox('removeItem', item);
            }
        });

    $("#BtnAddToRightAll").click(function () {
        var items = $("#LstLeftSteps").jqxListBox('getItems');
        for (var i = 0; i < items.length; i++) {
            var item1 = $("#LstRightSteps").jqxListBox('getItemByValue', items[0].value);
            if (typeof item1 === "undefined" || item1 === null) {
                $("#LstRightSteps").jqxListBox('addItem', { label: items[0].label, value: items[0].value });
                $("#LstLeftSteps").jqxListBox('removeItem', items[0]);
            } else {
                $("#LstLeftSteps").jqxListBox('removeItem', items[0]);
            }
        }
    });

    $("#BtnAddToLeftAll").click(function () {
        var items = $("#LstRightSteps").jqxListBox('getItems');
        for (var i = 0; i < items.length; i++) {
            var item1 = $("#LstLeftSteps").jqxListBox('getItemByValue', items[0].value);
            if (typeof item1 === "undefined" || item1 === null) {
                $("#LstLeftSteps").jqxListBox('addItem', { label: items[0].label, value: items[0].value });
                $("#LstRightSteps").jqxListBox('removeItem', items[0]);
            } else {
                $("#LstRightSteps").jqxListBox('removeItem', items[0]);
            }
        }
    });

    $("#imgBusinessDescription").click(function () {
        $("#txtWorkFlowDesc")[0].value = $("#tfirstHeading")[0].innerHTML;
        $("#dvWorkflowDesc").modal("show");
    });

    $("#imgBusinessName").click(function () {
        $("#txtWorkflowBuiName")[0].value = $("#iWorkflowFor")[0].innerHTML;
        $("#editWorkflowBusinessName").modal("show");
    });

    $("#btnUpdateBuiName").click(function () {
        var workflowId = $("#iWorkflowFor")[0].title;
        var workflowName = $("#txtWorkflowBuiName")[0].value;
        if (workflowId !== "" && typeof workflowId !== 'undefined' && workflowId !== null) {
            $.get(baseAddress + "ActionWorkflowsReference/UpdateWorkflowName?workflowId=" + workflowId + "&workflowName=" + workflowName,
                function (bData) {
                    if (bData !== null) {
                        $("#iWorkflowFor")[0].innerHTML = bData.WorkflowBusinessName;
                        $("#iWorkflowFor")[0].title = bData.ActionWorkflowId;
                    }
                });
        }
        $("#editWorkflowBusinessName").modal("hide");
    });

    $("#btnSubmitWorkflowDesc").click(function () {
        var workflowId = $("#imgBusinessDescription")[0].alt;
        var workflowDesc = $("#txtWorkFlowDesc")[0].value;
        workflowId = workflowId.split('_')[1];
        if (workflowId !== "" && typeof workflowId !== 'undefined' && workflowId !== null) {
            $.get(baseAddress + "ActionWorkflowsReference/UpdateWorkflowDesc?workflowId=" + workflowId + "&workflowDesc=" +
                workflowDesc,
                function (bData) {
                    if (bData !== null) {
                        $("#tfirstHeading")[0].innerHTML = bData.WorkflowBusinessDescription;
                        $("#imgBusinessDescription")[0].alt = "img_" + bData.ActionWorkflowId;
                    }
                });
        }
        $("#dvWorkflowDesc").modal("hide");
    });

});

function onNodeCreated(sender, args) {
    var node = args.getNode();
    sender.removeItem(node);
}

function buildDiagram(lstNodes, lstLinks) {
    diagram = $create(Diagram, null, null, null, $get("diagram")); // Diagram.find("diagram");
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

function changeSecondTab(tab) {
    var ProjectId = getParameterByName("prjId");
    var prgmId = getParameterByName("prgmId");
    secondTabClickEvent(ProjectId, prgmId);
}

function changeFirstTab(tab) {
    var projectId = getParameterByName("prjId");
    var prgmId = getParameterByName("prgmId");
    var businessFun = document.getElementById("chkTreeFormatFirstTb");
    var parentBusiness = businessFun.parentElement;
    $(parentBusiness).prop("className", "form-checkbox form-icon form-text");
    var expondFun = document.getElementById("chkExpondFirst");
    var parentExpond = expondFun.parentElement;
    $(parentExpond).prop("className", "form-checkbox form-icon form-text");
    $('#divExpandFirstTab').hide();
    firstTabClickEvent(projectId, prgmId);

}

function ShowPopupDownloadProcF() {
    $('#dvWorkflowDiagramDownload').modal('show');
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline";
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden"; //Ashish Dhakate
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible"; //Ashish Dhakate
}

var flowchartObjectProcessFlowChart = null;

function downloadFile(path) {
    if (typeof path === "undefined") {
        displayMessage("Error occurred please try again!", "medium");
        return false;
    }
    var element = document.getElementById("a123456");
    element.href = path;
    element.target = "_blank";
    window.open(path, "_self");
    return true;
}

function projectWorkspace() {
    location.href = "projects_workspace.html?pid=" + projectId;

}

function loadFirstTabData(projectId, stmtId) {
    window.localStorage.setItem("firstTabDataNodes", "");
    $.get(baseAddress + "StatementRule/GetDataForFirstTab?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            if (tData !== null) {
                var source = tData[0].TreeViewListFirstTab;
                var actionWorkflow = tData[0].ActionWorkflows;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    $("#iTechnicalName")[0].innerHTML = oriEventMethod.toUpperCase();
                    $("#txtRename")[0].value = originEventMethod + " ";
                    $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    $("#iTechnicalName")[0].innerHTML = oriEventMethod.toUpperCase();
                    $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                    $("#txtRename")[0].value = workflowBusinessName + " ";
                }
                $("#imgBusinessName")[0].alt = "img_" + actionWorkflow.ActionWorkflowId;
                if (bDesc === "" || bDesc === null) {
                    $("#iWorkflowFor")[0].innerHTML = b;
                    $("#txtDescription")[0].value = b;
                    strWorkflowFor = b;
                    $("#tfirstHeading")[0].innerHTML = b;
                } else {
                    $("#iWorkflowFor")[0].innerHTML = bDesc;
                    $("#txtDescription")[0].value = bDesc;
                    strWorkflowFor = bDesc;
                    $("#tfirstHeading")[0].innerHTML = bDesc + " ";
                }
                $("#imgBusinessDescription")[0].alt = "img_" + actionWorkflow.ActionWorkflowId;
                document.getElementById("hdnActionWorkflowId").value = actionWorkflow.ActionWorkflowId;
                var sourceNew =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'GraphId', type: 'string' },
                        { name: 'ParentId', type: 'string' },
                        { name: 'GraphName', type: 'string' },
                        { name: "ActualStatementId", type: 'string' },
                        { name: "NodeId", type: "integer" }
                    ],
                    id: 'GraphId',
                    localData: source
                };
                //var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                $("#divFirstOld")[0].style.display = "none";
                $("#divFirstNew")[0].style.display = "inline";
                $("#jqTreeFirstTab").jqxGrid(
                {
                    width: "100%",
                    height: 850,
                    source: sourceNew,
                    showheader: false,
                    scrollmode: 'logical',
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ],
                    ready: function () {
                        var target = document.getElementById('jqxScrollThumbverticalScrollBarjqTreeFirstTab');
                        mutationObserver.observe(target, { attributes: true, attributeFilter: ['style'] });
                    }
                });
                if (source.length <= 15000) {
                    window.localStorage.setItem("firstTabDataNodes", JSON.stringify(source));
                }
               // $body.removeClass("loading");
            }
        });
}

var currentStatementId = 0;
var languageId = 0;
var baseCommandId = 0;
var WorkflowStartStatementid = 0;
var CheckDataRegex = 0;
var strOriginalStatement = "";

$(document).ready(function () {
    $('#fourDataTabs a[href="#demo-tabs2-box-4"]').click(function () {
        chkDecisionMatrix();
    });
});

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{5}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function showHideOther(rowId, statementId) {
    document.getElementById("hdnStatementIdDicision").value = statementId;
    for (var i = 0; i < 5000; i++) {
        var tr = document.getElementById("allStmts_" + i);
        var row = document.getElementById("tr_" + i);
        var action = document.getElementById("allActions_" + i);
        var actionElse = document.getElementById("allActionsElse_" + i);
        if (tr !== null && typeof tr !== 'undefined') {
            if (i === rowId) {
                tr.style.display = "inline";
                row.style.backgroundColor = "#f4b084";
                action.style.display = "inline";
                actionElse.style.display = "inline";
            } else {
                tr.style.display = "none";
                action.style.display = "none";
                actionElse.style.display = "none";
                row.style.backgroundColor = "#ffffff";
            }
        }
    }
}
function changeBg(parameters) {
    var currentRowId = $(parameters)[0].id;
    var tbl = $(parameters).closest('table');
    tbl.find('tr').each(function () {
        var rowId = $(this)[0].id;
        if (currentRowId === rowId) {
            $(this).css("background-color", "#f4b084");
        } else {
            $(this).css("background-color", "");
        }

    });
}

function PseudoCodeDialog(statementId) {
    document.getElementById("tdError1").innerHTML = "";
    //$("#lblSlectedStmt").text("");
    document.getElementById('txtRegexDesc').value = "";
    document.getElementById('txtAlternateRepre').value = "";
    currentStatementId = statementId;
    $.ajaxSetup({
        async: false
    });
    jQuery.ajax({
        url: baseAddress + "PostProcess/PseudoCodeGetStatement?statementID=" + statementId,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#lblSlectedStmt").text(data.Table[0].OriginalStatement);
            languageId = data.Table[0].LanguageId;
            baseCommandId = data.Table[0].BaseCommandId;
            WorkflowStartStatementid = data.Table[0].WorkflowStartStatementId;
            strOriginalStatement = data.Table[0].OriginalStatement;
            ExistPsuedoCodeAssignment();
        },
        error: function (x) {
            document.getElementById("tdError1").innerHTML = "Error";
            document.getElementById("tdError1").style.color = "red";
        }
    });
    $("#PseudoCodeDialog").modal("show");
}

function PseudoCodeAssignment() {
    var statementId = currentStatementId;
    var strRegexStmt = $("#txtRegexDesc").val();
    var strAlternateRepre = document.getElementById('txtAlternateRepre').value;

    if (strRegexStmt.trim().length > 0 && strAlternateRepre.trim().length > 0) {
        jQuery.ajax({
            url: baseAddress + "PostProcess/PseudoCodeForSelectedStatement",
            data: {
                statementID: statementId,
                strRegexStmt: strRegexStmt,
                strAlternateRepre: strAlternateRepre,
                languageId: languageId,
                baseCommandId: baseCommandId,
                projectId: projectId,
                WorkflowStartStatementid: WorkflowStartStatementid
            },
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == "0") {
                    var result = ExistPsuedoCodeAssignment();
                } else {
                    $('#loading-indicator').hide();
                    document.getElementById("tdError1").innerHTML = "Pseudo code apply Successfully";
                    document.getElementById("tdError1").style.color = "green";
                }
            },
            error: function (x) {
                document.getElementById("tdError1").innerHTML = "Error";
                document.getElementById("tdError1").style.color = "red";
            }
        });
    } else {
        document.getElementById("tdError1").innerHTML = "Please enter the Regex and Alternate Representation";
        document.getElementById("tdError1").style.color = "red";
    }

}

function ExistPsuedoCodeAssignment() {
    jQuery.ajax({
        url: baseAddress + "PostProcess/GetExistingPsuedoCode",
        data: {
            baseCommandId: baseCommandId,
            languageId: languageId,
            strOriginalStatement: strOriginalStatement
        },
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != null) {
                if (data.Table.length > 0) {
                    CheckDataRegex = 1;
                    document.getElementById('txtRegexDesc').value = data.Table[0].RegexPattern;
                    document.getElementById('txtAlternateRepre').value = data.Table[0].AlternateCodeRepresentation;
                }
            }
        },
        error: function (x) {
            CheckDataRegex = 0;
            document.getElementById("tdError1").innerHTML = "Error";
            document.getElementById("tdError1").style.color = "red";
        }
    });
}

var FilepathToexportDicision = '';

function showDecisionTableDialogNotParse() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    $.ajaxSetup({
        async: false
    });
    $.get(baseAddress + "General/GetDecisionTableData?iStatementId=" + stmtId + "&iProjectId=" + projectId,
        function (tData) {
            var source =
            {
                localdata: tData.Table1[0].StringName,
                FilePathToexportTemp: tData.Table1[0].FilePath
            };
            $("#lblDicisionTable")[0].innerHTML = source.localdata;
            FilepathToexportDicision = source.FilePathToexportTemp;
        });

    $("#tDecisionHeading")[0].innerHTML = strWorkflowFor;
    $("#decisionTableDialog").modal("show");
}

function showDecisionTableDialog() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
   //  $body.addClass("loading");
    $.get(baseAddress + "General/GetDecisionTableDataParse?iStatementId=" + stmtId + "&iProjectId=" + projectId,
        function (tData) {
            if (tData == null) {
                showDecisionTableDialogNotParse();
            } else {
                var source =
                {
                    localdata: tData
                };
                $("#lblDicisionTable")[0].innerHTML = source.localdata;
               // $body.removeClass("loading");
                $("#decisionTableDialog").modal("show");
            }
        });
    $("#tDecisionHeading")[0].innerHTML = strWorkflowFor;
}

function downloadDecision() {
    var fileNameToExport = FilepathToexportDicision;
    jQuery.ajax({
        url: baseAddress + "General/ConvertXmlToDataTable",
        type: 'GET',
        data: { "FileNameToExport": fileNameToExport },
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            downloadFile(data);
        }
    });
}

$('#btnPdfDecision').click(function () {
    var pdfToExport = $("#lblDicisionTable")[0].innerHTML;
    $.ajaxSetup({
        async: false
    });

    jQuery.ajax({
        url: baseAddress + "General/GenerateDecisionPDF",
        type: 'GET',
        data: { "strHtml": pdfToExport },
        contentType: "application/json;charset=utf-8",
        success: function (data) {

        }
    });
});

$(document).ready(function () {
    var prgmId = getParameterByName('prgmId');

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectDiscoveredCharacteristics?projectId=" + projectId + "&stmtId=" + 0 + "&programId=" + prgmId + "",
        success: function (entryPoints) {
            if (entryPoints != null) {
                if (entryPoints.length > 0) {
                    $("#lblTotalStatement")[0].innerHTML = entryPoints[0].LoopCount;
                    $("#lblDecisionPoint")[0].innerHTML = entryPoints[0].DecisionCount;
                    $("#lblExternalCall")[0].innerHTML = entryPoints[0].ExtrernalCalls;
                    $("#lblInternalCall")[0].innerHTML = entryPoints[0].InternalCalls;
                    var languageId = entryPoints[0].LaunguageId;
                    getTagNameData(projectId, prgmId);
                    loadProjectAssociationData(projectId, 0, prgmId, languageId);
                    loadProjectDataDependency(projectId, prgmId);
                }
            }
        }
    });
});

function getProgramsSecondTabDetails(projectId, programId, business, pseudo) {

    $.get(baseAddress + "StatementRule/GetSecondTabProgramTree?programId=" + programId + "" +
        "&business=" + business + "&pseudo=" + pseudo + "&userId=" + userId,
        function (tData) {
            if (tData !== null) {
                var secondTab = tData[0].TreeViewListSecondTab;
                var sourceSecondTab =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'GraphId', type: 'string' },
                        { name: 'ParentId', type: 'string' },
                        { name: 'GraphName', type: 'string' },
                        { name: "ActualStatementId", type: 'string' },
                        { name: "NodeId", type: "integer" },
                        { name: "StatementId", type: "StatementId" },
                        { name: "BaseCommandId", type: "interger" },
                        { name: "GlobalParentId", type: "string" }
                    ],
                    id: 'GraphId',
                    localData: secondTab
                };
                document.getElementById("divOld").style.display = "none";
                document.getElementById("divPre").style.display = "inline";

                $("#treeExpandedSecondTab").jqxGrid(
                {
                    width: "98%",
                    height: "498px",
                    showheader: false,
                    source: sourceSecondTab,
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ]
                });
            }
            $('#treeExpandedSecondTab').on('rowdoubleclick', function (event) {
                var args = event.args.row;
                var statementId = args.bounddata.StatementId;
                var graphName = args.bounddata.GraphName;
                annotateStatement(statementId, graphName);
            });
            $('#treeExpandedSecondTab').on('rowclick', function (event) {
                var args = event.args;
                var target = event.currentTarget.id;
                $(target).each(function (index, element) {
                    $(element).css("backgroundColor", "yellow");
                });
                event.preventDefault();
                var rowIndex = args.rowindex;
                var data = $('#treeExpandedSecondTab').jqxGrid('getrowdata', rowIndex);
                var graphId = data.GraphId;
                var rows = $('#treeExpandedSecondTab').jqxGrid('getrows');
                var groupRows = [];
                for (var i = 0; i < rows.length; i++) {
                    var currentRow = rows[i];
                    if (currentRow.ParentId === graphId)
                        groupRows.push(currentRow);
                }
                for (var j = 0; j < groupRows.length; j++) {
                    var c = groupRows[j];
                    $(c).attr("background-color", "red");
                }
            });
        });
    $('#treeExpandedSecondTab').on('rowclick', function (event) {
        event.preventDefault();
        var args = event.args.row.bounddata;
        var globalParentId = args.GlobalParentId;
        var divId = "div_" + args.GraphId;
        var gotDiv = false;
        $("#treeExpandedSecondTab").find("div").each(function (i, item) {
            if (item.id === divId && !gotDiv) {
                gotDiv = true;
                $(item).css("background-color", "#e0e5ec");
            } else {
                $(item).css("background-color", "");
            }
            if (gotDiv && item.lang === divId) {
                if (item.title === globalParentId)
                    $(item).css("background-color", "#e0e5ec");
                else
                    $(item).css("background-color", "");
            }
        });
        gotDiv = false;
    });
}

function loadProjectAssociationData(projectId, stmtId, programId, languageId) {
    $.get(baseAddress + "WorkspaceWorkflow/GetProjectAssociationAndPropertiesForProgram?projectId=" + projectId + "&stmtId=" + stmtId + "&prgmId=" + programId + "&languageId=" + languageId,
        function (tData) {
            var sourceNew =
            {
                dataType: "json",
                dataFields: [
                    { name: 'GraphId', type: 'string' },
                    { name: 'ParentId', type: 'string' },
                    { name: 'GraphName', type: 'string' },
                    //{ name: "ActualStatementId", type: 'string' },
                    { name: "NodeId", type: "integer" }
                ],
                hierarchy:
                {
                    keyDataField: { name: 'GraphId' },
                    parentDataField: { name: 'ParentId' }
                },
                id: 'GraphId',
                localData: tData
            };

            var dataAdapter = new $.jqx.dataAdapter(sourceNew);
            $("#treeAssociationsTab")
                .jqxTreeGrid(
                {
                    width: "100%",
                    height: 220,
                    source: dataAdapter,
                    altRows: true,
                    showHeader: false,
                    sortable: true,
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ]
                });
            $("#treeAssociationsTab").on('cellEndEdit', function (event) {
                var args = event.args;
                var rowKey = args.key;
                var rowData = args.row;
                var columnDataField = args.dataField;
                var columnDisplayField = args.displayField;
                var value = args.value;
                if (rowData.ParentId == "3") {
                    updateAssociationData(projectId, stmtId, value, 0);
                } else if (rowData.ParentId == "4") {
                    updateAssociationData(projectId, stmtId, value, 1);
                }

            });

        });
}

function firstTabClickEvent(projectId, prgmId) {
    $("#divFirstOld")[0].style.display = "none";
    $("#divFirstNew")[0].style.display = "inline";
    getProgramsFirstTabDetails(projectId, prgmId);
}
function getProgramsFirstTabDetails(projectId, programId) {

    $.get(baseAddress + "StatementRule/GetFirstTabProgramTree?programId=" + programId,
        function (tData) {
            var secondTab = tData[0].TreeViewListFirstTab;
            var sourceSecondTab =
            {
                dataType: "json",
                dataFields: [
                    { name: 'GraphId', type: 'string' },
                    { name: 'ParentId', type: 'string' },
                    { name: 'GraphName', type: 'string' },
                    { name: "ActualStatementId", type: 'string' },
                    { name: "NodeId", type: "integer" }
                ],
                id: 'GraphId',
                localData: secondTab
            };
            $("#jqTreeFirstTab").jqxGrid(
                {
                    width: "98%",
                    showheader: false,
                    height: "498px",
                    source: sourceSecondTab,
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ]
                });

        });
}

function secondTabClickEvent(projectId, prgmId) {

    getProgramsSecondTabDetails(projectId, prgmId, true, true);
    var businessFun = document.getElementById("chkBusinessFunction");
    var parentBusiness = businessFun.parentElement;
    $(parentBusiness).prop("className", "form-checkbox form-icon form-text active");

    var pseudoFun = document.getElementById("chkPseudoCodeFunction");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");

    var treeFun = document.getElementById("chkTreeFormat");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text");
    $('#divExpand').hide();
    return true;
}

function updateAssociationData(projectId, stmtId, renameData, flag) {
    $.get(baseAddress + "WorkspaceWorkflow/updateProjectAssociationAndProperties?projectId=" + projectId + "&stmtId=" + stmtId + "&renameData=" + renameData + "&flag=" + flag,
        function (tData) {
            var result = tData;
            getBusinessNameAndDescription();
        });
}

function addTagName(projectId, programId, tagName) {
    var stmtId = getParameterByName('stmtId');
    var pId = getParameterByName("prjId");
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkspaceWorkflow/addTags?projectId=" + pId + "&stmtId=" + stmtId + "&tagName=" + tagName,
        success: function (result) {
            if (result !== null) {
                var aaa = result;
            }
        }
    });

}

function updateTagName(projectId, programId, tagName, flag) {
    var stmtId = getParameterByName('stmtId');
    var pId = getParameterByName("prjId");
    $.get(baseAddress + "WorkspaceWorkflow/updateTags?projectId=" + pId + "&stmtId=" + stmtId + "&tagName=" + tagName + "&flag=" + flag,
        function (tData) {
            var result = tData;
        });
}

function getTagNameData(projectId, programId) {
    var stmtId = getParameterByName('stmtId');
    var pId = getParameterByName("prjId");
    $.get(baseAddress + "WorkspaceWorkflow/getTagsData?projectId=" + pId + "&stmtId=" + stmtId,
        function (tData) {
            var tagNameResult = tData;
            var eventTags;
            var result;
            if (tagNameResult !== "") {

                var array = [];
                var strArray = tagNameResult.split(',');

                for (var i = 0; i < strArray.length; i++) {
                    array[i] = strArray[i];
                }

                $('#myTags').removeData();
                $('#myTags').html("");
                $('#myTags').empty();

                for (var j = 0; j < array.length; j++) {
                    if (array[j]) {
                        $('#myTags').append('<li>' + array[j] + '</li>');
                    }

                }
                eventTags = $('#myTags');
                eventTags.tagit({
                    availableTags: array,
                    allowSpaces: true,
                    caseSensitive: false,
                    removeConfirmation: true,
                    autocomplete: false,
                    afterTagAdded: function (evt, ui) {
                        if (!ui.duringInitialization) {
                            if (result === "") {
                                result = eventTags.tagit('tagLabel', ui.tag);
                                addTagName(projectId, stmtId, result);
                            } else {
                                jQuery.ajax({
                                    type: 'GET',
                                    url: baseAddress +
                                        "WorkspaceWorkflow/getTagsData?projectId=" +
                                        projectId +
                                        "&stmtId=" +
                                        stmtId,
                                    success: function (data) {
                                        tagNameResult = data;
                                        result = tagNameResult + "," + eventTags.tagit('tagLabel', ui.tag);
                                        updateTagName(projectId, stmtId, result, 0);
                                    }
                                });
                            }
                        }
                    },
                    afterTagRemoved: function (evt, ui) {
                        result = eventTags.tagit('tagLabel', ui.tag);
                        updateTagName(projectId, stmtId, result, 1);
                    }
                });

            } else {
                result = "";
                eventTags = $('#myTags');
                eventTags.tagit({
                    afterTagAdded: function (evt, ui) {
                        if (!ui.duringInitialization) {
                            if (result === "") {
                                result = eventTags.tagit('tagLabel', ui.tag);
                                addTagName(projectId, stmtId, result);
                            } else {
                                result = result + "," + eventTags.tagit('tagLabel', ui.tag);
                                updateTagName(projectId, stmtId, result, 0);
                            }
                        }
                    }
                });
            }
        });
}

function updateBusinessNameAndDescription(flag) {
    var valueRename = $("#txtRename").val();
    var valueDecsription = $("#txtDescription").val();
    var workflowId = document.getElementById("hdnActionWorkflowId").value;
    if (flag === 0) {
        if (workflowId !== "" && typeof workflowId !== 'undefined' && workflowId !== null) {
            $.get(baseAddress +
                "ActionWorkflowsReference/UpdateWorkflowName?workflowId=" +
                workflowId +
                "&workflowName=" +
                valueRename,
                function (bData) {
                    if (bData !== null && typeof bData !== 'undefined') {
                        $("#iWorkflowFor")[0].title = bData.ActionWorkflowId;
                        var workflowBusinessName = bData.WorkflowBusinessName === null ? "" : bData.WorkflowBusinessName;
                        var oriEventMethod;
                        if (workflowBusinessName === "") {
                            oriEventMethod = bData.originEventMethod;
                            $("#iTechnicalName")[0].innerHTML = oriEventMethod.toUpperCase();
                        } else {
                            oriEventMethod = workflowBusinessName + " - " + bData.originEventMethod;
                            $("#iTechnicalName")[0].innerHTML = oriEventMethod.toUpperCase();
                        }
                        $("#txtRename")[0].value = bData.WorkflowBusinessName;
                    }
                });
        }
    } else {
        if (workflowId !== "" && typeof workflowId !== 'undefined' && workflowId !== null) {
            $.get(baseAddress + "ActionWorkflowsReference/UpdateWorkflowDesc?workflowId=" + workflowId + "&workflowDesc=" +
                valueDecsription,
                function (bData) {
                    if (bData !== null) {
                        $("#tfirstHeading")[0].innerHTML = bData.WorkflowBusinessDescription;
                        $("#imgBusinessDescription")[0].alt = "img_" + bData.ActionWorkflowId;
                        $("#txtDescription")[0].value = bData.WorkflowBusinessDescription;
                        $("#txtWorkflowBuiName")[0].value = bData.WorkflowBusinessDescription;
                        $("#iWorkflowFor")[0].innerHTML = bData.WorkflowBusinessDescription;
                    }
                });
        }
    }
}

function getBusinessNameAndDescription() {
    var stmtId = getParameterByName('stId');
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectAssociationAndProperties?projectId=" + projectId + "&stmtId=" + stmtId + "",
        success: function (entryPoints) {
            if (entryPoints != null) {
                if (entryPoints.length > 0) {
                    var array = entryPoints.split('@');
                    if (array.length > 1) {
                        $("#txtRename").val(array[0]);
                        $("#txtDescription").val(array[1]);
                    } else {
                        $("#txtRename").val(entryPoints.replace('@', ''));
                    }
                }
            }
        }
    });
}

function loadProjectDataDependency(projectId, prgmId) {
    $.get(baseAddress + "WorkspaceWorkflow/GetDataDependency?programId=" + prgmId,
        function (tData) {
            if (tData.length === 0) {
                document.getElementById("treeDataDependency").style.visibility = "hidden";
                document.getElementById("treeDataDependency").style.display = "none";

                document.getElementById("treeDataDependency1").style.visibility = "visible";
                document.getElementById("treeDataDependency1").style.display = "inline";
            } else {

                document.getElementById("treeDataDependency1").style.visibility = "hidden";
                document.getElementById("treeDataDependency1").style.display = "none";
                var sourceNew =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'GraphId', type: 'string' },
                        { name: 'ParentId', type: 'string' },
                        { name: 'GraphName', type: 'string' },
                        { name: "NodeId", type: "integer" }
                    ],
                    hierarchy:
                    {
                        keyDataField: { name: 'GraphId' },
                        parentDataField: { name: 'ParentId' }
                    },
                    id: 'GraphId',
                    localData: tData
                };

                var dataAdapter = new $.jqx.dataAdapter(sourceNew);

                $("#treeDataDependency")
                    .jqxTreeGrid(
                    {
                        width: "100%",
                        height: 150,
                        source: dataAdapter,
                        altRows: true,
                        showHeader: false,
                        sortable: true,
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ]
                    });
            }
        });
}

function viewSourceDialog(projectId, fileId) {
    $('#ViewSourceInputBody').hide();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId,
        success: function (projectDetails) {
            if (projectDetails != null) {
                if (projectDetails[0].LanguageMaster.LanguageId === 6) {
                    document.getElementById('li2').innerHTML.style.display = "none";
                }
            }
        }
    });
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
                $("#ViewSourceInputModal_SearchHitCount").text(hitHighlighter.hitCount + (hitHighlighter.hitCount === 1 ? " match" : " matches"));
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
                    
                    document.getElementById("treeViewSource").innerHTML = tData;
                    $('#ViewSourceInputBody').show();
                    $("#viewSourceDialog").modal("show");
                }
            }
        });
    }
}

function includeStateDialog(fileId) {

    var projectId = 0;
    $('#ViewSourceInputBody').hide();
    $(('#li1')).addClass('active');
    $(('#li2')).removeClass('active');
    $(('#tabSourceCodPopup')).addClass('tab-pane fade in active');
    $(('#tabPseudoCodePopup')).addClass('tab-pane fade in');
    $('#tabSourceCodPopup').show();
    $('#tabPseudoCodePopup').hide();
    document.getElementById("subRoutineprogramId").value = fileId;
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
                    document.getElementById("treeViewSource").innerHTML = tData;
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
    var openLeft = false;
    var openRight = false;
    var hitCount = 0;
    var currHitIdx = 0;

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

function exportWordDocument() {
    var prjId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ExportWordDocument/CreateWordDocumentFile?projectId=" + prjId + "&statmentId=" + stmtId,
        success: function (result) {
            downloadFile(result);
        }
    });
}

$("#btnDecisionExport").click(function () {
    var statementId = getParameterByName("stId"); //document.getElementById("hdnStatementIdDicision").value;
    var prjId = getParameterByName("prjId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/ExportDicisionTbl?projectId=" + prjId + "&statementId=" + statementId,
        success: function (result) {
            downloadFile(result);
        }
    });
});

function checkboxUnCheckTreeView() {
    document.getElementById("chkBusinessFunction").checked = false;
    document.getElementById("chkPseudoCodeFunction").checked = false;
    var treeFun = document.getElementById("chkTreeFormat");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text active");

    var pseudoFun = document.getElementById("chkPseudoCodeFunction");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text");
    //$(parentPseudo).click();
    var businessFun = document.getElementById("chkBusinessFunction");
    var parentBusiness = businessFun.parentElement;
    $(parentBusiness).prop("className", "form-checkbox form-icon form-text");

    //$(parentBusiness).click();
}

function callChkbusinessFormat() {
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    var treeFun = document.getElementById("chkTreeFormat");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text");
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkPseudo = document.getElementById("chkPseudoCodeFunction").checked;
    if (chkBusiness === true && chkPseudo === true) {
        getProgramsSecondTabDetails(projectId, prgmId, true, true);
    }
    else if (chkBusiness === false && chkPseudo === false) {
        getProgramsSecondTabDetails(projectId, prgmId, false, false);
    }
    else if (chkBusiness === true && chkPseudo === false) {
        getProgramsSecondTabDetails(projectId, prgmId, true, false);
    }
    else if (chkBusiness === false && chkPseudo === true) {
        getProgramsSecondTabDetails(projectId, prgmId, false, true);
    }
}

function callChkPseudoFormat() {
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    var treeFun = document.getElementById("chkTreeFormat");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text");

    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkPseudo = document.getElementById("chkPseudoCodeFunction").checked;
    if (chkBusiness === true && chkPseudo === true) {
        getProgramsSecondTabDetails(projectId, prgmId, true, true);
    }
    else if (chkBusiness === false && chkPseudo === false) {
        getProgramsSecondTabDetails(projectId, prgmId, false, false);
    }
    else if (chkBusiness === true && chkPseudo === false) {
        getProgramsSecondTabDetails(projectId, prgmId, true, false);
    }
    else if (chkBusiness === false && chkPseudo === true) {
        getProgramsSecondTabDetails(projectId, prgmId, false, true);
    }
}

function callChkTreeFormat() {
    $('#divExpand').hide();
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    if (document.getElementById("chkTreeFormat").checked === true) {
        checkboxUnCheckTreeView();
        $('#divExpand').show();
        loadTreeFormatData(projectId, prgmId);
        return;
    }
    else if (chkBusiness === true && chkpseudo === true) {
        $('#divExpand').hide();
        getProgramsSecondTabDetails(projectId, prgmId, true, true);

    } else {
        $('#divExpand').hide();
        getProgramsSecondTabDetails(projectId, prgmId, false, false);
    }
    var pseudoFun = document.getElementById("chkExpandAll");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text");
    firstTabClickEvent(projectId, prgmId);
}
function expandAllTreeView() {
    if (document.getElementById("chkExpandAll").checked === true) {
        var grid = $("#divSecTreeFormat");
        grid.jqxTreeGrid("expandAll");
        
    } else {
        $("#divSecTreeFormat").jqxTreeGrid('collapseAll');
    }
}

function expandAllTreeViewFirst() {
    if (document.getElementById("chkExpondFirst").checked === true) {
        var grid = $("#firstTabOld");
        grid.jqxTreeGrid("expandAll");
    } else {
        $("#firstTabOld").jqxTreeGrid('collapseAll');
    }
}

function callTreeFormatFirstTab() {
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    if (document.getElementById("chkTreeFormatFirstTb").checked === true) {
        $('#divExpandFirstTab').show();
        firstTabClickEventTreeFormat(prgmId);
    } else {
        var pseudoFun = document.getElementById("chkExpondFirst");
        var parentPseudo = pseudoFun.parentElement;
        $(parentPseudo).prop("className", "form-checkbox form-icon form-text");
        $('#divExpandFirstTab').hide();
        firstTabClickEvent(projectId, prgmId);
    }
}

/* Popup subRoutine */
function changeFirstTabPopup() {
    var programId = document.getElementById("subRoutineprogramId").value;
    //var programId = 857;
    $('#tabSourceCodPopup').show();
    $('#tabPseudoCodePopup').hide();
    includeStateDialog(programId);
}

function changeSecondTabPopup() {
    $('#tabSourceCodPopup').hide();
    $('#tabPseudoCodePopup').show();

    var programId = document.getElementById("subRoutineprogramId").value;
    // var programId = 857;

    var pseudoFun = document.getElementById("chkPseudoCodeFunctionSubRoutine");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");
    $('#divExpandSubRoutine').hide();

    var treeFun = document.getElementById("chkTreeFormatSubRoutine");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text ");
    getPseudoCodeIndentedDataSubRoutinePopup(programId, true, true);
}

function getPseudoCodeIndentedDataSubRoutinePopup(programId, business, pseudo) {

    document.getElementById("divOldPopup").style.display = "none";
    document.getElementById("divPrePopup").style.display = "none";
    $.get(baseAddress + "StatementRule/GetSecondTabProgramTree?programId=" + programId + "" +
        "&business=" + business + "&pseudo=" + pseudo + "&userId=" + userId,
        function (tData) {
            if (tData !== null) {
                var secondTab = tData[0].TreeViewListSecondTab;

                var sourceSecondTab =
               {
                   dataType: "json",
                   dataFields: [
                       { name: 'GraphId', type: 'string' },
                       { name: 'ParentId', type: 'string' },
                       { name: 'GraphName', type: 'string' },
                       { name: "ActualStatementId", type: 'string' },
                       { name: "NodeId", type: "integer" }
                   ],
                   id: 'GraphId',
                   localData: secondTab
               };

                document.getElementById("divOldPopup").style.display = "none";
                document.getElementById("divPrePopup").style.display = "inline";
                $("#treeExpandedSecondTabPopup").jqxGrid(
                {
                    width: "100%",
                    height: 400,
                    showheader: false,
                    source: sourceSecondTab,
                    scrollmode: 'logical',
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ],
                    ready: function () {
                        var target = document.getElementById('jqxScrollThumbverticalScrollBartreeExpandedSecondTab');
                        observer.observe(target, { attributes: true, attributeFilter: ['style'] });
                    }
                });
            }
        });
}

function callChkPseudoFormatSubRoutine() {
    var chkPseudo = document.getElementById("chkPseudoCodeFunctionSubRoutine").checked;
    var programId = document.getElementById("subRoutineprogramId").value;
    //var programId = 857;
    if (chkPseudo === true) {
        var treeFun = document.getElementById("chkTreeFormatSubRoutine");
        var parentTree = treeFun.parentElement;
        $(parentTree).prop("className", "form-checkbox form-icon form-text");
        $('#divExpandSubRoutine').hide();
        getPseudoCodeIndentedDataSubRoutinePopup(programId, true, true);
      
    } else {
        getPseudoCodeIndentedDataSubRoutinePopup(programId, false, false);
    }
}

function callChkTreeFormatSubRoutine() {
    var chkTree = document.getElementById("chkTreeFormatSubRoutine").checked;
    var programId = document.getElementById("subRoutineprogramId").value;
    if (chkTree === true) {
        var treeFun = document.getElementById("chkPseudoCodeFunctionSubRoutine");
        var parentTree = treeFun.parentElement;
        $(parentTree).prop("className", "form-checkbox form-icon form-text");
        var expandFun = document.getElementById("chkExpandAllSubRoutine");
        var parentExpand = expandFun.parentElement;
        $(parentExpand).prop("className", "form-checkbox form-icon form-text");
        $('#divExpandSubRoutine').show();
        loadTreeFormatDatasubRoutine(programId);
    }
    if (chkTree === false) {
        var pseudoFun = document.getElementById("chkPseudoCodeFunctionSubRoutine");
        var parentPseudo = pseudoFun.parentElement;
        $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");
        $('#divExpandSubRoutine').hide();
        getPseudoCodeIndentedDataSubRoutinePopup(programId, true, true);
    }
}

function expandAllTreeViewSubRoutine() {
    if (document.getElementById("chkExpandAllSubRoutine").checked === true) {
        var grid = $("#divSecTreeFormatPopup");
        grid.jqxTreeGrid("expandAll");
    } else {
        $("#divSecTreeFormatPopup").jqxTreeGrid('collapseAll');
    }
}

function loadTreeFormatDatasubRoutine(programId) {
    $.get(baseAddress + "StatementRule/GetPseudoCodeDataTreeFormat?programId=" + programId,
        function (tData) {
            var secondTab = tData[0].TreeViewListSecondTab;
            var sourceSecondTab =
            {
                dataType: "json",
                dataFields: [
                    { name: 'GraphId', type: 'string' },
                    { name: 'ParentId', type: 'string' },
                    { name: 'GraphName', type: 'string' },
                    { name: "ActualStatementId", type: 'string' },
                    { name: "NodeId", type: "integer" }
                ],
                hierarchy:
                {
                    keyDataField: { name: 'GraphId' },
                    parentDataField: { name: 'ParentId' }
                },
                id: 'GraphId',
                localData: secondTab
            };
            document.getElementById("divOldPopup").style.display = "inline";
            document.getElementById("divPrePopup").style.display = "none";
            var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
            $("#divSecTreeFormatPopup").jqxTreeGrid(
                {
                    width: "100%",
                    height: 400,
                    source: dataAdapterSecondTab,
                    showHeader: false,
                    columns: [
                        { text: 'GraphName', dataField: 'GraphName' }
                    ]
                });
        });
}


/* Deactivate Statement */

function deActivateStatement() {
    //$("#txtStatementStartWith").val("");
    //document.getElementById("dvError").innerHTML = "";
    //$("#dvDeactivate").modal("show");

    var projectId = getParameterByName("prjId");
    var statementId = getParameterByName("stmtId");
    var actionId = getParameterByName("aId");
    $("#txtStatementStartWith").val("");
    document.getElementById("dvError").innerHTML = "";
    getAllDeactivateStatement(projectId, statementId, actionId);
}

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

function getAllDeactivateStatement(projectId, statementId, actionId) {
    document.getElementById("dvError").innerHTML = "";
    // treeExpandedSecondTab
    var rowindex = $('#treeExpandedSecondTab').jqxGrid('getselectedrowindex');
    if (rowindex === -1) {
        displayMessage("Please select a statement to begin deactivation", "medium");
        // alert("Please select a statement to begin deactivation");
        return false;
    }
    var selectedRow = $('#treeExpandedSecondTab').jqxGrid('getrowdata', rowindex);
    var text = $(selectedRow.GraphName).text().trim();
    $("#txtStatementStartWith").val(text);

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "DeactivateStatement/GetAllDeactivateStatement?projectId=" + projectId +
            "&statementId=" + statementId + "&actionId=" + actionId,
        success: function (result) {
            if (result != null) {
                var source =
                {
                    datatype: "json",
                    datafields: [
                    { name: 'DeactivateStatementId', type: 'int' },
                    { name: 'ActualStatement', type: 'string' },
                    { name: 'Activate', type: 'string' }
                    ],
                    id: 'DeactivateStatementId',
                    localdata: result
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#jqxDeactivate").jqxGrid(
                    {
                        width: "95%",
                        height: 200,
                        source: dataAdapter,
                        showheader: false,
                        sortable: true,
                        // scrollbarsize: 22,
                        // scrollmode: 'logical',
                        columns: [
                            { text: 'Deactivate Statement', dataField: 'ActualStatement', width: 400 },
                            { text: 'Activate', dataField: 'Activate', cellsalign: 'center', width: 100 }
                        ]
                    });
            }
            $("#dvDeactivate").modal("show");
        }
    });
}

$("#btnAddDeactivateStatement").click(function () {
    if ($("#txtStatementStartWith").val() === "") {
        document.getElementById("dvError").innerHTML = "Please enter Statement start";
        $("#txtStatementStartWith").focus();
        $("#txtStatementStartWith").css("border-color", "red");
        $("#txtStatementStartWith").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }

    var projectId = getParameterByName("prjId");
    var actionWorkflowId = getParameterByName("aId");
    var statementId = getParameterByName("stmtId");
    var deactivateStatement = [];
    deactivateStatement.push({
        "ProjectId": projectId,
        "StartStatementId": statementId,
        "solutionId": 0,
        "ActualStatement": $("#txtStatementStartWith").val(),
        "ActionWorkflowId": actionWorkflowId,
        "IsDeleted": 0
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "DeactivateStatement/POST?startMethodId=" + statementId + "&projectId=" + projectId,
        data: deactivateStatement[0],
        success: function (result) {
            if (result !== null) {
                $("#txtStatementStartWith").val("");
                document.getElementById("dvError").style.color = "green";
                document.getElementById("dvError").innerHTML = "Record saved successfully";
                callAfterApplyAnnotateOrDeActivate();
            }
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                error.innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                error.innerHTML = response.statusText;
            },
            500: function (response) {
                error.innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("dvError").innerHTML = "Error while connecting to API";
        }
    });
});

/* Annotate statement */

function annotateStatement(statementId, graphName) {
    document.getElementById("dvError1").innerHTML = "";
    $("#txtAnnotateStatement").val();
    $("#dvAnnotate").modal("show");
    document.getElementById("hdnAnnotateStatement").value = statementId;
    document.getElementById("hdnAnnotateGraphName").value = graphName;
    // document.getElementById("#hdnAnnotateStatement").value = statmentId;
}

$("#btnAddAnootateStatement").click(function () {
    var statementId = document.getElementById("hdnAnnotateStatement").value;
    var graphName = document.getElementById("hdnAnnotateGraphName").value;
    if ($("#txtAnnotateStatement").val() === "") {
        document.getElementById("dvError1").innerHTML = "Please enter Annotate statement.";
        $("#txtAnnotateStatement").focus();
        $("#txtAnnotateStatement").css("border-color", "red");
        $("#txtAnnotateStatement").on("keypress", function () {
            $(this).css("border-color", "");
        });

        return false;
    }

    var annotateStatement = $("#txtAnnotateStatement").val();

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "StatementRule/UpdateAnnotateStatement?statementId=" + statementId + "&annotateStatement=" + annotateStatement,
        success: function (cData) {
            if (cData != null) {
                document.getElementById("dvError1").innerHTML = "Record saved successfully";
                document.getElementById("dvError1").style.color = "green";
                $("#txtAnnotateStatement").val("");
                callAfterApplyAnnotateOrDeActivate();
                $("#dvAnnotate").modal("hide");
            }
        }
    });
});

function callAfterApplyAnnotateOrDeActivate() {
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    if (document.getElementById("chkTreeFormat").checked === true) {
        checkboxUnCheckTreeView();
        $('#divExpand').show();
        loadTreeFormatData(projectId, prgmId);
        return;
    }
    else if (chkBusiness === true && chkpseudo === true) {
        $('#divExpand').hide();
        getProgramsSecondTabDetails(projectId, prgmId, true, true);

    } else {
        $('#divExpand').hide();
        getProgramsSecondTabDetails(projectId, prgmId, false, false);
    }
}

function getMethodStatements(ctrl) {
    var title = ctrl.title;
    var str = title;
    var statementId = str.split(',')[0];
    var fileId = str.split(',')[1];
    var projectId = getParameterByName('prjId');
    var methodName = str.split(',')[2] + "()";
    jQuery.ajax({
        url: baseAddress + "WorkspaceWorkflow/GetMethodName?statementId=" + statementId + "&fileId=" + fileId + "&methodName=" + methodName + "&projectId=" + projectId,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            if (typeof tData === "number") {
                includeStateDialog(tData);
                $("#dvMethodBlock").modal("hide");
            }
            else {
                var secondTab = tData[0].TreeViewListSecondTab;
                var sourceSecondTab =
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
                    localData: secondTab
                };

                var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                $("#divSecTreeFormatMethodBlock").jqxTreeGrid(
                    {
                        width: "100%",
                        height: 600,
                        source: dataAdapterSecondTab,
                        showHeader: false,
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ]

                    });
                $("#divSecTreeFormatMethodBlock").jqxTreeGrid('expandAll');
                $("#dvMethodBlock").modal("show");
            }
        }
    });
}



function chkDecisionMatrix() {
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    var actionId = getParameterByName('aId');
    var chkDecision = document.getElementById("chkDecisionMatrix").checked;
    var ruleDataAndSummary = [];
    $.ajaxSetup({ async: false });
    $.get(baseAddress + "WorkspaceWorkflow/GetBusinessFunction?projectId=" + projectId + "&actionId=" + actionId,
                   function (data) {
                       if (data !== null) {
                           ruleDataAndSummary = data;
                       }
                   });
    $.get(baseAddress + "ActionWorkflowsReference/GetDecisionTableData?prgId=" + prgmId + "" +
        "&projectId=" + projectId + "&actionId=" + actionId + "&pseudoCode=" + chkDecision + "&option=view", function (tData) {
            if (tData !== null) {
                var loopCounter = 0;
                var cnt = 0;
                var bgColor = "";
                var disp = "inline";
                var allRules =
                    "<table style='width: 100%; border-collapse: separate; border-spacing: 0.1em;'>";
                var allActions =
                    "<table id='tblAllAction'>";
                var allActionsElse =
                    "<table id='tblAllAction'>";
                var allStatements =
                    "<table id='tblAllStatements'>";
                $.each(tData, function (key, value) {
                    disp = loopCounter === 0 ? "inline" : "none";
                    bgColor = loopCounter === 0 ? "#f4b084" : "#ffffff";
                    var index = key.indexOf("#");
                    var statement = key.substring(index + 1); // .split("#")[1];
                    var statement1 = key.split("#")[0];
                    var statementId = statement1.split("StmtId_")[1].split(" ")[0];
                    var parentId = statement1.split("ParentId_")[1].split(" ")[0];
                    var callFunction = "<i class='fa fa-pencil-square-o fa-2x' " +
                        "onclick=funDefineBusinessRule('" + parentId + "'," + statementId + ");></i>";
                    var title = "Create business functions";
                    var nested = statement.indexOf("~") > -1 ? true : false;
                    if (nested) {
                        statement = statement.split("~")[0];
                    }
                    var n = nested === true ? "D" : "";
                    var boolean = false;
                    var loopEnd = false;
                    var cellBgColor = "";
                    for (var i = 0; i < ruleDataAndSummary.length; i++) {
                        var statementRule = ruleDataAndSummary[i].StatementRuleReference;
                        if (loopEnd) break;
                        for (var j = 0; j < statementRule.length; j++) {
                            if (statementRule[j].StatementIdFrom === parseInt(statementId)) {
                                title = "Rule Name: " + ruleDataAndSummary[i].RuleName;
                                cellBgColor = "#3acaa1";
                                loopEnd = true;
                                break;
                            }
                        }
                    }

                    allRules += "<tr onclick='showHideOther(" + loopCounter + "," + statementId + ");' id='tr_" +
                            loopCounter + "' style='background-color: " + bgColor + "'><td class='cellInner'>" +
                            statement.replace(" ( ", "(").replace(" ) ", ")") + "</td><td class='cellDependant'>" + n +
                            "</td><td class='cellBusiness' style='background-color: " + cellBgColor + "'><span><a href='#'" +
                            " title='" + title + "'>" + callFunction + "</a></span></td></tr>";
                    allStatements += "<tr id='allStmtsTr_" + cnt + "' ><td id='allStmts_" + loopCounter + "' style='display:" +
                        disp + ";' class='cellInnerStat'><table>";
                    allActions += "<tr id='allActionsTr_" + cnt + "'><td id='allActions_" + loopCounter + "' style='display:" +
                        disp + ";' class='cellInnerStat'><table>";
                    allActionsElse += "<tr id='allActionsElseTr_" + cnt + "'><td id='allActionsElse_" + loopCounter +
                        "' style='display:" + disp + ";' class='cellInnerStat'><table>";
                    $.each(value, function (k, v) {
                        cnt++;
                        var stmt = v.replace(" ( ", "(").replace(" ) ", ")");
                        if (stmt.indexOf("Else pId_") >= 0 || stmt.indexOf("ELSE pId_") >= 0) {
                            boolean = true;
                            stmt = stmt.split("pId_")[0];
                        }
                        allStatements += "<tr id='allStmtsTr_" + cnt +
                            "' onclick='changeBg(this);'><td>" + stmt + "</td></tr>";
                        if (boolean === false) {
                            allActions += "<tr id='allActionsTr_" + cnt + "' onclick='changeBg(this);'><td>"
                                + stmt + "</td></tr>";
                        }
                        if (boolean === true) {
                            allActionsElse += "<tr id='allActionsElseTr_" + cnt +
                                "' onclick='changeBg(this);'><td>" + stmt + "</td></tr>";
                        }
                    });
                    allStatements += "</td></tr></table>";
                    allActions += "</td></tr></table>";
                    allActionsElse += "</td></tr></table>";
                    loopCounter++;
                });
                allRules += "</table>";
                allStatements += "</table>";
                allActions += "</table>";
                allActionsElse += "</table>";
                $("#tdAllConditionRules")[0].innerHTML = allRules;
                $("#tdAllActions")[0].innerHTML = allActions;
                $("#tdAllActionsElse")[0].innerHTML = allActionsElse;
                $("#tdAllStatements")[0].innerHTML = allStatements;
            }
        });
}
/*
function chkDecisionMatrix() {
    var projectId = getParameterByName('prjId');
    var prgmId = getParameterByName('prgmId');
    var actionId = getParameterByName('aId');
    var chkDecision = document.getElementById("chkDecisionMatrix").checked;
    $.get(baseAddress + "ActionWorkflowsReference/GetDecisionTableData?prgId=" + prgmId + "" +
        "&projectId=" + projectId + "&actionId=" + actionId + "&pseudoCode=" + chkDecision +"&option=view", function (tData) {
            if (tData !== null) {
                var loopCounter = 0;
                var cnt = 0;
                var bgColor = "";
                var disp = "inline";
                var allRules =
                    "<table style='width: 100%; border-collapse: separate; border-spacing: 0.1em;'>";
                var allActions =
                    "<table id='tblAllAction'>";
                var allActionsElse =
                    "<table id='tblAllAction'>";
                var allStatements =
                    "<table id='tblAllStatements'>";
                $.each(tData, function (key, value) {
                    disp = loopCounter === 0 ? "inline" : "none";
                    bgColor = loopCounter === 0 ? "#f4b084" : "#ffffff";
                    var statement = key.split("#")[1];
                    var statement1 = key.split("#")[0];
                    var statementId = statement1.split("StmtId_")[1].split(" ")[0];
                    var parentId = statement1.split("ParentId_")[1].split(" ")[0];
                    var callFunction = "<i class='fa fa-pencil-square-o fa-2x' " +
                        "onclick=funDefineBusinessRule('" + parentId + "'," + statementId + ");></i>";
                    var nested = statement.indexOf("~") > -1 ? true : false;
                    if (nested) {
                        statement = statement.split("~")[0];
                    }
                    var n = nested === true ? "D" : "";
                    var boolean = false;
                    allRules += "<tr onclick='showHideOther(" + loopCounter + "," + statementId + ");' id='tr_" +
                        loopCounter + "' style='background-color: " + bgColor + "'><td class='cellInner'>" +
                        statement.replace(" ( ", "(").replace(" ) ", ")") + "</td><td class='cellDependant'>" + n +
                        "</td><td class='cellBusiness'><span><a href='#'" +
                        " title='Create business functions'>" + callFunction + "</a></span></td></tr>";
                    allStatements += "<tr id='allStmtsTr_" + cnt + "' ><td id='allStmts_" + loopCounter + "' style='display:" +
                        disp + ";' class='cellInnerStat'><table>";
                    allActions += "<tr id='allActionsTr_" + cnt + "'><td id='allActions_" + loopCounter + "' style='display:" +
                        disp + ";' class='cellInnerStat'><table>";
                    allActionsElse += "<tr id='allActionsElseTr_" + cnt + "'><td id='allActionsElse_" + loopCounter +
                        "' style='display:" + disp + ";' class='cellInnerStat'><table>";
                    $.each(value, function (k, v) {
                        cnt++;
                        var stmt = v.replace(" ( ", "(").replace(" ) ", ")");
                        if (stmt.indexOf("Else pId_") >= 0 || stmt.indexOf("ELSE pId_") >= 0) {
                            boolean = true;
                            stmt = stmt.split("pId_")[0];
                        }
                        allStatements += "<tr id='allStmtsTr_" + cnt +
                            "' onclick='changeBg(this);'><td>" + stmt + "</td></tr>";
                        if (boolean === false) {
                            allActions += "<tr id='allActionsTr_" + cnt + "' onclick='changeBg(this);'><td>"
                                + stmt + "</td></tr>";
                        }
                        if (boolean === true) {
                            allActionsElse += "<tr id='allActionsElseTr_" + cnt +
                                "' onclick='changeBg(this);'><td>" + stmt + "</td></tr>";
                        }
                    });
                    allStatements += "</td></tr></table>";
                    allActions += "</td></tr></table>";
                    allActionsElse += "</td></tr></table>";
                    loopCounter++;
                });
                allRules += "</table>";
                allStatements += "</table>";
                allActions += "</table>";
                allActionsElse += "</table>";
                $("#tdAllConditionRules")[0].innerHTML = allRules;
                $("#tdAllActions")[0].innerHTML = allActions;
                $("#tdAllActionsElse")[0].innerHTML = allActionsElse;
                $("#tdAllStatements")[0].innerHTML = allStatements;
            }
        });
}
*/

$("#btnDecisionExport").click(function () {
    decisionChartExport();
});

$("#btnDecisionExportHtml").click(function () {
    var prgmId = getParameterByName("prgmId");
    var actionId = getParameterByName("aId");
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/ExportDecisionTblViewOnPopup?projectId=" + projectId + "&prgmId=" + prgmId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode,
        success: function (result) {
            if (result != null) {
                var data = result;
                if (data === "To many columns") {
                    decisionChartExport();
                } else {
                    $("#divDecisionChartHtmlTable").html('');
                    $("#divDecisionChartHtmlTable").append(data);
                    $("#DvDecisionShow").modal("show");
                    $("#divDecisionChartHtmlTable").tooltip();
                }
            }
        }
    });
});

$("#btnExportDecisionChartHtml").click(function () {
    decisionChartExport();
});

function decisionChartExport() {
    var prgmId = getParameterByName("prgmId");
    var prjId = getParameterByName("prjId");
    var actionId = getParameterByName("aId");
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/ExportDicisionTblView?projectId=" + prjId + "&programId=" + prgmId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode,
        success: function (result) {
            downloadFile(result);
        }
    });
}

function exportViewSourceFile() {
    var fileId = document.getElementById("subRoutineprogramId").value;
    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "WorkspaceWorkflow/DownLoadSubRoutineViewSource?fileId=" + fileId,
            contentType: "text/plain;charset=utf-8",
            success: function (data) {
                if (data !== null) {
                    downloadTextFile(data[0], data[1]);
                }
            }
        });
    }
}

function downloadTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$("#dvCreateBusinessFunc").on("hidden.bs.modal", function () {
    chkDecisionMatrix();
});
$("#dvDeactivate").on("hidden.bs.modal", function () {
    //var projectId = getParameterByName('prjId');
    //var stmtId = getParameterByName('stId');
    //var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    //var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    //var annotate = document.getElementById("chkAnnotateView").checked;
    //firstTabClickEvent(projectId, prgmId);
    //getPseudoCodeIndentedData(projectId, stmtId, chkBusiness, chkpseudo, annotate);
    //return true;
    var prgmId = getParameterByName('prgmId');
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkPseudo = document.getElementById("chkPseudoCodeFunction").checked;
    if (chkBusiness === true && chkPseudo === true) {
        getProgramsSecondTabDetails(projectId, prgmId, true, true);
    }
    else if (chkBusiness === false && chkPseudo === false) {
        getProgramsSecondTabDetails(projectId, prgmId, false, false);
    }
    else if (chkBusiness === true && chkPseudo === false) {
        getProgramsSecondTabDetails(projectId, prgmId, true, false);
    }
    else if (chkBusiness === false && chkPseudo === true) {
        getProgramsSecondTabDetails(projectId, prgmId, false, true);
    }
    return true;
});


function revertDeactivateStatement(deactivateStatementId) {
    document.getElementById("dvError").innerHTML = "";
    var prjId = getParameterByName("prjId");
    var stmtId = getParameterByName("stmtId");
    var actionId = getParameterByName("aId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "DeactivateStatement/UpdateDeactivateStatement?deactivateId=" + deactivateStatementId + "&projectId=" + prjId + "&statementId=" + stmtId,
        success: function (result) {
            if (result === "Done") {
                document.getElementById("dvError").innerHTML = " Record Activated successfully";
                document.getElementById("dvError").style.color = "green";
                getAllDeactivateStatement(prjId, stmtId, actionId);
            } else {
                document.getElementById("dvError").innerHTML = "Error occured, please try again";
            }
        }
    });
}