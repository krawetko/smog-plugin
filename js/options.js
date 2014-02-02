function renderAvailableOptions() {
    function buildOptionHtmlForStation(station) {
        return "<option value = '" + station["_id"] + "'>" + station["_id"] + "</option>";
    }

    chrome.storage.local.get(STORAGE.availableStations, function (data) {
        data = data[STORAGE.availableStations];
        var availableStationsSelectOptionsHtml = [];

        $.each(data, function (index, station) {
            availableStationsSelectOptionsHtml.push(buildOptionHtmlForStation(station));
        });

        chrome.storage.local.get(STORAGE.selectedStation, function (location) {
            location = location.selectedStation;
            $("#stations").html(availableStationsSelectOptionsHtml.join(""));
            if (location != undefined) {
                $("#stations").val(location);
            }
        });

    });
}

function submitOptions(selectedStation) {
    chrome.storage.local.set(new Obj([STORAGE.selectedStation, selectedStation]));
}

$(function () {

    var $form = $('form');
    var $station = $('select')

    $form.submit(function () {
        submitOptions($station.val());
    });
})

renderAvailableOptions();