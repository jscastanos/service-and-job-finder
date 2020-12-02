app.controller('employerJS', ['$scope', '$http', '$timeout', function (s, h, t) {

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
    s.skilsTab = true;
    s.tempSkills = "";
    s.byteIMG = "";
    s.count = 0;
    s.countCert = 0;
    s.index = 0;
    s.serviceTempArr = {};
    s.serviceTempArrID = {};
    s.skillTempArr = {};
    s.tempArrSave = {};
    s.data = {};
    s.certTempArr = {};
    s.companyTempArr = {};
    s.tempArr = {};
    s.brgytempArr = {};
    s.serviceArrID = [];
    s.certArr = [];
    s.iconSkill = "fa-circle";
    getService();
    getSkill();
    brgyData();
    init_map(7.4472, 125.8093);

    function init_map(lat, lng) {

        var coordinates = document.getElementById('coordinates');
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            zoom: 13
            //style: 'mapbox://styles/mapbox/streets-v11'
        });

        //var marker = new mapboxgl.Marker({
        //    draggable: true
        //})
        //    .setLngLat([0, 0])
        //    .addTo(map);

        //function onDragEnd() {
        //    var lngLat = marker.getLngLat();
        //    coordinates.style.display = 'block';
        //    coordinates.innerHTML =
        //    'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
        //}

        //marker.on('dragend', onDragEnd);

    }
    function getService() {
        h.get("../api/employerapi").then(function (d) {
            s.serviceTempArr = d.data;
        });
    }
    function getSkill() {
        h.get("../api/employerapi/skill").then(function (d) {
            s.skillTempArr = d.data;
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
                    $("#fa-user1").hide();
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
            s.companyTempArr.img = data;
        });
    })

    s.addService = function (id, index) {
        s.IDfound = false;

        for (var i = 0; i < s.serviceArrID.length; i++) {
            if (s.serviceArrID[i].ServiceId == id) {
                s.IDfound = true;
                s.count = i;
                break;
            }
        }

        if (s.IDfound == true) {
            s.serviceArrID.splice(s.count, 1);
            $("#checkbox" + index).prop("checked", false);
           
        }
        else {
            s.serviceTempArrID.ServiceId = id;

            s.serviceArrID.push(s.serviceTempArrID);
            s.serviceTempArrID = {};

        }
    }

    s.continue = function () {

        if (s.tempSkills != "" && s.serviceArrID != "") {

            s.data.userid = s.userid;
            s.data.tempSkills = s.tempSkills;
            s.data.serviceArrID = s.serviceArrID;

            s.skills = false;
            s.profile = true;
            s.skillsBtn = false;
            s.skillsUpdate = false;
            s.iconSkill = "fa-check";
            
        }
        else {
            swal("Please fill all the fields!", "", "error");
            s.iconSkill = "fa-circle";
        } 
    }

    s.updatecontinue = function () {

        if (s.tempSkills != "" && s.serviceArrID != "") {
            s.data.userid = s.userid;
            s.data.tempSkills = s.tempSkills;
            s.data.serviceArrID = s.serviceArrID;

            s.skills = false;
            s.profile = true;
            s.skillsBtn = false;
            s.skillsUpdate = false;
            s.iconSkill = "fa-check";
            
        }
        else {
            swal("Please fill all the fields!", "", "error");
            s.iconSkill = "fa-circle";
        }
    }

    s.save = function () {

        s.companyTempArr.lat = s.selectedLat;
        s.companyTempArr.longitude = s.selectedLong;
        s.companyTempArr.userid = s.userid;

        console.log(s.companyTempArr);

        if (s.tempSkills != "" && s.serviceArrID != "")
        {
            h.post("../api/employerapi/saveProfile", s.companyTempArr).then(function (d) {
                
                h.post("../api/employerapi/PostSaveSkillandService", s.data).then(function (d) {
                   
                    s.companyTempArr = {};
                });
                window.location = "../employer/employerprofile?e=" + d.data;
            });
        }
        else {
            swal("No Main Services Selected!", "", "error");
        }
    }

    s.addToTable = function () {
        $("#certModal").modal("hide");

        s.tempArr.data = s.certTempArr;
        s.tempArr.userid = s.userid;
        
        h.post("../api/employerapi/saveCertificate", s.tempArr).then(function (d) {

            s.uploadImgID = false;

            $("#imageBrowes").val("");
            s.certArr.push(d.data);
            s.certTempArr = {};

            $("#imgPreview").hide();
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
    s.skillsServices = function () {

        if (s.tempSkills != "" && s.serviceArrID != "") {

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
    s.hideshowCompany = function () {
        $("#companyPic").click();
    }
    s.profilePic = function () {
        $('#companyPic').click();
    }
    
    $("#brgyID").change(function () {

        var lat = $("#brgyID").val().toString().split('-')[0];
        var long = $("#brgyID").val().toString().split('-')[1];

        //google.maps.event.addDomListener(window, 'load', init_map(lat, long));

        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [long, lat],
            zoom: 14
            //style: 'mapbox://styles/mapbox/streets-v11'
        });
        var coordinates = document.getElementById('coordinates');

        var marker = new mapboxgl.Marker({
            draggable: true
        }).setLngLat([long, lat]).addTo(map);

        function onDragEnd() {
            var lngLat = marker.getLngLat();
            //coordinates.style.display = 'block';
            //coordinates.innerHTML =
            //'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;

            s.selectedLat = lngLat.lat;
            s.selectedLong = lngLat.lng;

        }

        marker.on('dragend', onDragEnd);
     
    });

}])
