using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using service_and_job_finder_web.Models;
using System.Threading.Tasks;
using MultipartDataMediaFormatter.Infrastructure;
using System.IO;
using System.Diagnostics;

namespace service_and_job_finder_web.API
{

    public class uploadController : ApiController
    {
        [Route("api/upload/file")]
        public async Task<IHttpActionResult> PostFile(Test acc)
        {
            var file = HttpContext.Current.Request.Files[0];
            string root = HttpContext.Current.Server.MapPath("~/uploads");
            var provider = new MultipartFormDataStreamProvider(root);
            var result = await Request.Content.ReadAsMultipartAsync(provider);

            return Json(result);
        }
        [Route("api/upload/test")]
        public IHttpActionResult PostTest(Test acc)
        {
            var file = System.Web.HttpContext.Current.Request.Files[0];
            byte[] bytes;
            using (var binaryReader = new BinaryReader(file.InputStream))
            {
                bytes = binaryReader.ReadBytes(file.ContentLength);
            }
            return Json(new {a = acc, b = file });
        }

    }
    public class Test
    {
        public tAccountType acc { get; set; }
        public HttpFile file { get; set; }
    }
}
