var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

var projectId = getParameterByName("pid");

var openWin = function (link) {
    window.open(link, '', "width=" + screen.availWidth + ", height=" + screen.availHeight);
};

// -------------------------------------- Revised Menu Starts -----------------------------------


var downloadRevisedInventory = function(fileMenuId, menu) {
    //var fMenuId = fileMenuId.split("_")[1];
    var revisedMenu = new RevisedMenu();
    revisedMenu.invertoryMenu(fileMenuId, menu);
};

var downloadReqDoc = function (aId) {
    var revisedMenu = new RevisedMenu();
    revisedMenu.downloadReqDoc(aId);
}

var displayWizard = function (actionExecuted) {
    var revisedMenu = new RevisedMenu();
    revisedMenu.customImpact(actionExecuted);
};

var RevisedMenu = function () {
    this.id = 0;

    this.ajax = window.axios.create({
        baseURL: $.fn.baseAddress()
    });

    this.bootBox = window.bootbox;

    this.setId = function (data) {
        data.forEach((menu) => {
            menu.Id = `${++this.id}`;
        });
    };

    this.prepareParentChild = function (data) {
        data.forEach((menu) => {
            // menu.Id = `${++this.id}`;
            menu.Html = this.createHtml(menu);
            menu.ParentId = "-1";
        });
        var mainData = data;
        return mainData;
    };

    this.createHtml = function (m) {
        var objectType = this.getObjectType(m);
        m.MenuId = m.MenuId ? m.MenuId.trim() : "None";
        m.MenuTitle = m.MenuTitle ? m.MenuTitle.trim() : "None";
        var html = "";
        if (m.MenuId) html += m.MenuId;
        if (m.MenuTitle) html += ` | ${objectType} | ${m.MenuTitle}`;
        return html;
    };
};

