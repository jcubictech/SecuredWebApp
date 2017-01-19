using System.Web.Mvc;
using StructureMap;
using StructureMap.TypeRules;
using Heroic.Web.IoC;

namespace SecuredWebApp.Infrastructure
{
    public class AppActionFilterRegistry : Registry
    {
        public AppActionFilterRegistry(string namespacePrefix)
        {
            For<IFilterProvider>().Use(new StructureMapFilterProvider());

            // this is the same code as in Heroic.Web.IoC ActionFilterRegistry().
            // modify it as you see fit
            Policies.SetAllProperties(x =>
                x.Matching(p =>
                    p.DeclaringType.CanBeCastTo(typeof(ActionFilterAttribute)) &&
                    p.DeclaringType.Namespace.StartsWith(namespacePrefix) &&
                    !p.PropertyType.IsPrimitive &&
                    p.PropertyType != typeof(string)));
        }
    }
}