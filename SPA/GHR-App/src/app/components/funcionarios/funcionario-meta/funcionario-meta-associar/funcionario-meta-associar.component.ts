import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { ValidadorFormularios } from 'src/app/helpers/ValidadorFormularios';
import { FuncionarioMeta } from 'src/app/models/funcionarios/FuncionarioMeta';

import { Meta } from 'src/app/models/metas/Meta';

import { FuncionarioMetaService } from 'src/app/services/funcionarios/funcionarioMeta.service';

import { MetaService } from 'src/app/services/metas/Meta.service';

@Component({
  selector: 'app-funcionario-meta-associar',
  templateUrl: './funcionario-meta-associar.component.html',
  styleUrls: ['./funcionario-meta-associar.component.scss']
})
export class FuncionarioMetaAssociarComponent implements OnInit {

  public form: FormGroup;

  public funcionarioMeta = {} as FuncionarioMeta;
  public metas: Meta[] = [];
  public meta = {} as Meta;

  get ctrMeta(): any
  {
    return this.form.controls;
  }

  constructor(
    private activatedRouter: ActivatedRoute,
    private funcionarioMetaService: FuncionarioMetaService,
    private fb: FormBuilder,
    private metaService: MetaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router)
    {  }

  ngOnInit(): void
  {
    this.spinner.show();
    this.validarFormulario();
    this.carregarComboMetas();
  }

  public validarFormulario(): void {
    this.form = this.fb.group(       {
      nomeMeta: ['', Validators.required],
      metaCumprida: ['', Validators.required],
      metaAprovada: [false, Validators.required],
      inicioPlanejado: [null],
      fimPlanejado: [null],
      inicioRealizado: [null],
      fimRealizado: [null],
      supervisor: [null],
      funiconarioId: [],
      id: [],
    });
  }

  public carregarComboMetas(): void {

    this.spinner.show();

    this.metaService
      .recuperarMetasAtivas()
      .subscribe(
        (metas: Meta[]) => { this.metas = metas; },

        (error: any) => {

          console.error(error);
          this.toastr.error('Falha ao recuperar metas', "Erro!");})

      .add(() => this.spinner.hide());
  }

  public validarCampo(campoForm: FormControl): any {

    return ValidadorFormularios
      .verificarErroCampo(campoForm);
  }

  public retornarValidacao(nomeCampo: FormControl, nomeElemento: string): any {

    return ValidadorFormularios
      .retornarMensagemErro(nomeCampo, nomeElemento);
  }

  public consultarMeta(): void {

    this.spinner.show();
    const metaId = this.form.get('id').value

    if (metaId === null) {
      this.spinner.hide();
      this.toastr.info("Selecione uma meta para prosseguir", "Informação!")
    } else {
      this.metaService
        .recuperarMetaPorId(this.form.get('id').value)
        .subscribe(
          (metaRetorno: Meta) => {
            this.meta = metaRetorno;
            this.form.patchValue(this.meta);},
          (error: any) => {
            console.error(error);
            this.toastr.error('Falha ao recuperar metas', "Erro!");})
        .add(() => this.spinner.hide());
    }
  }

  public associarFuncionarioMeta(): void {
    const funcionarioIdParam = this.activatedRouter.snapshot.paramMap.get('id');
    const metaIdParam = this.form.get('id').value;

    if (funcionarioIdParam !== null && metaIdParam !== null) {
      if (this.form.valid) {
        this.consultarFuncionarioMeta(+funcionarioIdParam, +metaIdParam);
      }
    };
  }

  public consultarFuncionarioMeta(funcionarioId: number, metaId: number): void {
    this.spinner.show();

    this.funcionarioMetaService
      .recuperarFuncionarioIdMetaId(funcionarioId, metaId)
      .subscribe(
        (funcionarioMeta: FuncionarioMeta) => {
          if (funcionarioMeta !== null) {
              this.salvarFuncionarioMeta(funcionarioId, metaId);
          } else {
              this.criarFuncionarioMeta(funcionarioId, metaId);
          }
        },
        (error: any) => {
          this.toastr.error("Falha ao recuperar metas por Funcionario.", "Erro!");
          console.error(error);
        })
      .add(() => this.spinner.hide());
  }

  public criarFuncionarioMeta(funcionarioId: number, metaId: number): void {
    this.spinner.show();


    this.funcionarioMeta.funcionarioId = funcionarioId;
    this.funcionarioMeta.metaId = metaId;
    this.funcionarioMeta.metaCumprida = this.form.get('metaCumprida').value
    this.funcionarioMeta.inicioAcordado = this.meta.inicioPlanejado;
    this.funcionarioMeta.fimAcordado = this.meta.fimPlanejado;

    this.funcionarioMetaService
      .criarFuncionarioMeta(this.funcionarioMeta)
      .subscribe(
        () => {
          this.toastr.success("Associação realizada com sucesso!", "Sucesso!");
        },
        (error: any) => {
          console.error(error);
          this.toastr.error("Falha ao cadastrar metas para um funcionario", "Erro!");
        })
      .add(() => this.spinner.hide());
  }

  public salvarFuncionarioMeta(funcionarioId: number, metaId: number): void {
    this.spinner.show();


    this.funcionarioMeta.funcionarioId = funcionarioId;
    this.funcionarioMeta.metaId = metaId;
    this.funcionarioMeta.metaCumprida = this.form.get('metaCumprida').value
    this.funcionarioMeta.inicioRealizadb =   this.funcionarioMeta.inicioAcordado
    this.funcionarioMeta.fimRealizado = this.form.get('fimRealizado').value
    console.log("update", this.funcionarioMeta.metaCumprida, this.funcionarioMeta.inicioRealizadb, this.funcionarioMeta.inicioAcordado)
    console.log(funcionarioId, metaId, this.funcionarioMeta)

    this.funcionarioMetaService
      .salvarFuncionarioMeta(this.funcionarioMeta)
      .subscribe(
        () => {
          this.toastr.success("Funiconario/Meta atualizado!", "Sucesso!");
        },
        (error: any) => {
          console.error(error);
          this.toastr.error("Falha ao atualizar meta de um funcionário", "Erro!");
        })
      .add(() => this.spinner.hide());
  }



}
