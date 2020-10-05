var baseAddress = $.fn.baseAddress();

var projectId = getParameterByName("prjId");
var pid = parseInt(projectId);
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
$.fn.getUserProjectDetails(projectId);
window.localStorage.setItem("forthTabDataNodes", "");
window.localStorage.setItem("forthTabDataLinks", "");
window.localStorage.setItem("secondTabDataNodes", "");
window.localStorage.setItem("firstTabDataNodes", "");
// $.fn.getLicenseDetails("yes");
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);    // location
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
// var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var LayoutDirection = MindFusion.Graphs.LayoutDirection;
var FractalLayout = MindFusion.Graphs.FractalLayout;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var diagram = null;
var treeviewObj;
var decision1In3Out, apat2;
var strWorkflowFor = "";
var clickedDefineFunction = "";

$.ajaxSetup({ global: true });
$body = $("body");
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

    const tabMaster = JSON.parse(window.localStorage.getItem("tabs"));

    if (tabMaster.length === 0) {
        $("#li_1").show();
        $("#li_2").show();
        $("#li_4").show();
        $("#li_3").show();
        $("#li_5").show();
    } else {
        $("#li_1").hide();
        $("#li_2").hide();
        $("#li_4").hide();
        $("#li_3").hide();
        $("#li_5").hide();
        tabMaster.forEach(function (tab) {
            if (tab.SubMenuId === 0) {
                const tabName = tab.TabName;
                if (tabName === "li_2") {
                    document.getElementById("demo-tabs2-box-2").style.visibility = "initial";
                }
                $(`#${tabName}`).show();
            }
        });
    }
    document.getElementById("fourDataTabs").style.visibility = "initial";
});


function openUrl() {
    window.open("http://regexr.com/");
}
var nodesCount = 100;
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
    $("#txtSearch").on("mouseover", function () {
        var value = $(this).val();
        var highlightSearch = new HighlightSearch("treeExpandedSecondTab", null);
        if (value.length > 0) {
            highlightSearch.apply(value);
        } else {
            highlightSearch.remove();
        }
        //$("#txtFirstSearch").val(value);
    });
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val();
        var highlightSearch = new HighlightSearch("treeExpandedSecondTab", null);
        if (value.length > 0) {
            highlightSearch.apply(value);
        } else {
            highlightSearch.remove();
        }
        //$("#txtFirstSearch").val(value);
    });
    $("#txtFirstSearch").keypress(function (event) {
        if (event.which === 13) {
            $("#btnSearchText").click();
        }
    });
    //$("#txtFirstSearch").on("mouseover", function () {
    //    var value = $(this).val();
    //    var highlightSearch = new HighlightSearch("treeViewSourceFirstTab", null);
    //    if (value.length > 0) {
    //        highlightSearch.apply(value);
    //    } else {
    //        highlightSearch.remove();
    //        $("#divSearchHitCount").text("");
    //        return;
    //    }
    //    $("#txtSearch").val(value);
    //});

    //$("#txtFirstSearch").on("keyup", function () {
    //    var value = $(this).val();
    //    var highlightSearch = new HighlightSearch("treeViewSourceFirstTab", null);
    //    if (value.length > 0) {
    //        highlightSearch.apply(value);
    //    } else {
    //        highlightSearch.remove();
    //        $("#divSearchHitCount").text("");
    //        return;
    //    }
    //    $("#txtSearch").val(value);
    //});

    /*
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
   */
});

var observer = new MutationObserver(function () {
    var value = $("#txtSearch").val();
    var highlightSearch = new HighlightSearch("treeExpandedSecondTab", null);
    highlightSearch.apply(value);
});

var mutationObserver = new MutationObserver(function () {
    var value = $("#txtFirstSearch").val();
    var highlightSearch = new HighlightSearch("contenttablejqTreeFirstTab", null);
    highlightSearch.apply(value);
});

$(document).ready(function () {
    window.localStorage.setItem("projectId", projectId);
    $(document).ajaxStart(function () {
        $body.addClass("loading");
    });
    $(document).ajaxComplete(function () {
        $body.removeClass("loading");
    });

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
    $("#li_3").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Workflow Diagram');
    }, function () {
        $(this).css('cursor', 'auto');
    });
    $("#li_4").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Decision Chart');
    }, function () {
        $(this).css('cursor', 'auto');
    });
    $("#li_5").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'External and Internal View of the workflow(Tree view)');
    }, function () {
        $(this).css('cursor', 'auto');
    });
});

$(document).ready(function () {
    $("#rteStatementsNote").ejRTE({ width: "100%", height: "285px", isResponsive: true });
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

    $("#rteStatementsNote").ejRTE({ width: "100%", height: "285px", isResponsive: true });
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
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var actionId = getParameterByName('aId');
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    $("#btnSubmitRule").removeAttr("disabled", "");
    $("#txtRuleDescription").val("");
    $("#txtRuleName").val("");
    $("#dvRuleDetails")[0].innerHTML = "";
    var actionWorkflowId = getParameterByName("aId");
    document.getElementById("tdError12").innerHTML = "";
    var rows = [];
    $.get(baseAddress +
        "WorkspaceWorkflow/GetStatementsChildItemsUpdated" +
        "?graphId=" + parentId + "&iStatementId=" + stmtId + "&iProjectId=" + projectId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode + "&statementId=" + statementId,
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

function getBusinessFunctionData(projectId, stmtId) {
    $.get(baseAddress + "StatementRule/GetBusinessFunctionData?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            if (tData !== null) {
                var secondTab = tData[0].TreeViewListSecondTab;
                var source = tData[0].TreeViewListFirstTab;
                var tName;
                if (source.length > 0) {
                    var technicalName = source[0].GraphName;
                    tName = $(technicalName).text();
                }
                var nodes = tData[0].Nodes;
                var links = tData[0].Links;
                var actionWorkflow = tData[0].ActionWorkflows;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
                //$("#pnlWorkflowName")[0].innerHTML = actionWorkflow.TechnicalAndBusinessName + " ";
                var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; // .toUpperCase();
                $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                $("#iTechnicalName")[0].innerHTML = tName;
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    // $("#iTechnicalName")[0].innerHTML = oriEventMethod; // .toUpperCase();
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    // $("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
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

                var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                $("#jqTreeFirstTab")
                    .jqxGrid(
                        {
                            width: "100%",
                            height: 850,
                            source: dataAdapter,
                            showheader: false,
                            sortable: true,
                            scrollbarsize: 22,
                            scrollmode: 'logical',
                            columns: [
                                { text: 'GraphName', dataField: 'GraphName' }
                            ]
                        });

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

                var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                $("#treeExpandedSecondTab")
                    .jqxGrid(
                        {
                            width: "100%",
                            height: 850,
                            source: dataAdapterSecondTab,
                            showheader: false,
                            sortable: true,
                            scrollbarsize: 22,
                            scrollmode: 'logical',
                            columns: [
                                { text: 'GraphName', dataField: 'GraphName' }
                            ]
                        });
                buildDiagram(nodes, links);
            }
        });
}

function getWorkflowFunctionData(projectId, stmtId) {
    $.get(baseAddress + "StatementRule/GetWorkflowBusinessFunctionData?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            if (tData !== null) {
                var secondTab = tData[0].TreeViewListSecondTab;
                var source = tData[0].TreeViewListFirstTab;
                var tName = "";
                if (source.length > 0) {
                    var technicalName = source[0].GraphName;
                    tName = $(technicalName).text();
                }
                var nodes = tData[0].Nodes;
                var links = tData[0].Links;
                var actionWorkflow = tData[0].ActionWorkflows;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
                //$("#pnlWorkflowName")[0].innerHTML = actionWorkflow.TechnicalAndBusinessName + " ";
                var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; //.toUpperCase();
                $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                $("#iTechnicalName")[0].innerHTML = tName;
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    // $("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    // $("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
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
                    hierarchy:
                    {
                        keyDataField: { name: 'GraphId' },
                        parentDataField: { name: 'ParentId' }
                    },
                    id: 'GraphId',
                    localData: source
                };

                var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                $("#jqTreeFirstTab")
                    .jqxTreeGrid(
                        {
                            width: "100%",
                            height: 850,
                            checkboxes: true,
                            source: dataAdapter,
                            hierarchicalCheckboxes: true,
                            showHeader: false,
                            sortable: true,
                            columns: [
                                { text: 'GraphName', dataField: 'GraphName' }
                            ]
                        });

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

                var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                $("#treeExpandedSecondTab")
                    .jqxTreeGrid(
                        {
                            width: "100%",
                            height: 850,
                            checkboxes: true,
                            hierarchicalCheckboxes: true,
                            source: dataAdapterSecondTab,
                            showHeader: false,
                            sortable: true,
                            columns: [
                                { text: 'GraphName', dataField: 'GraphName' }
                            ]
                        });
                buildDiagram(nodes, links);
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

    //  getTechnicalName();
    var projectId = getParameterByName('prjId');
    window.localStorage.setItem("projectId", projectId);
    var stmtId = getParameterByName('stId');
    secondTabClickEvent(projectId, stmtId);
});

