using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace service_and_job_finder_web.Controllers
{
    public class ServiceWorkerController : Controller
    {
        // GET: ServiceWorker
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult serviceWorkerRegistration() {
            return View();
        }

        public ActionResult serviceWorkerProfile()
        {
            return View();
        }
    }
}