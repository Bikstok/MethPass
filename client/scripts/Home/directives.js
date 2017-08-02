angular.module("Home")

    .directive("activePassesView", function () {
        return {
            restrict: "E",
            templateUrl: "./activepasses.html"
        };
    })

    .directive("addPassView", function () {
        return {
            restrict: "E",
            templateUrl: "./addpass.html"
        };
    })

    .directive("statisticsView", function () {
        return {
            restrict: "E",
            templateUrl: "./statistics.html"
        };
    })

    .directive("expiredPassesView", function () {
        return {
            restrict: "E",
            templateUrl: "./expiredpasses.html"
        };
    })

    .directive("blacklistView", function () {
        return {
            restrict: "E",
            templateUrl: "./blacklist.html"
        };
    })