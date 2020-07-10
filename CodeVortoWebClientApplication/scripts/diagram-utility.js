var Diagram = MindFusion.Diagramming.Diagram;
var Rect = MindFusion.Drawing.Rect;
var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var Reassign = MindFusion.Graphs.Anchoring.Reassign;
var LayoutDirection = MindFusion.Graphs.LayoutDirection;
var TreeLayout = MindFusion.Graphs.TreeLayout;
var TreeLayoutLinkType = MindFusion.Graphs.TreeLayoutLinkType;
var FractalLayout = MindFusion.Graphs.FractalLayout;

function DiagramUtility() {
    this.createInstance = function(id, gridLines, backBrush) {
        var diagram = window.$create(Diagram, null, null, null, window.$get(id)); // Diagram.find("diagram");
        diagram.setShowGrid(gridLines);
        diagram.setLinkHeadShapeSize(2);
        diagram.setBackBrush(backBrush);
        diagram.imageSmoothingEnabled = false;
    };

    this.addControlPanel = function(id, canvasId) {
        var panelBody = preparePanel(canvasId);
        var instance = $("#" + id);
        instance.append(panelBody);
    };

    this.getInstance = (id) => {
        var diagram = Diagram.find(id);
        return diagram;
    };

    this.build = function(id, nodes, links) {
        var diagram = window.$create(Diagram, null, null, null, window.$get(id)); //this.getInstance(id); 
        this.buildDiagram(diagram, nodes, links);
    };

    this.buildDiagram = function(diagram, lstNodes, lstLinks) {
        diagram.clearAll();
        var nodeMap = [];
        var nodes = lstNodes;
        $.each(nodes, function(node) {
            var nodewidth;
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
        $.each(links, function(link) {
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
    };

    this.topToBottom = function(id) {
        var diagram = this.getInstance(id);
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        layout.anchoring = Reassign;
    };

    this.zoomIn = function(id) {
        var diagram = Diagram.find(id);
        if (diagram.zoomFactor > 200) return;
        diagram.setZoomFactor(diagram.zoomFactor + 10);
    };

    this.zoomOut = function(id) {
        var diagram = Diagram.find(id);
        if (diagram.zoomFactor < 19) return;
        diagram.setZoomFactor(diagram.zoomFactor - 10);
    };

    this.resetZoom = function(id) {
        var diagram = Diagram.find(id);
        diagram.setZoomFactor(100);
    };

    this.treeLayout = function(id) {
        var diagram = Diagram.find(id);
        var treeLayout = new TreeLayout();
        treeLayout.linkType = TreeLayoutLinkType.Straight;
        treeLayout.nodeDistance = 6;
        treeLayout.levelDistance = 12;
        diagram.arrange(treeLayout);
    };

    this.leftToRight = function(id) {
        var diagram = Diagram.find(id);
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.LeftToRight;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        layout.anchoring = Reassign;
    };

    this.topToBottom = function(id) {
        var diagram = Diagram.find(id);
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        layout.anchoring = Reassign;
    };

    this.layeredLayout = function(id) {
        var diagram = Diagram.find(id);
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
    };

    this.fractalLayout = function(id) {
        var diagram = Diagram.find(id);
        var layout = new FractalLayout();
        layout.root = diagram.nodes[0];
        diagram.arrange(layout);
        fitFractalItems(diagram);
    };

    this.directRouting = function(id) {
        var diagram = Diagram.find(id);
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
    };

    this.orthogonalRouting = function(id) {
        var diagram = Diagram.find(id);
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        this.topToBottom();
    };

    function fitFractalItems(diagram) {
        var rect = Rect.empty;
        diagram.nodes.forEach(function(node) {
            if (rect === Rect.empty)
                rect = node.bounds;
            else
                rect = rect.union(node.bounds);
        });
        if (rect) {
            diagram.setBounds(new Rect(0, 0, rect.right() + 10, rect.bottom() + 10));
        }
    };

    this.downloadCanvasDiagram = function(id) {
        var gDiagram = Diagram.find(id);
        var gNodes = [];
        var gLinks = [];
        $.each(gDiagram.nodes, function(i, node) {
            var nodeName = node.nodeName || "";
            nodeName = nodeName.replace("&apos;", "'").replace("&gt;", ">").replace("&lt;", "<")
                .replace("&quot;", "\"").replace("&amp;", "&");
            gNodes.push({
                Id: node.id,
                Name: nodeName,
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

        $.each(gDiagram.links, function(i, link) {
            var linkText = link.linkText;
            linkText = linkText.replace("&apos;", "'").replace("&gt;", ">").replace("&lt;", "<")
                .replace("&quot;", "\"").replace("&amp;", "&");
            var lineTp = "";
            var lineCl = "";
            if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
                lineTp = link.lineType;
                lineCl = link.lineColor;
            }
            gLinks.push({
                LinkText: linkText,
                StatementId: link.statementId,
                ProgramId: link.programId,
                Origin: link.originId,
                Target: link.targetId,
                ActionWorkflowId: link.actionWorkflowId,
                LineType: lineTp,
                LineColor: lineCl
            });
        });
    }
}

function preparePanel(id) {
    var root = $("<div />").attr("class", "col-md-8");
    var table = $("<table />").append($("<tbody />"));
    var row = $("<tr />");
    row.append($("<td />").append($("<a style='cursor: pointer;'>" +
        " <i style='margin-left: 5px; margin-right: 4px;' class='fa fa-search-plus  fa-2x' title='Zoom In' " +
        " onclick=zoomIn('" + id + "'); aria-hidden='true'></i>")));
    row.append($("<td />").append($("<a style='cursor: pointer;'>" +
        " <i class='fa fa-search-minus  fa-2x' style='margin-left: 4px; margin-right: 4px;' title='Zoom Out' " +
        " onclick=zoomOut('" + id + "'); aria-hidden='true'></i></a>")));
    row.append($("<td />").append($("<a style='cursor: pointer;'>" +
        " <i class='fa fa-search  fa-2x' style='margin-left: 4px; margin-right: 4px;' title='Reset' " +
        " onclick=resetZoom('" + id + "'); aria-hidden='true'></i></a>")));
    row.append($("<td />").append($("<a style='cursor: pointer;'>" +
        " <i class='fa fa-arrow-right fa-2x' style='margin-left: 4px; margin-right: 4px;' title='Left to Right' " +
        " onclick=leftToRight('" + id + "'); aria-hidden='true'></i></a>")));
    row.append($("<td />").append($("<a style='cursor: pointer;'>" +
        " <i class='fa fa-arrow-down fa-2x' style='margin-left: 4px; margin-right: 4px;' title='Top to Bottom' " +
        " onclick=topToBottom('" + id + "'); aria-hidden='true'></i></a>")));
    row.append($("<td />").append("&nbsp;"));
    row.append($("<td />").append($("<button onclick=directRouting('" + id + "'); " +
        "title='Routing: Direct' class='btn btn-primary'>Direct</button>")));
    row.append($("<td />").append("&nbsp;"));
    row.append($("<td />").append($("<button onclick=orthogonalRouting('" + id + "'); " +
        "title='Routing: Orthogonal' class='btn btn-primary'>Orthogonal</button>")));
    row.append($("<td />").append("&nbsp;"));
    row.append($("<td />").append($("<button onclick=treeLayout('" + id + "'); " +
        "title='Layout: Tree Layout' class='btn btn-primary'>Tree Layout </button>")));
    row.append($("<td />").append("&nbsp;"));
    row.append($("<td />").append($("<button onclick=layeredLayout('" +
        id +
        "'); title='Layout: Layered Layout' class='btn btn-primary'>Layered Layout</button>")));
    row.append($("<td />").append("&nbsp;"));
    row.append($("<td />").append($("<button onclick=fractalLayout('" + id + "'); " +
        "title='Layout: Fractal Layout' class='btn btn-primary'>Fractal Layout</button>")));
    row.append($("<td />").append("&nbsp;"));
    row.append($("<td />").append($("<button class='btn btn-mint btn-labeled  " +
        "fa fa-download' onclick=downloadCanvasDiagram('" + id + "');>Download</button>")));
    row.append($("<td />").append("&nbsp;"));
    table.append(row);
    root.append(table);
    return root;
};