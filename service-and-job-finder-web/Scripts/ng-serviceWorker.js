app.controller('serviceWorkerJS', ['$scope', '$http', '$timeout', function (s, h, t) {

    var url = new URL(location.href);

    s.type = url.searchParams.get('type');
    s.userid = url.searchParams.get('userid');

    console.log(s.type + "-" + s.userid);

    s.skills = true;
    s.skillsBtn = true;
    s.skillsUpdate = false;
    s.profile = false;
    //s.skills = false;
    //s.profile = true;
    s.imageBrowesBol = false;
    s.tempMainService = {};
    s.data = {};
    s.serviceTempArr = {};
    s.serviceTempArrData = {};
    s.tempArr = {};
    s.certArr = [];
    s.iconSkill = "fa-circle";

    s.tempService = "";

    getService();
    brgyData();

    function getService() {
        h.get("../api/employerapi").then(function (d) {
            s.serviceTempArr = d.data;
        });
    }
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

                if (s.imageBrowesBol == true) {
                    $("#targetImg").attr('src', _file.target.result);
                    $("#description").text("Size:" + size + ", " + height + "X " + width + ", " + type + "");
                    $("#imgPreview").show();
                    $("#fa-user").hide();
                }
                else {
                    $("#targetPic").attr('src', _file.target.result);
                    $("#companyDescription").text("Size:" + size + ", " + height + "X " + width + ", " + type + "");
                    $("#companyimgPreview").show();
                    $("#fa-user").hide();
                }
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
    function brgyData() {
        h.get("../api/employerapi/brgy").then(function (d) {
            s.brgytempArr = d.data;
        });
    }

    $("#imageBrowes").change(function () {
        s.certIMGFile = this.files;
        if (s.certIMGFile && s.certIMGFile[0]) {
            s.imageBrowesBol = true;
            ReadImage(s.certIMGFile[0]);
        }

        var file = s.certIMGFile[0];
        convertToBinary(file, function (e) {
            var data = e.split(',')[1];
            //s.certTempArr.FileImg = data;
            s.tempArr.FileImg = data
        });
    })
    $("#companyPic").change(function () {
        s.companyProPicFile = this.files;

        if (s.companyProPicFile && s.companyProPicFile[0]) {
            s.imageBrowesBol = false;
            ReadImage(s.companyProPicFile[0]);
        }

        var file = s.companyProPicFile[0];
        convertToBinary(file, function (e) {
            var data = e.split(',')[1];
            s.serviceTempArrData.img = data;
        });
    })

    s.continue = function () {
        if (s.tempMainService != "" && s.tempService != "") {

            s.skills = false;
            s.profile = true;
            s.skillsBtn = false;
            s.skillsUpdate = false;
            s.iconSkill = "fa-check";
        }
        else {
            swal("Please fill all the fields!", "", "error");
        } 
    }

    s.updatecontinue = function () {

        if (s.tempMainService != "" && s.tempService != "") {

            s.skills = false;
            s.profile = true;
            s.skillsBtn = false;
            s.skillsUpdate = false;
            s.iconSkill = "fa-check";

        }
        else {
            swal("Please fill all the fields!", "", "error");
        }
    }

    s.save = function () {

        s.serviceTempArrData.lat = s.selectedLat;
        s.serviceTempArrData.longitude = s.selectedLong;
        s.serviceTempArrData.userid = s.userid;

        s.tempMainService = s.userid;
        if (s.tempMainService != "" && s.tempService != "") {
            h.post("../api/employerapi/saveProfile", s.serviceTempArrData).then(function (d) {
                h.post("../api/serviceworkerapi/PostSaveService?data=" + s.tempService + "&userid=" + s.userid).then(function (d) {
                    h.post("../api/serviceworkerapi/PostSaveMainService", s.tempMainService).then(function (d) {
                       
                        s.serviceTempArrData = {};
                    });
                });
                window.location = "../serviceworker/serviceWorkerprofile?e=" + d.data;
            });
        }
        else {
            swal("Please fill all the fields!", "", "error");
        } 
    }

    s.addToTable = function () {

        $("#certModal").modal("hide");
        s.tempArr.data = s.certTempArr;

        h.post("../api/employerapi/saveCertificate", s.tempArr).then(function (d) {

            s.uploadImgID = false;

            $("#imageBrowes").val("");
            s.certArr.push(d.data);
            s.certTempArr = {};

        });

    }

    s.removeCert = function (id) {
        h.put("../api/employerapi/removeCert?id=" + id).then(function (d) {
            s.IDfoundCert = false;

            for (var i = 0; i < s.certArr.length; i++) {
                if (s.certArr[i].recNo == id) {
                    s.IDfoundCert = true;
                    s.countCert = i;
                    break;
                }
            }

            if (s.IDfoundCert == true) {
                s.certArr.splice(s.countCert, 1);
            }
        });
    }

    s.hideshow = function () {
        $("#imageBrowes").click();
    }
    s.hideshowCompany = function () {
        $("#companyPic").click();
    }
    s.skillsServices = function () {

        if (s.tempMainService != "" && s.tempService != "") {

            s.skills = true;
            s.skillsUpdate = true;
            s.profile = false;
            s.skillsBtn = false;

        }
        else {
            s.skills = true;
            s.skillsUpdate = false;
            s.profile = false;
            s.skillsBtn = true;
        }
    }
    s.createProfile = function () {
        s.skills = false;
        s.profile = true;
        s.skillsBtn = false;
        s.skillsUpdate = false;
        s.createProfileTrigger = "pointer";
    }
    s.profilePic = function () {
        $('#companyPic').click();
    }
    s.addJobList = function () {

        s.jobListArr.push(s.jobListTempArr);

        h.post("../api/employerapi/saveJobList", s.jobListTempArr).then(function (d) {
            console.log(d.data);
            s.jobListTempArr = {};

        });
    }
    $("#brgyID").change(function () {

        var lat = $("#brgyID").val().toString().split('-')[0];
        var long = $("#brgyID").val().toString().split('-')[1];

        google.maps.event.addDomListener(window, 'load', init_map(lat, long));
    });

    function init_map(lat, long) {

        var myOptions = {
            zoom: 14,
            //center: new google.maps.LatLng(7.424357378428908, 125.82941258743372),
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.HYBRID
        };

        map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);

        //infowindow = new google.maps.InfoWindow({
        //content: '<strong>Layout</strong><br><br>8100 <br>'
        //});
        //google.maps.event.addListener(marker, 'click', function () {
        //    infowindow.open(map, marker);
        //}); infowindow.open(map, marker); addListenerOnce

        google.maps.event.addListener(map, 'click', function (event) {
            //alert("Latitude: " + event.latLng.lat() + " " + ", longitude: " + event.latLng.lng());

            s.selectedLat = event.latLng.lat();
            s.selectedLong = event.latLng.lng();

            marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
            });
        });

    }

    google.maps.event.addDomListener(window, 'load', init_map(7.4472, 125.8093));

}])
