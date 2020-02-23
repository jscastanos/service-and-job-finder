using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using service_and_job_finder_web.Models;
using System.IO;
using System.Web;

namespace service_and_job_finder_web.API
{
    public class EmployerApiController : ApiController
    {
        private AppWorkEntities db = new AppWorkEntities();

        public class skillAndServices
        {
            public string[] tempSkills { get; set; }
            public string userid
            {
                get;
                set;
            }
            public List<tServiceSet> serviceArrID { get; set; }

        }

        public class certificateData
        {
            public tCertification data { get; set; }
            public string FileImg { get; set; }
            public string userid
            {
                get;
                set;
        }
        }
        public class businessData
        {
            public tBusinessEntity data
            {
                get;
                set;
            }
            public string FileImg
            {
                get;
                set;
            }
        }

        public class businessDataProfile
        {
            public tBusinessEntity data
            {
                get;
                set;
            }
            public string[] serviceData
            {
                get;
                set;
            }

            public string userID
            {
                get;
                set;
            }
        }

        public class imgBase64Str
        {
            public string name { get; set; }
            public string desc { get; set; }
            public string add { get; set; }
            public string contact { get; set; }
            public string img { get; set; }
            public double lat { get; set; }
            public double longitude { get; set; }
             public string userid { get; set; }
        }

        //GET
        public IHttpActionResult GetService()
        {
            return Json(db.tServices.ToList());
        }

        [Route("api/employerapi/skill")]
        public IHttpActionResult GetSkill()
        {
            return Json(db.tSkills.ToList());
        }

        [Route("api/employerapi/CompanyData")]
        public IHttpActionResult GetCompanyData(string id)
        {
            var data = db.tBusinessEntities.FirstOrDefault(a => a.EntityId == id);

            return Json(data);
        }

        [Route("api/employerapi/CompanyCert")]
        public IHttpActionResult GetCompanyCert(string id)
        {
            var data = db.tCertifications.Where(a => a.UserId == db.tBusinessEntities.FirstOrDefault(x => x.EntityId == id).UserId && a.Status == 0).ToList();

            return Json(data);
        }

        [Route("api/employerapi/CompanyService")]
        public IHttpActionResult GetCompanyService(string id)
        {
            var data = db.tServiceSets.Where(a => a.UserId ==  db.tBusinessEntities.FirstOrDefault(x => x.EntityId == id).UserId && a.Status == 0).Select(x => new
            {
                name = db.tServices.FirstOrDefault(p => p.ServiceId == x.ServiceId).Description
            });

            return Json(data);
        }

        [Route("api/employerapi/CompanyJobList")]
        public IHttpActionResult GetCompanyJobList(string id)
        {
            var data = db.tJobs.Where(a => a.EntityId == id).ToList();
            return Json(data);
        }

        [Route("api/employerapi/jobApplicant")]
        public IHttpActionResult GetjobApplicant(string id)
        {
            var data = db.tApplications.Where(a => a.JobId == id && a.Status == 0).Select(x => new
            {
                name = db.tPersonInfoes.FirstOrDefault(p => p.PersonId == x.PersonId).Firstname + " " + db.tPersonInfoes.FirstOrDefault(p => p.PersonId == x.PersonId).Lastname
            });
            return Json(data);
        }

        [Route("api/employerapi/updateCert")]
        public IHttpActionResult GetupdateCert(int id)
        {
            var data = db.tCertifications.FirstOrDefault(x => x.recNo == id);
            return Json(data);
        }

        [Route("api/employerapi/brgy")]
        public IHttpActionResult GetBrgy()
        {
            return Json(db.tBarangays.OrderBy(a => a.BrgyName).ToList());
        }

        [Route("api/employerapi/Coordinate")]
        public IHttpActionResult GetCoordinate(string id)
        {

            var data = db.tBusinessEntities.SingleOrDefault(a => a.EntityId == id && a.Status == 0);

            return Json(new { lat = data.Latitude, lng = data.Longitude });
        }

        [Route("api/employerapi/userData")]
        public IHttpActionResult GetuserData(string id)
        {

            var data = db.tUsers.SingleOrDefault(a => a.UserId ==  db.tBusinessEntities.FirstOrDefault(x => x.EntityId == id).UserId);

            return Json(data);
        }


        //POST
        [Route("api/employerapi/PostSaveSkillandService")]
        public IHttpActionResult PostSaveSkillandService(skillAndServices data)
        {
            var obj = new tSkillSet();
            var obj2 = new tServiceSet();

            if (data.tempSkills != null)
            {

                foreach (var a in data.tempSkills)
                {
                    obj.UserId = data.userid;
                    obj.SkillId = a;
                    obj.Status = 0;

                    db.Entry(obj).State = EntityState.Added;
                    db.SaveChanges();
                }
            }

            if (data.serviceArrID != null)
            {
                foreach (var a in data.serviceArrID)
                {
                    obj2.UserId = data.userid;
                    obj2.ServiceId = a.ServiceId;
                    obj2.Status = 0;

                    db.Entry(obj2).State = EntityState.Added;
                    db.SaveChanges();
                }
            }

            return Json("Saved!");
        }

