using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using service_and_job_finder_web.Models;
using Microsoft.AspNet.SignalR;
using service_and_job_finder_web.Controllers;
using service_and_job_finder_web.Hubs;

namespace service_and_job_finder_web.API
{
    [RoutePrefix("api/feed")]
    public class FeedController : ApiController
    {
        AppWorkEntities db = new AppWorkEntities();
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MyHub>();

        [Route("connected")]
        public IHttpActionResult GetConnectedUsers()
        {

            return Json(MyHub.users);
        }
        [Route("jobtitle/{entityId}")]
        public IHttpActionResult PostJobTitles(string entityId)
        {
            var titles = db.tJobs.Where(w => w.EntityId == entityId);
            return Json(titles);
        }
        [Route("sendapplication")]
        public IHttpActionResult PostJobTitles(tApplication applicant)
        {
            try
            {
            retryID:
                string generatedID = new Utilities().GenerateCoupon(5);
                if (db.tApplications.Any(a => a.ApplicationId == generatedID))
                {
                    goto retryID;
                }
                applicant.ApplicationId = generatedID;
                applicant.DateCreated = DateTime.Now;
                applicant.DateUpdated = DateTime.Now;
                applicant.Status = 0;

                db.tApplications.Add(applicant);
                db.SaveChanges();
                return Json(1);
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
        }
        [Route("jobpost")]
        public IHttpActionResult PostJobPosts()
        {
            var jobPosts = db.tPosts.Select(s => new
            {
                s.DateCreated,
                s.DateUpdated,
                s.Description,
                s.PostId,
                s.Title,
                s.UserId,
                s.JobId,
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
                    Name = db.tBusinessEntities.Any(b => b.UserId == ss.UserId) ? db.tBusinessEntities.FirstOrDefault(f => f.UserId == ss.UserId).BusinessEntityName : db.tPersonInfoes.Where(p => p.UserId == ss.UserId).Select(sss => new { Name = sss.Firstname + " " + (sss.Middlename != null ? sss.Middlename.Substring(0, 1) + ". " : "") + sss.Lastname }).FirstOrDefault().Name,
                    UserType = db.tBusinessEntities.Any(b => b.UserId == ss.UserId) ? 1 : 0
                }),
                Applicants = db.tApplications.Where(ap => ap.PostId == s.PostId).Select(ss => ss.PersonId)
            });
            return Json(jobPosts);
        }

        [Route("newcomment")]
        public IHttpActionResult PostNewComment(tComment comment)
        {
        retryId:
            string commentID = new Utilities().GenerateCoupon(5);
            if (db.tComments.Any(a => a.CommentId == commentID))
            {
                goto retryId;
            }

            comment.DateCreated = DateTime.Now;
            comment.DateUpdated = DateTime.Now;
            comment.CommentId = commentID;
            var newComment = db.tComments.Add(comment);
            db.SaveChanges();
            var newCommentObj = db.tComments.Where(w => w.recNo == newComment.recNo).Select(ss => new
            {
                ss.CommentId,
                ss.DateCreated,
                ss.DateUpdated,
                ss.Comment,
                ss.PostId,
                ss.UserId,
                Name = db.tBusinessEntities.Any(b => b.UserId == ss.UserId) ? db.tBusinessEntities.FirstOrDefault(f => f.UserId == ss.UserId).BusinessEntityName : db.tPersonInfoes.Where(p => p.UserId == ss.UserId).Select(sss => new { Name = sss.Firstname + " " + (sss.Middlename != null ? sss.Middlename.Substring(0, 1) + ". " : "") + sss.Lastname }).FirstOrDefault().Name,
                UserType = db.tBusinessEntities.Any(b => b.UserId == ss.UserId) ? 1 : 0
            }).FirstOrDefault();

            context.Clients.All.newComment(newCommentObj);

            return Json(newComment);
        }

    }
}
