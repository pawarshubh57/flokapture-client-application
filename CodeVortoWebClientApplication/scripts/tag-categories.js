var baseAddress = $.fn.baseAddress();
$(document).ready(function () {
    fillGrid();
    $("#btnCreateNewTag").click(function () {
        $("#divAdd").show();
        $("#divUpdate").hide();
        $("#divView").hide();
        $("#txtCategory").val();
    });

    $("#btnAddTag").click(function () {
        var error = document.getElementById("tdError");
        if ($("#txtCategory").val() === "") {
            error.innerHTML = "Please enter Tag Category";
            $("#txtCategory").focus();
            $("#txtCategory").css("border-color", "red");
            $("#txtCategory").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var itemSource = {
            TagCategoryName: $("#txtCategory").val(),
            Active:1
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagCategory/AddNewItem",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(itemSource),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag category added successfully.";
                    error.style.color = "green";
                    fillGrid();
                    return true;
                }
                return false;
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    error.innerHTML = response.responseJSON.Message;
                    error.style.color = "red";
                },
                404: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                },
                500: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                }
            },
            error: function (e) {
                console.log(e);
                error.innerHTML = "Error while connecting to API";
                error.style.color = "red";
            }
        });
    });

    $("#btnEditTagCategory").click(function() {
        var tagCategoryId = document.getElementById("hdnCategoryId").value;
        $("#tdError12").html("");
        if (tagCategoryId !== "") {
            $("#divView").hide();
            $("#divAdd").hide();
            $("#divUpdate").show();
            $.get(baseAddress + "TagCategory/GetItems?tagCategoryId=" + tagCategoryId,
                function(result) {
                    if (result !== null) {
                        $("#txtTabCategory12").val(result.TagCategoryName);
                    }
                    return false;
                });
        }
        return false;
    });

    $("#btnUpdateTagCategory").click(function() {
        var error = document.getElementById("tdError");
        if ($("#txtTabCategory12").val() === "") {
            error.innerHTML = "Please enter Tag Category";
            $("#txtTabCategory12").focus();
            $("#txtTabCategory12").css("border-color", "red");
            $("#txtTabCategory12").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagCategoryId = document.getElementById("hdnCategoryId").value;
        var tagCategory = {
            TagCategoryName: $("#txtTabCategory12").val(),
            TagCategoryId: tagCategoryId,
            Active:1
        };
        jQuery.ajax({
            type: "PUT",
            url: baseAddress + "TagCategory/UpdateItem",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagCategory),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag  updated successfully.";
                    error.style.color = "green";
                    fillGrid();
                    return true;
                }
                return false;
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    error.innerHTML = response.responseJSON.Message;
                    error.style.color = "red";
                },
                404: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                },
                500: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                }
            },
            error: function (e) {
                console.log(e);
                error.innerHTML = "Error while connecting to API";
                error.style.color = "red";
            }
        });
    });

    $("#btnDeleteTag").click(function() {
        document.getElementById("tdEmpError").innerHTML = "";
        var error = document.getElementById("tdEmpError");
        var tagCategoryId = document.getElementById("hdnCategoryId").value;
        if (tagCategoryId === "") {
            error.innerHTML = "Please select Tag Category";
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "TagCategory/DeteleItem?categoryId=" + tagCategoryId,
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                if (result !== null) {
                    error.innerHTML = "Tag category deleted successfully.";
                    error.style.color = "green";
                    fillGrid();
                    return true;
                }
                return false;
            },
            statusCode: {
                200: function() {

                },
                201: function() {

                },
                400: function(response) {
                    error.innerHTML = response.responseJSON.Message;
                    error.style.color = "red";
                },
                404: function(response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                },
                500: function(response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                }
            },
            error: function(e) {
                console.log(e);
                error.innerHTML = "Error while connecting to API";
                error.style.color = "red";
            }
        });
    });

});
function fillGrid() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagCategory/GetAllItems",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var width = "100%";
            if (data.length === 0) {
                width = "80%";
            }
            if (data.length > 0) {
                $("#divTagCategories").ejGrid(
                    {
                        dataSource: data,
                        allowSorting: true,
                        allowPaging: true,
                        allowReordering: true,
                        allowResizeToFit: true,
                        allowScrolling: true,
                        scrollSettings: { width: width },
                        allowSearching: true,
                        allowResizing: true,
                        toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Search] },
                        columns: [
                            { headerText: 'TagCategoryId', visible: false, field: 'TagCategoryId' },
                            { headerText: 'Tag Category', field: 'TagCategoryName' }
                        ],
                        rowSelected: function (args) {
                            var tagCategoryId = args.data.TagCategoryId;
                            document.getElementById("hdnCategoryId").value = tagCategoryId;
                            GetTagCategory(tagCategoryId);
                        }
                    });
            }
        }
    });
}

function GetTagCategory(tagCategoryId) {
    $("#divView").show();
    $("#divAdd").hide();
    $("#divUpdate").hide();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagCategory/GetItems?tagCategoryId=" + tagCategoryId,
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            if (data !== "undefined") {
                $("#tdTagCategory")[0].innerHTML = data.TagCategoryName;
            }
        }
    });
};

var TagCategories = function () {
 
};

/*
TagCategories.prototype = {
    getAllItems: function() {
        var endPoint = "TagCategories/GetAllItems";
        return await this.ajax.get(endPoint).then((d) => {
            var width = "100%";
            if (data.length === 0) {
                width = "80%";
            }
            if (data.length > 0) {
                $("#divTagCategories").ejGrid(
                    {
                        dataSource: data,
                        allowSorting: true,
                        allowPaging: true,
                        allowReordering: true,
                        allowResizeToFit: true,
                        allowScrolling: true,
                        scrollSettings: { width: width },
                        allowSearching: true,
                        allowResizing: true,
                        toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Search] },
                        columns: [
                            { headerText: 'TagCategoryId', visible: false, field: 'TagCategoryId' },
                            { headerText: 'Tag Category', field: 'Tag Category' }
                        ],
                        rowSelected: function (args) {
                            //var userId = args.data.UserId;
                            //var userDetailsId = args.data.UserDetailsId;
                            //document.getElementById("hdnCurrentUserId").value = userId;
                            //document.getElementById("hdnUserDetailsId").value = userDetailsId;
                            //viewUserDetails(userId);
                        }
                    });
            }
            return data;
        }).catch(() => {
            return [];
        });
    }
}

*/



