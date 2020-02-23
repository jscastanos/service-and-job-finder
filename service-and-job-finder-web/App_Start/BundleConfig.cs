using System.Web;
using System.Web.Optimization;

namespace service_and_job_finder_web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/js").Include(
                      "~/Scripts/jquery-2.1.1.js",
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/jquery.metisMenu.js",
                      "~/Scripts/jquery.slimscroll.min.js",
                      "~/Scripts/pace.min.js",
                      "~/Scripts/popper.js",
                      "~/Scripts/angular.min.js",
                      "~/Scripts/template.js",
                      "~/Scripts/moment.min.js",
                      "~/Scripts/ng-app.js"
                      ));

            bundles.Add(new StyleBundle("~/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/font-awesome.css",
                      "~/Content/icomoon.css",
                      "~/Content/animate.css",
                      "~/Content/style.css"
                      ));
        }
    }
}
