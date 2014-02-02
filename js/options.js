function renderAvailableOptions() {
    chrome.storage.local.get(STORAGE.availableStations, function (data) {
        data = data[STORAGE.availableStations];
        var stations = [];

        for (var i = 0; i < data.length; i++) {
            stations.push("<option value = '" + data[i]["_id"] + "'>" + data[i]["_id"] + "</option>");
        }

        chrome.storage.local.get("selectedStation", function (location) {
            $("#stations").html(stations.join(""));
            location = location.selectedStation;
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