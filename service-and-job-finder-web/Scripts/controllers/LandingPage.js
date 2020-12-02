app.controller("LandingPage", ["$scope", "$http", "$filter", function (s, r, f) {





    //view Payment Ledger
    s.getStarted = function (accountType) {
        window.open("../account/signup?type=" + accountType);
    }

    s.gotToLogInPage = function () {
        window.open("../account/login");
    }

}]);