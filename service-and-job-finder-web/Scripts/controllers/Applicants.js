app.controller("Applicants", ["$scope", "$http", "$filter", "$rootScope", function (s, r, f, rs) {


    var url = new URL(location.href);

    s.jobId = url.searchParams.get('jobId');
    s.EntityId = url.searchParams.get('id');


    //s.EntityId = "929EA";
    s.jobs = [];
    s.sendMsgTempArr = {};

    s.index = 0;
    s.activeTab1 = 'tab-pane active';
    s.activeTab2 = 'tab-pane';

    s.showSearchBartab1 = 0;
    s.showSearchBartab2 = 0;


    s.isElementExistsAtDOMboolean = false;


    s.init = function () {

        r.get("../api/tUsers/GetJobs/" + s.EntityId).then(function (d) {

            console.log(d.data)
            s.jobs = d.data;
        })



    }

    s.cTab = function (type) {

        if (type == 0) {

            s.showSearchBartab1 = 0;
            s.showSearchBartab2 = 0;
            s.activeTab1 = 'tab-pane active';
            s.activeTab2 = 'tab-pane';
        }

        else {

            s.showSearchBartab1 = 1;
            s.showSearchBartab2 = 1;
            s.activeTab1 = 'tab-pane';
            s.activeTab2 = 'tab-pane active';
        }
    }

    s.vApplicants = function (index) {

        s.index = index;
        s.showSearchBartab1 = 0;
        s.showSearchBartab2 = 0;
        s.activeTab1 = 'tab-pane active';
        s.activeTab2 = 'tab-pane';
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

    s.sendMsg = function (name, id) {

        s.sendMsgTempArr.UserId = id;
        s.sendMsgTempArr.Name = name;
                       
        rs.sendMessage(s.sendMsgTempArr);
    }

}]);