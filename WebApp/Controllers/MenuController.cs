using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SecuredWebApp.Infrastructure;
using SecuredWebApp.Models;
using SecuredWebApp.Data.Providers;
using SecuredWebApp.Models.View;

namespace SecuredWebApp.Controllers
{
    public class MenuController : AppBaseController
    {
        private readonly AppDbContext _context;

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        public ActionResult Index()
        {
            return RedirectToAction("Route", "Error"); // not supported
        }

        [OutputCache(Duration = 3600)]
        public ActionResult Install()
        {
            IDataProvider xmlRetriever = new MenuContentProvider();
            object xmlData = xmlRetriever.Read();
            if (xmlData is List<MenuViewModel>)
            {
                List<MenuViewModel> viewModel = (List<MenuViewModel>)xmlData;
                return PartialView("_MenuPartial", viewModel);
            }
            else
                return PartialView(string.Empty);
        }
    }
}