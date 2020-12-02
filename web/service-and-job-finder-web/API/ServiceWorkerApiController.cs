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
    public class ServiceWorkerApiController : ApiController
    {
        private AppWorkEntities db = new AppWorkEntities();

        [Route("api/serviceworkerapi/PostSaveService")]
        public IHttpActionResult PostSaveService(string data, string userid)
        {
            var obj = new tServiceSet();
            
            if (data != null)
            {
                var serviceID = data.Split(',');

                foreach (var a in serviceID)
                {
                    obj.UserId = userid;
                    obj.ServiceId = a.ToString();
                    obj.Status = 0;

                    db.Entry(obj).State = EntityState.Added;
                    db.SaveChanges();
                }
            }

            return Json("Saved!");
        }

        [Route("api/serviceworkerapi/PostSaveMainService")]
        public IHttpActionResult PostSaveMainService(tMainService data)
        {

            data.Status = 0;

            db.Entry(data).State = EntityState.Added;
            db.SaveChanges();

            return Json("Saved!");
        }


    }
}
