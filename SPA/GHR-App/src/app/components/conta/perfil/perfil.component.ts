import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, provideRoutes, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { ContaAtiva } from 'src/app/models/contas/ContaAtiva';
import { Conta } from 'src/app/models/contas/Conta';

import { ContaService } from 'src/app/services/contas/Conta.service';

import { ValidadorFormularios } from 'src/app/helpers/ValidadorFormularios';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public conta = {} as Conta;
  public contaLogada = false;
  public contaAtiva = {} as ContaAtiva;

  form: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    router.events.subscribe(
      (val) => {
        if (val instanceof NavigationEnd) {
          this.contaService.contaAtual$.subscribe(
            (value) => {
              this.contaLogada = value !== null;
              this.contaAtiva = { ...value };
            }
          )
        }
      }
    );
  }

  ngOnInit() {
    this.validation();
    this.consultarConta();
  }
  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidadorFormularios.CompararSenha('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      userName: [''],
      funcao: [''],
      visao: [''],
      nomeCompleto: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)]],
      email: ['', [
        Validators.required,
        Validators.email]],
      phoneNumber: ['', Validators.required],
      descricao: ['', Validators.required],
      password: ['',[
        Validators.required,
        Validators.minLength(6)]],
      confirmarPassword: [''],
    }, formOptions);
  }
  public limparFormulario(): void {
    this.form.reset();
  }
  validarCampo(campoForm: FormControl): any {
    return ValidadorFormularios.verificarErroCampo(campoForm);
  }
  retornarValidacao(nomeCampo: FormControl, nomeElemento: string): any {
    return ValidadorFormularios.retornarMensagemErro(nomeCampo, nomeElemento);
  }

  private consultarConta(): void {

    this.spinner.show();

    this.contaService.recuperarConta().subscribe(
      (contaConsulta: Conta) => {
        console.log(contaConsulta);
        this.conta = contaConsulta;
        this.form.patchValue(this.conta);
        this.toastr.success("Consulta de conta realizada.", "Sucesso!");
      },
      (error) => {
        console.error(error);
        this.toastr.error("Falaha na carga de usuário", "Erro!");
      }
    ).add(() => this.spinner.hide());
  }
  public onSubmit(): void {
    this.atualizarConta();
  }
  public atualizarConta() {

    this.conta = { ...this.form.value };

    this.spinner.show();

    this.contaService.alterarConta(this.conta).subscribe(
      () => this.toastr.success("Conta atualizada!", "Sucesso!"),
      (error) => {
        this.toastr.error(error.error);
        console.error(error);
       }
    ).add(() => this.spinner.hide())
  }
}