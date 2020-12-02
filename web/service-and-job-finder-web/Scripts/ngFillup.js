app.controller('SSFillUp', ["$scope", "$http", "$filter", function (s, h, _f) {
    s.check = 0;
    s.count = 0;
    s.index = 0;
    s.imageBrowesBol = false;
    s.imageBrowesBol2 = false;
    s.tempSkills = {};
    s.fieldofExpertise = {};
    s.serviceTempArrID = {};
    s.skillTempArr = {};
    s.serviceArrID = [];
    s.data = {};
    s.datacert = {};
    s.datacert2 = {};
    s.certTempArr = {};
    s.TcertTempArr = {};
    s.TcertTempArr2 = {};
    s.profTempArr = {};
    s.tempArrCert = {};
    s.tempArrCert2 = {};
    s.industryTempArr = {};
    //s.profTempPic = {};
    s.PortArr = [];
    s.EmpArr = [];
    s.EduArr = [];
    s.TrainArr = [];
    s.CertArr = [];
    s.CertArr2 = [];
    s.globalID = "65B6F";

    getSkill();
    loaddata();
    getIndustry();

   
    function getSkill() {
        h.get("../api/employerapi/skill")
        .then(function (d) {
            s.skillTempArr = d.data;
        })
    }

    function getIndustry() {
        h.get("../api/JobSeeker/Industrydata")
        .then(function (d) {
           s.industryTempArr = d.data;
            
        })
    }

    s.getId = "";

    $("#getIndustryID").change(function () {
        s.getId = $("#getIndustryID").val();
        h.get("../api/JobSeeker/FieldofExpertise?id=" + s.getId)
            .then(function (d) {

                s.fieldofExpertise = d.data;
                console.log(s.fieldofExpertise)
              
            })
        
    })



    function loaddata() {
        console.log(s.check);
    }

    s.addService = function (id, index) {
        s.IDfound = false;
        console.log(s.serviceArrID.length)
        for (var i = 0; i < s.serviceArrID.length; i++) {
            if (s.serviceArrID[i].ExpertiseId == id) {
                s.IDfound = true;
                s.count = i;
                console.log(s.count)
                break;
            }
        }

        if (s.IDfound == true) {
            s.serviceArrID.splice(s.count, 1);
            $("#checkbox" + index).prop("checked", false);

        }
        else {
            s.serviceTempArrID.ExpertiseId = id;

            s.serviceArrID.push(s.serviceTempArrID);
            s.serviceTempArrID = {};

        }
        console.log(s.serviceArrID);

    }

    s.SkillandService = function () {
        ////h.post("../api/JobSeeker/SaveSkills", s.data).then(function (d) {
        //   s.check = 1;
        ////    console.log(d.data)
        ////});


        //1st page
        //s.data.getId = s.getId;
        //s.data.tempSkills = s.tempSkills;
        //s.data.serviceArrID = s.serviceArrID;

        if (s.serviceArrID != "" && s.tempSkills != "") {
              s.check = 1;

        } else {
            alert('no content')
        }
    }
    s.PortAdd = function () {
        s.TcertTempArr = {};
        s.portAddBool = true;
        s.educAddBool = false;
        s.empAddBool = false;
        s.trnAddBool = false;
        s.crtAddBool = false;
        $('#portfolioModal').modal('show');
    }

    s.EducationAdd = function () {
        s.certTempArr = {};
        s.portAddBool = false;
        s.educAddBool = true;
        s.empAddBool = false;
        s.trnAddBool = false;
        s.crtAddBool = false;
        $('#educationModal').modal('show');
    }


    s.EmploymentAdd = function () {
        s.certTempArr = {};
        s.portAddBool = false;
        s.educAddBool = false;
        s.empAddBool = true;
        s.trnAddBool = false;
        s.crtAddBool = false;
        $('#employmentModal').modal('show');
    }

    s.TrainingAdd = function () {
        s.certTempArr = {};
        s.portAddBool = false;
        s.educAddBool = false;
        s.empAddBool = false;
        s.trnAddBool = true;
        s.crtAddBool = false;
        $('#trainingModal').modal('show');
    }

    s.CertAdd = function () {
        s.certTempArr = {};
        s.portAddBool = false;
        s.educAddBool = false;
        s.empAddBool = false;
        s.trnAddBool = false;
        s.crtAddBool = true;
        $('#certificationModal').modal('show');
    }

    s.SaveTempList = function () {

        //PORTFOLIO




        //if (s.portAddBool == true) {
        //    console.log("portfolio dria")
        //    s.portexist = false;
        //    for (var i = 0; i < s.PortArr.length; i++) {
        //        if (s.PortArr[i].id == s.certTempArr.id) {
        //            console.log("nakasulod")
        //            s.portexist = true;
        //            s.PortArr[i] = s.certTempArr;
        //            s.certTempArr = {};
        //            break;
        //        }
        //    }

        //    if (s.portexist == false) {
        //        s.certTempArr.id = s.PortArr.length
        //        s.PortArr.push(s.certTempArr);

        //    }
        //    s.portAddBool = false;
        //}
        // END PORTFOLIO

        //EDUCATION
        if (s.educAddBool == true) {
            console.log("education dria")
            s.eduexist = false;
            for (var i = 0; i < s.EduArr.length; i++) {
                if (s.EduArr[i].id == s.certTempArr.id) {
                    console.log("nakasulod")
                    s.eduexist = true;
                    s.EduArr[i] = s.certTempArr;
                    s.certTempArr = {};
                    break;
                }
            }

            if (s.eduexist == false) {
                s.certTempArr.id = s.EduArr.length
                s.EduArr.push(s.certTempArr);

            }
            s.educAddBool = false;
        }
        // END EDUCATION


        //EMPLOYMENT
        if (s.empAddBool == true) {
            console.log("employee dria")
            s.empexist = false;
            for (var i = 0; i < s.EmpArr.length; i++) {
                if (s.EmpArr[i].id == s.certTempArr.id) {
                    console.log("nakasulod")
                    s.empexist = true;
                    s.EmpArr[i] = s.certTempArr;
                    s.certTempArr = {};
                    break;
                }
            }

            if (s.empexist == false) {
                s.certTempArr.id = s.EmpArr.length
                s.EmpArr.push(s.certTempArr);

            }
            s.empAddBool = false;
        }
        // END EMPLOYMENT

        //TRAINING
        if (s.trnAddBool == true) {
            console.log("training dria")
            s.crtexist = false;
            for (var i = 0; i < s.TrainArr.length; i++) {
                if (s.TrainArr[i].id == s.certTempArr.id) {
                    console.log("nakasulod")
                    s.crtexist = true;
                    s.TrainArr[i] = s.certTempArr;
                    s.certTempArr = {};
                    break;
                }
            }

            if (s.crtexist == false) {
                s.certTempArr.id = s.TrainArr.length
                s.TrainArr.push(s.certTempArr);

            }
            s.trnAddBool = false;
        }
        // END TRAINING


        ////CERTIFICATION
        //if (s.crtAddBool == true) {
        //    console.log("Certification dria")
        //    s.trnexist = false;
        //    for (var i = 0; i < s.CertArr.length; i++) {
        //        if (s.CertArr[i].id == s.certTempArr.id) {
        //            console.log("nakasulod")
        //            s.trnexist = true;
        //            s.CertArr[i] = s.certTempArr;
        //            s.certTempArr = {};
        //            break;
        //        }
        //    }

        //    if (s.trnexist == false) {
        //        s.certTempArr.id = s.CertArr.length
        //        s.CertArr.push(s.certTempArr);

        //    }
        //    s.crtAddBool = false;
        //}
        //// END CERTIFICATION



        s.certTempArr = {};

        $('#educationModal').modal('hide');
        $('#employmentModal').modal('hide');
        $('#trainingModal').modal('hide');
        $('#certificationModal').modal('hide');
        $('#portfolioModal').modal('hide');
        console.log(s.CertArr)
    }

    //Portfolio
    s.Deleteport = function (emp) {
        s.PortArr.splice(emp.id, 1);

        for (i = 0; i < s.PortArr.length; i++) {
            s.PortArr[i].id = i;
        }
    }

    s.Editport = function (emp) {
        s.certTempArr = emp;
        $('#portfolioModal').modal('show');
    }


    //Education
    s.Deleteduc = function (emp) {
        s.EduArr.splice(emp.id, 1);

        for (i = 0; i < s.EduArr.length; i++) {
            s.EduArr[i].id = i;
        }
    }

    s.Editeduc = function (emp) {
        s.certTempArr = emp;
        $('#educationModal').modal('show');
    }


    //Employment
    s.Deletemp = function (emp) {
        s.EmpArr.splice(emp.id, 1);

        for (i = 0; i < s.EmpArr.length; i++) {
            s.EmpArr[i].id = i;
        }
    }
    s.Editemp = function (emp) {
        s.certTempArr = emp;
        $('#employmentModal').modal('show');
    }


    //Training
    s.Deletetrn = function (emp) {
        s.TrainArr.splice(emp.id, 1);

        for (i = 0; i < s.TrainArr.length; i++) {
            s.TrainArr[i].id = i;
        }
    }
    s.Editrn = function (emp) {
        s.certTempArr = emp;
        $('#trainingModal').modal('show');
    }

    //Certification
    s.Deletecert = function (emp) {
        s.CertArr.splice(emp.id, 1);

        for (i = 0; i < s.CertArr.length; i++) {
            s.CertArr[i].id = i;
        }
    }
    s.Editcert = function (emp) {
        s.certTempArr = emp;
        $('#trainingModal').modal('show');
    }



    s.GetBackSS = function () {
        s.check = 0;
    }

    s.School = function () {
        console.log("sdasdas")
    }


    //Profile Pic

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
                if (s.imageBrowesBol2 == true) {
                    $("#targetImg2").attr('src', _file.target.result);
                    $("#description2").text("Size:" + size + ", " + height + "X " + width + ", " + type + "");
                    $("#imgPreview2").show();
                    $("#fa-user2").hide();
                }

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

    $("#imageBrowes").change(function () {
        s.certIMGFile = this.files;
        if (s.certIMGFile && s.certIMGFile[0]) {
            s.imageBrowesBol = true;
            ReadImage(s.certIMGFile[0]);
        }

        var file = s.certIMGFile[0];
        convertToBinary(file, function (e) {
            var data = e.split(',')[1];
            s.tempArrCert.FileImg = data
        });
    })

    $("#fileup").click(function () {
        $("#files").click()
    })

    $("#files").change(function () {
        s.portIMGFile = this.files;
        if (s.portIMGFile && s.portIMGFile[0]) {
            s.imageBrowesBol2 = true;
            ReadImage(s.portIMGFile[0]);
        }

        var file = s.portIMGFile[0];
        convertToBinary(file, function (e) {
            var data1 = e.split(',')[1];
            s.tempArrCert2.FileImg2 = data1
        });
    })


    $("#profilePic").change(function () {
        s.companyProPicFile = this.files;
        console.log(s.companyProPicFile)
        if (s.companyProPicFile && s.companyProPicFile[0]) {
            s.imageBrowesBol = false;
            ReadImage(s.companyProPicFile[0]);
        }

        var file = s.companyProPicFile[0];
        convertToBinary(file, function (e) {
            var data = e.split(',')[1];
            s.profTempArr.ProfileImg = data;
        });
    })

    //s.checkdis = function () {
    //    console.log(s.tempArrCert.FileImg)
    //    console.log(s.tempArrCert2.FileImg2)
    //}

    s.hideshow = function () {
        $("#imageBrowes").click();
    }

    s.hideshow2 = function () {
        $("#imageBrowes2").click();
       
    }

    s.hideshowCompany = function () {
        $("#profilePic").click();
    }
    s.profilePic = function () {
        $('#profilePic').click();
    }


    s.addToTableCert = function () {
        $('#certificationModal').modal('hide');
        $('#imgPreview').hide();
        s.tempArrCert.datacert = s.TcertTempArr;
        s.tempArrCert.globalID = s.globalID;
        console.log(s.tempArrCert);
        if (s.tempArrCert.FileImg != null) {
            h.post("../api/employerapi/saveCertificate", s.tempArrCert).then(function (d) {


                s.uploadImgID = false;
                s.tempArrCert = {}
                $("#imageBrowes").val("");
                s.CertArr.push(d.data);
                s.TcertTempArr = {};
                console.log(d.data);
            });
        } else {
            alert('no image')
        }
    }


    s.addToTableCert2 = function () {
        $('#portfolioModal').modal('hide');
        $('#imgPreview2').hide();
        s.tempArrCert2.datacert2 = s.TcertTempArr2;
        s.tempArrCert2.globalID = s.globalID;
        console.log(s.tempArrCert2);
        if (s.tempArrCert2.FileImg2 != null) {
            h.post("../api/employerapi/savePortfolio", s.tempArrCert2).then(function (d) {

                console.log(d.data);

                s.uploadImgID = false;
                s.tempArrCert = {}
                $("#imageBrowes2").val("");
                s.CertArr2.push(d.data);
                s.tempArrCert2 = {};
                s.TcertTempArr2 = {};
                console.log(s.CertArr2);
            });
        } else {
            alert('no image')
        }
    }


    s.removeCert = function (id) {
        h.put("../api/employerapi/removeCert?id=" + id).then(function (d) {
            s.IDfoundCert = false;

            for (var i = 0; i < s.CertArr.length; i++) {
                if (s.CertArr[i].recNo == id) {
                    s.IDfoundCert = true;
                    s.countCert = i;
                    break;
                }
            }

            if (s.IDfoundCert == true) {
                s.CertArr.splice(s.countCert, 1);
            }
        });
    }

    s.removePort = function (id) {
        h.put("../api/employerapi/removePort?id=" + id).then(function (d) {
            s.IDfoundCert2 = false;

            for (var i = 0; i < s.CertArr2.length; i++) {
                if (s.CertArr2[i].recNo == id) {
                    s.IDfoundCert2 = true;
                    s.countCert = i;
                    break;
                }
            }

            if (s.IDfoundCert2 == true) {
                s.CertArr2.splice(s.countCert, 1);
            }
        });
    }




    s.req= {};
    s.saveThis = function () {
        //1st page
        s.data.getId = s.getId;
        s.data.tempSkills = s.tempSkills;
        s.data.serviceArrID = s.serviceArrID;
        s.data.globalID = s.globalID;

        //2nd page
        //s.data.profTempArr = s.profTempArr;
        s.req.EduArr = s.EduArr;
        s.req.EmpArr = s.EmpArr;
        s.req.TrainArr = s.TrainArr;
        s.req.img = s.profTempArr.ProfileImg;
        s.req.globalID = s.globalID;


        console.log(s.profTempArr)
        console.log(s.req)
       // console.log(s.profTempArr.ProfileImg)
        if(s.req.img != null){

            h.post("../api/jobseeker/saveskills", s.data).then(function (d) {
                console.log(d.data)
            });

            h.post("../api/JobSeeker/ProfRequirements", { profTempArr: s.profTempArr, req: s.req }).then(function (d) {
                s.profTempArr = {};
                console.log(d.data)
                window.location.href = "../jobseekerprofile/jobseekerview";
            });
        } else {
            alert('please put profile pic')
        }
        


        //if (s.profTempArr != null && s.req != null && s.data.tempSkills != null && s.data.serviceArrID != null) {

        //    h.post("../api/JobSeeker/SaveSkills", s.data).then(function (d) {
        //        console.log(d.data)
        //    });
        //    h.post("../api/JobSeeker/ProfRequirements", { profTempArr: s.profTempArr, req: s.req }).then(function (d) {
        //        s.profTempArr = {};
        //        console.log(d.data)
        //       /// window.location.href = "../JobSeekerProfile/JobSeekerView";
        //    });

        //} else {
        //    alert('Something is missing')
        //}
        
            //console.log(s.profTempArr);
            //h.post("../api/JobSeeker/Prof", s.profTempArr).then(function (d) {
            //    console.log(d.data)
            //    s.profTempArr = {};
            //});
    }



}]);