using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace service_and_job_finder_web.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult SignUp()
        {

            return View();
        }

        public ActionResult LogIn()
        {

            return View();
        }

    }
}