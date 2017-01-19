using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using StructureMap;
using Heroic.Web.IoC;
using SecuredWebApp.Helpers;
using SecuredWebApp.Infrastructure.Tasks;

namespace SecuredWebApp
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public IContainer Container
        {
            get
            {
                return (IContainer)HttpContext.Current.Items[AppConstants.CONTAINER_KEY];
            }
            set
            {
                HttpContext.Current.Items[AppConstants.CONTAINER_KEY] = value;
            }
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // sync up NLog configuration with web.config for db configuration + log level
            LogConfig.SyncWithAppConfig(SettingsHelper.GetSafeSetting(AppConstants.LOG_LEVEL, "Error"));

            // register all infrastructure related dependency using structuremap package
            StructureMapConfig.Configure();

            using (var container = IoC.Container.GetNestedContainer())
            {
                foreach (var task in container.GetAllInstances<IRunAtInit>())
                {
                    task.Execute();
                }

                foreach (var task in container.GetAllInstances<IRunAtStartup>())
                {
                    task.Execute();
                }
            }
        }
    }
}
