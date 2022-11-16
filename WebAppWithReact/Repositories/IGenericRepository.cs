namespace WebAppWithReact.Repositories;

public interface IGenericRepository<TEntity> where TEntity : class
{
    Task Create(TEntity item);
    Task<TEntity?> FindById(Guid id);
    Task<IEnumerable<TEntity>?> Get();
    Task<IEnumerable<TEntity>?> Get(Func<TEntity, bool> predicate);
    Task Remove(TEntity item);
    Task Update(TEntity item);
}