function loadTreeFormatData(projectId, stmtId) {
    var actionId = getParameterByName("aId");
    var chkBusiness = document.getElementById("chkBusinessFunctionThirdTab").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunctionThirdTab").checked;
    var chkAnnotate = document.getElementById("chkAnnotateThirdTab").checked;
    $.get(baseAddress + "StatementRule/GetPseudoCodeDataTreeFormat?projectId=" + projectId + "&stmtId=" + stmtId + "&business=" + chkBusiness + "&pseudo=" + chkpseudo + "&annotate=" + chkAnnotate + "&userId=" + userId + "&actionId=" + actionId,
        function (tData) {
            var secondTab = tData[0].TreeViewListSecondTab;
            var actionWorkflow = tData[0].ActionWorkflows;
            var tName = actionWorkflow.OriginObject;
            var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
            var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; //.toUpperCase();
            $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
            $("#iTechnicalName")[0].innerHTML = tName;
            $("#imgBusinessName")[0].alt = "img_" + actionWorkflow.ActionWorkflowId;
            $("#iWorkflowFor")[0].innerHTML = b;
            $("#txtDescription")[0].value = b;
            strWorkflowFor = b;
            $("#tfirstHeading")[0].innerHTML = actionWorkflow.WorkflowBusinessDescription + " ";;
            $("#imgBusinessDescription")[0].alt = "img_" + actionWorkflow.ActionWorkflowId;
            document.getElementById("hdnActionWorkflowId").value = actionWorkflow.ActionWorkflowId;

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
    });
}

function loadData(projectId, stmtId) {
    $.get(baseAddress + "PostProcess/GetWorkflow?projectId=" + projectId + "&stmtId=" + stmtId + "&number=1",
        function (tData) {
            var secondTab = tData[0].TreeViewListSecondTab;
            var source = tData[0].TreeViewListFirstTab;
            var tName = "";
            if (source.length > 0) {
                var technicalName = source[0].GraphName;
                tName = $(technicalName).text();
            }
            var actionWorkflow = tData[0].ActionWorkflows;
            var originEventMethod = actionWorkflow.OriginEventMethod;
            var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
            var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
            //$("#pnlWorkflowName")[0].innerHTML = actionWorkflow.TechnicalAndBusinessName + " ";
            var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; // .toUpperCase();
            $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
            $("#iTechnicalName")[0].innerHTML = tName;
            var oriEventMethod;
            if (workflowBusinessName === "" || workflowBusinessName === null) {
                oriEventMethod = originEventMethod + " ";
                // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
            } else {
                oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
            }
            // $("#iTechnicalName")[0].innerHTML = oriEventMethod; // .toUpperCase();
            $("#imgBusinessName")[0].alt = "img_" + actionWorkflow.ActionWorkflowId;
            $("#iWorkflowFor")[0].innerHTML = b;
            $("#txtDescription")[0].value = b;
            strWorkflowFor = b;
            $("#tfirstHeading")[0].innerHTML = actionWorkflow.WorkflowBusinessDescription + " ";;
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

            var dataAdapter = new $.jqx.dataAdapter(sourceNew);
            $("#jqTreeFirstTab")
                .jqxGrid(
                    {
                        width: "100%",
                        height: 850,
                        source: dataAdapter,
                        showheader: false,
                        sortable: true,
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ]
                    });

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

            var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
            $("#treeExpandedSecondTab")
                .jqxGrid(
                    {
                        width: "100%",
                        height: 850,
                        source: dataAdapterSecondTab,
                        showheader: false,
                        sortable: true,
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ]
                    });
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
            $.get(baseAddress + "ActionWorkflowsReference/UpdateWorkflowDesc?workflowId=" + workflowId + "&workflowDesc=" + workflowDesc,
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

function projectWorkspace() {
    location.href = "projects_workspace.html?pid=" + projectId;
}

var eCount = false;
function getPseudoCodeIndentedData(projectId, stmtId, business, pseudo, annotate) {
    var userId = window.localStorage.getItem("userId");
    window.localStorage.setItem("secondTabDataNodes", "");
    var actionId = getParameterByName("aId");
    $.get(baseAddress +
        "StatementRule/GetPseudoCodePreIndentedData?projectId=" + projectId + "&stmtId=" + stmtId + "&business=" + business +
        "&pseudo=" + pseudo + "&annotate=" + annotate + "&userId=" + userId + "&actionId=" + actionId,
        function (tData) {
            if (tData !== null && tData.length > 0) {
                var secondTab = tData[0].TreeViewListSecondTab;
                var actionWorkflow = tData[0].ActionWorkflows;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject;
                var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName;  //.toUpperCase();
                $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                $("#iTechnicalName")[0].innerHTML = b;
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    $("#txtRename")[0].value = originEventMethod + " ";
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                    $("#txtRename")[0].value = workflowBusinessName + " ";
                }
                // ("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
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
                        width: "100%",
                        height: 850,
                        showheader: false,
                        source: sourceSecondTab,
                        scrollmode: 'logical',
                        columns: [
                            { text: 'GraphName', dataField: 'GraphName' }
                        ],
                        ready: function () {
                            var target = document
                                .getElementById('jqxScrollThumbverticalScrollBartreeExpandedSecondTab');
                            observer.observe(target, { attributes: true, attributeFilter: ['style'] });
                        }
                    });

                if (secondTab.length <= 15000) {
                    window.localStorage.setItem("secondTabDataNodes", JSON.stringify(secondTab));
                }
                $body.removeClass("loading");
                eCount = false;

                // Log this action...
                var audit = {
                    postData: {
                        OptionUsed: "Load Action Workflow",
                        PrimaryScreen: "Load Action Workflow",
                        UserId: userId,
                        ProjectId: projectId,
                        BriefDescription: "Workflow business name: <b>" + b + "</ b> with options: Pseudo Code?: Yes, Annotation…?: Yes and Business Function?: Yes."
                    }
                };
                $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
                    console.log(e);
                });
            }
            $('#treeExpandedSecondTab').on('rowdoubleclick', function (event) {
                var args = event.args.row;
                var statementId = args.bounddata.StatementId;
                var actualStatementId = args.bounddata.ActualStatementId;
                var graphId = args.bounddata.GraphId;
                var graphName = args.bounddata.GraphName;
                var gPName = $(graphName).text();
                annotateStatement123(statementId, gPName, actualStatementId, graphId);
            });
            $('#treeExpandedSecondTab').on('rowclick', function (event) {
                var args = event.args;
                var target = event.currentTarget.id;
                $(target).each(function (index, element) {
                    $(element).css("backgroundColor", "yellow");
                });

                //$(target).children();

                event.preventDefault();
                var rowIndex = args.rowindex;
                var data = $('#treeExpandedSecondTab').jqxGrid('getrowdata', rowIndex);
                var graphName = data.GraphName;
                var graphId = data.GraphId;
                var parentId = data.ParentId;
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

function loadFirstTabData(projectId, stmtId) {
    var hitHighlighter = new Hilitor("jqTreeFirstTab");
    hitHighlighter.setMatchType("open");

    $("#btnSearchText").click(
        function () {
            hitHighlighter.remove();
            var keywords = $("#txtFirstSearch").val();
            var words = keywords.split(",").sort(function (a, b) {
                return b.length - a.length;
            });
            var hitCount = 0;
            $.each(words, function () {
                hitHighlighter.apply(this);
                hitCount += hitHighlighter.hitCount;
            });

            if (hitCount === 0) {
                $("#divSearchHitCount").text("no matches found");
            } else {
                $("#divSearchNav").show();
                $("#divSearchHitCount").text(hitCount + (hitCount === 1 ? " match" : " matches"));
            }
        });

    $("#btnSearchPrev").click(function () {
        hitHighlighter.prevHit();
    });

    $("#btnSearchNext").click(function () {
        hitHighlighter.nextHit();
    });
    window.localStorage.setItem("firstTabDataNodes", "");
    var actionId = getParameterByName("aId");
    $.get(baseAddress +
        "StatementRule/GetFirstTabSourceData?projectId=" + projectId + "&stmtId=" + stmtId + "&actionId=" + actionId,
        function (tData) {
            if (tData !== null) {
                $("#divFirstOld")[0].style.display = "none";
                $("#divFirstNew")[0].style.display = "inline";
                document.getElementById("treeViewSourceFirstTab").innerHTML = "";
                document.getElementById("treeViewSourceFirstTab").innerHTML = tData;
                //$("#treeViewSourceFirstTab").innerHTML = "";
                //$("#treeViewSourceFirstTab").innerHTML = tData;
            }
        });
}

function getPseudoCodeFunctionData(projectId, stmtId) {
    $.get(baseAddress + "StatementRule/GetPseudoCodeData?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            if (tData !== null) {
                var secondTab = tData[0].TreeViewListSecondTab;
                var source = tData[0].TreeViewListFirstTab;
                var tName = "";
                if (source.length > 0) {
                    var technicalName = source[0].GraphName;
                    tName = $(technicalName).text();
                }
                var nodes = tData[0].Nodes;
                var links = tData[0].Links;
                var actionWorkflow = tData[0].ActionWorkflows;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
                var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; // .toUpperCase();
                $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                $("#iTechnicalName")[0].innerHTML = tName;
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    $("#txtRename")[0].value = originEventMethod + " ";
                    //  $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                    // $("#txtRename")[0].value = workflowBusinessName + " ";
                }
                // $("#iTechnicalName")[0].innerHTML = oriEventMethod; // .toUpperCase();
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

                var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                $("#jqTreeFirstTab")
                    .jqxGrid(
                        {
                            width: "100%",
                            height: 850,
                            source: dataAdapter,
                            showheader: false,
                            sortable: true,
                            scrollbarsize: 22,
                            scrollmode: 'logical',
                            columns: [
                                { text: 'GraphName', dataField: 'GraphName' }
                            ]
                        });

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

                var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                $("#treeExpandedSecondTab")
                    .jqxGrid(
                        {
                            width: "100%",
                            height: 850,
                            source: dataAdapterSecondTab,
                            showheader: false,
                            sortable: true,
                            scrollbarsize: 22,
                            scrollmode: 'logical',
                            columns: [
                                { text: 'GraphName', dataField: 'GraphName' }
                            ]
                        });
                buildDiagram(nodes, links);
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
    chkDecisionMatrix();
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

function bb(parameter) {
    $(parameter).css("background-color", "white");
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

function PseudoCodeDialog(statementId) {
    document.getElementById("tdError1").innerHTML = "";
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
                if (data === "0") {
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
    $body.addClass("loading");
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
                $body.removeClass("loading");
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
    var stmtId = getParameterByName('stId');
    var actionId = getParameterByName('aId');
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectDiscoveredCharacteristics?projectId=" + projectId + "&stmtId=" + stmtId + "",
        success: function (entryPoints) {
            if (entryPoints != null) {
                if (entryPoints.length > 0) {
                    $("#lblTotalStatement")[0].innerHTML = entryPoints[0].LoopCount;
                    $("#lblDecisionPoint")[0].innerHTML = entryPoints[0].DecisionCount;
                    $("#lblExternalCall")[0].innerHTML = entryPoints[0].ExtrernalCalls;
                    $("#lblInternalCall")[0].innerHTML = entryPoints[0].InternalCalls;
                    var languageId = entryPoints[0].LaunguageId;
                    getTagNameData(projectId, stmtId);
                    loadProjectAssociationData(projectId, stmtId, languageId);
                    loadProjectDataDependency(projectId, stmtId);
                    loadActionWorkflowFilesUpload(projectId, stmtId);
                }
            }
        }
    });
});

function getProgramsFirstTabDetails(programId) {
    if (programId === 0) {
        displayMessage("File are not available!", "small");
        return false;
    }
    var stmtId = getParameterByName('stId');
    var actionWorkflowId = getParameterByName("aId");
    window.open("workflowview.html?prjId=" + projectId + "&prgmId=" + programId + "&tab=1&stmtId=" + stmtId + "&aId=" + actionWorkflowId, "_blank");
}

function getProgramsSecondTabDetails(programId) {
    if (programId === 0) {
        displayMessage("File are not available!", "small");
        return false;
    }
    var stmtId = getParameterByName('stId');
    var actionWorkflowId = getParameterByName("aId");
    window.open("workflowview.html?prjId=" + projectId + "&prgmId=" + programId + "&tab=2&stmtId=" + stmtId + "&aId=" + actionWorkflowId, "_blank");
}

function loadProjectAssociationData(projectId, stmtId, languageId) {
    $.get(baseAddress + "WorkspaceWorkflow/GetProjectAssociationAndProperties?projectId=" + projectId + "&stmtId=" + stmtId + "&languageId=" + languageId,
        function (tData) {
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
                var rowData = args.row;
                var value = args.value;
                if (rowData.ParentId === "3") {
                    updateAssociationData(projectId, stmtId, value, 0);
                } else if (rowData.ParentId === "4") {
                    updateAssociationData(projectId, stmtId, value, 1);
                }

            });

        });
}

