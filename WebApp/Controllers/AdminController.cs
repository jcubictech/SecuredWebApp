using System.Web.Mvc;
using NLog;
using SecuredWebApp.Infrastructure;
using SecuredWebApp.Models;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Controllers
{
    [Authorize(Roles = AppConstants.ADMIN_ROLE + "," + AppConstants.SUPER_ADMIN_ROLE)]
    [CustomHandleError]
    public class AdminController : AppBaseController
    {
        private readonly AppDbContext _dbContext;

        public AdminController(AppDbContext context)
        {
            _dbContext = context;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Users()
        {
            return View("UserManagement");
        }

        [Authorize(Roles = AppConstants.SUPER_ADMIN_ROLE)]
        public ActionResult Roles()
        {
            return View("RoleManagement");
        }

        public ActionResult UserRoles()
        {
            return View("UserRoleManagement");
        }

        public ActionResult ApplicationLog()
        {
            return View("AppLog");
        }
    }
}