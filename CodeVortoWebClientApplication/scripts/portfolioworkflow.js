var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");

var AbstractionLayer = MindFusion.AbstractionLayer;
var AnchorPattern = MindFusion.Diagramming.AnchorPattern;
var AnchorPoint = MindFusion.Diagramming.AnchorPoint;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var MarkStyle = MindFusion.Diagramming.MarkStyle;
var Style = MindFusion.Diagramming.Style;
var Theme = MindFusion.Diagramming.Theme;
var FontStyle = MindFusion.Drawing.FontStyle;
var Alignment = MindFusion.Diagramming.Alignment;
var Behavior = MindFusion.Diagramming.Behavior;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var ChangeItemCommand = MindFusion.Diagramming.ChangeItemCommand;
var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var Overview = MindFusion.Diagramming.Overview;
var NodeListView = MindFusion.Diagramming.NodeListView;
var Rect = MindFusion.Drawing.Rect;
var Shape = MindFusion.Diagramming.Shape;
var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var TreeLayout = MindFusion.Graphs.TreeLayout;
var TreeLayoutLinkType = MindFusion.Graphs.TreeLayoutLinkType;
var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var LayoutDirection = MindFusion.Graphs.LayoutDirection;
var FractalLayout = MindFusion.Graphs.FractalLayout;

var diagram, overview, nodeList, anchorPattern, listFileNames;

var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
var projectId = getParameterByName("pId");
$.fn.getUserProjectDetails(projectId);
$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
    var projectId = getParameterByName("pId");
    $('#ddlWorkFlow').ejDropDownList({ width: "100%", dataSource: [] });
    $('#drpdwnProject').ejDropDownList({ width: "100%", dataSource: [] });
    fillProjectDropDown();
    var headerHeight = $('.header').outerHeight();
    $('.scrollContainer').css('top', headerHeight);
    diagram = AbstractionLayer.createControl(Diagram, null, null, null, $("#diagram")[0]);
    diagram.setAllowInplaceEdit(true);
    diagram.setRouteLinks(true);
    diagram.setShowGrid(true);
    diagram.setRoundedLinks(true);
    diagram.setUndoEnabled(true);
    overview = AbstractionLayer.createControl(Overview,
        null, null, null, $("#overview")[0]);
    overview.setDiagram(diagram);
    loadDataTemp(1, 675010);
    //loadDataTemp(1, 674756);
});


function loadDataTemp(projectId, stmtId) {
    //  $.get(baseAddress + "PostProcess/GetAlternateWorkflow?projectId=" + projectId + "&stmtId=" + stmtId,
    $.get(baseAddress + "WorkflowExport/GetWorkFlowWorkSpace?projectId=" + projectId + "&stmtId=" + stmtId,
        function (tData) {
            var nodes = tData.Nodes;
            var links = tData.Links;
            var nodeCnt = tData.Nodes.length;
            buildDiagram(nodes, links);
            //if (tData[0].nodeCount === true) {
            //    var name;
            //    if (projectId === "0") {
            //        name = "Overall Workflow";
            //    } else {
            //        name = "Project Portfolio Workflow";
            //    }
            //    bootbox.confirm({
            //        message: "Do you want process for Job queue ?.",
            //        callback: function (result) {
            //            if (result === true) {
            //                addWorkflowProcess(projectId, stmtId, tData[0].actionWorkflowId, name, nodeCnt);
            //                return true;
            //            } else {
            //                return false;
            //            }
            //        }
            //    });
            //    return false;

            //} else {
            //    buildDiagram(nodes, links);
            //}
        });
}