function callforthtab(projectId, stmtId, workflowViewType) {
    var tDataNew;
    var chkBusiness = document.getElementById("chkShowFlowWithBusinessFun").checked;
    if (workflowViewType === true) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceButterflyView?projectId=" + projectId + "&stmtId=" + stmtId + "&workflowViewType=true&business=" + chkBusiness + "",
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                }
                else if (nodes.length > nodesCount) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                }
                else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }
            });
    } else {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceSequentialView?projectId=" + projectId + "&stmtId=" + stmtId + "&business=" + chkBusiness + "",
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                }
                else if (nodes.length > nodesCount) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                } else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }
            });
    }
}

function callforthtabWithBusinessFunction(projectId, stmtId) {
    var tDataNew;
    $.get(baseAddress + "PostProcess/GetWorkflow?projectId=" + projectId + "&stmtId=" + stmtId + "&number=2 &business=business",
        function (tData) {
            tDataNew = tData;
            var nodes = tData[0].Nodes;
            if (nodes == null) {
                $('#dvWorkflowDownloadPopUp').modal('show');
            } else {
                document.getElementById("dvBusinessFun").style.visibility = "visible";
                document.getElementById("dvBusinessFun").style.display = "inline";

                document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                var links = tData[0].Links;
                window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                buildDiagram(nodes, links);
            }
        });
}

function updateAssociationData(projectId, stmtId, renameData, flag) {
    $.get(baseAddress + "WorkspaceWorkflow/updateProjectAssociationAndProperties?projectId=" + projectId + "&stmtId=" + stmtId + "&renameData=" + renameData + "&flag=" + flag,
        function () {
            getBusinessNameAndDescription();
        });
}

function addTagName(projectId, stmtId, tagName) {
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkspaceWorkflow/addTags?projectId=" + projectId + "&stmtId=" + stmtId + "&tagName=" + tagName,
        success: function (result) {
            if (result !== null) {
            }
        }
    });

}

function updateTagName(projectId, stmtId, tagName, flag) {
    $.get(baseAddress + "WorkspaceWorkflow/updateTags?projectId=" + projectId + "&stmtId=" + stmtId + "&tagName=" + tagName + "&flag=" + flag,
        function () {
        });
}

