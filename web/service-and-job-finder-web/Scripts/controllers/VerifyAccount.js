app.controller("VerifyAccount", ["$scope", "$http", "$filter", function (s, r, f) {



    s.tabEmployer = 1;
    s.tabJobSeeker = 0;
    s.tabServiceWorker = 0;
    s.tabCustomer = 0;

    s.Employers = [];
    s.JobSeekers = [];
    s.ServiceWorkers = [];
    s.Customers = [];

    s.vEmployers = [];
    s.vJobSeekers = [];
    s.vServiceWorkers = [];
    s.vCustomers = [];


    s.typeEmployer = 0;
    s.typeJSeeker = 0;
    s.typeSWorker = 0;
    s.typeCustomer = 0;


    s.fEmployer = 1;
    s.fJSeeker = 0;
    s.fSWorker = 0;
    s.fCustomer = 0;

    s.isElementExistsAtDOMboolean = false;



    s.init = function () {

        r.get("../api/tUsers/getuseraccounts").then(function (d) {

            console.log(d.data)
            s.Employers = d.data.employers;
            s.JobSeekers = d.data.jobseekers;
            s.ServiceWorkers = d.data.serviceworkers;
            s.Customers = d.data.customers;

        })

        r.get("../api/tUsers/GetUserVerifiedAccounts").then(function (d) {

            console.log(d.data)
            s.vEmployers = d.data.employers;
            s.vJobSeekers = d.data.jobseekers;
            s.vServiceWorkers = d.data.serviceworkers;
            s.vCustomers = d.data.customers;

        })

    }










    s.cActivateDeactivateAccount = function (type, index, action, userId) {

      
        // Deactivate
        if (action == 0) {

            console.log("Deactivate")
            swal({
                title: "Are you sure?",
                text: "This account will be deactivated!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, deactivate it!",
                closeOnConfirm: false
            }, function () {

                r.post("../api/tUsers/ActivateDeactivateAccount/" + action + "/" + userId).then(function (d) {

                    console.log(d.data)
                    if (type == 1) {

                        s.vEmployers[index].Status = d.data.Status;
                    } else if (type == 2) {

                        s.vJobSeekers[index].Status = d.data.Status;
                    } else if (type == 3) {

                        s.vServiceWorkers[index].Status = d.data.Status;
                    } else if (type == 4) {

                        s.vCustomers[index].Status = d.data.Status;
                    }
                 
                })
                swal("Deactivated!", "Account has been deactivated.", "success");
            });
        }

            // Activate
        else {
            swal({
                title: "Are you sure?",
                text: "This account will be activated!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, activate it!",
                closeOnConfirm: false
            }, function () {

                r.post("../api/tUsers/ActivateDeactivateAccount/" + action + "/" + userId).then(function (d) {

                    console.log(d.data)
                    if (type == 1) {

                        s.vEmployers[index].Status = d.data.Status;
                    } else if (type == 2) {

                        s.vJobSeekers[index].Status = d.data.Status;
                    } else if (type == 3) {

                        s.vServiceWorkers[index].Status = d.data.Status;
                    } else if (type == 4) {

                        s.vCustomers[index].Status = d.data.Status;
                    }
                })
                swal("Activated!", "Account has been activated.", "success");
            });
            console.log("Activate")
        }
    }






    s.cTab = function (usertype, val) {

        if (usertype == 1) {

            if (val == 0) {
                s.typeEmployer = 0;
            }
            else {
                s.typeEmployer = 1;
            }
        } else if (usertype == 2) {

            if (val == 0) {
                s.typeJSeeker = 0;
            }
            else {
                s.typeJSeeker = 1;
            }
        } else if (usertype == 3) {

            if (val == 0) {
                s.typeSWorker = 0;
            }
            else {
                s.typeSWorker = 1;
            }
        } else if (usertype == 4) {

            if (val == 0) {
                s.typeCustomer = 0;
            }
            else {
                s.typeCustomer = 1;
            }
        }
    }

    s.vUsersAccount = function (tab) {

        if (tab == 1) {
            s.tabEmployer = 1;
            s.tabJobSeeker = 0;
            s.tabServiceWorker = 0;
            s.tabCustomer = 0;

            s.fEmployer = 1;
            s.fJSeeker = 0;
            s.fSWorker = 0;
            s.fCustomer = 0;
        }

        else if (tab == 2) {
            s.tabEmployer = 0;
            s.tabJobSeeker = 1;
            s.tabServiceWorker = 0;
            s.tabCustomer = 0;

            s.fEmployer = 0;
            s.fJSeeker = 1;
            s.fSWorker = 0;
            s.fCustomer = 0;
        }
        else if (tab == 3) {
            s.tabEmployer = 0;
            s.tabJobSeeker = 0;
            s.tabServiceWorker = 1;
            s.tabCustomer = 0;


            s.fEmployer = 0;
            s.fJSeeker = 0;
            s.fSWorker = 1;
            s.fCustomer = 0;
        }
        else if (tab == 4) {
            s.tabEmployer = 0;
            s.tabJobSeeker = 0;
            s.tabServiceWorker = 0;
            s.tabCustomer = 1;

            s.fEmployer = 0;
            s.fJSeeker = 0;
            s.fSWorker = 0;
            s.fCustomer = 1;
        }
    }


    s.vProfile = function (id) {

        console.log(id)
    }




    s.isElementExistsAtDOM = function (id) {

        console.log(id)
        if (document.getElementById(id)) {

            s.isElementExistsAtDOMboolean = true;

        } else {

            s.isElementExistsAtDOMboolean = false;

        }
        console.log(s.isElementExistsAtDOMboolean)
        return s.isElementExistsAtDOMboolean;
    }
}]);