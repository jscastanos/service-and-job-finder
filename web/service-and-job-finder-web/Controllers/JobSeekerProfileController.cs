using service_and_job_finder_web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace service_and_job_finder_web.Controllers
{
    public class JobSeekerProfileController : Controller
    {
         private AppWorkEntities db = new AppWorkEntities();

        // GET: JobSeekerProfile
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult JobSeekerView()
        {
            return View();
        }

        public ActionResult RetrieveCertImg(int id)
        {
            var q = db.tCertifications.SingleOrDefault(w => w.recNo == id && w.Status != 1).FileImg;
            byte[] cover = q;

            if (cover != null)
            {
                return File(cover, "image/jpeg");
            }
            else
            {
                //return null;
                return File("~images/user60.png", "image/png");
            }
        }

        public ActionResult RetrievePort(int id)
        {
            var q = db.tPortfolios.SingleOrDefault(w => w.recNo == id && w.Status != 1).ProjectImg;
            byte[] cover = q;

            if (cover != null)
            {
                return File(cover, "image/jpeg");
            }
            else
            {
                //return null;
                return File("~images/user60.png", "image/png");
            }
        }

        public ActionResult RetrieveProfile(int id)
        {
            var q = db.tPersonInfoes.SingleOrDefault(w => w.recNo == id).ProfileImg;
            byte[] cover = q;

            if (cover != null)
            {
                return File(cover, "image/jpeg");
            }
            else
            {
                //return null;
                return File("~images/user60.png", "image/png");
            }
        }

    }
}