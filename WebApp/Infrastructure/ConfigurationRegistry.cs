using StructureMap;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Infrastructure
{
    public class ConfigurationRegistry : Registry
    {
        public interface IAppConfigurationManager : IConfigurationManger
        {
        }

        public ConfigurationRegistry()
        {
            For<IConfigurationManger>().Use<AppConfigurationManager>();
        }
    }
}