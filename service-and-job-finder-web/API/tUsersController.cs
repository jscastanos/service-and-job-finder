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
using System.Web;


namespace service_and_job_finder_web.API
{


    [RoutePrefix("api/tusers")]
    public class tUsersController : ApiController
    {
        private AppWorkEntities db = new AppWorkEntities();





        public string genCode(int count)
        {
            var code = Guid.NewGuid().ToString().Replace("-", string.Empty).Replace("+", string.Empty).Substring(0, count).ToUpper();
            return code;
        }







        // GET: api/tUsers
        public IQueryable<tUser> GettUsers()
        {
            return db.tUsers;
        }

        // GET: api/tUsers/5
        [ResponseType(typeof(tUser))]

        public IHttpActionResult GettUser(int id)
        {
            tUser tUser = db.tUsers.Find(id);
            if (tUser == null)
            {
                return NotFound();
            }

            return Ok(tUser);
        }

        // PUT: api/tUsers/5

        public IHttpActionResult PuttUser(int id, tUser tUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tUser.recNo)
            {
                return BadRequest();
            }

            db.Entry(tUser).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tUserExists(id))
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




        // GET: api/tUsers/getuseraccounts
        [Route("getuseraccounts")]
        public IHttpActionResult GetUserAccounts()
        {
            var e = db.tUsers.Where(a => a.AccountTypeId == "1" && a.Status == 0).Select(x => x.UserId);
            var j = db.tUsers.Where(a => a.AccountTypeId == "2" && a.Status == 0).Select(x => x.UserId);
            var s = db.tUsers.Where(a => a.AccountTypeId == "3" && a.Status == 0).Select(x => x.UserId);
            var c = db.tUsers.Where(a => a.AccountTypeId == "4" && a.Status == 0).Select(x => x.UserId);

            var obj = new object();
            var employers = new object();
            var jobseekers = new object();
            var serviceworkers = new object();
            var customers = new object();

            if (e == null)
            {
                employers = null;
            }
            else
            {
                employers = db.tBusinessEntities.Where(x => e.Contains(x.UserId)).
                Select(y => new
                {

                    y.UserId,
                    y.EntityId,
                    y.ProfileImg,
                    y.BusinessEntityAddress,
                    y.BusinessEntityName
                }).ToList();
            }

            if (j == null)
            {
                jobseekers = null;
            }
            else
            {
                jobseekers = db.tPersonInfoes.Where(x => j.Contains(x.UserId)).
                Select(y => new
                {
                    y.UserId,
                    y.PersonId,
                    y.ProfileImg,
                    y.Address,
                    fullname = y.Lastname + ", " + y.Firstname + " " + (y.Middlename != null ? y.Middlename.Substring(0, 1) + "." : "")
                }).ToList();
            }

            if (s == null)
            {
                serviceworkers = null;
            }

            else
            {
                serviceworkers = db.tBusinessEntities.Where(x => s.Contains(x.UserId)).
                Select(y => new
                {

                    y.UserId,
                    y.EntityId,
                    y.ProfileImg,
                    y.BusinessEntityAddress,
                    y.BusinessEntityName
                }).ToList();
            }

            if (c == null)
            {
                customers = null;
            }

            else
            {
                customers = db.tPersonInfoes.Where(x => c.Contains(x.UserId)).
                Select(y => new
                {

                    y.UserId,
                    y.PersonId,
                    y.ProfileImg,
                    y.Address,
                    fullname = y.Lastname + ", " + y.Firstname + " " + (y.Middlename != null ? y.Middlename.Substring(0, 1) + "." : "")
                }).ToList();
            }


            obj = new
           {
               employers,
               jobseekers,
               serviceworkers,
               customers
           };


            return Ok(obj);
        }


        // GET: api/tUsers/getuseraccounts
        [Route("GetUserVerifiedAccounts")]
        public IHttpActionResult GetUserVerifiedAccounts()
        {


            var employers = db.vUsersAcctBusinessEntityStatus.Where(x => x.AccountTypeId == "1").
                    Select(y => new
                    {

                        y.UserId,
                        y.BusinessEntityAddress,
                        vBusinessEntityName = y.BusinessEntityName,
                        y.EntityId,
                        y.ProfileImg,
                        y.Status
                    }).ToList();


            if (employers == null)
            {
                employers = null;
            }

            var serviceworkers = db.vUsersAcctBusinessEntityStatus.Where(x => x.AccountTypeId == "3").
                   Select(y => new
                   {

                       y.UserId,
                       y.BusinessEntityAddress,
                       vBusinessEntityName = y.BusinessEntityName,
                       y.EntityId,
                       y.ProfileImg,
                       y.Status
                   }).ToList();

            if (serviceworkers == null)
            {
                serviceworkers = null;
            }

            var jobseekers = db.vUsersAcctPersonStatus.Where(x => x.AccountTypeId == "2").
                  Select(y => new
                  {

                      y.UserId,
                      y.Address,
                      y.PersonId,
                      vfullname = y.Lastname + ", " + y.Firstname + " " + (y.Middlename != null ? y.Middlename.Substring(0, 1) + "." : ""),
                      msgFullname = y.Firstname + " " + (y.Middlename != null ? y.Middlename.Substring(0, 1) + ". " : "") + y.Lastname,
                      y.ProfileImg,
                      y.Status
                  }).ToList();

            if (jobseekers == null)
            {
                jobseekers = null;
            }

            var customers = db.vUsersAcctPersonStatus.Where(x => x.AccountTypeId == "4").
                  Select(y => new
                  {

                      y.UserId,
                      y.Address,
                      y.PersonId,
                      vfullname = y.Lastname + ", " + y.Firstname + " " + (y.Middlename != null ? y.Middlename.Substring(0, 1) + "." : ""),
                      y.ProfileImg,
                      y.Status
                  }).ToList();

            if (customers == null)
            {
                customers = null;
            }

            var obj = new
            {
                employers,
                jobseekers,
                serviceworkers,
                customers
            };


            return Ok(obj);
        }



