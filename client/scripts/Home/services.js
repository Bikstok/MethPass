angular.module("Home")

    .factory("HomeService", ["$http", "$window", "$rootScope", function ($http, $window, $rootScope) {
        var service = {};

        service.GetAllPasses = function () {
            $http({ method: "GET", url: "/api/pass/" }).success(function (data) {
                $rootScope.ActivePasses = data.ActivePasses;
                $rootScope.ExpiredPasses = data.ExpiredPasses;
                $rootScope.BlacklistedPasses = data.BlacklistedPasses;
                $rootScope.Money = data.Money;
                $rootScope.TopSellers = data.TopSellers;
            });
        };

        service.AddPass = function (pass) {
            $http({
                method: "POST",
                url: "/api/pass/",
                data: pass
            }).
                success(function (data, response, headers, status) {
                    console.log("success");
                    $window.location.reload();
                }).
                error(function (data, response) {
                    console.log("Something fucked up..");
                })
        };

        service.UpdatePass = function (pass) {
            $http({
                method: "PUT",
                url: "/api/pass/",
                data: pass
            }).
            success(function (data, response, headers, status) {
                console.log("success");
                $window.location.reload();
            }).
            error(function (data, response) {
                console.log("Something fucked up..");
            });
        };

        service.DeletePass = function (pass) {
            $http({
                method: "PUT",
                url: "/api/pass/delete",
                data: pass
            }).
            success(function (data, response, headers, status) {
                console.log("success");
                $window.location.reload();
            }).
            error(function (data, response) {
                console.log("Something fucked up..");
            });
        };

        return service;
    }])