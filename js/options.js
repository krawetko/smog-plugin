function renderAvailableOptions() {
    function buildOptionHtmlForStation(station) {
        return "<option value = '" + station[smogApi.props.stationLocation.id] + "'>" + station[smogApi.props.stationLocation.address] + ", " + station[smogApi.props.stationLocation.cityArea] + "</option>";
    }

    chrome.storage.local.get(storage.availableStations, function (data) {
        var availableStations = data[storage.availableStations],
            availableStationsSelectOptionsHtml = [];

        $.each(availableStations, function (index, station) {
            availableStationsSelectOptionsHtml.push(buildOptionHtmlForStation(station));
        });

        chrome.storage.local.get(storage.selectedStation, function (data) {
            var selectedStation = data.selectedStation;
            $("#stations").html(availableStationsSelectOptionsHtml.join(""));
            if (selectedStation != undefined) {
                $("#stations").val(selectedStation);
            }
        });

    });
}

function submitOptions(selectedStation) {
    chrome.storage.local.set(new Obj([storage.selectedStation, selectedStation]));
}


$(function () {

    var $form = $('form');
    var $station = $('select')

    $form.submit(function () {
        submitOptions($station.val());
    });
})

renderAvailableOptions();