function getData() {
    chrome.storage.local.get("selectedStation", function (location) {
        location = location.selectedStation;
        if (location == undefined) {
            location = SMOG_API.defaultLocationId;
        }

        var statsUrl = SMOG_API.pollutionStatisticsForLocationUrl + location;


        $.getJSON(statsUrl, function (data) {
            chrome.storage.local.get("pollution", function (prevData) {
                prevData = prevData.pollution;
                showNotificationIfPolutionChanged(prevData, data);
                chrome.storage.local.set({pollution: data}, function () {
                    var pollutants = data["pollutants"];
                    var normExceeded = false;
                    for (var i = 0; i < pollutants.length; i++) {
                        if (pollutants[i]["normPercent"] > 100) {
                            normExceeded = true;
                            break;
                        }
                    }

                    if (normExceeded) {
                        chrome.browserAction.setBadgeText({text: "!"});
                        chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"})
                    } else {
                        chrome.browserAction.setBadgeText({text: "OK"});
                        chrome.browserAction.setBadgeBackgroundColor({color: "#00FF00"})
                    }
                });

            });

        });
    });
};

function getStations() {
    $.getJSON(SMOG_API.availableStationsUrl, function (data) {
        chrome.storage.local.set(new Obj([STORAGE.availableStations, data]));
    });
}
chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create("refreshData", {
        periodInMinutes: 1
    });
    chrome.alarms.create("refreshStations", {
        periodInMinutes: 60
    });
    getData();
    getStations();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "refreshData") {
        getData();
    } else if (alarm.name == "refreshStations") {
        getStations();
    }

});

chrome.storage.onChanged.addListener(function (changes) {

    if (changes.hasOwnProperty("selectedStation")) {
        if (changes["selectedStation"].newValue != undefined) {
            getData();
        }
    }

});

function showNotificationIfPolutionChanged(prevData, newData) {
    if (prevData != undefined) {
        var oldPollutants = prevData["pollutants"];
        var newPollutants = newData["pollutants"];
        var oldCount = 0, newCount = 0;
        for (var i = 0; i < oldPollutants.length; i++) {
            if (oldPollutants[i] && oldPollutants[i]["normPercent"] > 100) {
                oldCount++;
            }
            if (newPollutants[i] && newPollutants[i]["normPercent"] > 100) {
                newCount++;
            }
        }
        if (oldCount < newCount) {
            chrome.notifications.create("SmogAert", {
                type: "basic",
                title: "Smog alert",
                message: "New pollutions appeared",
                iconUrl: "/img/icon_64.png"
            }, function () {
            });
        } else if (oldCount > newCount) {
            chrome.notifications.create("SmogAert", {
                type: "basic",
                title: "Smog alert",
                message: "There are no pollutions",
                iconUrl: "/img/icon_64.png"
            }, function () {
            });
        }
    }
}




