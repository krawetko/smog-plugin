function refreshPage() {

    function createTableColumn(renderedValue, cssClass) {
        return $("<td/>",
            {
                class: cssClass || '',
                text: renderedValue
            }
        );
    }

    function createTablePercentColumn(renderedValue, maxPollutionPercent) {
        var width = (renderedValue / maxPollutionPercent) * 100;
        var cssClass = renderedValue > 100 ? 'exceeded' : 'ok';
        return $("<td/>",
            {
                class: 'pollution'

            }
        ).append($('<div/>').css('width', width + '%').addClass(cssClass).text(renderedValue + '%'));
    }

    chrome.storage.local.get(storage.stationStatistics, function (data) {
        var stationStatistics = data[storage.stationStatistics],
            stationPollutions = stationStatistics[smogApi.props.stationStatistics.pollutions].sort(descendingPollutionsSorter),
            maxPollutionPercent = +stationPollutions[0][smogApi.props.stationStatistics.pollution.maxSafeValuePercent],
            lastRefreshDate = stationStatistics[smogApi.props.stationStatistics.lastRefresh];

        if (maxPollutionPercent < 100) {
            maxPollutionPercent = 100;
        }


        var $pollutionsTableRows = $("<table/>");

        $.each(stationPollutions, function (index, pollution) {
            $pollutionsTableRows.append(
                $('<tr/>')
                    .append(createTableColumn(pollution[smogApi.props.stationStatistics.pollution.substance], 'first'))
                    .append(createTablePercentColumn(+pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent], maxPollutionPercent))
            );
        });

        $("#statistics").html($pollutionsTableRows[0]);
        $('footer').find('.lastRefresh').text(lastRefreshDate)
        $("#content").animate({opacity: 1});
    });
}

function renderAvailableOptions() {
    function updateBodyWidth() {
        var width = $('header').find('.dropdown-menu').width();
        $('body').width(width + 50);
    }

    chrome.storage.local.get(storage.availableStations, function (data) {
        var availableStations = data[storage.availableStations],
            $availableStationsSelect = $('header').find('.dropdown-menu').empty();

        $.each(availableStations, function (index, station) {
            $availableStationsSelect.append(buildStationOption(station));
            chrome.storage.local.set(new Obj([storage.geoLocation(station[smogApi.props.stationLocation.id]), station[smogApi.props.stationLocation.location][smogApi.props.geoLocation.latitude] + ',' + station[smogApi.props.stationLocation.location][smogApi.props.geoLocation.longitude]]));

        });

        updateBodyWidth();
        setSelectedStation();
    });

    function buildStationOption(stationLocation) {
        var longStationAddress = stationLocation[smogApi.props.stationLocation.address] + ", " + stationLocation[smogApi.props.stationLocation.cityArea];
        return $('<li/>', {
                id: stationLocation[smogApi.props.stationLocation.id],
                value: longStationAddress,
                html: '<a href="#">' + longStationAddress + '</a>'
            }
        );
    }

}

function setSelectedStation(selectedStationFullAddress) {
    if (selectedStationFullAddress == undefined) {
        chrome.storage.local.get(storage.selectedStationFullAddress, function (data) {
            selectedStationFullAddress = data[storage.selectedStationFullAddress];
            setSelectedStationValue(selectedStationFullAddress);
        });
    } else {
        setSelectedStationValue(selectedStationFullAddress);
    }

    function setSelectedStationValue(selectedStationFullAddress) {
        if (selectedStationFullAddress != undefined) {
            $('#selectedStation').text(selectedStationFullAddress);
        }

    }
}

function submitOptions(selectedStationId, selectedStationFullAddress) {
    $("#content").animate({opacity: 0});
    setSelectedStation(selectedStationFullAddress);
    chrome.storage.local.set(new Obj([storage.selectedStationId, selectedStationId], [storage.selectedStationFullAddress, selectedStationFullAddress]));
}


$(function () {

    $('header .dropdown-menu').on('click', 'li', function () {
        submitOptions($(this).attr('id'), $(this).attr('value'));
    });

    $('header .location').on('click', function () {
        chrome.storage.local.get(storage.selectedStationId, function (data) {
            var selectedStationId = data[storage.selectedStationId];
            chrome.storage.local.get(storage.geoLocation(selectedStationId), function (data) {
                var selectedStationLocation = data[storage.geoLocation(selectedStationId)];
                window.open('http://maps.google.com/maps?q=' + selectedStationLocation);
            });
        });
    });
});


chrome.storage.onChanged.addListener(stationStatisticsChangedListener);

function stationStatisticsChangedListener(storageChanges) {

    function hasStationStatisticsChanged() {
        return storageChanges.hasOwnProperty(storage.stationStatistics);
    }

    if (hasStationStatisticsChanged()) {
        refreshPage();
    }

}

function descendingPollutionsSorter(pollutionA, pollutionB) {
    return pollutionB[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] - pollutionA[smogApi.props.stationStatistics.pollution.maxSafeValuePercent]
}

renderAvailableOptions();

refreshPage();