RevisedMenu.prototype = {

    getBaseMenuData: async function (searchKey) {
        var key = searchKey || "";
        var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + key;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach(function (n) {
                var action = n.ActionExecuted ? n.ActionExecuted.trim().split(" ")[0] : "123$123";
                if (action === "") action = "123$123";
                var inventoryUrl = "downloadRevisedInventory('" + n.FileMenuId + "',true)";
                n.FileMenuId = loopCnt + n.FileMenuId;
                n.ObjectType = 'Menu';
                var pUrl = "displayWizard('" + action + "')";
                n.Actions = "<a data-action=" + action + " onclick=" + pUrl + " style='cursor: pointer;' title='Download impacts document'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>Download</button> </a>";
                n.Actions += "&nbsp; <a data-action=" + action + " onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                if (n.ActionExecuted === "FileObject")
                    n.dataObject = "data-Object";
                else
                    n.dataObject = "menu-Object";
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuFileById: async function (expandedRecord) {
        var fileMenuId = expandedRecord.FileMenuId.split("_")[1];
        var endPoint = `WorkspaceWorkflow/GetMenuFileById?projectId=${projectId}&fileMenuId=${parseInt(fileMenuId)}`;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach(function (n) {
                var menuId = n.MenuLevel;
                n.FileMenuId = loopCnt + n.FileMenuId;
                n.ObjectType = n.LevelNumber === 9998
                    ? "JCL"
                    : n.LevelNumber === 9999
                    ? "Missing"
                    : n.LevelNumber === 0
                    ? " - "
                    : "Menu";
                if (n.ActionExecuted === "FileObject")
                    n.dataObject = "data-Object";
                else
                    n.dataObject = "action-Object";

                if (n.ObjectType === "JCL" || n.ObjectType === "jcl") {
                    var pUrl = `openWin('customview.html?prjId=${n.ProjectId}&fileId=${menuId}');`;
                    var inventoryUrl = "downloadRevisedInventory('" + menuId + "',false)";
                    n.Actions = "<a onclick=" + pUrl +
                        " style='cursor: pointer;' title='Object explorer view'><button  style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                    n.Actions += "&nbsp; <a  href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    n.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        n.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                }
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuByActionExecuted: async function (menuObject) {
        var actionExecuted = menuObject.ActionExecuted;
        var fileMenuId = menuObject.FileMenuId.split("_")[1];
        var endPoint =
            `WorkspaceWorkflow/GetMenuByActionExecuted?projectId=${projectId}&actionExecuted=${actionExecuted
                }&fileMenuId=${parseInt(fileMenuId)}`;
        return await this.ajax.get(endPoint).then((actions) => {
            var actData = actions.data;
            this.setId(actData);
            var loopCnt = "fileMenuId_";
            actData.forEach((m) => {
                var menuId = m.FileMenuId;
                if (m.ActionExecuted === "FileObject") {
                    m.dataObject = "data-Object";
                    var pUrl = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${m.FileMenuId}');`;
                    var inventoryUrl = "downloadRevisedInventory('" + m.FileMenuId + "',false)";
                    m.Actions = "<a onclick=" +
                        pUrl + " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";

                    m.Actions += "&nbsp; <a  &nbsp; href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        m.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                } else
                    m.dataObject = "action-Object";
                m.FileMenuId = loopCnt + m.FileMenuId;
                m.ObjectType = this.getObjectType(m);
                if (m.ObjectType === "JCL" || m.ObjectType === "jcl") {
                    var inventoryUrl12 = "downloadRevisedInventory('" + menuId + "',false)";
                    var pUrl12 = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${menuId}');`;
                    m.Actions = "<a onclick=" +
                        pUrl12 +
                        " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                    m.Actions += "&nbsp; <a  &nbsp; href='#' onclick=" + inventoryUrl12 + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        m.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                }
                m.MenuId = m.MenuId.replace(/.pgm|.sbr|.jcl|.icd|.JCL/g, "");
            });
            var mainData = this.prepareParentChild(actData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuForObject: async function (expRecord) {
        var fileId = expRecord.FileMenuId.split("_")[1];
        var endPoint = "WorkspaceWorkflow/GetMenuForObject?projectId=" + projectId + "&objectId=" + fileId;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach((m) => {
                var pUrl = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${m.FileMenuId}');`;
                var inventoryUrl = "downloadRevisedInventory('" + m.FileMenuId + "',false)";
                m.Actions = "<a onclick=" +
                    pUrl +
                    " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                m.Actions += "&nbsp; <a href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                    m.Id +
                    ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                m.MenuTitle = m.MenuLevel;
                m.FileMenuId = loopCnt + m.FileMenuId;
                m.ObjectType = this.getObjectType(m);
                m.MenuId = m.MenuId.replace(/.pgm|.sbr|.jcl|.icd|.JCL/g, "");
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getObjectType: function (m) {
        var objectType = "";
        if (m.MenuId.endsWith(".pgm")) objectType = "Program";
        if (m.MenuId.endsWith(".sbr")) objectType = "Subroutine";
        if (m.MenuId.endsWith(".jcl")) objectType = "JCL";
        if (m.MenuId.endsWith(".icd")) objectType = "Include";
        if (objectType === "")
            objectType = m.LevelNumber === 9997
                ? "Menu"
                : m.LevelNumber === 9998
                ? "JCL"
                : m.LevelNumber === 9999
                ? "Missing"
                : "-";
        return objectType;
    },

    downloadReqDoc: function (aId) {
        console.log(aId);
        /*
        var projectId = getParameterByName("pid");
        var endPoint = "ExportWordDocument/GenerateRequirementDoc?projectId=" + projectId + "&actionWorkflowId=" + aId;
        this.ajax.get(endPoint).then((res) => {
            this.downloadFile(res.data);
        }).catch(e => {
            console.log(e);
        });
        */
    },

    downloadFile: (path) => {
        if (typeof path === "undefined") {
            return false;
        }
        var element = document.createElement("a");
        element.href = path;
        element.target = "_blank";
        element.click();
        document.removeElement(element);
        return true;
    },

    getNodeColor: function (m) {
        var nodeColor = { color: "#ffcc00", shape: "Ellipse" }
        if (m.ObjectType === "Program") nodeColor = { color: "#FFF78C", shape: "RoundRect" }
        if (m.ObjectType === "Subroutine") nodeColor = { color: "#66ab8c", shape: "RoundRect" }
        if (m.ObjectType === "JCL") nodeColor = { color: "#6ec4db", shape: "RoundRect" }
        if (m.ObjectType === "Include") nodeColor = { color: "#7d5ba6", shape: "RoundRect" }
        return nodeColor;
    },

    prepareNodes: function (menuId, nodes) {
        var row = $("#revisedTreeMenu").jqxTreeGrid('getRow', menuId);
        var node = this.getNodeColor(row);
        nodes.push({
            Id: row.Id,
            Width: "150px",
            Name: row.MenuTitle,
            ShapeId: node.shape,
            Color: node.color
        });
        var parent = row.parent;
        if (parent) return this.prepareNodes(parent.Id, nodes);
        else return nodes;
    },

    prepareLinks: function (nodes, links) {
        for (var i = 1; i < nodes.length; i++) {
            links.push({
                Origin: nodes[i - 1].Id,
                Target: nodes[i].Id,
                LinkText: ""
            });
        }
        return links;
    },

    invertoryMenu: async function (fileMenuId, menu) {
        var endPoint = "WorkspaceWorkflow/GetFileIdsForMenuInventory?projectId=" + projectId + "&fileMenuId=" + fileMenuId + "&menuType=" + menu;
        return await this.ajax.get(endPoint).then((res) => {
            this.downloadFile(res.data.Content);
        }).catch(() => {
            return [];
        });
    },

    customImpact: function (actionExecuted) {
        actionExecuted = actionExecuted || "";
        var jclAction = actionExecuted.trim();
        if (jclAction === "") return;
        var jclName = jclAction.split(" ")[0];
        var endPoint = "CustomRequirment/GetJclObjects?projectId=" + projectId + "&jclName=" + jclName;
        this.ajax.get(endPoint).then((jclData) => {
            this.fillJclObjects(jclData.data);
            var options = {
                contentWidth: 850,
                contentHeight: 450,
                showCancel: false,
                progressBarCurrent: true
            };
            var wizard = $("#revised-menu-wizard").wizard(options);
            wizard.show();
            var _self = this;
            wizard.on('incrementCard', function () {
                var currentCard = this.getActiveCard();
                if (currentCard.alreadyVisited()) return;

                var cardName = currentCard.name;
                // console.log(cardName);
                _self.fillObjects(cardName);
            });
            wizard.on('decrementCard', function () {
                // console.log(this.getActiveCard());
            });
            wizard.on('submit', function (w) {
                w.submitSuccess();
                w.hideButtons();
                w.updateProgressBar(0);
            });
        }).catch((err) => {
            this.bootBox.alert("There is no JCL file associated with this Menu!");
            console.log(err);
        });
    },

    fillObjects: function (cardName) {
        if (cardName === "Programs") {
            var items = $("#listSelectedJclObject").jqxListBox('getItems');
            var jclFile = [];
            items.forEach(function (item) {
                jclFile.push(item.value);
            });
            var fileIds = jclFile.join(",");
            var endPoint = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + fileIds;
            this.ajax.get(endPoint).then((res) => {
                var fileMaster = res.data;
                this.fillProgramObjects(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillProgramObjects(empty);
            });
        } else if (cardName === "Subroutines" /* || cardName === "Includes" */) {
            var pItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
            var pFile = [];
            pItems.forEach(function (item) {
                pFile.push(item.value);
            });
            var pFileIds = pFile.join(",");
            var endPoint1 = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + pFileIds;
            this.ajax.get(endPoint1).then((res) => {
                var fileMaster = res.data;
                this.fillSubroutinesAndIncludes(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillSubroutinesAndIncludes(empty);
            });
        } else if (cardName === "Summary") {
            this.generateSummary();
        } else if (cardName === "Download") {
            this.generateImpactDocument();
        }
    },

    fillJclObjects: function (jcls) {
        $("#listJclObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: jcls,
            checkboxes: true,
            height: 200
        });

        $("#listSelectedJclObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    fillProgramObjects: function (programs) {
        $("#listProgramsObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: programs,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedProgramsObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    fillSubroutinesAndIncludes: function (result) {
        var subRoutines = result.filter(function (element) {
            return element.FileTypeExtensionId === 17;
        });
        $("#listSubroutinesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: subRoutines,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedSubroutinesObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });

        var includes = result.filter(function (element) {
            return element.FileTypeExtensionId === 12;
        });
        $("#listIncludesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: includes,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedIncludesObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    generateSummary: function () {
        $("#tblSummary").html('');
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();
        /* Jcl Object */
        var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
        var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
        var chkJclSource = document.getElementById("chkSourceJCL").checked;
        var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
        var jFileName = [];
        $.each(jclItems, function (i, item) {
            jFileName.push(item.label);
        });
        var jclOjbectDet = {
            "Object Name": jFileName,
            "Entity Schema": chkJclDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkJclPseudo === true ? "Yes" : "No",
            "Source Code": chkJclSource === true ? "Yes" : "No"
        };
        /* Program Object */
        var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
        var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
        var chkPrgSource = document.getElementById("chkSourceProg").checked;
        var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
        var pFileName = [];
        $.each(programItems, function (i, item) {
            pFileName.push(item.label);
        });
        var programOjbectDet = {
            "Object Name": pFileName,
            "Entity Schema": chkPrgDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkPrgPseudo === true ? "Yes" : "No",
            "Source Code": chkPrgSource === true ? "Yes" : "No"
        };
        /* SubRoutine Object */
        var chkSubDbAct = document.getElementById("chkDBActSub").checked;
        var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
        var chkSubSource = document.getElementById("chkSourceSub").checked;
        var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
        var sFileName = [];
        $.each(subRoutineItems, function (i, item) {
            sFileName.push(item.label);
        });
        var subRoutineOjbectDet = {
            "Object Name": sFileName,
            "Entity Schema": chkSubDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkSubPseudo === true ? "Yes" : "No",
            "Source Code": chkSubSource === true ? "Yes" : "No"
        };
        /* Include Object */
        var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
        var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
        var chkIncludeSource = document.getElementById("chkSourceInc").checked;
        var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
        var iFileName = [];
        $.each(includeItems, function (i, item) {
            iFileName.push(item.label);
        });
        var includeOjbectDet = {
            "Object Name": iFileName,
            "Entity Schema": chkIncludeDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkIncludePseudo === true ? "Yes" : "No",
            "Source Code": chkIncludeSource === true ? "Yes" : "No"
        };
        var customRequirmentDocDetails = {
            Title: title,
            Description: description,
            /*
                "Entity Objects": entityOjbectDet,
                "I-Descriptors": iDescptOjbectDet,
            */
            "JCL Objects": jclOjbectDet,
            "Program Objects": programOjbectDet,
            "Sub-Routine Objects": subRoutineOjbectDet,
            "Include Objects": includeOjbectDet
        };
        var html = "";
        html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
        html += "<tr><td>Description</td><td>" + customRequirmentDocDetails["Description"] + "</td></tr>";
        $.each(customRequirmentDocDetails, function (i, item) {
            if (typeof item === "object")
                html += drawSummaryRow(i, item);
        });
        $("#tblSummary").append(html);
    },

    generateImpactDocument: function () {
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();

        /* Entity */
        /*
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
        */
        var entityOjbectDet = {
            ObjDetailsLst: [], // entityObject,
            EntitySchema: false, // chkEntitySchema,
            PseudoCode: false,
            SourceCode: false
        };
        /* IDescriptor */
        /*
        var iDescriptorObject = [];
        var iDescriptorItems = $("#listSelectedIDescriptor").jqxListBox('getItems');
        $.each(iDescriptorItems, function (i, item) {
            iDescriptorObject.push({
                FileName: item.label,
                FileId: item.value
            });
        });
        */
        var iDescriptorOjbectDet = {
            ObjDetailsLst: [], // iDescriptorObject,
            EntitySchema: false,
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
        var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
        var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
        var chkIncludeSource = document.getElementById("chkSourceInc").checked;
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
            EntitySchema: chkIncludeDbAct,
            PseudoCode: chkIncludePseudo,
            SourceCode: chkIncludeSource
        };
        var customRequirmentDocDetails = {
            ProjectId: projectId,
            Title: title,
            Description: description,
            EntityObject: entityOjbectDet,
            DescriptorObject: iDescriptorOjbectDet,
            JclObject: jclOjbectDet,
            ProgramObject: programOjbectDet,
            SubRoutineObject: subRoutineOjbectDet,
            IncludeObject: includeOjbectDet
        };
        document.getElementById("tdError123").innerHTML = "Please wait... Generating custom impacts document...";
        document.getElementById("tdError123").style.color = "green";
        var endPoint = "ExportWordDocument/GenerateCustomReqDocument";
        this.ajax.post(endPoint, customRequirmentDocDetails).then((res) => {
            document.getElementById("hdnDownloadPath").value = res.data;
            document.getElementById("tdError123").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
            document.getElementById("tdError123").style.color = "green";
            document.getElementById("btnDownload").disabled = false;
        }).catch((e) => {
            document.getElementById("tdError123").innerHTML = "Something went wrong, please try again.";
            document.getElementById("tdError123").style.color = "red";
        });

        /*
        jQuery.ajax({
            type: "POST",
            data: customRequirmentDocDetails,
            contenttype: "application/json",
            url: baseAddress + "ExportWordDocument/GenerateCustomReqDocument",
            success: function (data) {
                document.getElementById("hdnDownloadPath").value = data;
                document.getElementById("tdError").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError").style.color = "green";
            },
            error: function () {
                $body.removeClass("loading");
            }
        });
        */
    }
};

$(document).ready(function () {
    $("#btnIncludeJcl").click(function () {
        $('#listSelectedJclObject').jqxListBox('refresh');
        var items = $("#listJclObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveJcl").click(function () {
        var items = $("#listSelectedJclObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludePrograms").click(function () {
        $('#listSelectedProgramsObject').jqxListBox('refresh');
        var items = $("#listProgramsObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedProgramsObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemovePrograms").click(function () {
        var items = $("#listSelectedProgramsObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedProgramsObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludeSubroutines").click(function () {
        $('#listSelectedSubroutinesObject').jqxListBox('refresh');
        var items = $("#listSubroutinesObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveSubroutines").click(function () {
        var items = $("#listSelectedSubroutinesObject").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('removeItem', item);
            }); return false;
    });

    $("#btnIncludeIncludes").click(function () {
        $('#listSelectedIncludesObject').jqxListBox('refresh');
        var items = $("#listIncludesObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveIncludes").click(function () {
        var items = $("#listSelectedIncludesObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnDownload").click(function () {
        var dPath = document.getElementById("hdnDownloadPath").value;
        window.open(dPath, "_self");
        setTimeout(function () {
            window.location.reload(true);
        }, 2500);
    });
});

var showObjConnectivity = function (menuId) {
    var revisedMenu = new RevisedMenu();
    var nodes = [];
    revisedMenu.prepareNodes(menuId, nodes);
    var reversedNodes = nodes.reverse();
    var links = [];
    revisedMenu.prepareLinks(reversedNodes, links);
    var diaLegends = [];

    diaLegends.push({});
    $("#div-revised-tree-dia").modal("show");
    $("#div-revised-tree-diagram").html("");
    var diagram = new DiagramUtility("#div-revised-tree-diagram", {
        width: 5000,
        height: 360,
        backBrush: "#FFFFFF",
        gridLines: true,
        nodes: nodes,
        links: links,
        legends: [{ title: "Starting Point", bgColor: "#ffcc00" }, { title: "JCL", bgColor: "#6ec4db" }, { title: "Program", bgColor: "#FFF78C" },
            { title: "Subroutine", bgColor: "#66ab8c" }, { title: "Include", bgColor: "#7d5ba6" }]
    });
    diagram.setTitle("Objects Connectivity");
};

$(document).ready(function () {
    $("#searchMenuItems").click(async function () {
        var searchKey = $("#txtSearchMenu").val();
        initializeMenuGrid(searchKey);
    });

    initializeMenuGrid("");
});

var initializeMenuGrid = function (searchKey) {
    var revisedMenu = new RevisedMenu();
    var key = searchKey || "";
    $("#revisedTreeMenu").jqxTreeGrid(
        {
            width: "100%",
            height: "700px",
            sortable: true,
            columnsResize: true,
            altRows: true,
            pageSize: 20,
            pageSizeOptions: ['15', '20', '30'],
            pageable: true,
            pagerPosition: 'both',
            pagerMode: "advanced",
            pageSizeMode: "root",
            virtualModeCreateRecords: async function (expandedRecord, done) {
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'ParentId' }, { name: "MenuTitle" }, { name: "Html" }, { name: "Id" }, { name: "ActionExecuted" }, { name: "FileMenuId" },
                        { name: "MenuId" }, { name: "MenuDescription" }, { name: "MenuLevel" }, { name: "LevelNumber" }, { name: "WorkflowMenuName" },
                        { name: "ProjectId" }, { name: "ObjectType" }, { name: "dataObject" }, { name: "Actions" }
                    ],
                    id: 'Id',
                    localData: await (async function (expRecord) {
                        if (expRecord === null) {
                            return await revisedMenu.getBaseMenuData(key);
                        } else if (expRecord && expRecord.dataObject === "menu-Object") {
                            return await revisedMenu.getMenuFileById(expRecord);
                        } else if (expRecord && expRecord.dataObject === "action-Object") {
                            return await revisedMenu.getMenuByActionExecuted(expRecord);
                        } else {
                            return await revisedMenu.getMenuForObject(expRecord);
                        }
                    })(expandedRecord)
                };
                var dataAdapter = new $.jqx.dataAdapter(source,
                    {
                        loadComplete: function () {
                            done(dataAdapter.records);
                        }
                    });
                dataAdapter.dataBind();
            },
            virtualModeRecordCreating: function (record) {
                record.rObject = record;
            },
            columns: [
                { text: 'Object Name', columnGroup: 'MenuId', dataField: 'MenuId', width: "25%" },
                { text: "Object Type", dataField: "ObjectType", width: "8%" },
                { text: 'Object Description', dataField: 'MenuTitle', width: "40%" },
                { text: "Actions", dataField: 'Actions', width: "27%" }
            ]
        });
};

var drawSummaryRow = function (enities, cObject) {
    var html = "";
    html += "<tr>";
    html += "<td>" + enities + "</td>";
    html += "<td><table style='width: 100%;' class='table-bordered table-striped table table-hover'>";
    html += "<tr>";
    var entString = "";
    for (var k = 0; k <= cObject["Object Name"].length - 1; k++) {
        entString += cObject["Object Name"][k] + ", ";
    }
    entString = entString.trim();
    var lastChar = entString.slice(-1);
    if (lastChar === ',') {
        entString = entString.slice(0, -1);
    };
    html += "<td style='width: 23%;'>Objects</td><td>" + entString + "</td></tr>";
    var entitySchema = cObject["Entity Schema"];
    if (entitySchema)
        html += "<tr><td>Entity Schema</td><td>" + entitySchema + "</td></tr> ";
    var pseudoCode = cObject["Pseudo Code"];
    if (pseudoCode)
        html += "<tr><td>Pseudo Code</td><td>" + pseudoCode + "</td></tr> ";
    var sourceCode = cObject["Source Code"];
    if (sourceCode)
        html += "<tr><td>Source Code</td><td>" + sourceCode + "</td></tr> ";

    html += "</td></table>";
    return html;
};


// -------------------------------------- Revised Menu Ends -----------------------------------

/*

$(document).ready(function () {
    getMenuFileRevisedData(projectId);
});

$(document).ready(function () {
    $('#menuTreeView').on('expand', function (event) {
        $body.addClass("loading");
        var htmlTreeGrid = new HtmlTreeGrid();
        var $element = $(event.args.element);
        var topMenuId = $element.prop("id");
        var fileMenuId = topMenuId.split("_")[1];
        var dataObject = $element.prop("data-object");
        var menuObject = $element.prop("menu-object");
        var children = $element.find('ul:first').children();
        var child = children[0];
        if (!child) return;
        var loader = false;
        var loaderItem = null;
        var loadObject = false;
        var loaderObject = null;
        var item = $('#menuTreeView').jqxTree('getItem', child);
        if (item && item.label === 'Loading...' && !dataObject && !menuObject) {
            loaderItem = item;
            loader = true;
        }
        else if (dataObject && !menuObject && item && item.label === 'Loading...') {
            loadObject = true;
            loaderObject = item;
        }
        else if (menuObject && item && item.label === 'Loading...') {
            $body.addClass("loading");
            var actionExecuted = menuObject.ActionExecuted;
            var flMenuId = menuObject.FileMenuId.split("_")[1];
            loaderItem = item;
            var configUrl = {
                url: "WorkspaceWorkflow/GetMenuByActionExecuted?projectId=" + projectId + "&actionExecuted=" + actionExecuted + "&fileMenuId=" + parseInt(flMenuId)
            }
            htmlTreeGrid.getMenuData(configUrl).then((actions) => {
                var actData = actions.data;
                if (actData.length > 0) {
                    var itemId = 0;
                    actData.forEach(function (m) {
                        var newId = m.FileMenuId + "-" + itemId++;
                        var childItem = htmlTreeGrid.prepareItem(newId, m);
                        m.tempId = newId;
                        $('#menuTreeView').jqxTree('addTo', childItem, $element[0]);
                        var lastLi = $element.find('ul li:last');
                        $('#menuTreeView').jqxTree('addTo', { label: "Loading..." }, lastLi);
                        $(lastLi).prop({ "id": m.FileMenuId });
                        if (m.ActionExecuted === "FileObject")
                            $(lastLi).prop({ "data-object": m, "value": m.ActionExecuted });
                        else
                            $(lastLi).prop({ "menu-object": m, "value": m.ActionExecuted });
                    });
                    $('#menuTreeView').jqxTree('removeItem', loaderItem.element);
                } else {
                    $body.removeClass("loading");
                    $(loaderItem.element).prop({ "innerText": "Not found" });
                    loaderItem.label = "Not found";
                }
                $body.removeClass("loading");
            }).catch(r => { console.log(r); $body.removeClass("loading"); });
        }

        if (loader) {
            var config = {
                url: "WorkspaceWorkflow/GetMenuFileById?projectId=" + projectId + "&fileMenuId=" + parseInt(fileMenuId)
            }
            htmlTreeGrid.getMenuData(config).then((actions) => {
                var actData = actions.data;
                if (actData.length > 0) {
                    var itemId = 0;
                    actData.forEach(function (m) {
                        var newId = m.FileMenuId + "-" + itemId++;
                        var childItem = htmlTreeGrid.prepareItem(newId, m);
                        m.tempId = newId;
                        $('#menuTreeView').jqxTree('addTo', childItem, $element[0]);
                        var lastLi = $element.find('ul li:last');
                        $('#menuTreeView').jqxTree('addTo', { label: "Loading..." }, lastLi);
                        $(lastLi).prop({ "id": m.FileMenuId });
                        if (m.ActionExecuted === "FileObject")
                            $(lastLi).prop({ "data-object": m, "value": m.ActionExecuted });
                        else
                            $(lastLi).prop({ "menu-object": m, "value": m.ActionExecuted });
                    });
                    $('#menuTreeView').jqxTree('removeItem', loaderItem.element);
                } else {
                    $(loaderItem.element).prop({ "innerText": "Not found" });
                    loaderItem.label = "Not found";
                }
                $body.removeClass("loading");
            }).catch(r => { $body.removeClass("loading"); console.log(r); });
        }

        if (loadObject) {
            console.log(dataObject);
            var fileId = dataObject.FileMenuId.split("_")[1];
            var dtConfig = {
                url: "WorkspaceWorkflow/GetMenuForObject?projectId=" + projectId + "&objectId=" + parseInt(fileId)
            }
            htmlTreeGrid.getMenuData(dtConfig).then((actions) => {
                var actData = actions.data;
                if (actData.length > 0) {
                    var itemId = 0;
                    actData.forEach(function (m) {
                        var newId = m.FileMenuId + "-" + itemId++;
                        var childItem = htmlTreeGrid.prepareObject(newId, m);
                        m.tempId = newId;
                        $('#menuTreeView').jqxTree('addTo', childItem, $element[0]);
                        var lastLi = $element.find('ul li:last');
                        $('#menuTreeView').jqxTree('addTo', { label: "Loading..." }, lastLi);
                        $(lastLi).prop({ "id": m.FileMenuId, "data-object": m });
                    });
                    $('#menuTreeView').jqxTree('removeItem', loaderObject.element);
                } else {
                    $(loaderObject.element).prop({ "innerText": "Not found" });
                    loaderObject.label = "Not found";
                }
                $body.removeClass("loading");
            }).catch(r => { $body.removeClass("loading"); console.log(r); });
        }

        if (!loader && !loadObject && !item) $body.removeClass("loading");

        return;
    });
});

var openWin = function (link) {
    window.open(link, '', "width=" + screen.availWidth + ", height=" + screen.availHeight);
};

var showTreePopup = function (m) {
    $body.addClass("loading");
    $('#menuTreeView').jqxTree('clear');
    var htmlTreeGrid = new HtmlTreeGrid();
    var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + m.id;
    htmlTreeGrid.getMenuData({ url: endPoint }).then((d) => {
        var menuData = d.data;
        var loopCnt = "fileMenuId_";
        menuData.forEach(function (n) {
            n.FileMenuId = loopCnt + n.FileMenuId;
        });
        var mainData = htmlTreeGrid.prepareParentChild(menuData);
        htmlTreeGrid.bindTree(mainData);
        $body.removeClass("loading");
        $("#divMenuTree").modal("show");
    }).catch((e) => {
        console.log(e);
        $body.removeClass("loading");
        $("#divMenuTree").modal("hide");
    });
}

function getMenuFileRevisedData(projectId) {
    $body.addClass("loading");
    $('#menuTreeView').jqxTree('clear');
    var htmlTreeGrid = new HtmlTreeGrid();
    var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + $("#txtMenuSearch").val();
    htmlTreeGrid.getMenuData({ url: endPoint }).then((d) => {
        var menuData = d.data;
        var loopCnt = "fileMenuId_";
        menuData.forEach(function (m) {
            m.FileMenuId = loopCnt + m.FileMenuId;
            m.showButton = "<button id=" + m.MenuId + " value=" + m.FileMenuId + " onclick='showTreePopup(this);' class='btn btn-primary'>Show</button>";
        });
        htmlTreeGrid.bindMenuTable(menuData);
        $body.removeClass("loading");
    }).catch((e) => {
        console.log(e);
        $body.removeClass("loading");
    });
};

var HtmlTreeGrid = function () {
    this.ajax = window.axios.create({
        baseURL: $.fn.baseAddress()
    });

    this.getMenuData = async function (config) {
        return await this.ajax.get(config.url);
    };

    this.createHtml = function (m) {
        var objectType = m.LevelNumber === 9997
            ? "Menu"
            : m.LevelNumber === 9998
                ? "JCL"
                : m.LevelNumber === 9999
                    ? "Missing"
                    : "";
        m.MenuId = m.MenuId ? m.MenuId.trim() : "None";
        m.MenuTitle = m.MenuTitle ? m.MenuTitle.trim() : "None";
        var html = "";
        if (m.MenuId) html += m.MenuId;
        if (m.MenuTitle) html += ` | ${objectType} | ${m.MenuTitle}`;
        return html;
    };

    this.createObjectHtml = function (m) {
        var html = "";
        var objectType = "";
        if (m.MenuId.endsWith(".pgm")) objectType = "Program";
        if (m.MenuId.endsWith(".sbr")) objectType = "Subroutine";
        if (m.MenuId.endsWith(".jcl")) objectType = "JCL";
        if (m.MenuId.endsWith(".icd")) objectType = "Include";
        if (objectType === "")
            objectType = m.LevelNumber === 9997
                ? "Menu"
                : m.LevelNumber === 9998
                    ? "JCL"
                    : m.LevelNumber === 9999
                        ? "Missing"
                        : "";
        if (m.MenuId) html += m.MenuId + " | " + objectType + " | " + m.MenuLevel;

        var fileId = m.FileMenuId.split('_')[1]; //     color: blue; padding - left: 10px;
        var url = `customview.html?prjId=${projectId}&fileId=${fileId}`;
        if (objectType !== "Menu") html += "<a style='color: blue; padding-left: 10px; cursor: pointer; text-decoration: none;' onclick=openWin('" + url + "'); href='#'>View</a>";
        return html;
    };

    this.prepareItem = function (id, item) {
        item.FileMenuId = "parentMenuId_" + item.FileMenuId;
        item.Id = id;
        item.Html = item.ActionExecuted === "FileObject" ? this.createObjectHtml(item) : this.createHtml(item);
        item.ParentId = item.Id;
        item.label = item.Html;
        return item;
    }

    this.prepareObject = function (id, item) {
        item.FileMenuId = "parentMenuId_" + item.FileMenuId;
        item.Id = id;
        item.Html = this.createObjectHtml(item);
        item.ParentId = item.Id;
        item.label = item.Html;
        return item;
    }

    this.prepareParentChild = function (data) {
        var id = 0;
        data.forEach((menu) => {
            menu.Id = "" + ++id;
            menu.Html = this.createHtml(menu);
            menu.ParentId = "-1";
        });
        var mainData = data;
        data.forEach(function (menu) {
            mainData.push({
                Id: "" + ++id,
                Html: "Loading...",
                ParentId: menu.Id,
                MenuTitle: "Loading..."
            });
        });
        return mainData;
    };

    this.bindTree = function (data) {
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'ParentId' }, { name: "MenuTitle" }, { name: "Html" }, { name: "Id" }, { name: "ActionExecuted" },
                { name: "FileMenuId" }
            ],
            id: 'Id',
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy('Id',
            'ParentId',
            'items',
            [
                { name: 'Html', map: 'label' },
                { name: "FileMenuId", map: "id" }, { name: "ActionExecuted", map: "value" },
                { name: "ActionExecuted", map: "actionExecuted" }
            ]);
        $('#menuTreeView').jqxTree('clear');
        $('#menuTreeView').jqxTree({ source: records, width: "100%;", height: 450 });
        $('#menuTreeView').jqxTree('expandAll');
    };

    this.bindMenuTable = function (menuData) {
        $('#menuTable').DataTable({
            data: menuData,
            pagingType: "full_numbers",
            destroy: true,
            columns: [
                { data: 'MenuId' },
                { data: 'MenuTitle' },
                //{ data: 'MenuDescription' },
                { data: 'showButton' }
            ]
        });
    };
};

HtmlTreeGrid.prototype = {
    search: async function (searchKey, config) {
        config.url = config.url + "&keyword=" + searchKey;
        return await new Promise((resolve, reject) => {
            return this.ajax.get(config.url).then((res) => { resolve(res); }).catch((e) => { reject(e); });
        });
    }
};

* /

/*

var s = [1, 2, 3, 2, 4, 5, 5];
var e = [... new Set(s)];
console.log(e);

var p = ["sadf", "wtrw", "435", "567fff"];
var [a, s, f] = p;

*/

/*
$(document).ready(function () {
    var abc = new AbcModule();
    abc.init("dvTest");
    abc.getText("dvTest", function (t) {
        $(this.selector).html(t);
        // console.log(t);
    }.bind(abc));
    abc.setText(" This is sample div");
});

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.AbcModule = factory();
    }
}(typeof window !== "undefined" ? window : this, function () {
    "use strict";
    var AbcModule = function () {
        this.getText = function (s, callback) {
            jQuery.ajax({
                url: "https://127.0.0.1:8888/api/WorkspaceWorkflow/GetViewSourceData?projectId=4&fileId=3346",
                type: "GET",
                contentType: "application/json;charset=utf-8",
                success: function (tData) {
                    if (tData != null) {
                        $(this.selector).html(tData);
                        callback.call(null, tData);
                    }
                },
                error: function () {
                    callback.call(null, "Internal Server Error. Please try later");
                }
            });
        };
        var defaults = {
            width: "100px",
            height: "300px",
            text: "This is Yogesh Sonawane",
            max: Math.max
        };

        var init = function (s, options) {
            var opt = $.extend(null, options, this.defaults);
            this.selector = document.getElementById(s);
            this.options = opt;
        };
        var setText = function (t) {
            $(this.selector).html(t);
        };

        return {
            defaults, init, setText, getText: this.getText
        }
    };
    return AbcModule;
}));
*/