function getTagNameData(projectId, stmtId) {
    $.get(baseAddress + "WorkspaceWorkflow/getTagsData?projectId=" + projectId + "&stmtId=" + stmtId,
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
                workflowId + "&workflowName=" + valueRename,
                function (bData) {
                    if (bData !== null && typeof bData !== 'undefined') {
                        $("#iWorkflowFor")[0].title = bData.ActionWorkflowId;
                        var pnlwkflowName = bData.WorkflowName; //.toUpperCase();
                        $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                        // $("#iTechnicalName")[0].innerHTML = bData.OriginEventMethod;
                        var workflowBusinessName = bData.WorkflowBusinessName === null ? "" : bData.WorkflowBusinessName;
                        /*
                        var oriEventMethod;
                        if (workflowBusinessName === "") {
                            oriEventMethod = bData.originEventMethod;
                            $("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
                        } else {
                            oriEventMethod = workflowBusinessName + " - " + bData.originEventMethod;
                            $("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
                        }
                        */
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
                        var pnlwkflowName = bData.WorkflowName; //.toUpperCase();
                        $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                        //$("#pnlWorkflowName")[0].innerHTML = bData.WorkflowName + " ";
                        $("#txtDescription")[0].value = bData.WorkflowBusinessDescription;
                        $("#txtWorkflowBuiName")[0].value = pnlwkflowName;
                        // $("#txtWorkflowBuiName")[0].value = bData.WorkflowBusinessDescription;
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

function loadProjectDataDependency(projectId, stmtId) {
    $.get(baseAddress + "WorkspaceWorkflow/GetDataDependency?projectId=" + projectId + "&stmtId=" + stmtId,
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
    document.getElementById("subRoutineprogramId").value = fileId;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId,
        success: function (projectDetails) {
            if (projectDetails != null) {
                if (projectDetails[0].LanguageMaster.LanguageId === 6) {
                    document.getElementById("li2").style.display = "none";
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
        jQuery.ajax({
            url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?projectId=" + projectId + "&fileId=" + fileId,
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSource").innerHTML = tData;
                    $('#ViewSourceInputBody').hide();
                    $(('#li1')).addClass('active');
                    $(('#li2')).removeClass('active');
                    $(('#tabSourceCodPopup')).addClass('tab-pane fade in active');
                    $(('#tabPseudoCodePopup')).addClass('tab-pane fade in');
                    $('#tabSourceCodPopup').show();
                    $('#tabPseudoCodePopup').hide();
                    $('#ViewSourceInputBody').show();
                    $("#viewSourceDialog").modal("show");
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
            // headers: "Content-Type: application/graphml",
            success: function (data) {
                if (data !== null) {
                    downloadTextFile(data[0], data[1]);
                    /*
                    var element = document.createElement("a");
                    element.setAttribute("href", data);
                    element.target = "_blank";
                    document.body.appendChild(element);
                    element.click();
                    */
                }
            }
        });
    }
}

function downloadTestCase() {
    var stmtId = getParameterByName('stId');
    var actionWorkflowId = getParameterByName("aId");
    var projectId = getParameterByName("prjId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ExportWordDocument/CreateTestCasesDoc?projectId=" + projectId + "&actionWorkflowId=" + actionWorkflowId + "&stmtId=" + stmtId + "&userId=" + userId,
        success: function (data) {
            if (data !== null) {
                downloadFile(data);
            }
        }
    });
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
        hitHighlighter.apply($("#ViewSourceInputModal_SearchBox").val());
        if (hitHighlighter.hitCount === 0) {
            $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
        } else {
            $("#ViewSourceInputModal_SearchNav").show();
            $("#ViewSourceInputModal_SearchHitCount").text(hitHighlighter.hitCount + (hitHighlighter.hitCount == 1 ? " match" : " matches"));
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

// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
function Hilitor(id, tag) {
    var targetNodeId = id;
    var targetNode = document.getElementById(id) || document.body;
    var hiliteTag = tag || "EM";
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
        input = input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
        if (node.nodeName === "EM") return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i]);
        }
        if (node.nodeType === 3) { // NODE_TEXT
            if ((nv === node.nodeValue) && (regs === matchRegex.exec(nv))) {

                var match = document.createElement(hiliteTag);
                match.appendChild(document.createTextNode(regs[0]));
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
        while (arr.length && (el === arr[0])) {
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
            this.hits = $("#" + targetNodeId + " em");
            if (this.hits.length > 0) {
                this.hits[0].scrollIntoView();
                this.hits[0].style.backgroundColor = "#a0ffff";
            }
        }
    };

    this.hiliteComments = function (codeType) {
        this.remove();
        switch (codeType) {
            case "9": //cobol
                matchRegex = new RegExp('^.{6}[*/].*\n', "im");
                break;
            case "4": //cobol JCL
                matchRegex = new RegExp('^.{2}[*/].*\n', "im");
                break;
            case "31": //adbas
            case "26":
            case "30":
                matchRegex = new RegExp('^.{4}[*/].*\n|/\\*.*\n|^.{4}[0-9]{4}[*].*\n', "im");
                break;
            default:
                return;
        }
        this.hiliteWords(targetNode);
    }

    this.hiliteExpandedSource = function (codeType) {
        this.remove();
        switch (codeType) {
            case "9": //cobol
                //matchRegex = new RegExp('^.{6}[*/].*\n', "im");
                var re1 = '(#)';	// Any Single Character 1
                var re2 = '(\\$)';	// Any Single Character 2
                var re3 = '(#)';	// Any Single Character 3
                var re4 = '(\\$)';	// Any Single Character 4
                var re5 = '(#)';	// Any Single Character 5
                var re6 = '(\\$)';	// Any Single Character 6
                var re7 = '(START)';	// Word 1
                var re8 = '(#)';	// Any Single Character 7
                var re9 = '(\\$)';	// Any Single Character 8
                var re10 = '(#)';	// Any Single Character 9
                var re11 = '(\\$)';	// Any Single Character 10
                var re12 = '(#)';	// Any Single Character 11
                matchRegex = new RegExp(re1 + re2 + re3 + re4 + re5 + re6 + re7 + re8 + re9 + re10 + re11 + re12, ["i"]);
                break;
            default:
                return;
        }
        this.hiliteWords(targetNode);
    }

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

$("#btnDecisionExport").click(function () {
    var statementId = getParameterByName("stId");
    var prjId = getParameterByName("prjId");
    var actionId = getParameterByName("aId");
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/ExportDicisionTbl?projectId=" + prjId + "&statementId=" + statementId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode,
        success: function (result) {
            downloadFile(result);
        }
    });
});

$("#btnDecisionExportHtml").click(function () {
    var statementId = getParameterByName("stId");
    var projectId = getParameterByName("prjId");
    var actionId = getParameterByName("aId");
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/ExportDicisionTblOnPopup?projectId=" + projectId + "&statementId=" + statementId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode,
        success: function (result) {
            if (result != null) {
                var data = result;
                $("#divDecisionChartHtmlTable").html('');
                $("#divDecisionChartHtmlTable").append(data);
                $("#DvDecisionShow").modal("show");
                $("#divDecisionChartHtmlTable").tooltip();
            }
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
    var businessFun = document.getElementById("chkBusinessFunction");
    var parentBusiness = businessFun.parentElement;
    $(parentBusiness).prop("className", "form-checkbox form-icon form-text");
}

/* Popup subRoutine */
function changeFirstTabPopup() {
    var programId = document.getElementById("subRoutineprogramId").value;
    $('#tabSourceCodPopup').show();
    $('#tabPseudoCodePopup').hide();
    includeStateDialog(programId);
}

function changeSecondTabPopup() {
    $('#tabSourceCodPopup').hide();
    $('#tabPseudoCodePopup').show();
    var programId = document.getElementById("subRoutineprogramId").value;

    var pseudoFun = document.getElementById("chkPseudoCodeFunctionSubRoutine");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");
    $('#divExpandSubRoutine').hide();

    var treeFun = document.getElementById("chkTreeFormatSubRoutine");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text ");
    /*
    var audit = {
        postData: {
            OptionUsed: "Workflow Workspace",
            PrimaryScreen: "Workflow Workspace",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Viewed External and Internal View of the Workflow(flat view) tab"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
      
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });*/
    getPseudoCodeIndentedDataSubRoutinePopup(programId, true, true);
}

function getPseudoCodeIndentedDataSubRoutinePopup(programId, business, pseudo) {
    document.getElementById("divOldPopup").style.display = "none";
    document.getElementById("divPrePopup").style.display = "none";
    // $("#treeExpandedSecondTabPopup").html('');
    $.get(baseAddress + "StatementRule/GetSecondTabProgramTree?programId=" + programId + "" +
        "&business=" + business + "&pseudo=" + pseudo + "&userId=" + userId,
        function (tData) {
            $body.addClass("loading");
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
                        ]
                    });
                $body.removeClass("loading");
            }
        });
}

function callChkPseudoFormatSubRoutine() {
    $body.addClass("loading");
    var programId = document.getElementById("subRoutineprogramId").value;
    document.getElementById("chkPseudoCodeFunctionSubRoutine").checked = true;
    document.getElementById("chkTreeFormatSubRoutine").checked = false;
    var chkPseudo = document.getElementById("chkPseudoCodeFunctionSubRoutine").checked;
    if (chkPseudo === true) {
        var treeFun = document.getElementById("chkTreeFormatSubRoutine");
        var parentTree = treeFun.parentElement;
        $(parentTree).prop("className", "form-checkbox form-icon form-text");
        $('#divExpandSubRoutine').hide();
        getPseudoCodeIndentedDataSubRoutinePopup(programId, true, true);
        $body.removeClass("loading");
    } else {
        getPseudoCodeIndentedDataSubRoutinePopup(programId, false, false);
    }
}


function callChkTreeFormatSubRoutine() {

    var programId = document.getElementById("subRoutineprogramId").value;
    document.getElementById("chkPseudoCodeFunctionSubRoutine").checked = false;
    document.getElementById("chkTreeFormatSubRoutine").checked = true;
    var chkTree = document.getElementById("chkTreeFormatSubRoutine").checked;
    if (chkTree === true) {
        $("divSecTreeFormatPopup").html('');
        $body.addClass("loading");
        var treeFun = document.getElementById("chkPseudoCodeFunctionSubRoutine");
        var parentTree = treeFun.parentElement;
        $(parentTree).prop("className", "form-checkbox form-icon form-text");
        var expandFun = document.getElementById("chkExpandAllSubRoutine");
        var parentExpand = expandFun.parentElement;
        $(parentExpand).prop("className", "form-checkbox form-icon form-text");
        $('#divExpandSubRoutine').show();
        loadTreeFormatDatasubRoutine(programId);
        $body.removeClass("loading");
    }
    if (chkTree === false) {
        $("divSecTreeFormatPopup").html('');
        var pseudoFun = document.getElementById("chkPseudoCodeFunctionSubRoutine");
        var parentPseudo = pseudoFun.parentElement;
        $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");
        $('#divExpandSubRoutine').hide();
        getPseudoCodeIndentedDataSubRoutinePopup(programId, true, true);
    }
}

function expandAllTreeViewSubRoutine() {
    var $body = $("body");
    if (document.getElementById("chkExpandAllSubRoutine").checked === true) {
        $body.addClass("loading");
        var grid = $("#divSecTreeFormatPopup");
        grid.jqxTreeGrid("expandAll");
        $body.removeClass("loading");
    } else {
        $body.addClass("loading");
        $("#divSecTreeFormatPopup").jqxTreeGrid('collapseAll');
        $body.removeClass("loading");
    }
}

function loadTreeFormatDatasubRoutine(programId) {
    $body.addClass("loading");
    // $("#divSecTreeFormatPopup").html('');
    document.getElementById("divOldPopup").style.display = "none";
    document.getElementById("divPrePopup").style.display = "none";
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

/* ------------ Start code for First Tab ----------------------- */

function changeFirstTab(tab) {
    var projectId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    var businessFun = document.getElementById("chkTreeFormatFirstTb");
    var parentBusiness = businessFun.parentElement;
    $(parentBusiness).prop("className", "form-checkbox form-icon form-text");
    var expondFun = document.getElementById("chkExpondFirst");
    var parentExpond = expondFun.parentElement;
    $(parentExpond).prop("className", "form-checkbox form-icon form-text");
    var audit = {
        postData: {
            OptionUsed: "Workflow Workspace",
            PrimaryScreen: "Workflow Workspace",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Viewed Complete View of the Workflow tab"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
        firstTabClickEvent(projectId, stmtId);
        $('#divExpandFirstTab').hide();
        $("#txtFirstSearch").keyup();
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });


}

function firstTabClickEvent(projectId, stmtId) {
    $("#divFirstOld")[0].style.display = "none";
    $("#divFirstNew")[0].style.display = "inline";
    var tDataNewNodes = window.localStorage.getItem("firstTabDataNodes");
    if (tDataNewNodes === undefined || tDataNewNodes === null || tDataNewNodes === "") {
        loadFirstTabData(projectId, stmtId);
    } else {
        var nodes = JSON.parse(tDataNewNodes);
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
            localData: nodes
        };

        $("#jqTreeFirstTab").jqxGrid(
            {
                width: "100%",
                height: 850,
                source: sourceNew,
                showheader: false,
                scrollbarsize: 28,
                scrollmode: 'logical',
                columns: [
                    { text: 'GraphName', dataField: 'GraphName' }
                ]
            });
    }
}

function callTreeFormatFirstTab() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    if (document.getElementById("chkTreeFormatFirstTb").checked === true) {
        $('#divExpandFirstTab').show();
        firstTabClickEventTreeFormat(projectId, stmtId);
    } else {
        var pseudoFun = document.getElementById("chkExpondFirst");
        var parentPseudo = pseudoFun.parentElement;
        $(parentPseudo).prop("className", "form-checkbox form-icon form-text");
        $('#divExpandFirstTab').hide();
        firstTabClickEvent(projectId, stmtId);
    }
}

function firstTabClickEventTreeFormat(projectId, stmtId) {
    var actionId = getParameterByName("aId");
    $.get(baseAddress + "StatementRule/GetDataForFirstTabTreeFormat?projectId=" + projectId + "&stmtId=" + stmtId + "&actionId=" + actionId,
        function (tData) {
            if (tData !== null) {
                var sourceFirstTab = tData[0].TreeViewListFirstTab;
                var actionWorkflow = tData[0].ActionWorkflows;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
                //$("#pnlWorkflowName")[0].innerHTML = actionWorkflow.TechnicalAndBusinessName + " ";
                var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; //.toUpperCase();
                var tName = actionWorkflow.OriginObject;
                $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                $("#iTechnicalName")[0].innerHTML = tName;
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    // $("#iTechnicalName")[0].innerHTML = oriEventMethod; //.toUpperCase();
                    $("#txtRename")[0].value = originEventMethod + " ";
                    //$("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    // $("#iTechnicalName")[0].innerHTML = oriEventMethod;  //.toUpperCase();
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
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
                $body.removeClass("loading");
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

function expandAllTreeViewFirst() {
    if (document.getElementById("chkExpondFirst").checked === true) {
        var grid = $("#firstTabOld");
        grid.jqxTreeGrid("expandAll");
    } else {
        $("#firstTabOld").jqxTreeGrid('collapseAll');
    }
}

/* ---------------- End code for First Tab ------------------------ */

/* ----------------- Start Code for second Tab -------------------- */

function changeSecondTab(tab) {
    var projectId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    secondTabClickEvent(projectId, stmtId);
    $("#txtSearch").keyup();
}

function secondTabClickEvent(projectId, stmtId) {
    //document.getElementById("chkBusinessFunction").checked = true;
    //document.getElementById("chkPseudoCodeFunction").checked = true;
    //document.getElementById("chkAnnotateView").checked = true;
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    //var businessFun = document.getElementById("chkBusinessFunction");
    //var parentbusinessFun = businessFun.parentElement;
    //$(parentbusinessFun).prop("className", "form-checkbox form-icon form-text active");

    //var pseudoFun = document.getElementById("chkPseudoCodeFunction");
    //var parentpseudoFun = pseudoFun.parentElement;
    //$(parentpseudoFun).prop("className", "form-checkbox form-icon form-text active");

    //var annotateFun = document.getElementById("chkAnnotateView");
    //var parentannotateFun = annotateFun.parentElement;
    //$(parentannotateFun).prop("className", "form-checkbox form-icon form-text active");

    getPseudoCodeIndentedData(projectId, stmtId, chkBusiness, chkpseudo, annotate);
    return true;
}

function callchkFunctionSecondTab() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    getPseudoCodeIndentedData(projectId, stmtId, chkBusiness, chkpseudo, annotate);
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
        IsDeleted: 0,
        StatementRuleReference: statementRuleReference,
        ActionWorkflowId: actionWorkflowId
    });

    var startMethodId = getParameterByName("stId");
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

$("#btnRemoveBusinessFun").click(function () {
    if ($("#txtRuleName").val() === "") {
        $("#tdError12")[0].innerHTML = "Enter Business function";
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

    var startMethodId = getParameterByName("stId");
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

function deActivateStatement() {
    var projectId = getParameterByName("prjId");
    var statementId = getParameterByName("stId");
    var actionId = getParameterByName("aId");
    $("#txtStatementStartWith").val("");
    document.getElementById("dvError").innerHTML = "";
    getAllDeactivateStatement(projectId, statementId, actionId);
}

$("#btnAddDeactivateStatement").click(function () {
    var startMethodId = getParameterByName("stId");
    if ($("#txtStatementStartWith").val() === "") {
        document.getElementById("dvError").innerHTML = "Please enter Statement start";
        $("#txtStatementStartWith").focus();
        $("#txtStatementStartWith").css("border-color", "red");
        $("#txtStatementStartWith").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    var statementId = getParameterByName("stId");
    var actionWorkflowId = getParameterByName("aId");
    var deactivateStatement = [];
    deactivateStatement.push({
        "ProjectId": projectId,
        "StartStatementId": statementId,
        "SolutionId": 0,
        "ActualStatement": $("#txtStatementStartWith").val(),
        "ActionWorkflowId": actionWorkflowId,
        "IsDeleted": 0
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "DeactivateStatement/POST?startMethodId=" + startMethodId + "&projectId=" + projectId,
        data: deactivateStatement[0],
        success: function (result) {
            if (result !== null) {
                $("#txtStatementStartWith").val("");
                document.getElementById("dvError").style.color = "green";
                document.getElementById("dvError").innerHTML = "Record saved successfully";
                callAfterApplyAnnotateOrDeActivate();
                $("#dvDeactivate").modal("hide");
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

function annotateStatement123(statementId, graphName, actualStatmentId, graphId) {
    document.getElementById("dvError1").innerHTML = "";
    $.ajaxSetup({ async: false });
    $("#txtAnnotateStatement").val();
    $.ajaxSetup({
        async: false
    });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetOrignalStatement?statementId=" + statementId + "&graphId=" + graphId + "&actualStatementId=" + actualStatmentId,
        success: function (result) {
            var tData = result;
            var currentStatement = tData[0].GraphName;
            $('#txtCurrentStatement').text(currentStatement);
            $("#txtAnnotateStatement").val(graphName.trim());

            document.getElementById("hdnAnnotateStatement").value = statementId;
            document.getElementById("hdnAnnotateActualStmtId").value = actualStatmentId;
            document.getElementById("hdnAnnotateGraphId").value = graphId;
        }
    });
    $("#dvAnnotate").modal("show");
}

$("#btnAddAnootateStatement").click(function () {
    var startMethodId = getParameterByName("stId");
    var statementId = document.getElementById("hdnAnnotateStatement").value;
    var actualStmtId = document.getElementById("hdnAnnotateActualStmtId").value;
    var graphId = document.getElementById("hdnAnnotateGraphId").value;
    if ($("#txtAnnotateStatement").val() === "") {
        document.getElementById("dvError1").innerHTML = "Please enter Annotate statement.";
        $("#txtAnnotateStatement").focus();
        $("#txtAnnotateStatement").css("border-color", "red");
        $("#txtAnnotateStatement").on("keypress", function () {
            $(this).css("border-color", "");
            document.getElementById("dvError1").innerHTML = "";
        });
        return false;
    }
    var annotateStatement = $("#txtAnnotateStatement").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "StatementRule/UpdateAnnotateStatement?statementId=" + statementId + "&annotateStatement=" + annotateStatement + "" +
            "&actualStatmentId=" + actualStmtId + "&graphId=" + graphId + "&startMethodId=" + startMethodId + "&projectId=" + projectId,
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
    return true;
});

$("#btnRevert").click(function () {
    var startMethodId = getParameterByName("stId");
    var statementId = document.getElementById("hdnAnnotateStatement").value;
    var actualStmtId = document.getElementById("hdnAnnotateActualStmtId").value;
    var graphId = document.getElementById("hdnAnnotateGraphId").value;
    var annotateStatement = "";
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "StatementRule/UpdateAnnotateStatement?statementId=" + statementId + "&annotateStatement=" + annotateStatement + "" +
            "&actualStatmentId=" + actualStmtId + "&graphId=" + graphId + "&startMethodId=" + startMethodId + "&projectId=" + projectId,
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

function exportWordDocument() {
    var userId = window.localStorage.getItem("userId");
    var uId = parseInt(userId);
    var prjId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ExportWordDocument/CreateWordDocumentFile?projectId=" + prjId + "&statmentId=" + stmtId + "&business=" + chkBusiness + "&pseudo=" + chkpseudo + "&annotate=" + annotate + "&userId=" + uId,
        success: function (result) {
            downloadFile(result);
        }
    });
}

function callAfterApplyAnnotateOrDeActivate() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    getPseudoCodeIndentedData(projectId, stmtId, chkBusiness, chkpseudo, annotate);
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

function revertDeactivateStatement(deactivateStatementId) {
    document.getElementById("dvError").innerHTML = "";
    var prjId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
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

/* ----------------- End code for second Tab ----------------------- */

/* ----------------- Start code for Forth Tab(Tree view ) ---------------------  */
function changeTreeTab() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var pseudoFun = document.getElementById("chkExpandAll");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text");
    var audit = {
        postData: {
            OptionUsed: "Workflow Workspace",
            PrimaryScreen: "Workflow Workspace",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Viewed External and Internal View of the workflow(Tree view) tab"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
        loadTreeFormatData(projectId, stmtId);
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });
}

function callChkTreeViewThirdTab() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var pseudoFun = document.getElementById("chkExpandAll");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text");
    loadTreeFormatData(projectId, stmtId);
}

function expandAllTreeView() {
    if (document.getElementById("chkExpandAll").checked === true) {
        var grid = $("#divSecTreeFormat");
        grid.jqxTreeGrid("expandAll");
    } else {
        $("#divSecTreeFormat").jqxTreeGrid('collapseAll');
    }
}

/* ---------------- End code for Forth Tab (Tree View ) ------------------------ */

/* -------------  Start code for fifthTab (Diagram View) ------------------- */

function changBgCss(tab) {
    var projectId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    forthTabClickEvent(projectId, stmtId);
    $("#TBProcF").click();
    diagram.setShowGrid(false);
}

function forthTabClickEvent(projectId, stmtId) {
    getFileTypeExtension();
    document.getElementById("chkSequentialView").checked = false;
    document.getElementById("chkButterflyView").checked = false;
    document.getElementById("chkFlowchartView").checked = true;
    document.getElementById("dvBusinessFun").style.visibility = "visible";
    document.getElementById("dvBusinessFun").style.display = "inline";

    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

    var tDataNewNodes = window.localStorage.getItem("forthTabDataNodes");
    var tDataNewLinks = window.localStorage.getItem("forthTabDataLinks");
    if (tDataNewNodes === undefined || tDataNewNodes === null || tDataNewNodes === "" && tDataNewLinks === undefined || tDataNewLinks === null || tDataNewLinks === "") {
        callforthtab(projectId, stmtId, false, false, true);
    } else {
        var nodes = JSON.parse(tDataNewNodes);
        var links = JSON.parse(tDataNewLinks);
        if (nodes.length > nodesCount) {
            $('#dvWorkflowDownloadPopUp').modal('show');
        } else {
            buildDiagram(nodes, links);
        }
    }
}

function callforthtab(projectId, stmtId, squentail, butterfly, flowchart) {
    var chkBusiness = document.getElementById("chkShowFlowWithBusinessFun").checked;
    var chkAnnotate = document.getElementById("chkShowWithAnnotateGraph").checked;
    var tDataNew;
    if (squentail) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceSequentialView?projectId=" + projectId + "&stmtId=" + stmtId + "&business=" + chkBusiness + "&annotate=" + chkAnnotate + "&deActivate=true",
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                }
                else if (nodes.length > nodesCount) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                } else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }
            });
    }
    else if (butterfly) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceButterflyView?projectId=" + projectId + "&stmtId=" + stmtId + "&workflowViewType=true&business=" + chkBusiness + "&annotate=" + chkAnnotate + "&deActivate=true",
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                }
                else if (nodes.length > nodesCount) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                }
                else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }
            });
    }
    else if (flowchart) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceFlowChartView?projectId=" + projectId + "&stmtId=" + stmtId + "&workflowViewType=true&business=" + chkBusiness + "&annotate=" + chkAnnotate + "&deActivate=true",
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                }
                else if (nodes.length > nodesCount) {
                    $('#dvWorkflowDownloadPopUp').modal('show');
                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                }
                else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }
            });
    }

    // Log this action...
    var audit = {
        postData: {
            OptionUsed: "Workflow Workspace Tab",
            PrimaryScreen: "Workflow Workspace Tab",
            UserId: userId,
            ProjectId: projectId,
            BriefDescription: "Viewed Workflow Diagram(5th) tab for: <b>" + $("#iTechnicalName").html() + "</b>"
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function chkCallForthTab() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var chksquentail = document.getElementById("chkSequentialView").checked;
    var chkButterfly = document.getElementById("chkButterflyView").checked;
    var chkFlowChart = document.getElementById("chkFlowchartView").checked;
    callforthtab(projectId, stmtId, chksquentail, chkButterfly, chkFlowChart);
}

function chkCallDiagramView(option) {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var butterflyFun = document.getElementById("chkButterflyView");
    var parentButterFly = butterflyFun.parentElement;
    $(parentButterFly).prop("className", "form-checkbox form-icon form-text");
    var flowchartFun = document.getElementById("chkFlowchartView");
    var parentFlowchart = flowchartFun.parentElement;
    $(parentFlowchart).prop("className", "form-checkbox form-icon form-text");
    var sequentailFun = document.getElementById("chkSequentialView");
    var parentSequentail = sequentailFun.parentElement;
    $(parentSequentail).prop("className", "form-checkbox form-icon form-text");
    switch (option) {
        case 1:
            document.getElementById("chkButterflyView").checked = false;
            document.getElementById("chkFlowchartView").checked = false;
            $(parentSequentail).prop("className", "form-checkbox form-icon form-text active");
            break;
        case 2:
            document.getElementById("chkSequentialView").checked = false;
            document.getElementById("chkFlowchartView").checked = false;
            $(parentButterFly).prop("className", "form-checkbox form-icon form-text active");
            break;
        case 3:
            document.getElementById("chkSequentialView").checked = false;
            document.getElementById("chkButterflyView").checked = false;
            $(parentFlowchart).prop("className", "form-checkbox form-icon form-text active");
            break;
        default:
            break;
    }
    var chksquentail = document.getElementById("chkSequentialView").checked;
    var chkButterfly = document.getElementById("chkButterflyView").checked;
    var chkFlowChart = document.getElementById("chkFlowchartView").checked;
    callforthtab(projectId, stmtId, chksquentail, chkButterfly, chkFlowChart);
}

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
        if (typeof node.ActionWorkflowId !== 'undefined' && node.ActionWorkflowId !== null)
            diagramNode.actionWorkflowId = node.ActionWorkflowId;
        if (typeof node.ProgramId !== 'undefined' && node.ProgramId !== null)
            diagramNode.programId = node.ProgramId;
        if (typeof node.GroupId !== 'undefined' && node.GroupId !== null)
            diagramNode.groupId = node.GroupId;
        if (typeof node.GroupName !== 'undefined' && node.GroupName !== null)
            diagramNode.groupName = node.GroupName;
        if (typeof node.StatementId !== 'undefined' && node.StatementId !== null)
            diagramNode.statementId = node.StatementId;
        if (typeof node.ShapeId !== 'undefined' && node.ShapeId !== null)
            diagramNode.shapeId = node.ShapeId;
        if (typeof node.Name !== 'undefined' && node.Name !== null)
            diagramNode.nodeName = node.Name;
        if (typeof node.Color !== 'undefined' && node.Color !== null)
            diagramNode.nodeColor = node.Color;
    });

    var links = lstLinks;
    Array.forEach(links, function (link) {
        var link1 = diagram.getFactory().createDiagramLink(nodeMap[link.Origin], nodeMap[link.Target]);
        if (typeof link.Origin !== 'undefined' && link.Origin !== null)
            link1.originId = link.Origin;
        if (typeof link.Target !== 'undefined' && link.Target !== null)
            link1.targetId = link.Target;
        if (typeof link.LinkText !== 'undefined' && link.LinkText !== null)
            link1.linkText = link.LinkText;
        if (typeof link.ProgramId !== 'undefined' && link.ProgramId !== null)
            link1.programId = link.ProgramId;
        if (typeof link.StatementId !== 'undefined' && link.StatementId !== null)
            link1.statementId = link.StatementId;
        if (typeof link.ActionWorkflowId !== 'undefined' && link.ActionWorkflowId !== null)
            link1.actionWorkflowId = link.ActionWorkflowId;
        if (typeof link.LineType !== 'undefined' && link.LineType !== null) {
            link1.setHeadBrush(link.LineColor);
            link1.setHeadShape('Triangle');
            link1.lineColor = link.LineColor;
            link1.lineType = link.LineType;
        } else {
            link1.lineColor = "";
            link1.lineType = "";
        }
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

function downloadGraph() {
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
    var prjId = getParameterByName("prjId");
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
        type: 'POST',
        data: JSON.stringify(workFlowData),
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            downloadFile(tData);
        }
    });
}

