app.controller('employerJS', ['$scope', '$http', '$timeout', function (s, h, t) {

    var url = new URL(location.href);

    s.entityID = url.searchParams.get('e');

    //s.entityID = localStorage.getItem("userid");

    s.profileTempArr = {};
    s.profileTempArrCert = {};
    s.updateCertTempArrProPic = {};
    s.jobListTempArr = {};
    s.updateCertArr = {};
    s.updateCertArrProPic = {};
    s.data = {};
    s.profileTempArrService = [];
    s.jobListArr = [];
    s.jobDiv = false;
    s.profilePicBol = false;
    $("#targetImgproPic").hide();
    s.profileService = "";
    s.countCert = 0;

    getCompanyData();
    getCompanyCert();
    getCompanyService();
    getCompanyJobList();
    getCoordinates();
    getService();
    getUserID();

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

                $("#targetImgproPic").show();
                $("#targetImgproPic").attr('src', _file.target.result);
                $("#imgPreviewproPic").hide();
            }
        }
    }
    function getService() {
        h.get("../api/employerapi").then(function (d) {
            s.serviceTempArr = d.data;
        });
    }
    function convertToBinary(file, callBack) {
        var reader = new FileReader();

        reader.onload = function () {
            callBack(reader.result)
        };
        reader.readAsDataURL(file);
    }
    function getCompanyData() {
        h.get("../api/employerapi/CompanyData?id=" + s.entityID).then(function (d) {
            s.profileTempArr = d.data;
            document.getElementById('about').innerHTML = s.profileTempArr.About;
        });
    }
    function getCompanyCert() {
        h.get("../api/employerapi/CompanyCert?id=" + s.entityID).then(function (d) {
            s.profileTempArrCert = d.data;
            console.log(s.profileTempArrCert);
        });
    }
    function getCompanyService() {
        h.get("../api/employerapi/CompanyService?id=" + s.entityID).then(function (d) {
            s.profileTempArrServiceData = d.data;

            for (var a = 0; a < d.data.length; a++) {
                s.profileTempArrService.push(s.profileTempArrServiceData[a].name);
            }

            s.profileService = s.profileTempArrService.join(" | ");
        });
    }
    function getCompanyJobList() {

        h.get("../api/employerapi/CompanyJobList?id=" + s.entityID).then(function (d) {
            s.jobListArr = d.data;
        });
    }
    function getCoordinates() {
        h.get("../api/employerapi/Coordinate?id=" + s.entityID).then(function (d) {
            s.companyLat = d.data.lat;
            s.companyLng = d.data.lng;
            //console.log(s.companyLat + "-" + s.companyLng)

            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/outdoors-v11',
                center: [d.data.lng, d.data.lat],
                zoom: 12
                //style: 'mapbox://styles/mapbox/streets-v11'
            });

            var marker = new mapboxgl.Marker({
                draggable: true
            }).setLngLat([d.data.lng, d.data.lat]).addTo(map);

            function onDragEnd() {
                var lngLat = marker.getLngLat();
                //coordinates.style.display = 'block';
                //coordinates.innerHTML =
                //'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;

                s.selectedLat = lngLat.lat;
                s.selectedLong = lngLat.lng;

            }

            marker.on('dragend', onDragEnd);

            console.log("Lat" + s.selectedLat);
            console.log("Long" + s.selectedLong);
        });
    }
    function getUserID() {
        h.get("../api/employerapi/userData?id=" + s.entityID).then(function (d) {
            s.userData = d.data;
            console.log(s.userData)
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
        swal({
            title: "Are you sure?",
            //text: "You will not be able to recover this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
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
                swal("Successfully Remove!", "", "success");
            });
        });
    }

    s.hideJobListApplicant = function () {
        s.jobDiv = false;
    }
    s.addCert = function () {
        s.updateCertTempArr = {};
        $("#updateImg").hide();
        s.updateTitle = false;
        s.addTitle = true;
        $("#certModal").modal("show");
    }
    s.updateCert = function (id) {
        $("#updateImg").show();
        s.updateTitle = true;
        s.addTitle = false;
        h.get("../api/employerapi/updateCert?id=" + id).then(function (d) {
            s.updateCertTempArr = d.data;
            s.updateImg = true;
            s.updatedImg = false;
            $("#certModal").modal("show");
        });


    }

    s.saveUpdateCert = function () {

        s.updateCertArr.data = s.updateCertTempArr;

        if (s.addTitle == true) {

            h.post("../api/employerapi/saveCertificate", s.updateCertArr).then(function (d) {

                s.uploadImgID = false;

                s.profileTempArrCert.push(d.data);
                s.updateCertArr = {};

                $("#certModal").modal("hide");
                $("#imgPreview").hide();
            });

        }
        else {

            h.put("../api/employerapi/saveUpdateCert", s.updateCertArr).then(function (d) {
                s.profileTempArrCert = {};
                s.updateCertArr = {};
                s.updateCertTempArr = {};
                $("#certModal").modal("hide");

                getCompanyCert();
            });

        }

    }

    s.hideshow = function () {
        $("#imageBrowes").click();
    }
    s.removeJob = function (id) {
        swal({
            title: "Are you sure?",
            //text: "You will not be able to recover this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
            h.put("../api/employerapi/removeJob?id=" + id).then(function (d) {
                s.IDfoundCert = false;

                for (var i = 0; i < s.jobListArr.length; i++) {
                    if (s.jobListArr[i].recNo == id) {
                        s.IDfoundCert = true;
                        s.countCert = i;
                        break;
                    }
                }

                if (s.IDfoundCert == true) {
                    s.jobListArr.splice(s.countCert, 1);
                }

                swal("Successfully Remove!", "", "success");
            });
        });
    }
    s.saveUpdateCompanyDesc = function (recno) {
        var str = $("#aboutTextArea").val();
        var msg = str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />')
        console.log(str);
        console.log(msg);
        h.put("../api/employerapi/saveUpdateCompanyDesc?recno=" + recno + "&desc=" + msg).then(function (d) {
            getCompanyData();
        });
    }
    s.changeProPic = function (recno) {
        $("#updateProPicInput").click();

        $("#updateProPicInput").change(function () {
            s.certIMGFileProPic = this.files;
            s.profilePicBol = true;
            console.log(s.certIMGFileProPic[0])
            ReadImage(s.certIMGFileProPic[0]);

            var file = s.certIMGFileProPic[0];
            convertToBinary(file, function (e) {
                var data = e.split(',')[1];
                s.updateCertArrProPic.FileImg = data
            });

            s.updateCertTempArrProPic.recNo = recno;
            s.updateCertArrProPic.data = s.updateCertTempArrProPic;

            console.log(s.updateCertArrProPic);

            h.put("../api/employerapi/saveUpdateProPic", s.updateCertArrProPic).then(function (d) {
                s.profileTempArrCert = {};
                s.updateCertArrProPic = {};
                s.updateCertTempArrProPic = {};
            });
        });
    }
    s.saveUpdateProfile = function () {

        s.data.data = s.profileTempArr;
        s.data.serviceData = s.tempSkills;

        console.log(s.data);

        h.put("../api/employerapi/saveUpdateProfile", s.data).then(function (d) {
            s.data = {};
            s.profileService = "";
            console.log(s.profileService + "asd");
            getService();
            getCompanyData();
            s.profileTempArrServiceData = d.data;
            s.profileTempArrService = [];

            for (var a = 0; a < d.data.length; a++) {
                s.profileTempArrService.push(s.profileTempArrServiceData[a].name);
            }

            s.profileService = s.profileTempArrService.join(" | ");

            console.log(s.profileTempArrService + "asdddd");

        });
    }

}])
