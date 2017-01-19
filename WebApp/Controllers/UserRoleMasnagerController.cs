using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using System.Web.Mvc;
using Newtonsoft.Json;
using NLog;
using SecuredWebApp.Infrastructure;
using SecuredWebApp.Models;
using SecuredWebApp.Models.View;
using SecuredWebApp.Helpers;
using SecuredWebApp.Data.Providers;

namespace SecuredWebApp.Controllers
{
    [Authorize(Roles = AppConstants.ADMIN_ROLE + "," + AppConstants.SUPER_ADMIN_ROLE)]
    [CustomHandleError]
    public class UserRoleManagerController : AppBaseController
    {
        // a looger object per class is the recommended way of using NLog
        private static Logger RDTLogger = NLog.LogManager.GetCurrentClassLogger();

        private readonly AppDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationRoleManager _roleManager;

        public UserRoleManagerController(AppDbContext context, ApplicationUserManager userManager, ApplicationRoleManager roleManager)
        {
            _dbContext = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        public JsonResult Create(string model)
        {
            Response.StatusCode = (int)System.Net.HttpStatusCode.NotImplemented;
            return JsonError("User-Role creation is not applicable.");
        }

        [OutputCache(Duration = 0, NoStore = true)]
        public JsonResult Retrieve()
        {
            if (_userManager != null && _userManager.SupportsUserRole)
            {
                var appUsers = _userManager.Users.ToList();

                // super user is a built-in user that cannot be changed
                var allUserRoles = appUsers.Where(u => u.UserName != AppConstants.SUPER_ADMIN_ROLE)
                                           .Select(u => new UserRoleManagementViewModel
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    UserRoles = u.Roles.Join(_dbContext.Roles,
                                                ur => ur.RoleId,
                                                dr => dr.Id,
                                                (ur, dr) => new CustomTuple
                                                {
                                                    Id = dr.Id,
                                                    Text = dr.Name
                                                })
                                        .ToList()
                });

                string message = string.Format("Total of {0:d} users are retrieved for role assignment.", appUsers.Count());
                RDTLogger.Info(message, typeof(UserRoleManagerController));

                return Json(allUserRoles, JsonRequestBehavior.AllowGet);
            }
            else if (!_userManager.SupportsUserRole)
                return JsonError("User Role is not suported.");
            else
                return JsonError("Role manager does not exist");
        }

        [HttpPost]
        public JsonResult Update(string model)
        {
            string userName = string.Empty;
            try
            {
                UserRoleManagementViewModel userRole = JsonConvert.DeserializeObject<UserRoleManagementViewModel>(model);
                var user = _userManager.Users.Where(u => u.Id == userRole.UserId).First();
                if (user != null)
                {
                    userName = user.UserName;
                    var oldRoles = _userManager.GetRoles(user.Id).ToArray();
                    IdentityResult result = _userManager.RemoveFromRoles(user.Id, oldRoles);
                    if (result == IdentityResult.Success)
                    {
                        var newRoles = userRole.UserRoles.Select(r => r.Text).ToArray();
                        result = _userManager.AddToRoles(user.Id, newRoles);
                        if (result == IdentityResult.Success)
                        {
                            string message = string.Format("Role '{0}' assigned to user '{1}'.", string.Join(", ", newRoles), userName);
                            RDTLogger.Info(message, typeof(UserRoleManagerController));

                            Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
                            return Json(userRole, JsonRequestBehavior.AllowGet);
                        }
                    }
                    throw new System.Exception("Remove/Add user role from DB fails.");
                }
                throw new System.Exception(string.Format("User does not exist for user ID = '{0}'.", userRole.UserId));
            }
            catch (Exception ex)
            {
                string message = string.Format("Update user role for user '{0}' fails. {1}", userName, ex.Message);
                RDTLogger.Info(message, typeof(UserRoleManagerController));

                Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;
                return Json(message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult Delete(string model)
        {
            Response.StatusCode = (int)System.Net.HttpStatusCode.NotImplemented;
            return JsonError("User-Role Deletion is not applicable.");
        }

        [OutputCache(Duration = 0, NoStore = true)]
        public JsonResult AvailableRoles()
        {
            if (_roleManager != null)
            {
                var roles = _roleManager.Roles.Select(r => new CustomTuple
                                                       {
                                                            Id = r.Id,
                                                            Text = r.Name
                                                        })
                                              .ToList();

                // super user role can only be assigned by AppAdmin
                if (!AuthorizationProvider.IsSuperAdmin())
                {
                    roles = roles.Where(r => r.Text != AppConstants.SUPER_ADMIN_ROLE).ToList();
                }

                return Json(roles, JsonRequestBehavior.AllowGet);
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        private IEnumerable<UserRoleManagementViewModel> GetModel(string userId)
        {
            var appUsers = _userManager.Users.Where(u => u.Id == userId).ToList();
            var userRoles = appUsers.Select(u => new UserRoleManagementViewModel
                                            {
                                                UserId = u.Id,
                                                UserName = u.UserName,
                                                UserRoles = u.Roles.Join(_dbContext.Roles,
                                                                            ur => ur.RoleId,
                                                                            dr => dr.Id,
                                                                            (ur, dr) => new CustomTuple
                                                                            {
                                                                                Id = dr.Id,
                                                                                Text = dr.Name
                                                                            })
                                                                    .ToList()
                                            })
                                     .ToList();
            return userRoles;
        }
    }
}