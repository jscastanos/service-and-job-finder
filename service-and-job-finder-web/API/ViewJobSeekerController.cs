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

namespace service_and_job_finder_web.API
{
    public class ViewJobSeekerController : ApiController
    {
        private AppWorkEntities db = new AppWorkEntities();

        [Route("api/ViewJobSeeker/tUserInfo")]
        public IHttpActionResult GettUserInfo(string id)
        {
            var tUserdata = db.tUsers.Where(i => i.UserId == id).SingleOrDefault();
            return Json(tUserdata);

        }

        [Route("api/ViewJobSeeker/PersonInfo")]
        public IHttpActionResult GetPersonInfo(string id)
        {
            var personinfo = db.tPersonInfoes.Where(i => i.UserId == id).ToList();
            return Json(personinfo);

        }

        [Route("api/ViewJobSeeker/PortfolioInfo")]
        public IHttpActionResult GetPortfolioInfo(string id)
        {
            var portfolioinfo = db.tPortfolios.Where(i => i.PersonId == id && i.Status != 1).ToList();
            return Json(portfolioinfo);
        }


        [Route("api/ViewJobSeeker/EmployementHistory")]
        public IHttpActionResult GetEmployementHistory(string id)
        {
            var emphistoryinfo = db.tEmploymentHistories.Where(i => i.PersonId == id && i.Status != 1).ToList();
            return Json(emphistoryinfo);
        }


        [Route("api/ViewJobSeeker/Trainings")]
        public IHttpActionResult GetTrainings(string id)
        {
            var traininginfo = db.tTrainings.Where(i => i.PersonId == id && i.Status != 1).ToList();
            return Json(traininginfo);
        }


        [Route("api/ViewJobSeeker/CertificationInfo")]
        public IHttpActionResult GetCertificationInfo(string id)
        {
            var certificationinfo = db.tCertifications.Where(i => i.UserId == id && i.Status != 1).ToList();
            return Json(certificationinfo);
        }


        [Route("api/ViewJobSeeker/EducationInfo")]
        public IHttpActionResult GetEducationInfo(string id)
        {
            var educationinfo = db.tEducationalBackgrounds.Where(i => i.PersonId == id && i.Status != 1).ToList();
            return Json(educationinfo);
        }

        [Route("api/ViewJobSeeker/Expertise")]
        public IHttpActionResult GetExpertiseInfo(string id)
        {
            var expertiseinfo = db.tJobSeekerExpertises.Where(i => i.UserId == id && i.Status != 1)
                .Select(c => new
                {
                    c.ExpertiseId,
                    c.UserId,
                    IndustryId = db.tMainServices.FirstOrDefault(h => h.UserId == c.UserId).IndustryId,
                    ExpertiseDesc = db.tFieldOfExpertises.Where(l => l.ExpertiseId == c.ExpertiseId && c.Status != 1).ToList()
                });

            return Json(expertiseinfo);
        }


        [Route("api/ViewJobSeeker/SkillInfo")]
        public IHttpActionResult GetSkillInfo(string id)
        {
            var skillsinfo = db.tSkillSets.Where(i => i.UserId == id && i.Status != 1)
       .Select(c => new
       {
           c.UserId,
           c.SkillId,
           SkillDesc = db.tSkills.Where(l => l.SkillId == c.SkillId && c.Status != 1).ToList()
       });
            return Json(skillsinfo);
        }

        [Route("api/ViewJobSeeker/proInfoChange")]
        public IHttpActionResult PutproInfoChange(tPersonInfo data)
        {

            data.DateUpdated = DateTime.Now;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }


        [Route("api/ViewJobSeeker/empInfoChange")]
        public IHttpActionResult PutempInfoChange(tEmploymentHistory data)
        {

            data.DateUpdated = DateTime.Now;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }

        [Route("api/ViewJobSeeker/trainInfoChange")]
        public IHttpActionResult PuttrainInfoChange(tTraining data)
        {

            data.DateUpdated = DateTime.Now;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }


        [Route("api/ViewJobSeeker/eduInfoChange")]
        public IHttpActionResult PuteduInfoChange(tEducationalBackground data)
        {

            data.DateUpdated = DateTime.Now;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }


        [Route("api/ViewJobSeeker/portInfoChange")]
        public IHttpActionResult PutportInfoChange(tPortfolio data)
        {
            data.DateUpdated = DateTime.Now;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            return Json(data);
        }


        [Route("api/ViewJobSeeker/certInfoChange")]
        public IHttpActionResult PutportInfoChange(tCertification data)
        {
            data.DateUpdated = DateTime.Now;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            return Json(data);
        }

        public class expInfo
        {
            public string globalID { get; set; }
            public string thisUser { get; set; }
            public string preIndusID { get; set; }
            public string[] expertId { get; set; }
        }


        [Route("api/ViewJobSeeker/expFieldChange")]
        public IHttpActionResult PutexpFieldChange(expInfo data)
        {
            var obj = new tJobSeekerExpertise();
            var obj2 = new tMainService();

            if (data.expertId != null)
            {
                foreach (var a in data.expertId)
                {
                    db.tJobSeekerExpertises.Where(i => i.ExpertiseId == a).ToList().ForEach(l => l.Status = 1);
                    db.SaveChanges();
                }
            }

            if (data.preIndusID != null)
            {
                db.tMainServices.Where(i => i.IndustryId == data.preIndusID && i.UserId == data.thisUser).ToList().ForEach(l => l.Status = 1);
                db.SaveChanges();
            }
        
            return Json(data);
        }

        

