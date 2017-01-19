using System.Security.Claims;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Data.Providers
{
    public static class AuthorizationProvider
    {
        public static bool IsAuthenticated()
        {
            return ClaimsPrincipal.Current.Identity.IsAuthenticated;
        }

        public static bool IsSuperAdmin()
        {
            return ClaimsPrincipal.Current.IsInRole(AppConstants.SUPER_ADMIN_ROLE);
        }

        public static bool IsAdmin()
        {
            return IsSuperAdmin() || ClaimsPrincipal.Current.IsInRole(AppConstants.ADMIN_ROLE);
        }

        public static bool IsEditor()
        {
            return IsAdmin() || ClaimsPrincipal.Current.IsInRole(AppConstants.EDITOR_ROLE);
        }

        public static bool IsViewer()
        {
            return IsEditor() || ClaimsPrincipal.Current.IsInRole(AppConstants.VIEWER_ROLE);
        }

        public static bool HasRole()
        {
            return ClaimsPrincipal.Current.Identity.IsAuthenticated && IsViewer();
        }

        public static bool NoRoleAssignment()
        {
            return ClaimsPrincipal.Current.Identity.IsAuthenticated &&
                   !ClaimsPrincipal.Current.IsInRole(AppConstants.VIEWER_ROLE) &&
                   !ClaimsPrincipal.Current.IsInRole(AppConstants.EDITOR_ROLE) &&
                   !ClaimsPrincipal.Current.IsInRole(AppConstants.ADMIN_ROLE) &&
                   !ClaimsPrincipal.Current.IsInRole(AppConstants.SUPER_ADMIN_ROLE);

        }
    }
}
