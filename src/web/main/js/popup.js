function refreshPage() {

    function createTableColumn(renderedValue) {
        return $("<td/>",
            {
                text: renderedValue
            }
        );
    }

    chrome.storage.local.get(storage.stationStatistics, function (data) {
        var stationStatistics = data[storage.stationStatistics],
            stationPollutions = stationStatistics[smogApi.props.stationStatistics.pollutions],
            lastRefreshDate = stationStatistics[smogApi.props.stationStatistics.lastRefresh];

        var $pollutionsTableRows = $("<table/>");

        $.each(stationPollutions, function (index, pollution) {
            $pollutionsTableRows.append(
                $('<tr/>')
                    .append(createTableColumn(pollution[smogApi.props.stationStatistics.pollution.substance]))
                    .append(createTableColumn(pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] + "%"))
            );
        });

        $("#statistics").html($pollutionsTableRows[0]);
        $('footer').find('.lastRefresh').text(lastRefreshDate)
        $("#content").animate({opacity: 1});
    });
}

function renderAvailableOptions() {
    chrome.storage.local.get(storage.availableStations, function (data) {
        var availableStations = data[storage.availableStations],
            $availableStationsSelect = $('select');

        $.each(availableStations, function (index, station) {
            $availableStationsSelect.append(buildStationOption(station));
        });
        setSelectedStation($availableStationsSelect);
    });

    function buildStationOption(stationLocation) {
        return $('<option/>', {
                value: stationLocation[smogApi.props.stationLocation.id],
                text: stationLocation[smogApi.props.stationLocation.address] + ", " + stationLocation[smogApi.props.stationLocation.cityArea]
            }
        )
    }

    function setSelectedStation($availableStationsSelect) {
        chrome.storage.local.get(storage.selectedStation, function (data) {
            var selectedStation = data[storage.selectedStation];
            if (selectedStation != undefined) {
                $availableStationsSelect.val(selectedStation);
            }
        });
    }
}

function submitOptions(selectedStation) {
    $("#content").animate({opacity: 0});
    chrome.storage.local.set(new Obj([storage.selectedStation, selectedStation]));
}


$(function () {

    $('select').on('change', function () {
        submitOptions($(this).val());
    });
})

chrome.storage.onChanged.addListener(stationStatisticsChangedListener);

function stationStatisticsChangedListener(storageChanges) {

    function hasStationStatisticsChanged() {
        return storageChanges.hasOwnProperty(storage.stationStatistics);
    }

    if (hasStationStatisticsChanged()) {
        refreshPage();
    }

}

renderAvailableOptions();

refreshPage();