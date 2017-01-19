using System.Data.Entity;
using System.Web;
using SecuredWebApp.Infrastructure.Tasks;
using SecuredWebApp.Models;
using SecuredWebApp.Helpers;

namespace SecuredWebApp.Infrastructure
{
    public class TransactionPerRequest : IRunOnEachRequest, IRunOnError, IRunAfterEachRequest
    {
        private readonly AppDbContext _dbContext;
        private readonly HttpContextBase _httpContext;

        public TransactionPerRequest(AppDbContext dbContext, HttpContextBase httpContext)
        {
            _dbContext = dbContext;
            _httpContext = httpContext;
        }

        void IRunOnEachRequest.Execute()
        {
            _httpContext.Items[AppConstants.TRANSACTION_KEY] =
                _dbContext.Database.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
        }

        void IRunOnError.Execute()
        {
            _httpContext.Items[AppConstants.TRANSACTION_ERROR_KEY] = true;
        }

        void IRunAfterEachRequest.Execute()
        {
            var transaction = (DbContextTransaction)_httpContext.Items[AppConstants.TRANSACTION_KEY];

            if (_httpContext.Items[AppConstants.TRANSACTION_ERROR_KEY] != null)
            {
                transaction.Rollback();
            }
            else
            {
                transaction.Commit();
            }
        }
    }
}