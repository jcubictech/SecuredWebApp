using System.Text;
using System.Security.Claims;
using NLog;
using NLog.LayoutRenderers;
using SecuredWebApp.Models;

namespace SecuredWebApp.Helpers
{
    [LayoutRenderer("app-user")]
    public class AppUserLayoutRenderer : LayoutRenderer
    {
        protected override void Append(StringBuilder sb, LogEventInfo logEvent)
        {
            string userName = ClaimsPrincipal.Current.Identity.Name;
            if (!string.IsNullOrEmpty(userName)) sb.Append(userName);
        }
    }
}