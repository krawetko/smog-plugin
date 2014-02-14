/**
 * Created with IntelliJ IDEA.
 * User: krawetko
 * Date: 02.02.14
 * Time: 15:18
 */
function showNotificationIfNecessary(previousStationStatistics, selectedStationStatistics) {
    if (previousStationStatistics != undefined && previousStationStatistics[smogApi.props.stationStatistics.address] == selectedStationStatistics[smogApi.props.stationStatistics.address]) {
        var previousPollutions = previousStationStatistics[smogApi.props.stationStatistics.pollutions];
        var currentPollutions = selectedStationStatistics[smogApi.props.stationStatistics.pollutions];
        var oldCount = 0, currentCount = 0;
        $.each(previousPollutions, function (index, pollution) {
            if (pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] > 100) {
                oldCount++;
            }
        });

        $.each(currentPollutions, function (index, pollution) {
            if (pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] > 100) {
                currentCount++;
            }
        });

        if (oldCount < currentCount) {
            chrome.notifications.create("NewPollutions", {
                type: "basic",
                title: "Smog alert",
                message: "New pollutions appeared!",
                iconUrl: "/img/smog_48.png"
            }, function () {
            });
        } else if (currentCount == 0 && oldCount > 0) {
            chrome.notifications.create("ClearAir", {
                type: "basic",
                title: "Smog alert",
                message: "Air is clear!",
                iconUrl: "/img/smog_48.png"
            }, function () {
            });
        }
    }
}
