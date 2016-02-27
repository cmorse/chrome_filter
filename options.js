"use strict";
$(function () {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        console.log("Storage changed for", areaName);
        if (areaName == "sync") {
            if ("filters" in changes) {
                loadFilters();
            }
        }
    });

    function loadFilters() {
        chrome.runtime.sendMessage({"action": "getFilters"}, function (response) {
            console.log("Got filters!", response);

            var list = $("#filterList");
            list.empty();
            $.each(response.filters, function (idx, val) {
                var item = $("<li>" + val + "</li>");
                var btn = $("<button class='block'/>");
                btn.click(function () {
                    chrome.runtime.sendMessage({"action": "removeFilter", "text": val});
                    item.hide("fast", function () {
                        item.remove();
                    });
                });
                item.append(btn);
                list.append(item);
            });
        });
    }

    $("#resetOptions").click(function () {
        chrome.extension.sendMessage({"action": "resetOptions"});
    });

    loadFilters();
});