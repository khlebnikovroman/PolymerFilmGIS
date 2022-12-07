using DAL;

using Microsoft.EntityFrameworkCore;


namespace WebAppWithReact.Repositories;

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

    public async Task<IEnumerable<TEntity>?> Get()
    {
        var l = await _dbSet.AsNoTracking().ToListAsync();

        return l;
    }

    public async Task<IEnumerable<TEntity>?> Get(Func<TEntity, bool> predicate)
    {
        //TODO кажется тут что-то не так с запросом
        var l = await _dbSet.AsNoTracking().AsEnumerable().Where(predicate).AsQueryable().ToListAsync();

        return l;
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
