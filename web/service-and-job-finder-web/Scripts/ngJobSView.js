app.controller('JSView', ["$scope", "$http", "$filter", function (s, h, _f) {

    var url = new URL(location.href);

    s.personalID = url.searchParams.get('id');

    console.log(s.personalID);

    s.test = "mictest"
    s.globalID = "65B6F";
    s.switchpic = 1;
    s.profileData = [];
    s.portfolioData = [];
    s.employmentData = [];
    s.TrainingsData = [];
    s.CertificateData = [];
    s.EducationData = [];
    s.ExpertiseData = [];
    s.SkillsData = [];

    s.industryTempArr = {};
    s.fieldofExpertise = {};
    s.serviceTempArrID = {};
    s.serviceArrID = [];
    s.data = {};
    s.predata = {};
    s.expertId = [];
    s.temparr = {};

    s.tempArrCert2 = {};
    s.imageBrowesBol2 = false;
    s.datacert2 = {};

    s.tempArrCert = {};
    s.imageBrowesBol = false;
    s.datacert = {};

    loadtuser();
    loadprofile();
    loadportfolio();
    loademploymenthistory();
    loadTrainings();
    loadCertificates();
    loadEducation();
    loadExpertise();
    loadSkills();

   
    function ReadImage(file) {

        console.log(file);
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
                    console.log("kasulod ko")
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

    s.refresh = function () {
        loadtuser();
        loadprofile();
        loadportfolio();
        loademploymenthistory();
        loadTrainings();
        loadCertificates();
        loadEducation();
        loadExpertise();
        loadSkills();
    }

    //Add txt
   
    s.AddEdu = function () {
        s.certTempArr = {};
        $('#educationModal').modal('show');

    }
    s.AddTrn = function () {
        s.trainTempArr = {};
        $('#trainingModal').modal('show');
    }

    s.AddEmp = function () {
        s.trainTempArr = {};
        $('#employmentModal').modal('show');
    }

    s.certTempArr = {};
    s.Edu = function () {
        s.certTempArr.PersonId = s.globalID;
        console.log(s.certTempArr);
        h.post("../api/ViewJobSeeker/EduInfo", s.certTempArr)
       .then(function (d) {
           s.certTempArr = {};
           console.log(d.data)
           loadEducation();
           $('#educationModal').modal('hide');
       })
     }

    s.trainTempArr = {};
    s.Trn = function () {
        s.trainTempArr.PersonId = s.globalID;
        console.log(s.trainTempArr);
        h.post("../api/ViewJobSeeker/TrnInfo", s.trainTempArr)
       .then(function (d) {
           s.trainTempArr = {};
           console.log(d.data)
           loadTrainings();
           $('#trainingModal').modal('hide');
       })
    }

    s.empTempArr = {};
    s.Emp = function () {
        s.empTempArr.PersonId = s.globalID;
        console.log(s.empTempArr);
        h.post("../api/ViewJobSeeker/EmpInfo", s.empTempArr)
       .then(function (d) {
           s.empTempArr = {};
           console.log(d.data)
           loademploymenthistory();
           $('#employmentModal').modal('hide');
       })
    }

    $("#clickPortfolio").click(function () {
        $("#files").click()
    })



    //PICTURE
    s.hideshow = function () {
        $("#imageBrowes").click();
    }

    s.hideshow2 = function () {
        $("#imageBrowes2").click();

    }

    


    s.profilePic = function () {
        $('#profilePic').click();
    }


    //mine
    s.upProfile = function () {
        $("#picProf").click();
    }

    //function loadProf() {
    //    h.post("../JobSeekerProfile/RetrieveProfile")
    //        .then(function () {
    //            consol.log(d.data)
    //        })
    //}

    s.TempUpdateProf = {};
    $("#picProf").change(function () {
        s.switchpic = 0;
        s.ProPicFile = this.files;
        console.log(s.ProPicFile)
        if (s.ProPicFile && s.ProPicFile[0]) {
            s.imageBrowesBol = false;
            ReadImage(s.ProPicFile[0]);
        }

        var file = s.ProPicFile[0];
        convertToBinary(file, function (e) {
            var data = e.split(',')[1];
            s.TempUpdateProf.UpdateProf = data;
            s.TempUpdateProf.UserId = s.profileData[0].UserId;
          
        });
        h.put("../api/ViewJobSeeker/UpProf", s.TempUpdateProf)
              .then(function (d) {

                  //loadProf();
              })
       
    })

    

    s.PortAdd = function () {
        s.TcertTempArr2 = {};
        $('#portfolioModal').modal('show');
    }
    s.CertAdd = function () {
        s.TcertTempArr = {};
        $('#certificationModal').modal('show');
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

    function convertToBinary(file, callBack) {
        var reader = new FileReader();

        reader.onload = function () {
            callBack(reader.result)
        };
        reader.readAsDataURL(file);
    }

    //Save Database Pic
    s.addToTableCert2 = function () {
        $('#portfolioModal').modal('hide');
        $('#imgPreview2').hide();
        s.tempArrCert2.datacert2 = s.TcertTempArr2;
        s.tempArrCert2.globalID = s.globalID;
        console.log(s.tempArrCert2);
        if (s.tempArrCert2.FileImg2 != null) {
            h.post("../api/employerapi/savePortfolio", s.tempArrCert2).then(function (d) {

                loadCertificates();
                loadportfolio();
                $("#imageBrowes2").val("");
                s.tempArrCert2 = {};
                s.TcertTempArr2 = {};

                s.uploadImgID = false;

                $("#imageBrowes").val("");
                s.tempArrCert = {}
                s.TcertTempArr = {};
                console.log(d.data);
            });
        } else {
            alert('no image')
        }
    }



    s.addToTableCert = function () {
        $('#certificationModal').modal('hide');
        $('#imgPreview').hide();
        s.tempArrCert.datacert = s.TcertTempArr;
        s.tempArrCert.globalID = s.globalID;
        console.log(s.tempArrCert);
        if (s.tempArrCert.FileImg != null) {
            h.post("../api/employerapi/saveCertificate", s.tempArrCert).then(function (d) {

             
                loadCertificates();
                loadportfolio();
                $("#imageBrowes2").val("");
                s.tempArrCert2 = {};
                s.TcertTempArr2 = {};
                s.uploadImgID = false;
               
                $("#imageBrowes").val("");
                s.tempArrCert = {}
                s.TcertTempArr = {};
                console.log(d.data);
            });
        } else {
            alert('no image')
        }
    }



    //NO Photos
    s.portEdit = function (i) {
        s.portInfoSelect = i;
        $('#portInfo').modal('show');
    }

    s.SaveportInfo = function (portInfoSelect) {
        console.log(portInfoSelect)
        h.put("../api/ViewJobSeeker/portInfoChange", portInfoSelect)
           .then(function (d) {
               console.log(d.data)
               loadportfolio();
               $('#portInfo').modal('hide');
           })
    }

    s.certEdit = function (m) {
        s.certInfoSelect = m;
        $('#certInfo').modal('show');
        console.log('asdasdas');
    }

    s.SavecertInfo = function (certInfoSelect) {
        console.log(certInfoSelect)
        h.put("../api/ViewJobSeeker/certInfoChange", certInfoSelect)
           .then(function (d) {
               console.log(d.data)
               loadCertificates();
               $('#certInfo').modal('hide');
           })
    }





    s.nameProfEdit = function (i) {
        s.nameInfoSelect = i;
        $('#nameInfo').modal('show');
    }

    s.SaveProfInfo = function (nameInfoSelect) {
        console.log(nameInfoSelect)
        h.put("../api/ViewJobSeeker/proInfoChange", nameInfoSelect)
           .then(function (d) {
               console.log(d.data)
               loadprofile();
               $('#nameInfo').modal('hide');
           })
    }

    s.empInfo = function (k) {
        s.employmentDataSelect = k;
        console.log(s.employmentDataSelect)
        $('#empInfo').modal('show');
    }

    s.SaveEmpInfo = function (employmentDataSelect) {
        console.log(employmentDataSelect)
        h.put("../api/ViewJobSeeker/empInfoChange", employmentDataSelect)
           .then(function (d) {
               console.log(d.data)
               loademploymenthistory();
               $('#empInfo').modal('hide');
           })
    }

    s.trainingInfo = function (l) {
        s.trainDataSelect = l;
        console.log(s.trainDataSelect)
        $('#trainingInfo').modal('show');
    }

    s.SaveTrainInfo = function (trainDataSelect) {
        console.log(trainDataSelect)
        h.put("../api/ViewJobSeeker/trainInfoChange", trainDataSelect)
           .then(function (d) {
               console.log(d.data)
               loadTrainings();
               $('#trainingInfo').modal('hide');
           })
    }

    s.eduInfo = function (n) {
        s.EducationDataSelect = n;
        console.log(s.EducationDataSelect)
        $('#eduInfo').modal('show');
    }

    s.SaveEduInfo = function (EducationDataSelect) {
        console.log(EducationDataSelect)
        h.put("../api/ViewJobSeeker/eduInfoChange", EducationDataSelect)
           .then(function (d) {
               console.log(d.data)
               loadEducation();
               $('#eduInfo').modal('hide');
           })
    }

    //Expertise
   



    function getSkill() {
        h.get("../api/employerapi/skill")
        .then(function (d) {
            s.skillTempArr = d.data;
        })
    }

    function getIndustry() {
        console.log("asdasd")
        h.get("../api/JobSeeker/Industrydata")
        .then(function (d) {
            s.industryTempArr = d.data;
            console.log(s.industryTempArr);
        })
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


    s.fieldExp = function (o) {

        s.expertId = [];
        s.serviceArrID = [];
        s.preIndusID = "";
        s.thisUser = "";

        console.log(s.ExpertiseData)
        s.option = 1;
        getIndustry();
        for (var i = 0; i < s.ExpertiseData.length; i++) {
            //console.log(s.ExpertiseData[i].ExpertiseId);
            s.expertId.push(s.ExpertiseData[i].ExpertiseId);
           
        }

    }

    s.preIndusID = "";
    s.thisUser = "";
    s.SavefieldExpInfo = function () {
        s.preIndusID = s.ExpertiseData[0].IndustryId;
        s.thisUser = s.ExpertiseData[0].UserId;
        if (s.serviceArrID != "") {
           
            s.predata.globalID = s.globalID;
            s.predata.thisUser = s.thisUser;
            s.predata.preIndusID = s.preIndusID;
            s.predata.expertId = s.expertId

            s.data.getId = s.getId;
           // s.data.tempSkills = s.tempSkills;
            s.data.serviceArrID = s.serviceArrID;
            s.data.globalID = s.globalID;
            console.log(s.predata);

            h.put("../api/ViewJobSeeker/expFieldChange", s.predata)
                       .then(function (d) {
                           console.log(d.data)
                           h.post("../api/JobSeeker/SaveSkills2", s.data).then(function (d) {
                               console.log(d.data)
                               loadExpertise();

                           });

                       })

            s.option = 0;
        } else {
            alert('no content')
        }

    }

    s.Dont = function () {
        s.option = 0;
        loadExpertise();
    }


    //Skill

    
    s.option2 = 0;
    getSkill();
    s.SkillEdit = function () {
        s.option2 = 1;
        console.log(s.SkillsData);
    }

    s.Dont2 = function () {
        s.option2 = 0;
    }

    s.preskillId = "";
    s.newSkill = [];
    s.newSkillTemp = {};
    
    $("#getIDskill").change(function () {
        s.userSkill = s.ExpertiseData[0].UserId;
        s.idtest = false;
        s.preskillId = $("#getIDskill").val();
        console.log(s.preskillId);
        console.log(s.SkillsData);
        // console.log(s.skillTempArr);    
        
        


        for (var i = 0; i < s.SkillsData.length; i++) {
            if (s.SkillsData[i].SkillId == s.preskillId) {
                s.idtest = true
                break;
            }
        }

            if (s.idtest == true) {
                console.log("dili ka push")
            }
            else 
            {
                console.log("ka push")
                s.newSkill.push(s.preskillId)
                s.newSkillTemp.newSkill = s.newSkill;
                console.log(s.newSkillTemp)
                s.newSkillTemp.userSkill = s.userSkill;
               
                //console.log(newSkillTemp);
                h.put("../api/ViewJobSeeker/expSkillChange", s.newSkillTemp)
                    .then(function (d) {
                        loadSkills();
                        s.newSkill = [];
                        s.option2 = 0;
                        console.log(d.data)
                    })
            }

    })



    //End Skill


    s.RemovePort = function (id) {
        h.put("../api/employerapi/removePort?id=" + id).then(function (d) {
            loadportfolio();
        })
           
        
    }

    s.RemoveCert = function (id) {
        console.log(id);
        h.put("../api/employerapi/removeCert?id=" + id).then(function (d) {
            loadCertificates();
        })
    }


    s.DeleteEmp = function (id) {
        h.put("../api/ViewJobSeeker/removeEmpID", id).then(function (d) {
            loademploymenthistory();
        })
    }
   

    s.DeleteTrn = function (id) {
        h.put("../api/ViewJobSeeker/removeTrnID", id).then(function (d) {
            loadTrainings();
        })
    }

    s.DeleteEdu= function (id) {
        h.put("../api/ViewJobSeeker/removeEduID", id).then(function (d) {
            loadEducation();
        })
    }




    s.statusProf = "";
    function loadtuser() {
        h.get("../api/ViewJobSeeker/tUserInfo?id=" + s.globalID)
            .then(function (d) {
                
                s.statusProf = d.data.Status;
                console.log(s.statusProf);
            })
    }


    function loadprofile() {
        h.get("../api/ViewJobSeeker/PersonInfo?id=" + s.globalID)
             .then(function (d) {

                 angular.forEach(d.data, function (v, key) {
                     v.Birthdate = new Date((v.Birthdate).split('T')[0])
                 })
                 console.log(d.data)
                 s.profileData = d.data;
             })
    }

    function loadportfolio() {
        h.get("../api/ViewJobSeeker/PortfolioInfo?id=" + s.globalID)
            .then(function (d) {
                console.log(d.data)
                s.portfolioData = d.data;
            })
    }

    function loademploymenthistory() {
        h.get("../api/ViewJobSeeker/EmployementHistory?id=" + s.globalID)
           .then(function (d) {
               console.log(d.data)
               angular.forEach(d.data, function (v, key) {
                   v.StartedDate = new Date((v.StartedDate).split('T')[0])
                   v.EndedDate = new Date((v.EndedDate).split('T')[0])

               })
               s.employmentData = d.data;
           })
    }


    function loadTrainings() {
        h.get("../api/ViewJobSeeker/Trainings?id=" + s.globalID)
           .then(function (d) {
               console.log(d.data)
               angular.forEach(d.data, function (v, key) {
                   v.Date = new Date((v.Date).split('T')[0])
               })
               s.TrainingsData = d.data;
           })
    }

    function loadCertificates() {
        h.get("../api/ViewJobSeeker/CertificationInfo?id=" + s.globalID)
           .then(function (d) {
               console.log(d.data)
               s.CertificateData = d.data;
           })
    }

    function loadEducation() {
        h.get("../api/ViewJobSeeker/EducationInfo?id=" + s.globalID)
           .then(function (d) {
               console.log(d.data)
               angular.forEach(d.data, function (v, key) {
                   v.DateStared = new Date((v.DateStared).split('T')[0])
                   v.DateEnded = new Date((v.DateEnded).split('T')[0])

               })
               s.EducationData = d.data;
           })
    }

    function loadExpertise() {
        h.get("../api/ViewJobSeeker/Expertise?id=" + s.globalID)
        .then(function (d) {

            s.ExpertiseData = d.data;
            console.log(s.ExpertiseData)
        })
    }

    function loadSkills() {
        h.get("../api/ViewJobSeeker/SkillInfo?id=" + s.globalID)
        .then(function (d) {

            s.SkillsData = d.data;
            console.log(s.SkillsData)
        })
    }

}]);