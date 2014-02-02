/**
 * Created with IntelliJ IDEA.
 * User: krawetko
 * Date: 02.02.14
 * Time: 15:29
 */
function refreshSelectedStationStatistics() {
    chrome.storage.local.get(storage.selectedStation, function (data) {
        var selectedLocation = data.selectedStation;
        if (selectedLocation == undefined) {
            selectedLocation = smogApi.defaultLocationId;
        }

        var stationStatisticsUrl = smogApi.url.pollutionStatisticsForLocationUrl + selectedLocation;


        $.getJSON(stationStatisticsUrl, function (selectedStationStatistics) {
            chrome.storage.local.get(storage.stationStatistics, function (previousData) {
                var prevStationStatistics = previousData[storage.stationStatistics];
                showNotificationIfPollutionsChanged(prevStationStatistics, selectedStationStatistics);
                chrome.storage.local.set(new Obj([storage.stationStatistics, selectedStationStatistics]), function () {
                    var pollutions = selectedStationStatistics[smogApi.props.stationStatistics.pollutions];
                    var normExceeded = false;
                    $.each(pollutions, function (index, pollution) {
                        if (pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] > 100) {
                            normExceeded = true;
                            return false; // break the loop
                        }
                    });

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

function refreshAvailableStations() {
    $.getJSON(smogApi.url.availableStationsUrl, function (data) {
        chrome.storage.local.set(new Obj([storage.availableStations, data]));
    });
}
