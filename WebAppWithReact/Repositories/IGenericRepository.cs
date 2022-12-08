namespace WebAppWithReact.Repositories;

public interface IGenericRepository<TEntity> where TEntity : class
{
    Task Create(TEntity item);
    Task<TEntity?> FindById(Guid id);
    Task<List<TEntity>?> Get();
    Task<List<TEntity>?> Get(Func<TEntity, bool> predicate);
    Task Remove(TEntity item);
    Task Update(TEntity item);
}
