/**
 * Created with IntelliJ IDEA.
 * User: krawetko
 * Date: 02.02.14
 * Time: 13:26
 */

/*
 * Defines API provided by http://smogalert.pl
 */
var smogApi = {
    defaultLocationId: "krakow-krasinskiego"
}

smogApi.url = {
    availableStationsUrl: "http://smogalert.pl/api/stations",
    pollutionStatisticsForLocationUrl: "http://smogalert.pl/api/stats/"
}
smogApi.props = {};

smogApi.props.stationStatistics = {
    pollutions: "pollutants",
    address: "city",
    date: "date",
    stationId: "station_id",
    lastRefresh: "lastRefresh",

    pollution: {
        substance: "pollutant",
        currentValue: "value",
        maxSafeValue: "norm",
        maxSafeValuePercent: "normPercent"
    }
};

smogApi.props.stationLocation = {
    id: "_id",
    city: "city",
    address: "address",
    cityArea: "cityArea",
    latitude: "location.latitude",
    longitude: "location.longitude"
};
