namespace SecuredWebApp.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SecuredWebApp.Models.AppDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
            MigrationsDirectory = @"Migrations";
        }

        protected override void Seed(SecuredWebApp.Models.AppDbContext context)
        {
            //  This method will be called after migrating to the latest version.
            SecuredWebApp.Data.SeedData seed = new Data.SeedData(context);
            seed.Execute();
        }
    }
}
