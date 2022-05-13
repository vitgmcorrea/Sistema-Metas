using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GHR.Application.Contracts;
using GHR.Application.Dtos;
using GHR.Domain;
using GHR.Persistence.Contracts;

namespace GHR.Application
{
    public class DepartamentoService : IDepartamentoService
    {
        private readonly IGlobalPersistence _globalPersistence;
        private readonly IDepartamentoPersistence _departamentoPersistence;
        private readonly IMapper _mapper;

        public DepartamentoService(
            IGlobalPersistence globalPersistence,
            IDepartamentoPersistence DepartamentoPersistence,
            IMapper mapper)
        {
            _globalPersistence = globalPersistence;
            _departamentoPersistence = DepartamentoPersistence;
            _mapper = mapper;
        }
        public async Task<DepartamentoDto> AddDepartamento(DepartamentoDto model)
        {
            try
            {
                var departamento = _mapper.Map<Departamento>(model);

                _globalPersistence.Add<Departamento>(departamento);
                if (await _globalPersistence.SaveChangeAsync())
                {
                    var departamentoRetorno = await _departamentoPersistence.GetDepartamentoByIdAsync(departamento.Id);

                    return _mapper.Map<DepartamentoDto>(departamentoRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteDepartamento(int departamentoId)
        {
            try
            {
                var departamento = await _departamentoPersistence.GetDepartamentoByIdAsync(departamentoId);

                if (departamento == null) throw new Exception("Departamento não encontrado para exclusão");


                _globalPersistence.Delete<Departamento>(departamento);

                return await _globalPersistence.SaveChangeAsync();
            }

            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<DepartamentoDto[]> GetAllDepartamentosAsync()
        {
            try
            {
                var departamentos = await _departamentoPersistence.GetAllDepartamentosAsync();

                if (departamentos == null) return null;

                var departamentosMapper = _mapper.Map<DepartamentoDto[]>(departamentos);

                return departamentosMapper;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<DepartamentoDto[]> GetAllDepartamentosByNomeDepartamentoAsync(string nome)
        {
            try
            {
                var departamentos = await _departamentoPersistence.GetAllDepartamentosByNomeDepartamentoAsync(nome);

                if (departamentos == null) return null;

                var departamentosMapper = _mapper.Map<DepartamentoDto[]>(departamentos);

                return departamentosMapper;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<DepartamentoDto> GetDepartamentoByIdAsync(int departamentoId)
        {
            try
            {
                var departamento = await _departamentoPersistence.GetDepartamentoByIdAsync(departamentoId);

                if (departamento == null) return null;

                var departamentoMapper = _mapper.Map<DepartamentoDto>(departamento);

                return departamentoMapper;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<DepartamentoDto> UpdateDepartamento(int departamentoId, DepartamentoDto model)
        {
            try
            {
                var departamento = await _departamentoPersistence.GetDepartamentoByIdAsync(departamentoId);

                if (departamento == null) return null;

                model.Id = departamento.Id;

                _mapper.Map(model, departamento);

                _globalPersistence.Update<Departamento>(departamento);

                if (await _globalPersistence.SaveChangeAsync())
                {
                    var departamentoRetorno = await _departamentoPersistence.GetDepartamentoByIdAsync(departamento.Id);

                    return _mapper.Map<DepartamentoDto>(departamentoRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
    }
}