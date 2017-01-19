using Heroic.AutoMapper;
using AutoMapper;

namespace SecuredWebApp.Infrastructure.Mappings
{
    public class RegistrationMappings : IHaveCustomMappings // the interface auto-registers during start-up by Heroic.AutoMapper
    {
        private static MapperConfiguration _configuration;
        private static IMapper _autoMapper;

        public object Configuration  { get { return _configuration; }  } // Accessor

        public T Map<T>(object source)
        {
            return _autoMapper.Map<T>(source);
        }

        public void CreateMappings(IMapperConfigurationExpression configuration)
        {
            _configuration = new MapperConfiguration(config => { });
            var profileExpression = _configuration as IProfileExpression;

            // set the mapping here. for example:
            //profileExpression.CreateMap<MyViewModel, MyModel>();

            _autoMapper = _configuration.CreateMapper();
        }
    }
}