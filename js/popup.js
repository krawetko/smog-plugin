function refreshPage() {

    chrome.storage.local.get("pollution", function (data) {
        data = data.pollution;
        var items = [];
        for (var i = 0; i < data["pollutants"].length; i++) {

            var pollutant = data["pollutants"][i];
            items.push("<tr>" +
                "<td>" + pollutant["pollutant"] + "</td>" +
                "<td>" + pollutant["normPercent"] + "%</td>"
                + "</tr>")
        }

        if (items == undefined) {
            console.log("data not loaded");
        }
        else {
            console.log("building page")
            $("<table/>", {
                "class": "my-new-list",
                html: items.join("")
            }).appendTo("#content");
            $('#toptitle').text(data['city']);
        }
    });
}


refreshPage();