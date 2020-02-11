using System.Web;
using System.Web.Optimization;

namespace service_and_job_finder_web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
          /////////////////////////////// SCRIPTS ////////////////////////////////////////////////////////

            bundles.Add(new ScriptBundle("~/Scripts/template").Include(
                      "~/Scripts/architect-ui.js"));

            bundles.Add(new ScriptBundle("~/Scripts/angular").Include(
                 "~/Scripts/angular/angular.min.js",
                 "~/Scripts/angular/ng-app.js"));


            /////////////////////////////// STYLES ////////////////////////////////////////////////////////

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/architect-ui.css"));
        }
    }
}
