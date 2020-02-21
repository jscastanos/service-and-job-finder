app.controller("LogIn", ["$scope", "$http", "$filter", function (s, r, f) {



    s.user = {};
    s.result = null;




    s.gotToSignUpPage = function (accountType) {
        location.href = "../account/signup?type=" + accountType;
    }
    s.description = "Socal Media for Job Seeker and Service Finder";





    s.LogIn = function () {



        r.post("../api/tUsers/login", s.user).then(function (d) {


            if (d.data != null) {

                console.log(d.data)
                s.user = {};
                s.result = d.data;
            }

            else {

                s.result = 3;
                console.log(d.data)
            }

        })
    }
}]);