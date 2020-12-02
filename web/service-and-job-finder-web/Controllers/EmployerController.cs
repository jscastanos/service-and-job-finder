using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using service_and_job_finder_web.Models;

namespace service_and_job_finder_web.Controllers
{
    public class EmployerController : Controller
    {
        private AppWorkEntities db = new AppWorkEntities();

        // GET: Employer
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult employerRegistration() {
            return View();
        }

        public ActionResult employerProfile() {
            return View();
        }

        public ActionResult RetrieveCertImg(int id)
        {
            var q = db.tCertifications.SingleOrDefault(w => w.recNo == id).FileImg;
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

        public ActionResult RetrieveCompanyLogo(int id)
        {
            var q = db.tBusinessEntities.SingleOrDefault(w => w.recNo == id).ProfileImg;
            byte[] cover = q;

            if (cover != null)
            {
                return File(cover, "image/jpeg");
            }
            else
            {
                //return null;
                return File("~/images/user60.png", "image/png");
            }

        }

        public ActionResult RetrieveIMG(int id)
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
                return File("~/images/user60.png", "image/png");
            }

        }

        public ActionResult Applicants()
        {

            return View();
        }
    }
}