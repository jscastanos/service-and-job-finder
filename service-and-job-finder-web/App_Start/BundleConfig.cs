using System.Web;
using System.Web.Optimization;

namespace service_and_job_finder_web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            ////////////////////////////////////////////// SCRIPTS ////////////////////////////////////////////

            bundles.Add(new ScriptBundle("~/Scripts/template").Include(
                      "~/Scripts/template/jquery-2.1.1.js",
                      "~/Scripts/template/bootstrap.min.js",
                      "~/Scripts/template/plugins/metisMenu/jquery.metisMenu.js",
                      "~/Scripts/template/plugins/slimscroll/jquery.slimscroll.min.js",
                      "~/Scripts/template/inspinia.js",
                      "~/Scripts/template/plugins/pace/pace.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/angular").Include(
                "~/Scripts/angular/angular.min.js",
                "~/Scripts/angular/ng-app.js"
                ));


                ////////////////////////////////////////// STYLES //////////////////////////////////////////////

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/fonts/font-awesome/css/font-awesome.min.css",
                      "~/Content/animate.css",
                      "~/Content/style.css"));
        }
    }
}
