using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using service_and_job_finder_web.Models;
using System.Text;
using service_and_job_finder_web.Controllers;
using Microsoft.AspNet.SignalR;
using service_and_job_finder_web.Hubs;

namespace service_and_job_finder_web.Controllers
{
    public class JobsController : Controller
    {
        AppWorkEntities db = new AppWorkEntities();
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MyHub>();

        public ActionResult Feed() // id is for session purpose only remove in production
        {
            //Session["userID"] = id;
            return View();
        }

        public ActionResult newPost(tPost post)
        {
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];
                byte[] bytes;
                using (var binaryReader = new BinaryReader(file.InputStream))
                {
                    bytes = binaryReader.ReadBytes(file.ContentLength);
                }
                post.FileImg = bytes;
            }
        retryId:
            string postID = new Utilities().GenerateCoupon(5);
            if (db.tPosts.Any(a => a.PostId == postID))
            {
                goto retryId;
            }

            post.DateCreated = DateTime.Now;
            post.DateUpdated = DateTime.Now;
            post.PostId = postID;
            var newPost = db.tPosts.Add(post);
            db.SaveChanges();

            var newPostObj = db.tPosts.Where(w => w.PostId == newPost.PostId).Select(s => new
            {
                s.DateCreated,
                s.DateUpdated,
                s.Description,
                s.PostId,
                s.Title,
                s.UserId,
                HasFile = db.tPosts.Any(a => a.PostId == s.PostId && s.FileImg != null) ? true : false,
                Name = db.tBusinessEntities.FirstOrDefault(f => f.UserId == s.UserId).BusinessEntityName,
                JobTitle = db.tJobs.FirstOrDefault(f => f.JobId == s.JobId).JobTitle,
                Comments = db.tComments.Where(w => w.PostId == s.PostId).Select(ss => new
                {
                    ss.CommentId,
                    ss.DateCreated,
                    ss.DateUpdated,
                    ss.Comment,
                    ss.PostId,
                    ss.UserId,
                    Name = db.tBusinessEntities.Any(b => b.UserId == ss.UserId) ? db.tBusinessEntities.FirstOrDefault(f => f.UserId == ss.UserId).BusinessEntityName : db.tPersonInfoes.Where(p => p.UserId == ss.UserId).Select(sss => new { Name = sss.Firstname + " " + (sss.Middlename != null ? sss.Middlename.Substring(0, 1) : "") + sss.Lastname }).FirstOrDefault().Name,
                    UserType = db.tBusinessEntities.Any(b => b.UserId == ss.UserId) ? 1 : 0
                })
            }).FirstOrDefault();

            context.Clients.All.newPost(newPostObj);

            return Json(1, JsonRequestBehavior.AllowGet);
        }


        public ActionResult postImage(string id)
        {
            byte[] img = db.tPosts.SingleOrDefault(x => x.PostId == id).FileImg;
            if (img != null)
            {
                return File(img, "image/png");
            }
            else
            {
                //return null;
                return File("~/images/nophoto.png", "image/png");
            }
        }
        public ActionResult getVideo(string id)
        {
            byte[] img = db.tPosts.SingleOrDefault(x => x.PostId == id).FileImg;
            if (img != null)
            {
                return File(img, "video/mp4");
            }
            else
            {
                //return null;
                return File("~/images/nophoto.png", "image/png");
            }
        }
        public ActionResult userImage(string id)
        {
            byte[] img = null;
            if (db.tBusinessEntities.Any(a => a.UserId == id))
            {
                img = db.tBusinessEntities.SingleOrDefault(x => x.UserId == id).ProfileImg;
            }
            else
            {
                img = db.tPersonInfoes.SingleOrDefault(x => x.UserId == id).ProfileImg;
            }
            if (img != null)
            {
                return File(img, "image/png");
            }
            else
            {
                //return null;
                return File("~/images/nophoto.png", "image/png");
            }
        }
    }
}