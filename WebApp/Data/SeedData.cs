using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Linq;
using SecuredWebApp.Infrastructure.Tasks;
using SecuredWebApp.Models;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Data
{
    public class SeedData : IRunAtStartup
    {
        private readonly AppDbContext _dbContext;

        public SeedData(AppDbContext context)
        {
            _dbContext = context;
        }

        public void Execute()
        {
            SeedSuperAccount();
        }

        public void SeedSuperAccount()
        {
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_dbContext));
            var roleManager = new RoleManager<ApplicationRole>(new RoleStore<ApplicationRole>(_dbContext));

            var superUser = userManager.FindByName(AppConstants.SUPER_ADMIN_ROLE);
            if (superUser == null)
            {
                var user = new ApplicationUser()
                {
                    UserName = AppConstants.SUPER_ADMIN_ROLE,
                    Email = SettingsHelper.GetSafeSetting("SuperUser"),
                    EmailConfirmed = true,
                };
                IdentityResult result = userManager.Create(user, "WebApp#1");
                if (result == IdentityResult.Success)
                {
                    superUser = userManager.FindByName(AppConstants.SUPER_ADMIN_ROLE);
                }
            }

            if (superUser != null && roleManager.Roles.Count() == 0)
            {
                roleManager.Create(new ApplicationRole { Name = AppConstants.SUPER_ADMIN_ROLE });
                roleManager.Create(new ApplicationRole { Name = AppConstants.ADMIN_ROLE });
                roleManager.Create(new ApplicationRole { Name = AppConstants.EDITOR_ROLE });
                roleManager.Create(new ApplicationRole { Name = AppConstants.VIEWER_ROLE });
                roleManager.Create(new ApplicationRole { Name = AppConstants.APPROVER_ROLE });
            }

            if (superUser != null && roleManager.Roles.Count() > 0 && superUser.Roles.Count() == 0)
            {
                userManager.AddToRoles(superUser.Id, new string[] { AppConstants.SUPER_ADMIN_ROLE, AppConstants.ADMIN_ROLE });
            }
        }
    }
}