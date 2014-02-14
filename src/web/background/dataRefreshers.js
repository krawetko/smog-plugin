/**
 * Created with IntelliJ IDEA.
 * User: krawetko
 * Date: 02.02.14
 * Time: 15:29
 */
function refreshSelectedStationStatistics() {
    chrome.storage.local.get(storage.selectedStationId, function (selectedStationData) {
        var selectedStationStatisticsUrl = createSelectedStationStatistcsUrl(selectedStationData);

        $.getJSON(selectedStationStatisticsUrl, updateSelectedStationStatistics);
    });

    function updateSelectedStationStatistics(selectedStationStatisticsJSON) {
        chrome.storage.local.get(storage.stationStatistics, function (previousStationData) {
            var previousStationStatistics = previousStationData[storage.stationStatistics];

            showNotificationIfNecessary(previousStationStatistics, selectedStationStatisticsJSON);
            saveNewDataToStore();

        });

        function saveNewDataToStore() {
            selectedStationStatisticsJSON[smogApi.props.stationStatistics.lastRefresh] = $.formatDateTime('dd-M-yy hh:ii:ss', new Date());
            chrome.storage.local.set(new Obj([storage.stationStatistics, selectedStationStatisticsJSON]), updateBrowserActionIcons(selectedStationStatisticsJSON));
        }

    }

    function createSelectedStationStatistcsUrl(data) {
        var selectedLocation = data.selectedStationId;
        if (selectedLocation == undefined) {
            selectedLocation = smogApi.defaultLocationId;
        }

        var stationStatisticsUrl = smogApi.url.pollutionStatisticsForLocationUrl + selectedLocation;
        return stationStatisticsUrl;
    }

    function updateBrowserActionIcons(selectedStationStatisticsJSON) {

        return function () {
            var pollutions = selectedStationStatisticsJSON[smogApi.props.stationStatistics.pollutions];
            var numberOfPollutionsExceedingMaxSafeValue = calculateNumberOfPollutionsExceedingMaxSafeValue(pollutions);
            if (numberOfPollutionsExceedingMaxSafeValue > 0) {
                createWarningIcon(numberOfPollutionsExceedingMaxSafeValue);
            } else {
                createOkIcon();
            }
        }

        function createWarningIcon(numberOfPollutionsExceedingMaxSafeValue) {
            var redColor = "#FF0000";
            chrome.browserAction.setBadgeText({text: numberOfPollutionsExceedingMaxSafeValue + ''});
            chrome.browserAction.setBadgeBackgroundColor({color: redColor})
        }

        function createOkIcon() {
            var greenColor = "#00FF00";
            chrome.browserAction.setBadgeText({text: "OK"});
            chrome.browserAction.setBadgeBackgroundColor({color: greenColor})
        }

        function calculateNumberOfPollutionsExceedingMaxSafeValue(pollutions) {
            var numberOfPollutionsExceedingMaxSafeValue = 0;
            $.each(pollutions, function (index, pollution) {
                if (pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] > 100) {
                    numberOfPollutionsExceedingMaxSafeValue += 1;
                }
            });
            return numberOfPollutionsExceedingMaxSafeValue;
        }
    }

};

function refreshAvailableStations() {
    $.getJSON(smogApi.url.availableStationsUrl, function (availableStationsData) {
        chrome.storage.local.set(new Obj([storage.availableStations, availableStationsData]));
    });
}
