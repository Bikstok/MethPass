angular.module("Home")

    .controller("TabController", ["$scope", function ($scope) {
        $scope.tab = 1;

        $scope.isSet = function (checkTab) {
            return $scope.tab === checkTab;
        };

        $scope.setTab = function (setTab) {
            $scope.tab = setTab;
        };
    }])

    .controller("PassController", ["$scope", "$anchorScroll", "HomeService",
        function ($scope, $anchorScroll, HomeService) {
            $scope.ShowForm = false;
            $scope.SelectedPass = {};

            $scope.Options = [{
                name: "1 day",
                value: 1
            }, {
                name: "2 days",
                value: 2
            }, {
                name: "3 days",
                value: 3
            }, {
                name: "4 days",
                value: 4
            }, {
                name: "5 days",
                value: 5
            }, {
                name: "6 days",
                value: 6
            }, {
                name: "1 week",
                value: 7
            }, {
                name: "2 weeks",
                value: 14
            }, {
                name: "1 month",
                value: 30
            }, {
                name: "1 year",
                value: 365
            }];

            $scope.toggleEditForm = function (pass) {
                if ($scope.SelectedPass != pass) {
                    $scope.ShowForm = true;
                    $scope.SelectedPass = pass;
                    $anchorScroll("top");
                }
                else {
                    $scope.ShowForm = false;
                    $scope.SelectedPass = {};
                }
            }

            $scope.getAllPasses = function () {
                HomeService.GetAllPasses();
            };

            $scope.addPass = function (customer, daysPaid, seller, note) {
                newPass = {
                    Customer: customer,
                    DaysPaid: daysPaid,
                    Seller: seller,
                    Note: note
                }
                HomeService.AddPass(newPass);
            };

            $scope.updatePass = function () {
                HomeService.UpdatePass($scope.SelectedPass);
            };

            $scope.deletePass = function () {
                if (confirm("Are you sure you want to delete this pass pass?")) {
                    $scope.SelectedPass.Deleted = 1;
                    HomeService.DeletePass($scope.SelectedPass);
                }
            };

            $scope.getAllPasses();
        }]);