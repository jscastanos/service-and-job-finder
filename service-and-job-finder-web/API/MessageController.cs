using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.SignalR.Hubs;
using service_and_job_finder_web.Hubs;
using service_and_job_finder_web.Models;
using service_and_job_finder_web.Controllers;

namespace service_and_job_finder_web.API
{
    [RoutePrefix("api/message")]
    public class MessageController : ApiController
    {
        AppWorkEntities db = new AppWorkEntities();
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MyHub>();

        [Route("messageseen/{userID}/{friendID}")]
        public IHttpActionResult PostMessageSeen(string userID, string friendID)
        {
            try
            {
                db.seenMessage(userID, friendID);
                return Ok();
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
            
        }
        [Route("savemessage")]
        public IHttpActionResult PostSaveMessage(tMessage message)
        {
            try
            {
            retryID:
                string messageID = new Utilities().GenerateCoupon(5);
                if (db.tMessages.Any(a => a.MessageId == messageID))
                {
                    goto retryID;
                }
                message.DateCreated = DateTime.Now;
                message.Seen = false;
                message.MessageId = messageID;
                var addedMessage = db.tMessages.Add(message);
                db.SaveChanges();

                var newMessage = db.tMessages.Where(w => w.recNo == addedMessage.recNo).Select(s => new
                {
                    s.recNo,
                    s.MessageId,
                    s.Message,
                    s.DateCreated,
                    s.SenderId,
                    s.RecipientId,
                    s.Seen,
                    s.Status
                }).FirstOrDefault();

                return Json(new { stat = 1, message = newMessage });
            }
            catch (Exception e)
            {
                return Json(new { stat = 0, message = "Something went wrong" });
            }
        }
        [Route("usermessage/{userID}")]
        public IHttpActionResult PostUserMessage(string userID)
        {

            var messages = db.tMessages.Where(w => w.RecipientId == userID || w.SenderId == userID).Select(s => new
            {
                s.recNo,
                s.MessageId,
                s.Message,
                s.DateCreated,
                s.RecipientId,
                s.SenderId,
                s.Seen,
                friendID = userID == s.SenderId ? s.RecipientId : s.SenderId,
                friendName = db.tBusinessEntities.Any(b => b.UserId == (userID == s.SenderId ? s.RecipientId : s.SenderId)) ? db.tBusinessEntities.FirstOrDefault(f => f.UserId == (userID == s.SenderId ? s.RecipientId : s.SenderId)).BusinessEntityName : db.tPersonInfoes.Where(p => p.UserId == (userID == s.SenderId ? s.RecipientId : s.SenderId)).Select(sss => new { Name = sss.Firstname + " " + (sss.Middlename != null ? sss.Middlename.Substring(0, 1) + ". ": "") + sss.Lastname }).FirstOrDefault().Name,
            }).GroupBy(g => g.friendID).Select(s => s.OrderByDescending(o => o.DateCreated).FirstOrDefault());
            return Json(messages);
        }
        [Route("personalMessages/{userID}/{friendID}")]
        public IHttpActionResult PostPersonalMessages(string userID, string friendID)
        {

            var messages = db.tMessages.Where(w => (w.SenderId == userID && w.RecipientId == friendID) || (w.SenderId == friendID && w.RecipientId == userID)).Select(s => new
            {
                s.recNo,
                s.MessageId,
                s.Message,
                s.DateCreated,
                s.SenderId,
                s.RecipientId,
                s.Seen,
                //friendID = userID == s.SenderId ? s.RecipientId : s.SenderId
            });
            return Json(messages);
        }
    }
}
