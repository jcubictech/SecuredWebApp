using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SecuredWebApp.Infrastructure.ModelMetadata
{
    public class MicrosoftEmailAttribute : ValidationAttribute
    {
        private readonly string _msEmailTemplate = "@microsoft.com";
        public MicrosoftEmailAttribute() : base("{0} is not a valid Microsoft email account.")
        {
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                if (!value.ToString().ToLower().EndsWith(_msEmailTemplate))
                {
                    string errorMessage = FormatErrorMessage(validationContext.DisplayName);
                    return new ValidationResult(errorMessage);
                }
            }
            return ValidationResult.Success;
        }
    }
}