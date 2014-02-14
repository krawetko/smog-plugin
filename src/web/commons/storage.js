/**
 * Created with IntelliJ IDEA.
 * User: krawetko
 * Date: 02.02.14
 * Time: 11:47
 */


/*
 * Defines properties names used in a browser's local storage
 */
var storage = {
    selectedStationId: "selectedStationId",
    selectedStationFullAddress: "selectedStationFullAddress",
    availableStations: "availableStations",

    stationStatistics: "stationStatistics",

    geoLocation: function (stationId) {
        return stationId + 'loc';
    }

};
