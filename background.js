"use strict";

function getDefaultExtensionData() {
	return {
		"filters": []
	};
}

var ExtensionData = getDefaultExtensionData();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("runtime.onMessage got " + request.action + " request.");
    if(request.action == "getFilters") {
        console.log("getFilters data", ExtensionData);
        sendResponse({filters: ExtensionData.filters});
    } else if (request.action == "addFilter") {
        ExtensionData.filters.push(request.text);
        chrome.storage.sync.set(ExtensionData, function() {
			console.log("addFilter config callback", ExtensionData);
		});
        sendResponse({filters: ExtensionData.filters});
    } else if (request.action == "removeFilter") {
        ExtensionData.filters.remove(request.text);
        chrome.storage.sync.set(ExtensionData, function() {
			console.log("addFilter config callback", ExtensionData);
		});
    } else if (request.action == "resetFilter") {
        ExtensionData = getDefaultExtensionData();
        chrome.storage.sync.set(ExtensionData, function() {
			console.log("clearFilters config callback");
		});
    }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName == "sync") {
        if ("filters" in changes) {
            console.log("Updating filters settings", changes.filters);
            ExtensionData.filters = changes.filters.newValue;
        }
    }
});

function loadFilters() {
    chrome.storage.sync.get(("filters"), function(data) {
        if ("filters" in data) {
            ExtensionData.filters = data.filters;
        } else {
            ExtensionData = getDefaultExtensionData();
            chrome.storage.sync.set(ExtensionData, function() {
				console.log("empty config callback");
			});
        }
    });
}

loadFilters();

Array.prototype.remove = function() {
    var a = arguments;
    var L = a.length;
    var ax;
    while (L && this.length) {
        var what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};