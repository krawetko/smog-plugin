function refreshPage() {

    function createTableColumn(renderedValue) {
        return "<td>" + renderedValue + "</td>";
    }

    chrome.storage.local.get(storage.stationStatistics, function (data) {
        var stationStatistics = data[storage.stationStatistics],
            stationPollutions = stationStatistics[smogApi.props.stationStatistics.pollutions];
        var pollutionsTableRows = [];

        $.each(stationPollutions, function (index, pollution) {
            pollutionsTableRows.push("<tr>" +
                createTableColumn(pollution[smogApi.props.stationStatistics.pollution.substance]) +
                createTableColumn(pollution[smogApi.props.stationStatistics.pollution.maxSafeValuePercent] + "%")
                + "</tr>")
        });

        $("<table/>", {
            "class": "pollutions-table",
            html: pollutionsTableRows.join("")
        }).appendTo("#content");
        $('#toptitle').text(stationStatistics[smogApi.props.stationStatistics.address]);
    });
}


refreshPage();