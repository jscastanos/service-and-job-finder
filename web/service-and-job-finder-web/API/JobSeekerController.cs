using System;
using System.Collections.Generic;
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
    public class JobSeekerController : ApiController
    {
        private AppWorkEntities db = new AppWorkEntities();

       

        public class certificateData
        {
            public string globalID { get; set; }
            public tCertification datacert { get; set; }
            public string FileImg { get; set; }
        }

        public class portFolioData
        {
            public string globalID { get; set; }

            public tPortfolio datacert2 { get; set; }
            public string FileImg2 { get; set; }
        }

        [Route("api/employerapi/savePortfolio")]
        public IHttpActionResult PostsavePortfolio(portFolioData value)
        {
            var obj = new tPortfolio();
            byte[] imageBytes = Convert.FromBase64String(value.FileImg2);


            obj.Description = value.datacert2.Description;
            obj.URL = value.datacert2.URL;
            obj.Title = value.datacert2.Title;
            obj.ProjectImg = imageBytes;
            obj.PersonId = value.globalID;
            obj.DateCreated = DateTime.Now;
            obj.PersonId = value.globalID;
            obj.Status = 0;

            db.Entry(obj).State = EntityState.Added;
            db.SaveChanges();

            var data = db.tPortfolios.OrderByDescending(a => a.recNo).FirstOrDefault();
            return Json(data);
        }

        //[Route("api/employerapi/saveCertificate")]
        //public IHttpActionResult PostsaveCertificate(certificateData value)
        //{
        //    var obj = new tCertification();
        //    byte[] imageBytes = Convert.FromBase64String(value.FileImg);

        //    obj.Filename = value.datacert.Filename;
        //    obj.Description = value.datacert.Description;
        //    obj.FileImg = imageBytes;
        //    obj.DateCreated = DateTime.Now;
        //    obj.Status = 0;
        //    obj.UserId = value.globalID;
        //    db.Entry(obj).State = EntityState.Added;
        //    db.SaveChanges();

        //    var data = db.tCertifications.OrderByDescending(a => a.recNo).FirstOrDefault();
          
        //    return Json(data);
        //}


        [Route("api/employerapi/removeCert")]
        public IHttpActionResult PutremoveCert(int id)
        {
            db.tCertifications.Where(a => a.recNo == id).ToList()
               .ForEach(b => b.Status = 1);
            db.SaveChanges();

            return Ok();
        }

        [Route("api/employerapi/removePort")]
        public IHttpActionResult PutremovePort(int id)
        {
            db.tPortfolios.Where(a => a.recNo == id).ToList()
               .ForEach(b => b.Status = 1);
            db.SaveChanges();

            return Ok();
        }



        public class req
        {
            public List<tEducationalBackground> EduArr { get; set; }
            public List<tEmploymentHistory> EmpArr { get; set; }
            public List<tTraining> TrainArr { get; set; }
            public String img { get; set; }
            public string globalID { get; set; }

        }
        public class ProfileReq
        {
            
            public tPersonInfo profTempArr { get; set; }
            public req req { get; set; }

        }

         [Route("api/JobSeeker/ProfRequirements")]
        public IHttpActionResult PostProfRequirements(ProfileReq data)
        {


            try
            {

                if (data.req.EduArr != null)
                {
                    var obj = new tEducationalBackground();
                    foreach (var a in data.req.EduArr)
                    {
                        obj.School = a.School;
                        obj.Course = a.Course;
                        obj.Address = a.Address;
                        obj.DateStared = a.DateStared;
                        obj.DateEnded = a.DateEnded;
                        obj.DateCreated = DateTime.Now;
                        obj.Status = 0;
                        obj.PersonId = data.req.globalID;
                        db.tEducationalBackgrounds.Add(obj);
                        db.SaveChanges();
                    }
                }


                if (data.req.EmpArr != null)
                {
                    var obj2 = new tEmploymentHistory();
                    foreach (var a in data.req.EmpArr)
                    {
                        obj2.CompanyName = a.CompanyName;
                        obj2.CompanyAddress = a.CompanyAddress;
                        obj2.Position = a.Position;
                        obj2.StartedDate = a.StartedDate;
                        obj2.EndedDate = a.EndedDate;
                        obj2.DateCreated = DateTime.Now;
                        obj2.PersonId = data.req.globalID;
                        obj2.Status = 0;
                        db.tEmploymentHistories.Add(obj2);
                        db.SaveChanges();
                    }
                }


                if (data.req.TrainArr != null)
                {
                    var obj3 = new tTraining();
                    foreach (var a in data.req.TrainArr)
                    {
                        obj3.TrainingTitle = a.TrainingTitle;
                        obj3.TrainingVenue = a.TrainingVenue;
                        obj3.Description = a.Description;
                        obj3.PersonId = data.req.globalID;
                        obj3.Date = a.Date;
                        obj3.DateCreated = DateTime.Now;
                        obj3.Status = 0;
                        db.tTrainings.Add(obj3);
                        db.SaveChanges();
                    }
                }

                if (data.profTempArr != null)
                {

                    byte[] bitimage = Convert.FromBase64String(data.req.img.ToString());
                    data.profTempArr.ProfileImg = bitimage;
                    data.profTempArr.PersonId = Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
                    data.profTempArr.DateCreated = DateTime.Now;
                    data.profTempArr.Status = 0;
                    data.profTempArr.UserId = data.req.globalID;
                    db.tPersonInfoes.Add(data.profTempArr);
                    db.SaveChanges();

                }

            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
            return Json(data);
        }



       
         [Route("api/JobSeeker/Industrydata")]
         public IHttpActionResult GetIndustrydata()
         {
             return Json(db.tIndustries.ToList());
         }

         [Route("api/JobSeeker/FieldofExpertise")]
         public IHttpActionResult GetFieldofExpertise(string id)
         {
             var getall = db.tFieldOfExpertises.Where(i => i.IndustryId == id).ToList();
             return Json(getall);
         }


         public class skillAndServices
         {
             public string globalID { get; set; }
             public string getId { get; set; }
             public string[] tempSkills { get; set; }
             public List<tJobSeekerExpertise> serviceArrID { get; set; }

         }


         [Route("api/JobSeeker/SaveSkills")]
         [HttpPost]
         public IHttpActionResult PostSaveSkills(skillAndServices data)
         {
             var obj = new tSkillSet();
             var obj2 = new tJobSeekerExpertise();
             var obj3 = new tMainService();

             if (data.tempSkills != null)
             {

                 foreach (var a in data.tempSkills)
                 {
                     obj.SkillId = a;
                     obj.Status = 0;
                     obj.UserId = data.globalID;
                     db.tSkillSets.Add(obj);
                     db.SaveChanges();
                 }
             }

             if (data.serviceArrID != null)
             {
                 foreach (var a in data.serviceArrID)
                 {
                     obj2.ExpertiseId = a.ExpertiseId;
                     obj2.UserId = data.globalID;
                     obj2.Status = 0;
                     obj2.DateCreated = DateTime.Now;
                     db.tJobSeekerExpertises.Add(obj2);
                     db.SaveChanges();
                 }
             }
             if (data.getId != null)
             {
                 obj3.IndustryId = data.getId;
                 obj3.Status = 0;
                 obj3.UserId = data.globalID;
                 db.tMainServices.Add(obj3);
                 db.SaveChanges();
             }


             return Json(data.serviceArrID); 
         } 


        // GET: api/JobSeeker
        public IQueryable<tJobSeekerExpertise> GettJobSeekerExpertises()
        {
            return db.tJobSeekerExpertises;
        }

        // GET: api/JobSeeker/5
        [ResponseType(typeof(tJobSeekerExpertise))]
        public IHttpActionResult GettJobSeekerExpertise(int id)
        {
            tJobSeekerExpertise tJobSeekerExpertise = db.tJobSeekerExpertises.Find(id);
            if (tJobSeekerExpertise == null)
            {
                return NotFound();
            }

            return Ok(tJobSeekerExpertise);
        }

        // PUT: api/JobSeeker/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PuttJobSeekerExpertise(int id, tJobSeekerExpertise tJobSeekerExpertise)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tJobSeekerExpertise.recNo)
            {
                return BadRequest();
            }

            db.Entry(tJobSeekerExpertise).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tJobSeekerExpertiseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/JobSeeker
        [ResponseType(typeof(tJobSeekerExpertise))]
        public IHttpActionResult PosttJobSeekerExpertise(tJobSeekerExpertise tJobSeekerExpertise)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tJobSeekerExpertises.Add(tJobSeekerExpertise);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tJobSeekerExpertise.recNo }, tJobSeekerExpertise);
        }

        // DELETE: api/JobSeeker/5
        [ResponseType(typeof(tJobSeekerExpertise))]
        public IHttpActionResult DeletetJobSeekerExpertise(int id)
        {
            tJobSeekerExpertise tJobSeekerExpertise = db.tJobSeekerExpertises.Find(id);
            if (tJobSeekerExpertise == null)
            {
                return NotFound();
            }

            db.tJobSeekerExpertises.Remove(tJobSeekerExpertise);
            db.SaveChanges();

            return Ok(tJobSeekerExpertise);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tJobSeekerExpertiseExists(int id)
        {
            return db.tJobSeekerExpertises.Count(e => e.recNo == id) > 0;
        }
    }
}