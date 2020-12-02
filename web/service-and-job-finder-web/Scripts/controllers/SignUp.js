app.controller("SignUp", ["$scope", "$http", "$filter", function (s, r, f) {




    s.user = {};
    s.TempPassword = "";
    s.valid = false;
    s.account = null;
    s.description = null;
    s.check = false;
    s.chck;

    s.validUsername = null;
    s.btnEmployer = 1;
    s.btnJobSeeker = 1;
    s.btnServiceWorker = 1;
    s.btnCustomer = 1;

    var url = new URL(location.href);
    s.type = url.searchParams.get('type');


    s.init = function () {

        s.identifyAcctType(s.type);
        s.user.AccountTypeId = s.type;
    }





    s.validation = function () {

        if (s.TempPassword != null) {

            if (s.user.Password != s.TempPassword) {
                s.valid = true;
            }
            else if (s.user.Password == s.TempPassword) {
                s.valid = false;
            }
        }

        else {

            s.valid = true;
        }



    }





    // Create Users account
    s.createAccount = function () {


        r.post("../api/tUsers/createaccount", s.user).then(function (d) {
            if (d.data.AccountTypeId == 1) {

                //  Employer's Registration
                location.href = "../employer/employerregistration";
                localStorage.setItem("userid", d.data.UserId);
            }

            else if (d.data.AccountTypeId == 2) {

                //  Job Seeker's Registration
                location.href = "../JobSeekerReg/SkillandServices?type=" + d.data.AccountTypeId + "&userid=" + d.data.UserId;
            }

            else if (d.data.AccountTypeId == 3) {

                //  Service Worker's Registration
                location.href = "../serviceworker/serviceWorkerRegistration";
                localStorage.setItem("userid", d.data.UserId);
            }

            else if (d.data.AccountTypeId == 4) {

                //  Customer's Registration
                location.href = "../JobSeekerReg/SkillandServices?type=" + d.data.AccountTypeId + "&userid=" + d.data.UserId;
            }


            console.log(d.data)
            s.user = {};
            s.TempPassword = null;
            s.check = false;

        })

    }


    // Create Users account
    s.ValidateUsername = function () {


        r.post("../api/tUsers/validateusername/" + s.user.Username).then(function (d) {

            console.log(d.data)
            s.validUsername = d.data;

        })

    }






    s.identifyAcctType = function (type, click) {


        if (type == 1) {



            s.btnEmployer = 0
            s.btnJobSeeker = 1;
            s.btnServiceWorker = 1;
            s.btnCustomer = 1;

            s.account = "Employer";
            s.description = "Job posting is now very accessable and convenient to the public.";
            s.user.AccountTypeId = type;
        }

        else if (type == 2) {


            s.btnEmployer = 1
            s.btnJobSeeker = 0;
            s.btnServiceWorker = 1;
            s.btnCustomer = 1;

            s.account = "Job Seeker";
            s.description = "We help you to find a qualified job and guide you to have a great career experience.";
            s.user.AccountTypeId = type;
        }

        else if (type == 3) {

            s.btnEmployer = 1
            s.btnJobSeeker = 1;
            s.btnServiceWorker = 0;
            s.btnCustomer = 1;


            s.account = "Service Worker";
            s.description = "We bring you closer to the customer.";
            s.user.AccountTypeId = type;
        }

        else if (type == 4) {

            s.btnEmployer = 1
            s.btnJobSeeker = 1;
            s.btnServiceWorker = 1;
            s.btnCustomer = 0;


            s.account = "Customer";
            s.description = "Our mobile app has a chat feature that you can directly message the service worker and it has a google map feature where you can find nearby service worker in your location.";
            s.user.AccountTypeId = type;
        }

        else if (type == 0) {

            s.account = "AppWork";
            s.description = "Socal Media for Job Seeker and Service Finder";
        }
    }


    s.gotToLogInPage = function () {
        location.href ="../account/login";
    }

    s.selectAccountType = function (type, click) {

        s.identifyAcctType(type, click);
    }
}]);