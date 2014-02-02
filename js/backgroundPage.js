function getData() {
    chrome.storage.local.get(storage.selectedStation, function (data) {
        var selectedLocation = data.selectedStation;
        if (selectedLocation == undefined) {
            selectedLocation = smogApi.defaultLocationId;
        }

        var statsUrl = smogApi.url.pollutionStatisticsForLocationUrl + selectedLocation;


        $.getJSON(statsUrl, function (selectedStationStatistics) {
            chrome.storage.local.get(storage.stationStatistics, function (previousData) {
                var prevStationStatistics = previousData[storage.stationStatistics];
                showNotificationIfPolutionChanged(prevStationStatistics, selectedStationStatistics);
                chrome.storage.local.set(new Obj([storage.stationStatistics, selectedStationStatistics]), function () {
                    var pollutants = selectedStationStatistics["pollutants"];
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
    $.getJSON(smogApi.url.availableStationsUrl, function (data) {
        chrome.storage.local.set(new Obj([storage.availableStations, data]));
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

    if (changes.hasOwnProperty(storage.selectedStation)) {
        if (changes[storage.selectedStation].newValue != undefined) {
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
            chrome.notifications.create("SmogAlert", {
                type: "basic",
                title: "Smog alert",
                message: "New pollutions appeared",
                iconUrl: "/img/icon_64.png"
            }, function () {
            });
        } else if (oldCount > newCount) {
            chrome.notifications.create("SmogAlert", {
                type: "basic",
                title: "Smog alert",
                message: "There are no pollutions",
                iconUrl: "/img/icon_64.png"
            }, function () {
            });
        }
    }
}




