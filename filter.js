"use strict";

function filterResults(filters, results) {
    $(pageDef.resultItemSelector, results).each(function(index, value) {
        var linkText = $(pageDef.urlSelector, value).text();
        for(var f in filters) {
            if(linkText.indexOf(filters[f]) != -1) {
				console.log("Matched", linkTest)
                $(value).remove();
            }
        }
    });
}

function addFilter(urlText) {
    chrome.runtime.sendMessage({"action": "addFilter", "text": urlText}, function(response) {
        filterResults(response.filters, $(pageDef.resultListSelector));
    });
}

function addFilterToPage(results) {
    $(pageDef.resultItemSelector, results).each(function(index, value) {
        var cite = $(pageDef.urlSelector, value);

        var img = $("<button class='block'/>");
        img.css("background-image","url(" + chrome.extension.getURL("ban.svg") + ")");

        img.click(function() {
            var re = /^(https?:\/\/)?([^\/]*)/;
			$("#domainBlockText").val(cite.text().match(re)[2]);
			$(".jqmWindow").jqmShow()
        });
        img.insertBefore(cite);
    });
}

function buildFilterWindow() {
    var root = $("<div class='jqmWindow'></div>");
    var container = $("<div class='container'></div>");

    container.append($("<label for='domainBlockText'>Domain to block</label>"));
    var textBox = $("<input id='domainBlockText'></input>");
    container.append(textBox);
    var buttons = $("<div class='buttons'></div>");
    var cancelButton = $("<button>Cancel</button>");
    var addButton = $("<button>Add Filter</button>");

    textBox.keydown(function(event) {
        if(event.keyCode == '13') {
            addFilter(textBox.val());
            root.jqmHide();
        } else if(event.keyCode == '27') {
            root.jqmHide();
        }
    });

    cancelButton.click(function(){
        root.jqmHide();
    });
    addButton.click(function(){
        addFilter(textBox.val());
        root.jqmHide();
    });

    buttons.append(cancelButton);
    buttons.append(addButton);

    container.append(buttons);
    root.append(container);
    $("body").append(root);
    $(root).jqm();
}

function processPage(filters, results) {
    filterResults(filters,results);
    addFilterToPage(results);
}

var results = $(pageDef.resultListSelector);
if(results !== null) {
	buildFilterWindow();
	chrome.runtime.sendMessage({"action":"getFilters"}, function(response) {
		console.log("Got filters!");
		processPage(response.filters, results);
	});
} else {
	console.log("Didn't get any results!");
}