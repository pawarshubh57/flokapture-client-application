var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
/* Generate the Process Flowchart diagrams */
//var getUserProjectDetails = $.fn.getUserProjectDetails();
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
var MainData = "";


var userId = window.localStorage.getItem("userId");
var projectId = window.localStorage.getItem("projectId");

$(document).ready(function() {
    loadObjectConnectivity();
    var changeCheckbox = document.querySelector('.demo-switch');
    changeCheckbox.onchange = function() {
        if (changeCheckbox.checked) {
            connectivityViaDictionary();
        } else {
            loadObjectConnectivity();
        }
    };
});

function showDictionaryDialog() {
    document.getElementById("tdMessage").innerHTML = "";
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/GetObjectDictionaryData",
        type: 'GET',
        data: { "projectId": 1 },
        contentType: "application/json;charset=utf-8",
        success: function(data) {
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

function bindObjectDictionaryData(classes, methods, combineList) {
    var tblPreviousData = $("#objectDictionaryData").html();
    $("#objectDictionaryData").html('');
    var tblCurrent = $("#objectDictionaryData");
    if (classes.length > 0) {
        var tr1 = $("<tr />").append($("  <td colspan='4'> Classes </td>"));
        $("#objectDictionaryData").append(tr1);
        for (var i = 0; i < classes.length; i++) {
            var tr = $("<tr title='trClass_" + classes[i] + "' id='trClass_" + classes[i] + "' />");
            //var tr = $("<tr title='trClass_" + classes[i] + "' id='trClass_" + classes[i]+" />");
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
            //var tr = $("<tr title='trClass_" + classes[i] + "' id='trClass_" + classes[i]+" />");
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

function connectivityViaDictionary() {
    var projectId = window.localStorage.getItem("projectId");
    $('#loadingObjectConnectivityFlow').show();
    $('#divObjectConnectivity').hide();
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/GetObjectReference",
        type: 'GET',
        data: { "projectId": projectId, "oDictionary": "oDictionary" },
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            if (data != null) {
                MainData = data;
                if (MainData.nodeCount === true) {
                    var name = "Project Connectivity with Dictionary";
                    var stamtId = MainData.statementId;
                    var NodeCnt = MainData.NodeCnt;
                    bootbox.confirm({
                        message: "Do you want process for Job queue ?.",
                        callback: function(result) {
                            if (result === true) {
                                addWorkflowProcess(projectId, stamtId, 0, name, NodeCnt);
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                    return false;

                } else {
                    if (data.Nodes) {
                        flowchartObjectProcessFlowChart = data;
                        diagram = $create(Diagram, null, null, null, $get("canvasObjectConnectivity"));
                        diagram.setShowGrid(false);
                        diagram.setLinkHeadShapeSize(2);
                        diagram.setBackBrush("#F2F6F8");
                        var nodeMap = [];
                        var bounds = new Rect(0, 0, 18, 8);
                        var nodes = data.Nodes;
                        Array.forEach(nodes, function(node) {
                            bounds = new Rect(0, 0, parseInt(node.Width), parseInt(node.Height));
                            var diagramNode = diagram.getFactory().createShapeNode(bounds);
                            var setshape = node.ShapeId;
                            diagramNode.setShape(setshape);
                            nodeMap[node.Id] = diagramNode;
                            var nodeText = "";
                            if (node.BusinessName !== null && node.BusinessName !== "")
                                nodeText = node.BusinessName;
                            else
                                nodeText = node.Name;
                            diagramNode.setText(nodeText);
                            var color = node.Color;
                            diagramNode.setBrush(color);
                        });

                        // Add LINKS ------------
                        var links = data.Links;
                        Array.forEach(links, function(link) {
                            var linkText = link.BusinessName;
                            var link1 = diagram.getFactory().createDiagramLink(
                                nodeMap[link.Origin],
                                nodeMap[link.Target]);
                            link1.setText(linkText);
                            link1.route();
                        });
                        var layout = new LayeredLayout();
                        layout.direction = LayoutDirection.TopToBottom;
                        layout.siftingRounds = 2;
                        layout.nodeDistance = 15;
                        layout.layerDistance = 30;
                        diagram.setZoomFactor(80);
                        diagram.arrange(layout);
                        diagram.resizeToFitItems();
                        diagram.font.size = 5;
                        diagram.enabled = true;
                        diagram.width = 800;
                        diagram.height = 1000;
                        document.getElementById("TBProcF").checked = true;
                        document.getElementById("LRProcF").checked = false;
                        document.getElementById("OrthogonalRoutingProcF").checked = false;
                        document.getElementById("DirectRoutingProcF").checked = true;
                    }
                    $('#loadingObjectConnectivityFlow').hide();
                    $('#divObjectConnectivity').show();
                    var classes = data.Classes;
                    var methods = data.Methods;
                    var combineList = data.CombineList;
                    window.localStorage.setItem("Classes", classes);
                    window.localStorage.setItem("Methods", methods);
                    window.localStorage.setItem("CombineList", combineList);
                    //bindObjectDictionaryData(classes, methods, combineList);
                }
            }
        },
        statusCode: {
            200: function() {

            },
            201: function() {

            },
            400: function(response) {
                //document.getElementById("tdError").innerHTML = response.responseJSON.Message;
                $('#loadingObjectConnectivityFlow').hide();
            },
            404: function(response) {
                //document.getElementById("tdError").innerHTML = "User " + response.statusText;
                $('#loadingObjectConnectivityFlow').hide();
            }
        },
        error: function(err) {
            var msg = err;
            //document.getElementById("tdError").innerHTML = "Error while connecting to API";
            //net::ERR_CONNECTION_REFUSED
            $('#loadingObjectConnectivityFlow').hide();
        }
    });
}

function loadObjectConnectivity() {

    $('#loadingObjectConnectivityFlow').show();
    //$('#loadingObjectConnectivityFlow').hide();
    $('#divObjectConnectivity').hide();
    jQuery.ajax({
        url: baseAddress + "FileObjectReference/GetObjectReference",
        type: 'GET',
        data: { "projectId": projectId },
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            if (data != null) {
                MainData = data;
                if (MainData.nodeCount === true) {
                    var name = "Project Connectivity";
                    var stamtId = MainData.statementId;
                    var NodeCnt = MainData.NodeCnt;
                    bootbox.confirm({
                        message: "Do you want process for Job queue ?.",
                        callback: function(result) {
                            if (result === true) {
                                addWorkflowProcess(projectId, stamtId, 0, name, NodeCnt);
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                    return false;

                } else {
                    if (data.Nodes) {
                        flowchartObjectProcessFlowChart = data;
                        diagram = $create(Diagram, null, null, null, $get("canvasObjectConnectivity"));
                        diagram.setShowGrid(false);
                        diagram.setLinkHeadShapeSize(2);
                        diagram.setBackBrush("#F2F6F8");
                        var nodeMap = [];
                        var bounds = new Rect(0, 0, 18, 8);
                        var nodes = data.Nodes;
                        Array.forEach(nodes, function(node) {
                            if (node.Color !== 'LightPink' && node.Color !== 'LightGreen') {
                                bounds = new Rect(0, 0, parseInt(node.Width), parseInt(node.Height));
                                var diagramNode = diagram.getFactory().createShapeNode(bounds);
                                var setshape = node.ShapeId;
                                diagramNode.setShape(setshape);
                                nodeMap[node.Id] = diagramNode;
                                diagramNode.setText(node.Name);
                                var color = node.Color;
                                diagramNode.setBrush(color);
                                //diagramNode.resizeToFitText();
                                diagramNode.setPen("White");
                            } else if (node.ChildId > 0) {
                                var setName = node.Name;
                                if ((setName.toUpperCase().startsWith("USES ")) || (setName.toUpperCase().startsWith("RULE "))) {
                                    // create containers
                                    var container = diagram.getFactory().createContainerNode(0, 0, 10, 10);
                                    Array.forEach(nodes, function(node1) {
                                        if (node1.Color === 'LightPink' || node1.Color === 'LightGreen') {
                                            if (node1.ParentId === node.Id || node1.Id === node.Id) {
                                                bounds = new Rect(0, 0, parseInt(node1.Width), parseInt(node1.Height));
                                                var diagramNode = diagram.getFactory().createShapeNode(bounds);
                                                var setshape = node1.ShapeId;
                                                diagramNode.setShape(setshape);
                                                nodeMap[node1.Id] = diagramNode;
                                                diagramNode.setText(node1.Name);
                                                var color = node1.Color;
                                                diagramNode.setBrush(color);
                                                //diagramNode.resizeToFitText();
                                                diagramNode.setPen("White");
                                                container.add(diagramNode);
                                            }
                                        }
                                    });
                                    container.arrange(new MindFusion.Graphs.TreeLayout());
                                    container.setFoldable(true);
                                    container.setZIndex(0);
                                    container.setText(setName);
                                    container.setBrush("#666699");
                                    container.setHandlesStyle(HandlesStyle.HatchHandles3);
                                }
                                //else
                            }
                        });

                        // Add LINKS ------------
                        var links = data.Links;
                        Array.forEach(links, function(link) {
                            var linkText = link.LinkText;
                            var link1 = diagram.getFactory().createDiagramLink(
                                nodeMap[link.Origin],
                                nodeMap[link.Target]);
                            link1.baseShapeSize = "circle";
                            link1.setText(linkText);
                        });
                        var layout = new LayeredLayout();
                        layout.direction = LayoutDirection.TopToBottom;
                        layout.siftingRounds = 2;
                        layout.nodeDistance = 10;
                        layout.layerDistance = 15;
                        diagram.setZoomFactor(66);
                        diagram.arrange(layout);
                        diagram.resizeToFitItems();
                        diagram.font.size = 5;
                        diagram.enabled = true;
                        diagram.width = 450;
                        document.getElementById("TBProcF").checked = true;
                        document.getElementById("LRProcF").checked = false;
                        document.getElementById("OrthogonalRoutingProcF").checked = false;
                        document.getElementById("DirectRoutingProcF").checked = true;
                    }
                    $('#loadingObjectConnectivityFlow').hide();
                    $('#divObjectConnectivity').show();
                    var classes = data.Classes;
                    var methods = data.Methods;
                    var combineList = data.CombineList;
                    window.localStorage.setItem("Classes", classes);
                    window.localStorage.setItem("Methods", methods);
                    window.localStorage.setItem("CombineList", combineList);
                    //bindObjectDictionaryData(classes, methods, combineList);

                }
            }
        },
        statusCode: {
            200: function() {

            },
            201: function() {

            },
            400: function(response) {
                //document.getElementById("tdError").innerHTML = response.responseJSON.Message;
                $('#loadingObjectConnectivityFlow').hide();
            },
            404: function(response) {
                //document.getElementById("tdError").innerHTML = "User " + response.statusText;
                $('#loadingObjectConnectivityFlow').hide();
            }
        },
        error: function(err) {
            var msg = err;
            //document.getElementById("tdError").innerHTML = "Error while connecting to API";
            //net::ERR_CONNECTION_REFUSED
            $('#loadingObjectConnectivityFlow').hide();
        }
    });
}

function onZoomInProcF() {
    debugger;
    var diagram = $find("canvasObjectConnectivity");
    if (diagram.zoomFactor > 200) return;
    diagram.setZoomFactor(diagram.zoomFactor + 10);
}

function onZoomOutProcF() {
    var diagram = $find("canvasObjectConnectivity");
    if (diagram.zoomFactor < 19) return;
    diagram.setZoomFactor(diagram.zoomFactor - 10);
}

function applyTreeLayoutProcF() {
    debugger;
    var diagram = $find("canvasObjectConnectivity");
    var treeLayout = new TreeLayout();
    treeLayout.linkType = TreeLayoutLinkType.Straight;
    treeLayout.levelDistance = treeLayout.nodeDistance = 16;
    diagram.arrange(treeLayout);

}

function applyTopToBottomProcF() {
    var diagram = $find("canvasObjectConnectivity");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 5;
    layout.layerDistance = 5;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    document.getElementById("TBProcF").checked = true;
    document.getElementById("LRProcF").checked = false;

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

function applyLeftToRightProcF() {
    var diagram = $find("canvasObjectConnectivity");
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
    var diagram = $find("canvasObjectConnectivity");
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
    var diagram = $find("canvasObjectConnectivity");
    var layout = new FractalLayout();
    layout.root = diagram.nodes[0];
    diagram.arrange(layout);
    fitItemsProcF(diagram);
}

function applyDirectRoutingProcF() {
    var diagram = $find("canvasObjectConnectivity");
    var layout = new LayeredLayout();
    layout.direction = LayoutDirection.TopToBottom;
    layout.siftingRounds = 0;
    layout.nodeDistance = 8;
    layout.layerDistance = 40;
    diagram.arrange(layout);
    diagram.resizeToFitItems();
    //layout.anchoring = MindFusion.Graphs.Anchoring.Reassign;
    //for (var l = 0; l < diagram.links.length; l++) {
    //    var link = diagram.links[l];
    //    diagram.routeAllLinks();
    //}
    document.getElementById("DirectRoutingProcF").checked = true;
    document.getElementById("OrthogonalRoutingProcF").checked = false;

    if (document.getElementById("TBProcF").checked == true) {
        applyTopToBottomProcF();
    } else {
        applyLeftToRightProcF();
    }
}

function applyOrthogonalRoutingProcF() {
    var diagram = $find("canvasObjectConnectivity");
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
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline"; //James Park
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible"; //James Park
    document.getElementById("DownloadflowchartlinkProcF").style.display = "none"; //James Park
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden"; //James Park

}

function FunVisioProcF() {

    var checked = $('#radioVisioProcF').attr('checked', true);
    if (checked) {
        $('#radiographmlProcF').attr('checked', false);
    } else {
        $('#radioVisioProcF').attr('checked', true);
    }
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline"; //James Park
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible"; //James Park
    document.getElementById("DownloadflowchartlinkProcF").style.display = "none"; //James Park
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden"; //James Park
}

function fitItemsProcF(diagram) {
    var rect = Rect.empty;
    diagram = $find("canvasObjectConnectivity");
    diagram.nodes.forEach(function(node) {
        if (rect == Rect.empty)
            rect = node.bounds;
        else
            rect = rect.union(node.bounds);
    });

    if (rect)
        diagram.setBounds(new Rect(0, 0, rect.right() + 10, rect.bottom() + 10));
}

function ShowPopupDownloadProcF() {

    $('#dvObjectConnectivityDiagramDownload').modal('show');
    document.getElementById("btnDownloadflowchartProcF").style.display = "inline";
    document.getElementById("DownloadflowchartlinkProcF").style.visibility = "hidden"; // Ashish Dhakate
    document.getElementById("btnDownloadflowchartProcF").style.visibility = "visible"; // Ashish Dhakate
}

var flowchartObjectProcessFlowChart = null;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function downloadDataFlowchartProcF() {
    var changeCheckbox = document.querySelector('.demo-switch');
    var opt = 1;
    if (changeCheckbox.checked)
        opt = 2;
    var projectId = window.localStorage.getItem("projectId");
    jQuery.ajax({
        url: baseAddress +
            "FileObjectReference/GetLinkToDownloadObjectDictionaryFlowChart?" +
            "projectId=" +
            projectId +
            "&saveUrlPath=&opt=" + opt,
        type: 'POST',
        data: JSON.stringify(flowchartObjectProcessFlowChart),
        contentType: "application/graphml; charset=utf-8",
        headers: "Content-Type: application/graphml",
        success: function(data) {
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

function addWorkflowProcess(projectId, statementId, workflowId, name, NodeCnt) {
    var workflowProcess = [];
    workflowProcess.push({
        "ProjectId": projectId,
        "WorlflowId": workflowId,
        "StatementId": statementId,
        "Processed": 0,
        "Name": name,
        "NodeCount": NodeCnt,
        "UserId": userId
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkflowProcess/Post",
        data: workflowProcess[0],
        success: function(result) {
            if (result !== null) {

            }
        }
    });
}