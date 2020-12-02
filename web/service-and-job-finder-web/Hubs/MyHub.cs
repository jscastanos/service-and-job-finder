using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using service_and_job_finder_web.Models;

namespace service_and_job_finder_web.Hubs
{
    public class MyHub : Hub
    {
        AppWorkEntities db = new AppWorkEntities();
        public static List<Users> users = new List<Users>();
        private object _syncroot = new object();
        public void Hello()
        {
            Clients.All.hello();
        }
        public void register(string userID)
        {
            lock (_syncroot)
            {
                users.Add(new Users
                {
                    conId = Context.ConnectionId,
                    userID = userID,
                    isActive = true
                });
            }
        }

        public void newMessage(tMessage message)
        {
            IList<string> recipientConnectionID = users.Where(f => f.userID == message.RecipientId).Select(s => s.conId).ToList();
            IList<string> senderConnectionID = users.Where(f => f.userID == message.SenderId).Select(s => s.conId).ToList();

            Clients.Clients(senderConnectionID).newOwnMessage(message);
            Clients.Clients(recipientConnectionID).newMessage(message);
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            lock (_syncroot)
            {
                if (users.Any(a => a.conId == Context.ConnectionId))
                {
                    users.SingleOrDefault(s => s.conId == Context.ConnectionId).isActive = false;
                }
                
            }

            return base.OnDisconnected(stopCalled);
        }
        public override System.Threading.Tasks.Task OnReconnected()
        {
            lock (_syncroot)
            {
                if (users.Any(a => a.conId == Context.ConnectionId))
                {
                    users.SingleOrDefault(s => s.conId == Context.ConnectionId).isActive = true;
                }

            }
            return base.OnReconnected();
        }


    }
    public class Users
    {
        public string conId { get; set; }
        public string userID { get; set; }
        public bool isActive { get; set; }
    }
}