        // GET: api/tUsers/getuseraccounts
        [Route("ActivateDeactivateAccount/{type}/{UsersId}")]
        public IHttpActionResult ActivateDeactivateAccount(int type, string UsersId)
        {

            var user = db.tUsers.SingleOrDefault(x => x.UserId == UsersId);

            if (type == 0)
            {
                user.DateUpdated = DateTime.Now;
                user.Status = 2;
            }

            else if (type == 1)
            {
                user.DateUpdated = DateTime.Now;
                user.Status = 1;
            }

            db.SaveChanges();

            return Ok(user);
        }





        // POST: api/tUsers
        [Route("createaccount")]
        public IHttpActionResult CreateAccount(tUser tUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tUser.UserId = genCode(5);
            tUser.DateCreated = DateTime.Now;
            tUser.Status = 0;
            db.tUsers.Add(tUser);
            db.SaveChanges();

            var session = HttpContext.Current.Session;
            session["userID"] = tUser.UserId.ToString();
            session["name"] = "";
            session["entityID"] = "";

            return Ok(tUser);
        }



        // POST: api/tUsers/PostLogIn
        [Route("login")]
        public IHttpActionResult LogIn(tUser tUser)
        {
            var t = db.tUsers.Where(x => x.Username == tUser.Username && x.Password == tUser.Password).FirstOrDefault();

            if (t == null)
            {
                t = null;
                return Ok(t);
            }

            return Ok(t.Status);


        }



        // POST: api/tUsers/PostLogIn
        [Route("validateusername/{uname}")]
        public IHttpActionResult ValidateUsername(string uname)
        {
            var t = db.tUsers.Where(x => x.Username == uname).FirstOrDefault();

            if (t == null)
            {
                return Ok(0);
            }

            return Ok(1);


        }




        // GET: api/tUsers/getuseraccounts
        [Route("GetJobs/{entityId}")]
        public IHttpActionResult GetJobs(string entityId)
        {


            var jobs = db.tJobs.Where(x => x.EntityId == entityId).
                Select(x => new
                {

                    x.recNo,
                    x.JobId,
                    x.JobTitle,
                    x.EntityId,
                    applicants = db.vtJobApplicants.Where(y => y.EntityId == entityId && y.JobId == x.JobId && y.Status == 0)
                    .Select(z => new
                    {

                        z.recNo,
                        z.UserId,
                        z.PersonId,
                        fullname = z.Lastname + ", " + z.Firstname + " " + (z.Middlename != null ? z.Middlename.Substring(0, 1) + "." : ""),
                        z.ProfileImg,
                        z.Address,
                        z.JobId,
                        z.EntityId,
                        z.Status
                    }),
                    qualifiedApplicants = db.vtJobApplicants.Where(y => y.EntityId == entityId && y.JobId == x.JobId && y.Status == 1)
                    .Select(z => new
                    {

                        z.recNo,
                        z.UserId,
                        z.PersonId,
                        vfullname = z.Lastname + ", " + z.Firstname + " " + (z.Middlename != null ? z.Middlename.Substring(0, 1) + "." : ""),
                        z.ProfileImg,
                        z.Address,
                        z.JobId,
                        z.EntityId,
                        z.Status
                    }),
                    x.Status
                }).
                ToList();

            if (jobs == null)
            {

                jobs = null;
                return Ok(jobs);
            }

            return Ok(jobs);
        }









        // DELETE: api/tUsers/5
        [ResponseType(typeof(tUser))]
        public IHttpActionResult DeletetUser(int id)
        {
            tUser tUser = db.tUsers.Find(id);
            if (tUser == null)
            {
                return NotFound();
            }

            db.tUsers.Remove(tUser);
            db.SaveChanges();

            return Ok(tUser);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tUserExists(int id)
        {
            return db.tUsers.Count(e => e.recNo == id) > 0;
        }
    }
}