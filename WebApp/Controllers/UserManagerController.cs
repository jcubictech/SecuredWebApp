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
    public class UserManagerController : AppBaseController
    {
        private readonly AppDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public UserManagerController()
        {
        }

        public UserManagerController(AppDbContext context, ApplicationUserManager userManager)
        {
            _dbContext = context;
            _userManager = userManager;
        }

        [HttpPost]
        public JsonResult Create(string model)
        {
            Response.StatusCode = (int)System.Net.HttpStatusCode.NotImplemented;
            return JsonError("User Creation is not applicable.");
        }

        [OutputCache(Duration = 0, NoStore = true)]
        public JsonResult Retrieve()
        {
            if (_userManager != null)
            {
                var allAppUsers = _userManager.Users.ToList();

                // super admin is a built-in user that cannot be changed
                var allUsers = allAppUsers.Where(u => u.UserName != AppConstants.SUPER_ADMIN_ROLE)
                                          .Select(u => new UserManagementViewModel
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    Email = u.Email
                });

                return Json(allUsers, JsonRequestBehavior.AllowGet);
            }
            else
                return JsonError("User manager does not exist");
        }

        [HttpPost]
        public JsonResult Update(ApplicationUser model)
        {
            Response.StatusCode = (int)System.Net.HttpStatusCode.NotImplemented;
            return JsonError("User update is not applicable.");
        }

        [HttpPost]
        public JsonResult Delete(string model)
        {
            ApplicationUser appUser = new ApplicationUser();
            try
            {
                UserManagementViewModel user = JsonConvert.DeserializeObject<UserManagementViewModel>(model);
                var userToDelete = _userManager.Users.Where(u => u.Id == user.UserId).First();
                if (userToDelete != null)
                {
                    IdentityResult result = _userManager.Delete(userToDelete);
                    if (result == IdentityResult.Success)
                    {
                        Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
                        return Json("success", JsonRequestBehavior.AllowGet);
                    }
                }
                throw new System.Exception("User does not exist.");
            }
            catch(Exception ex)
            {
                Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;
                return Json("Delete user '" + appUser.UserName + "' fails. " + ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
    }
}