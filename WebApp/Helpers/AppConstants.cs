namespace SecuredWebApp.Helpers
{
    public static class AppConstants
    {
        public const string APP_ASSEMBLY_PREFIX = "SecuredWebApp";
        public const string SUPER_ADMIN_ROLE = "AppAdmin";
        public const string ADMIN_ROLE = "Admin";
        public const string EDITOR_ROLE = "Editor";
        public const string VIEWER_ROLE = "Viewer";
        public const string APPROVER_ROLE = "Approver";

        public const string TRANSACTION_KEY = "_Transaction";
        public const string TRANSACTION_ERROR_KEY = "_TransactionError";
        public const string ERROR_KEY = "_Error";
        public const string ALERT_KEY = "_Alerts";
        public const string PARTIAL_ALERT_KEY = "_PartialAlerts";
        public const string JSON_ALERT_KEY = "_JsonAlerts";
        public const string CONTAINER_KEY = "_Container";

        public const string MAINTENANCE_ACTION_NAME = "Maintenance";
        public const string ONLINE_ESTIMATE_TIME = "EstimatedOnlineTime";
        public const string SEED_DATA_ALWAYS = "SeedDataAlways";
        public const string LOG_TABLES = "LogTables";
        public const string LOG_LEVEL = "LogLevel";
        public const string APP_CONNECTION_NAME = "AppDbConnection";
        public const string GOOGLE_EMAIL_DOMAIN = "google.com";

        public const string DOWNLOAD_COOKIE_NAME = "AppDownload";
        public const string COOKIE_DONE = "done";
        public const string COOKIE_ERROR = "error";

        public const string EMAIL_SUPPORT_KEY = "AwsSupportEmail";
        public const string EMAIL_DEVELOPER_KEY = "AwsDeveloperEmail";
        public const string EMAIL_SENDER_KEY = "AwsEmailSender";
        public const string EMAIL_HOST_KEY = "AwsEmailHost";
        public const string EMAIL_PORT_KEY = "AwsEmailPort";
        public const string SMTP_USER_KEY = "AwsSmtpUser";
        public const string SMTP_USER_CODE_KEY = "AwsSmtpUserCode";
        public const string EMAIL_HOST_DEFAULT = "email-smtp.us-west-2.amazonaws.com";
        public const int EMAIL_PORT_DEFAULT = 587; // SSL-enabled (port can be 25, 465 or 587)
    }
}