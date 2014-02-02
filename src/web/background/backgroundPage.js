chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create(alarms.refreshCurrentStationStatistics, {
        periodInMinutes: 1
    });
    chrome.alarms.create(alarms.refreshAvailableStations, {
        periodInMinutes: 60
    });
    refreshAvailableStations();
    refreshSelectedStationStatistics();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    var alarmName = alarm.name;
    switch (alarmName) {
        case alarms.refreshCurrentStationStatistics :
            refreshSelectedStationStatistics();
            break;
        case alarms.refreshAvailableStations :
            refreshAvailableStations();
            break;
        default :
            console.log("Invalid alarm -> " + alarmName);
    }
});

chrome.storage.onChanged.addListener(function (changes) {

    function hasSelectedStationChanged() {
        return changes.hasOwnProperty(storage.selectedStation);
    }

    if (hasSelectedStationChanged()) {
        refreshSelectedStationStatistics();
    }

});






