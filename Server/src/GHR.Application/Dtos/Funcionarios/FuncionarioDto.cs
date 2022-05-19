using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GHR.Application.Dtos.Metas;

namespace GHR.Application.Dtos.Funcionarios
{
    public class FuncionarioDto
    {
      public int Id { get; set; }

      [Display(Name = "Salário"), Required(ErrorMessage = "O campo {0} é obrigatório."),
      Range(100, 9999999999, ErrorMessage = "O campo {0} não pode ser inferior a R$ 100,00")]
      public float Salario { get; set; }

      [Display(Name = "Data Admissão"), 
      Required(ErrorMessage = "O campo {0} é obrigatório.")]
      public DateTime DataAdmissao { get; set; }

      public string DataDemissao { get; set; }

      [Display(Name = "Funcionario Ativo"),
      Required(ErrorMessage = "O campo {0} é obrigatório.")]
      public Boolean FuncionarioAtivo { get; set; }

      public int SupervisorId { get; set; }
      public int GerenteAdministrativoId { get; set; }
      public int GerenteOperacionalId { get; set; }      
      public int DiretorId { get; set; }

      [Display(Name = "Cargo"),
      Required(ErrorMessage = "É necessário informa um {0}.")] 
      public int CargoId { get; set; }

      [Display(Name = "Departamento"),
      Required(ErrorMessage = "É necessário informa um {0}.")]
      public int DepartamentoId { get; set; }
      
      [Display(Name = "Conta"),
      Required(ErrorMessage = "É necessário informa um {0}.")]
      public int UserId { get; set; }

      [Display(Name = "Endereco"),
      Required(ErrorMessage = "É necessário informa um {0}.")]
      public int EndrecoId { get; set; }

      [Display(Name = "Dados Pessoais"),
      Required(ErrorMessage = "É necessário informa {0}.")]
      public int DadosPessoaisId { get; set; }
      public IEnumerable<MetaDto> Metas { get; set; }
      public string ImagemURL { get; set; }
       }
}