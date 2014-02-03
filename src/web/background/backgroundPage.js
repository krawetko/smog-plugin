chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create(alarms.refreshCurrentStationStatistics, {
        periodInMinutes: 1
    });
    chrome.alarms.create(alarms.refreshAvailableStations, {
        periodInMinutes: 2
    });
    refreshAvailableStations();
    refreshSelectedStationStatistics();
});

chrome.alarms.onAlarm.addListener(alarmListener);

chrome.storage.onChanged.addListener(selectedStationChangedListener);

function selectedStationChangedListener(storageChanges) {

    function hasSelectedStationChanged() {
        return storageChanges.hasOwnProperty(storage.selectedStation);
    }

    if (hasSelectedStationChanged()) {
        refreshSelectedStationStatistics();
    }

}

function alarmListener(alarm) {
    var alarmName = alarm.name;
    switch (alarmName) {
        case alarms.refreshCurrentStationStatistics :
            refreshSelectedStationStatistics();
            break;
        case alarms.refreshAvailableStations :
            refreshAvailableStations();
            break;
        default :
    }
}






