using DAL;

using Microsoft.EntityFrameworkCore;


namespace WebAppWithReact.Repositories;

/// <summary>
///     Репозиторий для работы с EF
/// </summary>
/// <typeparam name="TEntity">Тип Dbset</typeparam>
public class EFGenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
{
    private readonly DbContext _context;
    private readonly DbSet<TEntity> _dbSet;

    public EFGenericRepository(Context context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public async Task Create(TEntity item)
    {
        await _dbSet.AddAsync(item);
        await _context.SaveChangesAsync();
    }

    public async Task<TEntity?> FindById(Guid id)
    {
        var e = await _dbSet.FindAsync(id);

        return e;
    }

    public async Task<List<TEntity>?> Get()
    {
        var l = await _dbSet.AsNoTracking().ToListAsync();

        return l;
    }

    public async Task<List<TEntity>?> Get(Func<TEntity, bool> predicate)
    {
        //TODO кажется тут что-то не так с запросом
        // http://disq.us/p/1csop1o на метаните сказано что не имеет смысла отслеживать изменения, но я не знаю как сделать нормальную eager loading 
        // здесь, поэтому пока что включу отслеживание
        //var l = _dbSet.AsNoTracking().Where(predicate);
        var l = _dbSet.Where(predicate);
        var list = l.ToList();

        return list;
    }

    public async Task Remove(TEntity item)
    {
        _dbSet.Remove(item);
        await _context.SaveChangesAsync();
    }

    public async Task Update(TEntity item)
    {
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}

