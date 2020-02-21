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
            public List<tServiceSet> serviceArrID { get; set;}

        }

        [HttpGet]
        public IHttpActionResult GetService()
        {
            return Json(db.tServices.ToList());
        }

        [Route("api/employerapi/skill")]
        public IHttpActionResult GetSkill()
        {
            return Json(db.tSkills.ToList());
        }

        [Route("api/employerapi/PostSaveSkillandService")]
        [HttpPost]
        public IHttpActionResult PostSaveSkillandService(skillAndServices data)
        {
            var obj = new tSkillSet();
            var obj2 = new tServiceSet();

            if (data.tempSkills != null)
            {
                
                foreach(var a in data.tempSkills)
                {
                    obj.SkillId = a;
                    obj.Status = 0;

                    db.tSkillSets.Add(obj);
                    db.SaveChanges();
                }
            }

            if (data.serviceArrID != null)
            {
                foreach (var a in data.serviceArrID)
                {
                    obj2.ServiceId = a.ServiceId;
                    obj2.Status = 0;

                    db.tServiceSets.Add(obj2);
                    db.SaveChanges();
                }
            }

            return Json("Saved!");
        } 

    }
}
