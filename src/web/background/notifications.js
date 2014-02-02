/**
 * Created with IntelliJ IDEA.
 * User: krawetko
 * Date: 02.02.14
 * Time: 15:18
 */
function showNotificationIfNecessary(previousStationStatistics, selectedStationStatistics) {
    if (previousStationStatistics != undefined) {
        var previousPollutions = previousStationStatistics[smogApi.props.stationStatistics.pollutions];
        var currentPollutions = selectedStationStatistics[smogApi.props.stationStatistics.pollutions];
        var oldCount = 0, currentCount = 0
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
            chrome.notifications.create("SmogAlert", {
                type: "basic",
                title: "Smog alert",
                message: "New pollutions appeared",
                iconUrl: "/img/icon_64.png"
            }, function () {
            });
        } else if (oldCount > currentCount) {
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