        public class skillAndServices
        {
            public string globalID { get; set; }
            public string getId { get; set; }
            public string[] tempSkills { get; set; }
            public List<tJobSeekerExpertise> serviceArrID { get; set; }

        }


        [Route("api/JobSeeker/SaveSkills2")]
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
                    //db.tJobSeekerExpertises.Where(i => i.ExpertiseId == a).ToList().ForEach(l => l.Status = 1);
                    

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


            return Json(data);
        }


        public class skillsUp{
            public string userSkill { get; set; }
            public string[] newSkill { get; set; }
        }

        [Route("api/ViewJobSeeker/expSkillChange")]
        public IHttpActionResult PutexpSkillChange(skillsUp data)
        {
            var obj = new tSkillSet();

            if (data.newSkill != null)
            {

                foreach (var a in data.newSkill)
                {
                    obj.SkillId = a;
                    obj.Status = 0;
                    obj.UserId = data.userSkill;
                    db.tSkillSets.Add(obj);
                    db.SaveChanges();
                }
            }


            return Json(data);
        }


        //Delete function here

      
        

        [Route("api/ViewJobSeeker/removeEmpID")]
        public IHttpActionResult PutremoveEmpID(tEmploymentHistory id)
        {
           
            id.DateUpdated = DateTime.Now;
            id.Status = 1;
            db.Entry(id).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }


        [Route("api/ViewJobSeeker/removeTrnID")]
        public IHttpActionResult PutremoveTrnID(tTraining id)
        {

            id.DateUpdated = DateTime.Now;
            id.Status = 1;
            db.Entry(id).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }

        [Route("api/ViewJobSeeker/removeEduID")]
        public IHttpActionResult PutremoveTrnID(tEducationalBackground id)
        {

            id.DateUpdated = DateTime.Now;
            id.Status = 1;
            db.Entry(id).State = EntityState.Modified;
            db.SaveChanges();
            return Json("success");
        }

        // add function here

       [Route("api/ViewJobSeeker/EduInfo")]
        public IHttpActionResult PostEdu(tEducationalBackground Edu)
        {
            Edu.DateCreated = DateTime.Now;
            Edu.Status = 0;
            var aRole = db.tEducationalBackgrounds.Add(Edu);
            db.SaveChanges();
            return Json(aRole);
            
        }

        [Route("api/ViewJobSeeker/TrnInfo")]
        public IHttpActionResult PostEdu(tTraining Trn)
        {
            Trn.DateCreated = DateTime.Now;
            Trn.Status = 0;
            var aRole = db.tTrainings.Add(Trn);
            db.SaveChanges();
            return Json(aRole);
            
        }


        [Route("api/ViewJobSeeker/EmpInfo")]
        public IHttpActionResult PostEdu(tEmploymentHistory Emp)
        {
            Emp.DateCreated = DateTime.Now;
            Emp.Status = 0;
            var aRole = db.tEmploymentHistories.Add(Emp);
            db.SaveChanges();
            return Json(aRole);
            
        }


        public class requires
        {
            public string UpdateProf  { get; set; }
            public string UserId { get; set; }

        }

        [Route("api/ViewJobSeeker/UpProf")]
        public IHttpActionResult PutUpProf(requires data)
        {
            try
            {
                byte[] imageBytes = Convert.FromBase64String(data.UpdateProf);

                db.tPersonInfoes.Where(a => a.UserId == data.UserId).ToList()
                   .ForEach(b => b.ProfileImg = imageBytes);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
            return Json("success");
        }





        // GET: api/ViewJobSeeker
        public IQueryable<tPersonInfo> GettPersonInfoes()
        {
            return db.tPersonInfoes;
        }

        // GET: api/ViewJobSeeker/5
        [ResponseType(typeof(tPersonInfo))]
        public IHttpActionResult GettPersonInfo(int id)
        {
            tPersonInfo tPersonInfo = db.tPersonInfoes.Find(id);
            if (tPersonInfo == null)
            {
                return NotFound();
            }

            return Ok(tPersonInfo);
        }

        // PUT: api/ViewJobSeeker/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PuttPersonInfo(int id, tPersonInfo tPersonInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tPersonInfo.recNo)
            {
                return BadRequest();
            }

            db.Entry(tPersonInfo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tPersonInfoExists(id))
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

        // POST: api/ViewJobSeeker
        [ResponseType(typeof(tPersonInfo))]
        public IHttpActionResult PosttPersonInfo(tPersonInfo tPersonInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tPersonInfoes.Add(tPersonInfo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tPersonInfo.recNo }, tPersonInfo);
        }

        // DELETE: api/ViewJobSeeker/5
        [ResponseType(typeof(tPersonInfo))]
        public IHttpActionResult DeletetPersonInfo(int id)
        {
            tPersonInfo tPersonInfo = db.tPersonInfoes.Find(id);
            if (tPersonInfo == null)
            {
                return NotFound();
            }

            db.tPersonInfoes.Remove(tPersonInfo);
            db.SaveChanges();

            return Ok(tPersonInfo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tPersonInfoExists(int id)
        {
            return db.tPersonInfoes.Count(e => e.recNo == id) > 0;
        }
    }
}