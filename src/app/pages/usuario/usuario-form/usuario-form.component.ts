import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISexoView } from 'src/app/services/sexo/interfaces/sexo-view.interface';
import { IUsuarioView } from 'src/app/services/usuario/interfaces/usuario-view.interface';
import { UsuarioFacadeService } from '../usuario-facade.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  id: number | undefined;
  usuario: IUsuarioView | undefined;
  title: string | undefined;
  sexos: ISexoView[] = [];

  form: FormGroup = this.formBuilder.group({
    nome: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
    dataNascimento: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(100)])],
    senha: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
    sexoId: ['', Validators.compose([Validators.required])],
    ativo: [true, Validators.compose([Validators.required])],
  });

  private onRecieveSexos: Subscription | undefined;
  private onRecieveUsuario: Subscription | undefined;
  private onRecieveFeedback: Subscription | undefined;
  private onFinishCreate: Subscription | undefined;
  private onFinishUpdate: Subscription | undefined;
  private onFinishDelete: Subscription | undefined;

  constructor(
    private usuarioFacade: UsuarioFacadeService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initId();
    this.initTitle();
    this.initSubscriptions();
    this.loadSexos();
    this.loadUsuario();
  }

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  submit(): void {
    const formValue = this.form.value;

    return this.id ?
      this.usuarioFacade.update(this.id, formValue) :
      this.usuarioFacade.create(formValue);
  }

  delete(): void {
    if (this.usuario && confirm('Deseja realmente excluir?')) {
      this.usuarioFacade.delete(this.usuario.id, this.usuario.nome);
    }
  }

  private initId(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id, 10);
    }
  }

  private initTitle(): void {
    this.title = this.id ? 'Edição de usuário' : 'Cadastro de usuário';
  }

  private initSubscriptions(): void {
    this.onRecieveSexos = this.usuarioFacade.onRecieveSexos.subscribe(data => this.sexosOnSubscribe(data));
    this.onRecieveUsuario = this.usuarioFacade.onRecieveUsuario.subscribe(data => this.usuarioOnSubscribe(data));
    this.onRecieveFeedback = this.usuarioFacade.onRecieveFeedback.subscribe(data => this.feedbackMessageOnSubscribe(data));
    this.onFinishCreate = this.usuarioFacade.onFinishCreate.subscribe(() => this.redirectToList());
    this.onFinishUpdate = this.usuarioFacade.onFinishUpdate.subscribe(() => this.redirectToList());
    this.onFinishDelete = this.usuarioFacade.onFinishDelete.subscribe(() => this.redirectToList());
  }

  private destroySubscriptions(): void {
    this.onRecieveSexos?.unsubscribe();
    this.onRecieveUsuario?.unsubscribe();
    this.onRecieveFeedback?.unsubscribe();
    this.onFinishCreate?.unsubscribe();
    this.onFinishUpdate?.unsubscribe();
    this.onFinishDelete?.unsubscribe();
  }

  private loadSexos(): void {
    this.usuarioFacade.loadSexos();
  }

  private loadUsuario(): void {
    if (this.id) {
      this.usuarioFacade.loadUsuario(this.id);
    }
  }

  private sexosOnSubscribe(sexos: ISexoView[] | null): void {
    if (sexos) {
      this.sexos = sexos;
    }
  }

  private usuarioOnSubscribe(usuario: IUsuarioView | null): void {
    if (usuario) {
      this.usuario = usuario;
      const clone = Object.assign({ sexoId: usuario.sexo.id }, usuario);
      this.form.patchValue(clone);
    }
  }

  private feedbackMessageOnSubscribe(message: string | null): void {
    if (message) {
      this.openSnackBar(message);
    }
  }

  private redirectToList(): void {
    this.router.navigate(['usuario']);
  }

  private openSnackBar(text: string): void {
    this.matSnackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
