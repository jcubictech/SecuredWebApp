using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Models
{
    public partial class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public static AppDbContext Create()
        {
            return new AppDbContext();
        }

        public AppDbContext()
            : base(AppConstants.APP_CONNECTION_NAME, throwIfV1Schema: false)
        {
            // turn on lazy loading related tables for linq query
            this.Configuration.LazyLoadingEnabled = true;
        }

        public DbSet<AppLog> AppLogs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // will initialize UserManager
        }
    }
}
