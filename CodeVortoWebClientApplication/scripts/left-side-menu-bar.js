var pages = [
    "guide324.html", "guide1.html", "guide2.html", "guide3.html", "guide4.html", "guide5.html", "guide6.html", "guide7.html",
    "guide8.html", "guide9.html", "guide10.html", "guide11.html", "guide12.html", "guide13.html"
];
$(document).ready(function () {
    var url = window.location.pathname;
    var fileName = url.substring(url.lastIndexOf('/') + 1);
    console.log(fileName);
    var menuToShow = "landingRoleMenu";
    for (var f = 0; f < pages.length; f++) {
        if (pages[f] === fileName) {
            menuToShow = "userRoleMenu";
            break;
        }
    }
    
    // if (pages.indexOf(fileName)) menuToShow = "userRoleMenu";
    var finalMeunBar = window.localStorage.getItem(menuToShow);
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});

//var baseAddress = $.fn.baseAddress();

/*
$(document).ready(function() {
    $('#mainnav').load('left-side-template.html');
});
*/
//var prjctId = window.localStorage.getItem("prjctId");


/*

$(document).ready(function () {
    var url = window.location.href;
    var parts = url.split("#").shift().split("?").shift();
    var part = parts.split("/").pop();
    var inventory = "<li><a href='#'><i class='fa fa-gift'></i>" +
        "<span class='menu-title'> Inventory</span>" +
        "<i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href=\"javascript:viewInventory();\">View Inventory</a></li>" +
        "<li><a href=\"javascript:downloadInventoryPopup();\">Download Inventory</a></li>" +
        "<li><a href=\"javascript:viewDbSchema();\">View DB Schema</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:downloadObjectConnectivityFlowchart('Object Connectivity')\">Object Connectivity</a></li>" +
        "<li><a href=\"javascript:portfolioDownloadFlowChart('Workflow Connectivity')\">Workflow Connectivity</a></li>" +
        "</ul></li>" +
        "<li class='list-divider'>";

    var workProduct = "<li><a href='#'><i class='fa fa-cogs'></i>" +
        "<span class='menu-title'> Work Product</span><i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href=\"javascript:addSystemDescription();\">System Description</a></li>" +
        "<li><a href=\"javascript:showDictionaryDialog();\">Object Dictionary</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showCustomWorkflow();\">Custom Workflow</a></li>" +
        "</ul></li>" +
        "<li class='list-divider'>";
    if (part.includes("landing.html")) {
        inventory = "<li><a href='#'><i class='fa fa-gift'></i>" +
            "<span class='menu-title'> Inventory</span><i class='arrow'></i>" +
            "</a><ul class='collapse'>" +
            "<li><a href=\"javascript:showPortfolioDialog()\">Overall Workflow</a></li>" +
            "<li><a href=\"javascript:showPortfolioDialogConnectivity()\">Overall Connectivity</a></li>" +
            "</ul></li>" +
            "<li class='list-divider'>";
         workProduct = "";
    }
    var dashBoard = "<li class='active-link'>" +
        " <a href='landing.html'>" +
        "<i class='fa fa-dashboard'>" +
        "</i><span class='menu-title'>" +
        "<strong> Dashboard</strong>" +
        "<span class='label label-success pull-right'>Top</span></span></a></li>" +
        "<li class='list-divider'>";

    var searchMenu = " <li><a href='#'><i class='fa fa-search'></i>" +
        "<span class='menu-title'>Search</span><i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href='#' id='aQueryConsole'><span class='menu-title'>Keyword Search</span></a></li>" +
        "<li><a href=\"javascript:showCustomView('Object Search');\">Object Search</a></li></ul></li>" +
        "<li class='list-divider'>";

    var customImpacts = "<li>" +
        "<a href=\"javascript:showSideAdminPages('custom-requirements.html','Custom Impacts');\">" +
        "<i class='fa fa-file-word-o'></i>" +
        "<span class='menu-title'> Custom Impacts </span>" +
        "</a>" +
        "</li>" +
        "<li class='list-divider'>";
    
    var reports = "<li><a href='#'><i class='fa fa-sticky-note'></i>" +
        "<span class='menu-title'> Reports </span><i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href=\"javascript:showSideAdminPages('report.html?opt=1','Inventory Report');\">Inventory</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('crud_activity_report.html?opt=2','CRUD Activity');\">CRUD Activity</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('crud_activity_report.html?opt=1','Entity/Attribute Usage');\">Entity/Attribute Usage</a></li>" +
        "<li><a href=\"javascript:showSideAdminPages('user_activity_report.html?opt=2','Unused Attributes');\"> Unused Attributes</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('report.html?opt=3','Workflows Report');\">Workflows</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('report.html?opt=2','Progress Report');\">Progress</a></li>" +
        "</ul></li>" +
    
    var other = "<li class='list-header'>OTHER</li>";


    var myProfile = "<li><a href=\"javascript:showSideAdminPages('my_profile.html','My Profile');\">" +
        "<i class='fa fa-th'></i>" +
        "<span class='menu-title'> My Profile<span class='label label-mint pull-right'>New</span>" +
        "</span></a></li>" +
        "<li class='list-divider'></li>";

    var siteAdmin = "<li id='menuSiteAdmin' style='display:inline;'>" +
        "<a href='#'><i class='fa fa-cog fa-fw fa'></i><span class='menu-title'><strong> Site Admin</strong></span>" +
        "<i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href=\"javascript:showSideAdminPages('review_logs.html','Review Logs');\">Review Logs</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('product_config.html','Product Config');\">Product Config</a></li>" +
        "<li><a href=\"javascript:showSideAdminPages('db_config.html','DB Config');\">DB Config</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('lic_details.html','License Details');\">License Details</a></li>" +
        "<li><a href=\"javascript:showSideAdminPages('pseudocode.html','Pseudo Code');\">Pseudo Code</a></li>" +
        "<li class='list-divider'> </li>" +
        "<li><a href=\"javascript:showSideAdminPages('user_activity_report.html?opt=1','User Activity Report');\">User Activity Report</a></li>" +
        "</ul></li>" +
    "<li class='list-divider'></li>";

    var clientAdmin = "<li id='menuClientAdmin'><a href='#'><i class='fa fa-plug'></i>" +
        "<span class='menu-title'><strong> Client Admin</strong></span><i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href=\"javascript:showSideAdminPages('user_management.html','User Management');\">User Management</a></li>" +
        "<li><a href=\"javascript:showSideAdminPages('roles_admin.html','Role Management');\">Role Management</a></li>" +
        "</ul></li>" +
        "<li class='list-divider'></li>";

    var projectAdmin = "<li><a href='#'><i class='fa fa-briefcase'></i><span class='menu-title'> Project Admin</span>" +
        "<i class='arrow'></i></a>" +
        "<ul class='collapse'>" +
        "<li><a href=\"javascript:showSideAdminPages('submit_new_projects.html','Submit New Project');\">Submit New Project</a></li>" +
        "<li><a href=\"javascript:showSideAdminPages('load_projects.html','Load Project Workspace');\">Load Project Workspace</a></li>" +
        "<li class'list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('view_rules.html','View Functions Catalog');\">View Functions Catalog</a></li>" +
        "<li class='list-divider'></li>" +
        "<li><a href=\"javascript:showSideAdminPages('task_queue.html','Task Queue');\">" +
        "<span class='menu-title'><strong>Task Queue</strong>" +
        "<span class='pull-right badge badge-warning' id='cntTaskQueue'></span></span></a></li>" +
        "</ul></li>";
    var mainnavWidget =
        "<div class='mainnav-widget'><div class='show-small'><a href='#' data-toggle='menu-widget' data-target='#demo-wg-server'>" +
            "<i class='fa fa-desktop'></i></a></div>" +
            "<div id='demo-wg-server' class='hide-small mainnav-widget-content'>" +
            "<ul class='list-group'>" +
            "<li class='list-header pad-no pad-ver'>Product Status</li>" +
            "<li class='mar-btm'><span class='label label-purple pull-right'>75%</span><p>License Period</p>" +
            "<div class='progress progress-sm'>" +
            "<div class='progress-bar progress-bar-purple' style='width: 75%;'>" +
            "<span class='sr-only'>75%</span></div></div></li>" +
            "<li class='pad-ver'><a href=\"javascript:showSideAdminPages('lic_details.html?opt=2','View Details');\" class='btn btn-success btn-bock'>View Details</a></li>" +
            "</ul></div></div>";

    var finalMeunBar = dashBoard +
        searchMenu +
        inventory +
        customImpacts +
        reports +
        workProduct +
        other +
        myProfile +
        siteAdmin +
        clientAdmin +
        projectAdmin;
    $("#mainnav").append("<div class='nano'> <div class='nano-content'><ul id='mainnav-menu' class='list-group'>" + finalMeunBar + "</ul>" + mainnavWidget + "</div></div>");
});

*/

/*

// Please prefere this way of defining the module...
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.leftMenu = factory();
    }
}(typeof window !== "undefined" ? window : this, function () {
    "use strict";
    var LeftMenuTemplate = function () { };
    var prototypes = {};
    prototypes.goToPage = function (pageUrl) {
        window.top.location.href = pageUrl;
    };
    prototypes.navigateTo = function (element) {
        window.top.location.href = element.dataset.link;
    };
    prototypes.openWin = function (element, projectId, fileId) {
        projectId = projectId || 0;
        fileId = fileId || 0;
        window.open(element.dataset.link + "?projectId=" + projectId + "&fileId=" + fileId, "", "width=" + screen.availWidth + ",height=" + screen.availHeight);
    }
    LeftMenuTemplate.prototype = prototypes;

    return new LeftMenuTemplate();
}));

$(document).ready(function () {
    $(".aLink").click(function (e) {
        leftMenu.navigateTo(e.target);
    });

    $(".popup-win").click(function (e) {
        leftMenu.openWin(e.target);
    });

    $("#aLogout").click(function () {
        window.localStorage.clear();
        window.location.href = "login.html";
    });
});
*/