function downloadFlochartWithOption() {
    $("#dvDownloadOptions").modal("show");
}

function downloadGraphWithOpt() {
    var prjId = getParameterByName("prjId");
    var stmtId = getParameterByName('stId');
    var rdSquentail = document.getElementById("rdSequntial").checked;
    var rdButterfly = document.getElementById("rdButterfly").checked;
    var rdFlowChart = document.getElementById("rdFlowChart").checked;
    var business = document.getElementById("chkShowFlowWithBusinessFun").checked;
    var annotate = document.getElementById("chkShowWithAnnotateGraph").checked;
    if (rdFlowChart) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceFlowChartView?projectId=" + prjId + "&stmtId=" + stmtId +
            "&workflowViewType=true&business=" + business + "&annotate=" + annotate + "&deActivate=true",
            function (tData) {
                var gNodes = [];
                var gLinks = [];
                $.each(tData.Nodes, function (i, node) {
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

                $.each(tData.Links, function (i, link) {
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
                var prjId = getParameterByName("prjId");
                jQuery.ajax({
                    url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
                    type: 'POST',
                    data: JSON.stringify(workFlowData),
                    contentType: "application/json;charset=utf-8",
                    success: function (tData) {
                        downloadFile(tData);
                    }
                });
            });
    }
    else if (rdButterfly) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceButterflyView?projectId=" + prjId + "&stmtId=" + stmtId +
            "&workflowViewType=true&business=" + business + "&annotate=" + annotate + "&deActivate=true",
            function (tData) {
                var gNodes = [];
                var gLinks = [];
                $.each(tData.Nodes, function (i, node) {
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

                $.each(tData.Links, function (i, link) {
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
                var prjId = getParameterByName("prjId");
                jQuery.ajax({
                    url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
                    type: 'POST',
                    data: JSON.stringify(workFlowData),
                    contentType: "application/json;charset=utf-8",
                    success: function (tData) {
                        downloadFile(tData);
                    }
                });
            });
    }
    else if (rdSquentail) {
        $.get(baseAddress + "WorkflowExport/GetWorkflowWorkSpaceSequentialView?projectId=" + prjId + "&stmtId=" + stmtId +
            "&business=" + business + "&annotate=" + annotate + "&deActivate=true",
            function (tData) {
                var gNodes = [];
                var gLinks = [];
                $.each(tData.Nodes, function (i, node) {
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

                $.each(tData.Links, function (i, link) {
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
                var prjId = getParameterByName("prjId");
                jQuery.ajax({
                    url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
                    type: 'POST',
                    data: JSON.stringify(workFlowData),
                    contentType: "application/json;charset=utf-8",
                    success: function (tData) {
                        downloadFile(tData);
                    }
                });
            });
    }
}

function downloadGraphTooManyNodes() {
    var tDataNewNodes = window.localStorage.getItem("forthTabDataNodes");
    var tDataNewLinks = window.localStorage.getItem("forthTabDataLinks");
    var nodes = JSON.parse(tDataNewNodes);
    var links = JSON.parse(tDataNewLinks);
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
    var workFlowData = { Nodes: gNodes, Links: gLinks };

    var prjId = getParameterByName("prjId");
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
        type: 'POST',
        data: JSON.stringify(workFlowData),
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            downloadFile(tData);
        }
    });
}

function onZoomInProcF() {
    var diagram = $find("diagram");
    if (diagram.zoomFactor > 200) return;
    diagram.setZoomFactor(diagram.zoomFactor + 10);
    zoomIn();
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
            var link = diagram.links[l];
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
    if (document.getElementById("OrthogonalRoutingProcF").checked == true) {
        layout.anchoring = MindFusion.Graphs.Anchoring.Reassign;
        for (var l = 0; l < diagram.links.length; l++) {
            var link = diagram.links[l];
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
        var link = diagram.links[l];
        diagram.routeAllLinks();
    }
    document.getElementById("OrthogonalRoutingProcF").checked = true;
    document.getElementById("DirectRoutingProcF").checked = false;

    if (document.getElementById("TBProcF").checked == true) {
        applyTopToBottomProcF();
    } else {
        applyLeftToRightProcF();
    }
}

function FunGraphMLProcF() {
    var checked = $('#radiographmlProcF').attr('checked', true);
    if (checked) {
        $('#radioVisioProcF').attr('checked', false);
    } else {
        $('#radiographmlProcF').attr('checked', true);
    }
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline";
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible";
    document.getElementById("DownloadflowchartlinkProcF").style.display = "none";
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden";
}

function FunVisioProcF() {
    var checked = $('#radioVisioProcF').attr('checked', true);
    if (checked) {
        $('#radiographmlProcF').attr('checked', false);
    } else {
        $('#radioVisioProcF').attr('checked', true);
    }
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline";
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible";
    document.getElementById("DownloadflowchartlinkProcF").style.display = "none";
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden";
}

function fitItemsProcF() {
    var rect = Rect.empty;
    diagram = $find("diagram");
    diagram.nodes.forEach(function (node) {
        if (rect === Rect.empty)
            rect = node.bounds;
        else
            rect = rect.union(node.bounds);
    });
    if (rect)
        diagram.setBounds(new Rect(0, 0, rect.right() + 10, rect.bottom() + 10));
}

function ShowPopupDownloadProcF() {
    $('#dvWorkflowDiagramDownload').modal('show');
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline";
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden"; //Ashish Dhakate
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible"; //Ashish Dhakate
}

var flowchartObjectProcessFlowChart = null;

function downloadDataFlowchartProcF() {
    var projectId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    var chkBusiness = document.getElementById("chkShowFlowWithBusinessFun").checked;
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/GetLinkToDownloadFlowChart?" +
            "projectId=" + parseInt(projectId) + "&stmtId=" + parseInt(stmtId) + "&userId=" + userId + "&business=" + chkBusiness,
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (data) {
            downloadFile(data);
        }
    });
}

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

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

function loadActionWorkflowFilesUpload(projectId, stmtId) {
    $.get(baseAddress + "WorkspaceWorkflow/GetUploadedFiles?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            if (tData.length === 0) {
                document.getElementById("dvUploadFiles").style.visibility = "hidden";
                document.getElementById("dvUploadFiles").style.display = "none";

                document.getElementById("dvUploadFiles1").style.visibility = "visible";
                document.getElementById("dvUploadFiles1").style.display = "inline";
            } else {

                document.getElementById("dvUploadFiles1").style.visibility = "hidden";
                document.getElementById("dvUploadFiles1").style.display = "none";
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
                $("#dvUploadFiles")
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

function dowloadUploadedFile(fileId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/DownloadUploadedFile?fileId=" + fileId,
        success: function (result) {
            downloadFile(result);
        }
    });
}

function downloadUploadedNewWindow(ctrl) {
    //  downloadFile(ctrl.title);
    var element = document.createElement("a");
    element.setAttribute("href", ctrl.title);
    element.target = "_blank";
    document.body.appendChild(element);
    element.click();
}

function chkDecisionMatrix() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var actionId = getParameterByName('aId');
    var chkDecision = document.getElementById("chkDecisionMatrix").checked;
    var ruleDataAndSummary = [];
    $.ajaxSetup({ async: false });
    $.get(baseAddress + "WorkspaceWorkflow/GetBusinessFunction?projectId=" + projectId + "&actionId=" + actionId, function (data) {
        if (data !== null) {
            ruleDataAndSummary = data;
        }
    });
    $.get(baseAddress + "ActionWorkflowsReference/GetDecisionTableData?iStatementId=" + stmtId + "" +
        "&iProjectId=" + projectId + "&actionId=" + actionId + "&pseudoCode=" + chkDecision, function (tData) {
            if (tData !== null) {
                var loopCounter = 0;
                var cnt = 0;
                var bgColor = "";
                var disp = "inline";
                var allRules = "<table style='width: 100%; border-collapse: separate; border-spacing: 0.1em;'>";
                var allActions = "<table id='tblAllAction'>";
                var allActionsElse = "<table id='tblAllAction'>";
                var allStatements = "<table id='tblAllStatements'>";
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
    // Log this action...
    var audit = {
        postData: {
            OptionUsed: "Workflow Workspace Tab",
            PrimaryScreen: "Workflow Workspace Tab",
            UserId: userId,
            ProjectId: projectId,
            BriefDescription: "Viewed Decision Chart(4th) tab for: <b>" + $("#iTechnicalName").html() + "</b>"
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

$("#btnExportDecisionChartHtml").click(function () {
    var statementId = getParameterByName("stId");
    var prjId = getParameterByName("prjId");
    var actionId = getParameterByName("aId");
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/ExportDicisionTbl?projectId=" + prjId + "&statementId=" + statementId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode,
        success: function (result) {
            downloadFile(result);
        }
    });
});

$("#dvCreateBusinessFunc").on("hidden.bs.modal", function () {
    chkDecisionMatrix();
});

$("#dvDeactivate").on("hidden.bs.modal", function () {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    getPseudoCodeIndentedData(projectId, stmtId, chkBusiness, chkpseudo, annotate);
    return true;
});

function downloadWorkflowInventory() {
    var projectId = getParameterByName("prjId");
    var statementId = getParameterByName("stId");
    var actionId = getParameterByName("aId");
    var prjId = parseInt(projectId);
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/ExportInventoryToExcelWorkflow?projectId=" + prjId + "&actionWorkflowId=" + actionId + "&stmtId=" + statementId,
        type: 'GET',
        contentType: "application/xlsx; charset=utf-8",
        headers: "Content-Type: application/xlsx",
        success: function (data) {
            downloadFile(data);
        }
    });
}

function getFileTypeExtension() {
    var projectId = getParameterByName("prjId");
    $('#tblLegend').html('');
    jQuery.ajax({
        url: baseAddress + "General/GetFileTypeExtension?projectId=" + projectId,
        type: "GET",
        success: function (tData) {
            $('#tblLegend').html('');
            if (tData !== null) {
                var row = $("<tr />");
                $("#tblLegend").append(row);
                row.append("<td><div class='divStartingClass' style='padding-right: 4px;'><span>Starting Point</span></div></td>" +
                    " <td><div class='divClass' style='padding-right: 4px;'><span>All Statements</span></div></td>" +
                    "<td> <div class='divMissingClass' style='padding-right: 4px;'><span>Missing Object</span></div></td>" +
                    "<td> <div class='divCondition' style='padding-right: 4px;'><span>Decision</span></div></td>" +
                    "<td> <div class='divStatementOrLoop' style='padding-right: 4px;'><span>Statement Or Loop</span></div></td>" +
                    "<td> <div class='divMethod' style='padding-right: 4px;'><span>Workflow (Method)</span></div></td>" +
                    "<td> <div class='divDeactivate' style='padding-right: 4px;'><span>Deactivate</span></div></td>" +
                    "<td> <div class='divCallInternal' style='padding-right: 4px;'><span>Call Internal</span></div></td>");
                for (var i = 0; i < tData.length; i++) {
                    var color = tData[i].Color;
                    var fileTypeName = tData[i].FileTypeName;
                    row.append("<td><div class='divDynamic' style='padding-right: 4px;'><span style=background-color:" + color + "; >" + fileTypeName + "</span></div></td>");
                }
            }
        }
    });
}

function getTechnicalName() {
    var projectId = getParameterByName('prjId');
    var stmtId = getParameterByName('stId');
    var actionId = getParameterByName('aId');
    jQuery.ajax({
        url: baseAddress + "WorkspaceWorkflow/GetActionWorkflow?projectId=" + projectId + "&stmtId=" + stmtId + "&actionId=" + actionId,
        type: "GET",
        success: function (tData) {
            if (tData !== null) {
                var technicalName = tData[0].OriginObject;
                document.getElementById("hdnTechnicalName").value = technicalName;
            }
        }
    });
}

/* --- Old data --- 
function loadFirstTabData(projectId, stmtId) {
    window.localStorage.setItem("firstTabDataNodes", "");
    var actionId = getParameterByName("aId");
    $.get(baseAddress + "StatementRule/GetDataForFirstTab?projectId=" + projectId + "&stmtId=" + stmtId + "&actionId=" + actionId,
        function (tData) {
            if (tData !== null) {
                var source = tData[0].TreeViewListFirstTab;
                var actionWorkflow = tData[0].ActionWorkflows;
                var tName = actionWorkflow.OriginObject;
                var originEventMethod = actionWorkflow.OriginEventMethod;
                var workflowBusinessName = actionWorkflow.WorkflowBusinessName === null ? "" : actionWorkflow.WorkflowBusinessName;
                var bDesc = actionWorkflow.WorkflowBusinessDescription;
                var b = actionWorkflow.OriginObject + "." + actionWorkflow.OriginEventMethod.replace(/\s+/g, " ");
                var pnlwkflowName = actionWorkflow.TechnicalAndBusinessName; //.toUpperCase();
                $("#pnlWorkflowName")[0].innerHTML = pnlwkflowName;
                $("#iTechnicalName")[0].innerHTML = tName;
                //$("#pnlWorkflowName")[0].innerHTML = actionWorkflow.TechnicalAndBusinessName + " ";
                var oriEventMethod;
                if (workflowBusinessName === "" || workflowBusinessName === null) {
                    oriEventMethod = originEventMethod + " ";
                    $("#txtRename")[0].value = originEventMethod + " ";
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                } else {
                    oriEventMethod = workflowBusinessName + " - " + originEventMethod;
                    // $("#iTechnicalName")[0].title = actionWorkflow.ActionWorkflowId;
                    $("#txtRename")[0].value = workflowBusinessName + " ";
                }
                // $("#iTechnicalName")[0].innerHTML = oriEventMethod;  // .toUpperCase();
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
                $body.removeClass("loading");
            }
        });
}
*/