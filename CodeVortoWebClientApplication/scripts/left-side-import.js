// ReSharper disable once Html.EventNotResolved
window.addEventListener("WebComponentsReady", function () {
    var link = document.querySelector('link[data-name="left-menu"]');
    if (!link.import) return;
    var template = link.import.querySelector('.nano');
    var leftMenu = document.importNode(template, true);
    document.querySelector('#mainnav').appendChild(leftMenu);

    //var footer = link.import.querySelector('#footer');
    //var pageFooter = document.importNode(footer, true);
    //document.querySelector('#container').appendChild(pageFooter);

    //var navbarHeader = document.querySelector('link[data-name="navbar-header"]');
    //var navHeader = navbarHeader.import.querySelector('.navbar-header');
    //var navbarContent = navbarHeader.import.querySelector('.navbar-content');
    //var header = document.importNode(navHeader, true);
    //var content = document.importNode(navbarContent, true);
    //document.querySelector('#navbar-container').appendChild(header);
    //document.querySelector('#navbar-container').appendChild(content);

    //var pageBreadCrumb = document.querySelector('link[data-name="bread-crumb"]');
    //var path = window.location.pathname;
    //var fileName = path.split("/").pop().split('#').shift();
    //var nameOnly = fileName.split(".").shift();
    //var breadCrumbs = pageBreadCrumb.import.querySelector('#' + nameOnly);
    //var elements = $(breadCrumbs.innerHTML);
    //$('#page-bread-crumb').html(elements);
});