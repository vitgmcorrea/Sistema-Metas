using System.Linq;
using System.Threading.Tasks;
using GHR.Domain.DataBase.Funcionarios;
using GHR.Persistence.Interfaces.Contexts;
using GHR.Persistence.Interfaces.Contracts.Funcionarios;
using GHR.Persistence.Interfaces.Implements.Global;
using GHR.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace GHR.Persistence.Interfaces.Implements.Funcionarios
{
    public class FuncionarioMetaPersistence : GlobalPersistence, IFuncionarioMetaPersistence
    {
        private readonly GHRContext _context;

        public FuncionarioMetaPersistence(GHRContext context) : base (context)
        {
            _context = context;
        }
        //Funcionarios
        public async Task<PaginaLista<FuncionarioMeta>> RecuperarMetasPorFuncionarioIdAsync(int funcionarioId, int empresaId, PaginaParametros paginaParametros)
        {
            IQueryable<FuncionarioMeta> query = _context.FuncionariosMetas               
                .Include(e => e.Empresas)
                .Include(f => f.Funcionarios)
                .Include(m => m.Metas);

                query = query
                    .AsNoTracking()
                    .OrderBy(fm => fm.MetaId)
                    .Where(fm => fm.FuncionarioId == funcionarioId && fm.EmpresaId == empresaId &&
                                 (fm.Metas.Descricao.ToLower().Contains(paginaParametros.Termo.ToLower()) ||
                                  fm.Metas.NomeMeta.ToLower().Contains(paginaParametros.Termo.ToLower()))) ;

            return await PaginaLista<FuncionarioMeta>.CriarPaginaAsync(query, paginaParametros.NumeroDaPagina, paginaParametros.TamanhoDaPagina);
    
        }
        public async Task<FuncionarioMeta> RecuperarFuncionarioMetaAsync(int funcionarioId, int metaId, int empresaId)
        {
            IQueryable<FuncionarioMeta> query = _context.FuncionariosMetas
                .Include(e => e.Empresas)
                .Include(m => m.Metas)
                .Include(f => f.Funcionarios);

            query = query
                    .AsNoTracking()
                    .OrderBy(fm => fm.MetaId)
                    .Where(fm => fm.FuncionarioId == funcionarioId &&
                                 fm.MetaId == metaId &&
                                 fm.EmpresaId == empresaId );

            return await query.FirstOrDefaultAsync();

        }
       
        public async Task<FuncionarioMeta[]> RecuperarFuncionariosMetasAsync(int empresaId)
        {
            IQueryable<FuncionarioMeta> query = _context.FuncionariosMetas
                .Include(e => e.Empresas)
                .Include(m => m.Metas)
                .Include(f => f.Funcionarios);

            query = query
                    .AsNoTracking()
                    .OrderBy(fm => fm.MetaId)
                    .Where(fm => fm.EmpresaId == empresaId);

            return await query.ToArrayAsync();

        }
    }
    
}