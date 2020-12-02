using Owin;
using Microsoft.Owin;
[assembly: OwinStartup(typeof(service_and_job_finder_web.Startup))]
namespace service_and_job_finder_web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}