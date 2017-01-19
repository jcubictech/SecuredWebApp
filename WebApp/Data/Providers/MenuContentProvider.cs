using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using SecuredWebApp.Helpers;
using SecuredWebApp.Models.View;

namespace SecuredWebApp.Data.Providers
{
    public class MenuContentProvider : IDataProvider
    {
        public object Read()
        {
            try
            {
                List<SubmenuViewModel> adminSubMenu = new List<SubmenuViewModel>()
                {
                    new SubmenuViewModel { Id = "41", Name = "User Management", LinkUrl = "/UserManager/Retrieve?data=users" },
                    new SubmenuViewModel { Id = "42", Name = "Role Masnagement", LinkUrl = "/UserManager/Retrieve?data=roles" },
                    new SubmenuViewModel { Id = "43", Name = "User-Role Assignments", LinkUrl = "/UserManager/Retrieve?data=userroles" },
                };

                List<MenuViewModel> menuModel = new List<MenuViewModel>()
                {
                    new MenuViewModel { Id = "4", Name = "Administration", LinkUrl = "#", SubMenus = adminSubMenu },
                };

                return menuModel;
            }
            catch
            {
            }

            return null;
        }
    }
}
