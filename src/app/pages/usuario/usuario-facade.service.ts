import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ISexoView } from 'src/app/services/sexo/interfaces/sexo-view.interface';
import { SexoService } from 'src/app/services/sexo/sexo.service';
import { IUsuarioFilter } from 'src/app/services/usuario/interfaces/usuario-filter.interface';
import { IUsuarioInput } from 'src/app/services/usuario/interfaces/usuario-input.interface';
import { IUsuarioView } from 'src/app/services/usuario/interfaces/usuario-view.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioFacadeService {

  onRecieveSexos: Subject<ISexoView[] | null> = new Subject();
  onRecieveUsuario: Subject<IUsuarioView | null> = new Subject();
  onRecieveUsuarios: Subject<IUsuarioView[] | null> = new Subject();
  onRecieveFeedback: Subject<string | null> = new Subject();
  onRecieveValidationError: Subject<HttpErrorResponse | null> = new Subject();

  onFinishCreate: Subject<null> = new Subject();
  onFinishUpdate: Subject<null> = new Subject();
  onFinishUpdateStatus: Subject<null> = new Subject();
  onFinishDelete: Subject<null> = new Subject();

  constructor(
    private usuarioService: UsuarioService,
    private sexoService: SexoService
  ) { }

  loadSexos(): void {
    this.sexoService
      .get()
      .subscribe(
        data => this.onLoadSexosSuccess(data),
        error => this.onLoadSexosError(error),
      );
  }

  loadUsuarios(filters: IUsuarioFilter): void {
    this.usuarioService
      .get(filters)
      .subscribe(
        data => this.onLoadUsuariosSuccess(data),
        error => this.onLoadUsuariosError(error),
      );
  }

  loadUsuario(id: number): void {
    this.usuarioService
      .getById(id)
      .subscribe(
        data => this.onLoadUsuarioSuccess(data),
        error => this.onLoadUsuarioError(error),
      );
  }

  create(usuario: IUsuarioInput): void {
    this.usuarioService
      .create(usuario)
      .subscribe(
        data => this.onCreateSuccess(data),
        error => this.onCreateError(error),
        () => this.onFinishCreate.next()
      );
  }

  update(id: number, usuario: IUsuarioInput): void {
    this.usuarioService
      .update(id, usuario)
      .subscribe(
        data => this.onUpdateSuccess(data),
        error => this.onUpdateError(error),
        () => this.onFinishUpdate.next()
      );
  }

  updateStatus(id: number, status: boolean): void {
    this.usuarioService
      .updateStatus(id, status)
      .subscribe(
        data => this.onUpdateStatusSuccess(data),
        error => this.onUpdateStatusError(error),
        () => this.onFinishUpdateStatus.next()
      );
  }

  delete(id: number, nome: string): void {
    this.usuarioService
      .delete(id)
      .subscribe(
        () => this.onDeleteSuccess(nome),
        error => this.onDeleteError(error),
        () => this.onFinishDelete.next()
      );
  }

  // Success

  private onLoadSexosSuccess(sexos: ISexoView[]): void {
    this.setSexos(sexos);
  }

  private onLoadUsuariosSuccess(usuarios: IUsuarioView[]): void {
    this.setUsuarios(usuarios);
  }

  private onLoadUsuarioSuccess(usuario: IUsuarioView): void {
    this.setUsuario(usuario);
  }

  private onCreateSuccess(usuario: IUsuarioView): void {
    this.setFeedbackMessage(`Usuário "${usuario.nome}" criado com sucesso.`);
  }

  private onUpdateSuccess(usuario: IUsuarioView): void {
    this.setFeedbackMessage(`Usuário "${usuario.nome}" atualizado com sucesso.`);
  }

  private onUpdateStatusSuccess(usuario: IUsuarioView): void {
    const usuarioStatus = usuario.ativo ? 'Ativo' : 'Inativo';
    this.setFeedbackMessage(`Status do usuário "${usuario.nome}" alterado para "${usuarioStatus}".`);
  }

  private onDeleteSuccess(nome: string): void {
    this.setFeedbackMessage(`Usuário "${nome}" excluído com sucesso.`);
  }

  // Errors

  private onLoadSexosError(error: HttpErrorResponse): void {
    this.setSexos(null);

    if (error.status !== 404) {
      this.setFeedbackMessage('Ocorreu um erro ao consultar os sexos');
    }
  }

  private onLoadUsuariosError(error: HttpErrorResponse): void {
    this.setUsuarios(null);

    if (error.status !== 404) {
      this.setFeedbackMessage('Ocorreu um erro ao consultar os usuários');
    }
  }

  private onLoadUsuarioError(error: HttpErrorResponse): void {
    this.setUsuario(null);

    if (error.status === 404) {
      this.setFeedbackMessage('Esse usuário não existe.');
    } else {
      this.setFeedbackMessage('Ocorreu um erro ao consultar o usuário.');
    }
  }

  private onCreateError(error: HttpErrorResponse): void {
    if (error.status === 400) {
      this.setValidationError(error);
    } else {
      this.setFeedbackMessage('Ocorreu um erro ao cadastrar o usuário.');
    }
  }

  private onUpdateError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.setFeedbackMessage('Esse usuário não existe.');
    } else if (error.status === 400) {
      this.setValidationError(error);
    } else {
      this.setFeedbackMessage('Ocorreu um erro ao atualizar o usuário.');
    }
  }

  private onUpdateStatusError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.setFeedbackMessage('Esse usuário não existe.');
    } else {
      this.setFeedbackMessage('Ocorreu um erro ao atualizar o status do usuário.');
    }
  }

  private onDeleteError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.setFeedbackMessage('Esse usuário não existe.');
    } else {
      this.setFeedbackMessage('Ocorreu um erro ao excluir o usuário.');
    }
  }

  // Responses

  private setSexos(sexo: ISexoView[] | null): void {
    this.onRecieveSexos.next(sexo);
  }

  private setUsuario(usuario: IUsuarioView | null): void {
    this.onRecieveUsuario.next(usuario);
  }

  private setUsuarios(usuarios: IUsuarioView[] | null): void {
    this.onRecieveUsuarios.next(usuarios);
  }

  private setFeedbackMessage(message: string | null): void {
    this.onRecieveFeedback.next(message);
  }

  private setValidationError(error: HttpErrorResponse | null): void {
    this.onRecieveValidationError.next(error);
  }
}
