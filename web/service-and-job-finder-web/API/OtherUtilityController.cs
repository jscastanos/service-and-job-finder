using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using service_and_job_finder_web.Models;

namespace service_and_job_finder_web.API
{
    public class OtherUtilityController : ApiController
    {
        AppWorkEntities db = new AppWorkEntities();

        [Route("api/serviceworker/{id}")]
        public IHttpActionResult GetServiceDetails(string id)
        {
            var data = (from a in db.tBusinessEntities
                        join b in db.tUsers on a.UserId equals b.UserId
                        where a.EntityId == id
                        select new
                        {
                            a.recNo,
                            a.BusinessEntityName,
                            a.BusinessEntityAddress,
                            a.About,
                            a.ContactNo,
                            services = db.tServiceSets.Where(sst => sst.UserId == b.UserId).Select(ssst => new
                            {
                                service = db.tServices.Where(s => s.ServiceId == ssst.ServiceId).Select(ss => ss.Description).FirstOrDefault()
                            })

                        }).FirstOrDefault();

            return Json(data);
        }

        [Route("api/verify")]
        public IHttpActionResult GetVerify(string username, string password)
        {
            var data = db.tUsers.Where(u => u.Username == username && u.Password == password && u.AccountTypeId == "4");

            if (data.Count() > 0)
            {
                return Json(data.FirstOrDefault().UserId);
            }
            else
            {
                return Json("null");
            }
        }
        [Route("api/user")]
        public IHttpActionResult GetUserInfo(string id)
        {
            var data = db.tPersonInfoes.Where(p => p.UserId == id).Select(pp => new
            {
                pp.recNo,
                pp.Firstname,
                pp.Lastname,
                pp.Birthdate,
                pp.Address,
                pp.ContactNo
            }).FirstOrDefault();

            return Json(data);
        }
    }
}
