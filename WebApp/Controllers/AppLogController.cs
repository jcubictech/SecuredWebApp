using System;
using System.Linq;
using Microsoft.AspNet.Identity;
using System.Web.Mvc;
using Newtonsoft.Json;
using SecuredWebApp.Infrastructure;
using SecuredWebApp.Models;
using SecuredWebApp.Models.View;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Controllers
{
    [Authorize(Roles = AppConstants.ADMIN_ROLE + "," + AppConstants.SUPER_ADMIN_ROLE)]
    [CustomHandleError]
    public class AppLogController : AppBaseController
    {
        private readonly AppDbContext _dbContext;

        public AppLogController(AppDbContext context)
        {
            _dbContext = context;
        }

        [OutputCache(Duration = 0, NoStore = true)]
        public JsonResult Retrieve()
        {
            var logs = _dbContext.AppLogs.OrderByDescending(l => l.EventDateTime).ToList();
            return Json(logs, JsonRequestBehavior.AllowGet);
        }
    }
}