$(document).ready(function () {
    var searchControl = new SearchControl("searchControl");
    searchControl.initialize();
    var textControl = new SearchControl("textControl");
    textControl.initialize();
    jQuery.ajax({
        url: "https://127.0.0.1:8888/api/WorkspaceWorkflow/GetViewSourceData?projectId=0&fileId=3346",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            if (tData != null) {
                searchControl.setText(tData);
                textControl.setText(tData);
                // $("#dvStatementBlock").modal("show");
            }
        }
    });
});

// Please prefere this way of defining the module...
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.SearchControl = factory();
    }
}(typeof window !== "undefined" ? window : this, function () {
    "use strict";
    var SearchControl = function(id) {
        this.targetControl = $(`#${id}`);
        var self = this;
        this.previous = function() {
            self.hilitor.prevHit();
        };

        this.next = function() {
            self.hilitor.nextHit();
        };

        this.search = function() {
            var input = $(self.targetControl).children().find("input:text");
            var keyword = $(input).val();
            self.hilitor.setMatchType("left");
            var allWords = keyword.split(",");
            self.hilitor.remove();
            var hitCount = 0;
            $.each(allWords,
                function() {
                    self.hilitor.apply(this);
                    hitCount += self.hilitor.hitCount;
                });

            var msgCtrl = $(self.targetControl).children().find(".src-msg");
            if (hitCount === 0) {
                msgCtrl.text("No matches found!");
                msgCtrl.css("color", "red");
            } else {
                msgCtrl.text(hitCount + (hitCount === 1 ? " match" : " match(es)"));
                msgCtrl.css("color", "green");
            }
        };

        this.initialize = function () {
            var events = [this.search, this.previous, this.next];
            $(this.targetControl).children().find(".btn-mint").each(function(i) {
                $(this).on("click", events[i]);
            });
            $(self.targetControl).children().find("input:text").bind({
                keypress: function(e) {
                    if (e.keyCode === 13) {
                        self.search();
                    }
                }
            });
        };

        this.setText = function(text) {
            $(this.targetControl).find("pre").html(text);
        };

        this._wrapper = function() {
            var divWrapper = $("<div />");
            var searchInput = $("<input>").attr({
                type: "text",
                placeHolder: "Search",
                "class": "form-control"
            });
            var table = $("<table />").attr({ style: "width: 100%;" });
            var row = $("<tr />").append($("<td />")
                .attr({ style: "width: 25%;" })
                .append(searchInput));
            row.append($("<td />")
                .attr({ style: "width: 4%;" })
                .append("<span class='input-group-btn'>" +
                    "<button class='btn btn-mint' type='button'>" +
                    "<i class='fa fa-search fa-fw'></i></button></span>"));
            row.append($("<td />")
                .attr({ style: "width: 3%;" })
                .append(
                    "<a class='btn btn-mint' style='margin-left: 0px; vertical-align: middle;' data-toggle='tooltip' title='Previous Match'>" +
                    "<i class='fa fa-arrow-circle-o-left'></i></a>"));
            row.append($("<td />")
                .attr({ style: "width: 5%;" })
                .append(
                    "<a class='btn btn-mint' style='vertical-align: middle' data-toggle='tooltip' title='Next Match'><i class='fa fa-arrow-circle-o-right'></i></a>"));
            row.append($("<td />").append("<div class='src-msg'></div>"));

            var pre = $("<pre>").attr({
                style: "height: 300px; overflow: scroll; width: 100%; margin-top: 0;"
            });

            table.append(row);
            divWrapper.append(table);
            divWrapper.append($("<div />").attr({ colspan: "5" }).append(pre));
            return divWrapper;
        };

        this.highLighter = function() {
            var next = function() {

            };
            var previous = function() {

            };

            return {
                next,
                previous
            };
        };

        var hilitor = function(preId, tag) {
            var targetNode = document.getElementById(preId) || document.body;
            var hiliteTag = tag || "EM";
            var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
            var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
            var wordColor = [];
            var colorIdx = 0;
            var matchRegex = "";

            this.setMatchType = function(type) {
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

            this.setRegex = function(input) {
                input = input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                if (input) {
                    var re = "(" + input + ")";
                    matchRegex = new RegExp(re, "i");
                    return true;
                }
                return false;
            };

            this.getRegex = function() {
                var retval = matchRegex.toString();
                retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
                retval = retval.replace(/\|/g, " ");
                return retval;
            };

            this.hiliteWords = function(node) {
                if (node === undefined || !node) return;
                if (!matchRegex) return;
                if (skipTags.test(node.nodeName)) return;

                if (node.hasChildNodes()) {
                    for (var i = 0; i < node.childNodes.length; i++)
                        this.hiliteWords(node.childNodes[i]);
                }
                if (node.nodeType === 3 || node.nodeType === 1) {
                    var nv;
                    var regs;
                    if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
                        if (!wordColor[regs[0].toLowerCase()]) {
                            wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
                        }
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
                }
            };

            this.remove = function() {
                var element = $(targetNode);
                var arr = $(element).find("em");
                for (var l = 0; l < arr.length; l++) {
                    var el = arr[l];
                    var parent = el.parentNode;
                    if (el.firstChild === null || typeof el.firstChild === "undefined") break;
                    parent.replaceChild(el.firstChild, el);
                    parent.normalize();
                }
            };

            this.apply = function(input) {
                this.hitCount = 0;
                this.currHitIdx = 0;
                if (input === undefined || !input) return;
                if (this.setRegex(input)) {
                    this.hiliteWords(targetNode);
                    this.hits = $("#" + id + " em");
                    if (this.hits.length > 0) {
                        this.hits[0].scrollIntoView();
                        this.hits[0].style.backgroundColor = "#a0ffff";
                    }
                }
            };

            this.nextHit = function() {
                if (this.currHitIdx < this.hits.length - 1) {
                    this.currHitIdx++;
                    var currHit = this.hits[this.currHitIdx];
                    currHit.style.backgroundColor = "#a0ffff";
                    this.hits[this.currHitIdx - 1].style.backgroundColor = "#ff6";
                    currHit.scrollIntoView();
                }
            };

            this.prevHit = function() {
                if (this.currHitIdx !== 0) {
                    this.currHitIdx--;
                    var currHit = this.hits[this.currHitIdx];
                    currHit.style.backgroundColor = "#a0ffff";
                    this.hits[this.currHitIdx + 1].style.backgroundColor = "#ff6";
                    currHit.scrollIntoView();
                }
            };
        };

        var wrapperDiv = this._wrapper();
        $(this.targetControl).append(wrapperDiv);

        var divId = $(this.targetControl).attr("id");
        var preTagId = divId + "-" + "preSource";
        $(this.targetControl).find("pre").attr({ id: preTagId });
        var preTag = $(this.targetControl).find("pre").attr("id");
        this.hilitor = new hilitor(preTag);
    };

    return SearchControl;
}));

