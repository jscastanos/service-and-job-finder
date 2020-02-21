app.controller('serviceWorkerJS', ['$scope', '$http', '$timeout', function (s, h, t) {

    s.userid = '0003';
    s.profileTempArr = {};
    s.profileTempArrCert = {};
    s.jobListTempArr = {};
    s.updateCertArr = {};
    s.profileTempArrService = [];
    s.jobListArr = [];
    s.jobDiv = false;

    s.countCert = 0;

    getCompanyData();
    getCompanyCert();
    getCompanyService();
    getCompanyJobList();
    getCoordinates();

    function ReadImage(file) {

        var reader = new FileReader;
        var image = new Image;

        reader.readAsDataURL(file);
        reader.onload = function (_file) {

            image.src = _file.target.result;
            image.onload = function () {

                var height = this.height;
                var width = this.width;
                var type = file.type;
                var size = ~~(file.size / 1024) + "KB";

                $("#targetImg").attr('src', _file.target.result);
                $("#description").text("Size:" + size + ", " + height + "X " + width + ", " + type + "");
                $("#imgPreview").show();
                $("#fa-user").hide();
            }
        }
    }
    function convertToBinary(file, callBack) {
        var reader = new FileReader();

        reader.onload = function () {
            callBack(reader.result)
        };
        reader.readAsDataURL(file);
    }
    function getCompanyData() {
        h.get("../api/employerapi/CompanyData?id=" + s.userid).then(function (d) {
            s.profileTempArr = d.data;
            console.log(s.profileTempArr)
        });
    }
    function getCompanyCert() {
        h.get("../api/employerapi/CompanyCert?id=" + s.userid).then(function (d) {
            s.profileTempArrCert = d.data;
            console.log(s.profileTempArrCert);
        });
    }
    function getCompanyService() {
        h.get("../api/employerapi/CompanyService?id=" + s.userid).then(function (d) {
            s.profileTempArrServiceData = d.data;

            for (var a = 0; a < d.data.length; a++) {
                s.profileTempArrService.push(s.profileTempArrServiceData[a].name);
            }

            s.profileService = s.profileTempArrService.join(" | ");
        });
    }
    function getCompanyJobList() {

        h.get("../api/employerapi/CompanyJobList?id=" + s.userid).then(function (d) {
            s.jobListArr = d.data;
        });
    }
    function getCoordinates() {
        h.get("../api/employerapi/Coordinate?id=" + s.userid).then(function (d) {
            s.companyLat = d.data.lat;
            s.companyLng = d.data.lng;
            console.log(s.companyLat + "-" + s.companyLng)
        });

    }
    $("#imageBrowes").change(function () {
        s.certIMGFile = this.files;
        if (s.certIMGFile && s.certIMGFile[0]) {
            ReadImage(s.certIMGFile[0]);
        }

        var file = s.certIMGFile[0];
        convertToBinary(file, function (e) {
            var data = e.split(',')[1];
            s.updateCertArr.FileImg = data
        });

        $("#updateImg").hide();
    })

    s.addJobList = function () {

        s.jobListArr.push(s.jobListTempArr);

        h.post("../api/employerapi/saveJobList", s.jobListTempArr).then(function (d) {
            console.log(d.data);
            s.jobListTempArr = {};

        });
    }

    s.getJobApplicant = function (id) {
        s.jobID = id;
        s.jobDiv = true;

        h.get("../api/employerapi/jobApplicant?id=" + id).then(function (d) {
            s.jobApplicantArr = d.data;

        });
    }

    s.removeCert = function (id) {
        h.put("../api/employerapi/removeCert?id=" + id).then(function (d) {
            s.IDfoundCert = false;

            for (var i = 0; i < s.profileTempArrCert.length; i++) {
                if (s.profileTempArrCert[i].recNo == id) {
                    s.IDfoundCert = true;
                    s.countCert = i;
                    break;
                }
            }

            if (s.IDfoundCert == true) {
                s.profileTempArrCert.splice(s.countCert, 1);
            }
        });
    }

    s.hideJobListApplicant = function () {
        s.jobDiv = false;
    }

    s.updateCert = function (id) {

        h.get("../api/employerapi/updateCert?id=" + id).then(function (d) {
            s.updateCertTempArr = d.data;
            s.updateImg = true;
            s.updatedImg = false;
            $("#certModal").modal("show")
        });


    }

    s.saveUpdateCert = function () {

        s.updateCertArr.data = s.updateCertTempArr;

        h.put("../api/employerapi/saveUpdateCert", s.updateCertArr).then(function (d) {
            s.profileTempArrCert = {};
            s.updateCertArr = {};
            s.updateCertTempArr = {};
            $("#certModal").modal("hide")

            getCompanyCert();
        });

    }

    s.hideshow = function () {
        $("#imageBrowes").click();
    }



    function init_map() {
        var lat = s.companyLat;
        var lng = s.companyLng;

        var myOptions = {
            zoom: 20,
            //center: new google.maps.LatLng(7.4472, 125.8093),
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.HYBRID
        };

        map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);

        marker = new google.maps.Marker({
            map: map,
            //position: new google.maps.LatLng(7.4472, 125.8093)
            position: new google.maps.LatLng(lat, lng)
        });

        //infowindow = new google.maps.InfoWindow({
        //content: '<strong>Layout</strong><br><br>8100 <br>'
        //});
        //google.maps.event.addListener(marker, 'click', function () {
        //    infowindow.open(map, marker);
        //}); infowindow.open(map, marker); addListenerOnce

        //google.maps.event.addListener(map, 'click', function (event) {
        //    //alert("Latitude: " + event.latLng.lat() + " " + ", longitude: " + event.latLng.lng());

        //    s.selectedLat = event.latLng.lat();
        //    s.selectedLong = event.latLng.lng();


        //});

    }

    google.maps.event.addDomListener(window, 'load', init_map(7.4472, 125.8093));

}])
