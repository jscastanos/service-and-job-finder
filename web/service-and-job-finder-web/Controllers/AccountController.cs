using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using service_and_job_finder_web.Models;

namespace service_and_job_finder_web.Controllers
{
    public class AccountController : Controller
    {
        AppWorkEntities db = new AppWorkEntities();
        // GET: Account
        public ActionResult SignUp()
        {

            return View();
        }

        public ActionResult LogIn()
        {

            return View();
        }
        [HttpPost]
        public ActionResult LogIn(tUser u)
        {
            if (!db.tUsers.Any(a => a.Username == u.Username && a.Password == u.Password))
            {
                ViewBag.Err = "Invalid username or password.";
                return View();
            }
            var user = db.tUsers.SingleOrDefault(a => a.Username == u.Username && a.Password == u.Password);

            Session["userID"] = user.UserId;
            Session["accountType"] = user.AccountTypeId;
            Session["entityID"] = "0";
            if (db.tBusinessEntities.Any(b => b.UserId == user.UserId))
            {
                var entity = db.tBusinessEntities.SingleOrDefault(b => b.UserId == user.UserId);
                Session["entityID"] = entity.EntityId;
            }
            if (user.AccountTypeId == "1" || user.AccountTypeId == "3")
            {
                var info = db.tBusinessEntities.FirstOrDefault(f => f.UserId == user.UserId).BusinessEntityName;
                Session["name"] = info;
            }
            if (user.AccountTypeId == "2" || user.AccountTypeId == "4")
            {
                var info = db.tPersonInfoes.FirstOrDefault(f => f.UserId == user.UserId);
                var name = info.Lastname + ", " + info.Firstname + (info.Middlename != null ? " " + info.Middlename.Substring(0, 1) + "." : "");
                Session["name"] = name;
            }
            return RedirectToAction("Feed","Jobs");
        }

        public ActionResult Logout()
        {
            Session.RemoveAll();
            Session.Abandon();
            return RedirectToAction("Login");
        }

    }
}