        [Route("api/employerapi/saveProfile")]
        public IHttpActionResult PostsaveProfile(imgBase64Str obj)
        {
            var val = new tBusinessEntity();

            if (obj.img != null)
            {

                byte[] imageBytes = Convert.FromBase64String(obj.img);

                val.ProfileImg = imageBytes;
            }

            val.UserId = obj.userid;
            val.BusinessEntityName = obj.name;
            val.BusinessEntityAddress = obj.add;
            val.About = obj.desc;
            val.ContactNo = obj.contact;
            val.EntityId = Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
            val.DateCreated = DateTime.Now;
            val.Latitude = obj.lat;
            val.Longitude = obj.longitude;

            db.Entry(val).State = EntityState.Added;
            db.SaveChanges();

            return Json(val.EntityId);
        }

        [Route("api/employerapi/saveCertificate")]
        public IHttpActionResult PostsaveCertificate(certificateData value)
        {
            var obj = new tCertification();

            if (value.FileImg != null)
            {
                byte[] imageBytes = Convert.FromBase64String(value.FileImg);

                obj.FileImg = imageBytes;
            }

            if (db.tBusinessEntities.Any(a => a.EntityId == value.userid))
            {
                obj.UserId = db.tBusinessEntities.FirstOrDefault(a => a.EntityId == value.userid).UserId;
               
            }
            else
            {
                obj.UserId = value.data.UserId;
            }

            obj.UserId = value.data.UserId;
            obj.Filename = value.data.Filename;
            obj.Description = value.data.Description;
            obj.DateCreated = DateTime.Now;
            obj.Status = 0;

            db.Entry(obj).State = EntityState.Added;
            db.SaveChanges();

            var data = db.tCertifications.OrderByDescending(a => a.recNo).FirstOrDefault();
            return Json(data);
        }

        [Route("api/employerapi/saveJobList")]
        public IHttpActionResult PostsaveJobList(tJob data)
        {

            data.JobId = Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
            data.Status = 0;

            db.Entry(data).State = EntityState.Added;
            db.SaveChanges();

            return Json(data);
        }

        //PUT
        [Route("api/employerapi/removeCert")]
        public IHttpActionResult PutremoveCert(int id)
        {
            db.tCertifications.Where(a => a.recNo == id).ToList()
               .ForEach(b => b.Status = 1);
            db.SaveChanges();

            return Ok();
        }

        [Route("api/employerapi/saveUpdateCert")]
        public IHttpActionResult PutsaveUpdateCert(certificateData data)
        {
            var obj = db.tCertifications.SingleOrDefault(a => a.recNo == data.data.recNo);

            if (data.FileImg != null)
            {

                byte[] imageBytes = Convert.FromBase64String(data.FileImg);

                obj.FileImg = imageBytes;
            }

            obj.Filename = data.data.Filename;
            obj.Description = data.data.Description;

            db.Entry(obj).State = EntityState.Modified;
            db.SaveChanges();

            var value = db.tCertifications.Where(a => a.UserId == data.data.UserId).ToList();

            return Json(data.data.recNo);
        }

        [Route("api/employerapi/removeJob")]
        public IHttpActionResult PutremoveJob(int id)
        {
            db.tJobs.Where(a => a.recNo == id).ToList()
               .ForEach(b => b.Status = 1);
            db.SaveChanges();

            return Ok();
        }

        [Route("api/employerapi/saveUpdateCompanyDesc")]
        public IHttpActionResult PutsaveUpdateCompanyDesc(int recno, string desc)
        {
            db.tBusinessEntities.Where(a => a.recNo == recno).ToList()
               .ForEach(b => b.About = desc);
            db.SaveChanges();

            return Json(desc);
        }

        [Route("api/employerapi/saveUpdateProPic")]
        public IHttpActionResult PutsaveUpdateProPic(businessData data)
        {
            var obj = db.tBusinessEntities.SingleOrDefault(a => a.recNo == data.data.recNo);

            if (data.FileImg != null)
            {

                byte[] imageBytes = Convert.FromBase64String(data.FileImg);

                obj.ProfileImg = imageBytes;
            }

            db.Entry(obj).State = EntityState.Modified;
            db.SaveChanges();

            return Ok();
        }

        [Route("api/employerapi/saveUpdateProfile")]
        public IHttpActionResult PutsavesaveUpdateProfile(businessDataProfile data)
        {
            var obj = db.tBusinessEntities.SingleOrDefault(a => a.recNo == data.data.recNo);
            db.tServiceSets.Where(a => a.UserId == data.data.UserId).ToList().ForEach(b => b.Status = 1);
            db.SaveChanges();

            var obj2 = new tServiceSet();

            if (data.serviceData != null)
            {
                foreach (var a in data.serviceData)
                {
                    obj2.ServiceId = a;
                    obj2.UserId = "0003";
                    obj2.Status = 0;

                    db.Entry(obj2).State = EntityState.Added;
                    db.SaveChanges();
                }
            }

            obj.BusinessEntityName = data.data.BusinessEntityName;
            obj.BusinessEntityAddress = data.data.BusinessEntityAddress;
            db.SaveChanges();


            var data1 = db.tServiceSets.Where(a => a.UserId == data.data.UserId && a.Status == 0).Select(x => new
            {
                name = db.tServices.FirstOrDefault(p => p.ServiceId == x.ServiceId).Description
            });

            return Json(data1);
        }

    }
}
