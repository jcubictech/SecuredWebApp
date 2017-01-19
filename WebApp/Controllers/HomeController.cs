using System.Web.Mvc;
using SecuredWebApp.Infrastructure;
using SecuredWebApp.Data.Providers;
using SecuredWebApp.Models.View;

namespace SecuredWebApp.Controllers
{
    public class HomeController : AppBaseController
    {
        public ActionResult Index()
        {
            if (!AuthorizationProvider.IsAuthenticated())
                return RedirectToAction("Login", "Account", "/");
            else
            {
                return View();
            }
        }

        [HttpGet]
        public ActionResult Maintenance()
        {
            return View(new MaintenanceViewModel());
        }
    }
}