// This is also a working example, but this is specific to controls for which id property is pre-defined...
/*
// Please prefere this way of defining the module...
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.searchControl = factory();
    }
}(typeof window !== "undefined" ? window : this,
    function () {
        "use strict";
        var searchControl = {
            initialize: function (id) {
                var control = $(`#${id}`);
                var self = this;
                var wrapperDiv = this._wrapper();
                control.append(wrapperDiv);
                this.hitHighlighter = new Hilitor("preSource");
                $("#searchNext").click(function () {
                    self.next(self.hitHighlighter);
                });
                $("#searchPrev").click(function () {
                    self.previous(self.hitHighlighter);
                });
                $("#searchButton").click(function () {
                    var keyword = $("#txtSearch").val();
                    self.hitHighlighter.setMatchType("left");
                    self.hitHighlighter.apply(keyword);
                    if (self.hitHighlighter.hitCount === 0) {
                        $("#searchHitCount").text("No matches found!");
                        $("#searchHitCount").attr({style: "color: red;"});
                    } else {
                        $("#searchHitCount").text(self.hitHighlighter.hitCount +
                            (self.hitHighlighter.hitCount === 1 ? " match" : " match(es)"));
                        $("#searchHitCount").attr({style: "color: green;"});
                    }
                });
                $("#txtSearch").keypress(function (e) {
                    if (e.keyCode === 13) {
                        $("#searchButton").click();
                    }
                });
            },
            next: function (hitHighlighter) {
                hitHighlighter.nextHit();
            },
            previous: function (hitHighlighter) {
                hitHighlighter.prevHit();
            },
            applySearch: function () { },
            _wrapper: function () {
                var wrapperDiv = $("<div />");
                var searchInput = $("<input>").attr({
                    type: "text",
                    id: "txtSearch",
                    placeHolder: "Search",
                    "class": "form-control"
                });
                var table = $("<table />").attr({ style: "width: 100%;" });
                var row = $("<tr />").append($("<td />")
                    .attr({ style: "width: 25%;" })
                    .append(searchInput));
                row.append($("<td />")
                    .attr({ style: "width: 4%;" })
                    .append("<span class='input-group-btn'>" +
                        "<button id='searchButton' class='btn btn-mint' type='button'>" +
                        "<i class='fa fa-search fa-fw'></i></button></span>"));
                row.append($("<td />")
                    .attr({ style: "width: 3%;" })
                    .append(
                        "<a id='searchPrev' class='btn btn-mint' style='margin-left: 0px; vertical-align: middle;' data-toggle='tooltip' title='Previous Match'>" +
                        "<i class='fa fa-arrow-circle-o-left'></i></a>"));
                row.append($("<td />")
                    .attr({ style: "width: 5%;" })
                    .append(
                        "<a id='searchNext' class='btn btn-mint' style='vertical-align: middle' data-toggle='tooltip' title='Next Match'><i class='fa fa-arrow-circle-o-right'></i></a>"));
                row.append($("<td />").append("<div id='searchHitCount'></div>"));

                var pre = $("<pre>").attr({
                    style: "height: 500px; overflow: scroll; width: 100%; margin-top: 0;",
                    id: "preSource"
                });

                table.append(row);
                wrapperDiv.append(table);
                wrapperDiv.append($("<div />")
                    .attr({ colspan: "5" })
                    .append(pre));
                return wrapperDiv;
            }
        };
        return searchControl;
}));
*/
/*
function Hilitor(id, tag) {
    var targetNode = document.getElementById(id) || document.body;
    var hiliteTag = tag || "EM";
    var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
    var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
    var wordColor = [];
    var colorIdx = 0;
    var matchRegex = "";

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

    this.hiliteWords = function (node) {
        if (node === undefined || !node) return;
        if (!matchRegex) return;
        if (skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i]);
        }
        if (node.nodeType === 3 || node.nodeType === 1) {
            // NODE_TEXT
            var nv;
            var regs;
            if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
                if (!wordColor[regs[0].toLowerCase()]) {
                    wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
                }
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
        }
    };

    this.remove = function () {
        var arr = document.getElementsByTagName(hiliteTag);
        var el;
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            if (el.firstChild === null || typeof el.firstChild === "undefined") break;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };

    this.apply = function (input) {
        this.hitCount = 0;
        this.currHitIdx = 0;
        this.remove();
        if (input === undefined || !input) return;
        if (this.setRegex(input)) {
            this.hiliteWords(targetNode);
            this.hits = $("#" + id + " em");
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
        if (this.currHitIdx !== 0) {
            this.currHitIdx--;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx + 1].style.backgroundColor = "#ff6";
            currHit.scrollIntoView();
        }
    };
};
*/