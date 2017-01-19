using System.Web.Mvc;
using SecuredWebApp.Infrastructure;

namespace SecuredWebApp.Controllers
{
    public class ErrorController : AppBaseController
    {
        public ActionResult Route()
        {
            return View();
        }
        public ActionResult Application()
        {
            return View();
        }

        public ActionResult NotFound()
        {
            return RedirectToAction("Route", "Error");
        }

        public ActionResult Reauth(string redirectUri)
        {
            ViewBag.RedirectUri = redirectUri;
            return View();
        }
    }
}