function loadData(projectId, stmtId) {
    //  $.get(baseAddress + "PostProcess/GetAlternateWorkflow?projectId=" + projectId + "&stmtId=" + stmtId,
    $.get(baseAddress + "FileObjectReference/GetGroupedFlowChart?workFlowId=&projectId=" + projectId + "&stmtId=" + stmtId + "&param=2",
        function (tData) {
            var nodes = tData[0].PortfolioWorkflowNodes;
            var links = tData[0].PortfolioWorkflowLinks;
            var nodeCnt = tData[0].Nodes.length;
            if (tData[0].nodeCount === true) {
                var name;
                if (projectId === "0") {
                    name = "Overall Workflow";
                } else {
                    name = "Project Portfolio Workflow";
                }
                bootbox.confirm({
                    message: "Do you want process for Job queue ?.",
                    callback: function (result) {
                        if (result === true) {
                            addWorkflowProcess(projectId, stmtId, tData[0].actionWorkflowId, name, nodeCnt);
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                return false;

            } else {
                buildDiagram(nodes, links);
            }
        });
}

function buildDiagram(lstNodes, lstLinks) {
    diagram.clearAll();
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
    layout.nodeDistance = 6;
    layout.layerDistance = 6;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    diagram.font.size = 5;
    diagram.enabled = true;
    diagram.width = 1200;
    //diagram.height = "60%";
    var theme = new Theme();
    var linkStyle = new Style();
    linkStyle.setStroke("black");
    linkStyle.setTextColor("black");
    linkStyle.setFontName("Arial");
    linkStyle.setFontSize(3);
    theme.styles["std:DiagramLink"] = linkStyle;
    var tableStyle = new Style();
    tableStyle.setBrush({ type: 'LinearGradientBrush', color1: 'black', color2: 'black', angle: 90 });
    tableStyle.setStroke("black");
    tableStyle.setTextColor("black");
    tableStyle.setFontName("Arial");
    tableStyle.setFontSize(3);
    theme.styles["std:TableNode"] = tableStyle;
    diagram.setTheme(theme);
}

function onZoomIn() {
    diagram.setZoomFactor(Math.min(800, diagram.getZoomFactor() + 10));
}

function onZoomOut() {
    diagram.setZoomFactor(Math.max(10, diagram.getZoomFactor() - 10));
}

function onResetZoom() {
    diagram.setZoomFactor(100);
}

function portfolioDownloadFlowChart() {
    var projectId = getParameterByName("pId");
    var pids = document.getElementById("hdnProjectId").value;
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/PortfolioDownloadFlowChart?" +
            "projectId=" + parseInt(projectId) + "&saveUrlPath=&pids=" + pids + "",
        type: 'GET',
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function (data) {
            downloadFile(data);
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

function goBack() {
    var projectId = getParameterByName("pId");
    window.location.href = "projects_workspace.html?pid=" + projectId;
}

function applyTopToBottom() {
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 8;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    diagram.routeAllLinks();
    diagram.width = 1200;
}

function applyLeftToRight() {
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.LeftToRight;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 8;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    diagram.routeAllLinks();
    diagram.width = 1200;
}

function addWorkflowProcess(projectId, statementId, workflowId, name, nodeCnt) {
    var workflowProcess = [];
    workflowProcess.push({
        "ProjectId": projectId,
        "WorlflowId": workflowId,
        "StatementId": statementId,
        "Processed": 0,
        "Name": name,
        "NodeCount": nodeCnt,
        "UserId": userId
    });
}


function fillProjectDropDown() {
    var ids = "";
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetEntity?entity=ProjectMaster",
        success: function (result) {
            if (result != null) {
                $.each(result, function (key, value) {
                    $("#drpdwnProject").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                });
                $('#drpdwnProject').ejDropDownList({
                    showCheckbox: true,
                    width: "100%",
                    checkChange: function (args) {
                        var id = args.selectedValue;
                        if (args.isChecked === true) {
                            ids += id + ',';
                        } else if (args.isChecked === false) {
                            var n = ids.includes(id);
                            if (n === true) {
                                ids = ids.replace(id + ',', '');
                            }
                        }
                        document.getElementById("hdnProjectId").value = ids;
                        fillActionWorkFlowDropDown(document.getElementById("hdnProjectId").value);

                    }
                });
            }
        }

    });
}


function fillActionWorkFlowDropDown(id) {
    if (id !== "" || id !== "undefined") {
        var ids = "";
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "General/GetEntity?entity=ActionWorkflows&id=0&pids=" + id + "",
            success: function (result) {
                if (result != null) {
                    //$("#ddlWorkFlow").empty();
                    var list = [];
                    $.each(result, function (key, value) {
                        list.push({
                            "text": value.Name,
                            "value": value.Value
                        });
                    });

                    $('#ddlWorkFlow').ejDropDownList(
                    {
                        dataSource: list,
                        field: { text: "text" },
                        value: "value",
                        showCheckbox: true,
                        width: "100%",
                        checkChange: function (args) {
                            var id = args.selectedValue;
                            if (args.isChecked === true) {
                                ids += id + ',';
                            } else if (args.isChecked === false) {
                                var n = ids.includes(id);
                                if (n === true) {
                                    ids = ids.replace(id + ',', '');
                                }
                            }
                            document.getElementById("hdnWorkflowId").value = ids;

                        }
                    });

                }
            }

        });
    }
}

$("#btnsubmit").click(function () {
    var actionWkId = "";
    var projectId = document.getElementById("hdnProjectId").value;
    actionWkId = document.getElementById("hdnWorkflowId").value;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "FileObjectReference/GetGroupedFlowChart?workFlowId=" + actionWkId + "&projectId=" + projectId + "&stmtId=0&param=1",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var nodes = result[0].PortfolioWorkflowNodes;
            var links = result[0].PortfolioWorkflowLinks;
            var nodeCnt = result[0].Nodes.length;
            if (result[0].nodeCount === true) {
                var name = "Multiple projects";
                bootbox.confirm({
                    message: "Do you want process for Job queue ?.",
                    callback: function (result) {
                        if (result === true) {
                            addWorkflowProcess(projectId, 0, actionWkId, name, nodeCnt);
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                return false;
            } else {
                buildDiagram(nodes, links);
            }
        }
    });
});