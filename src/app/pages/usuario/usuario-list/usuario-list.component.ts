import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { IUsuarioFilter } from 'src/app/services/usuario/interfaces/usuario-filter.interface';
import { IUsuarioView } from 'src/app/services/usuario/interfaces/usuario-view.interface';
import { UsuarioFacadeService } from '../usuario-facade.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit, OnDestroy {

  items: IUsuarioView[] = [];

  displayedColumns: string[] = [
    'nome',
    'dataNascimento',
    'email',
    'sexo',
    'ativo',
    'acoes'
  ];

  formFilters: FormGroup = this.formBuilder.group({
    nome: [''],
    ativo: ['']
  });

  private onRecieveItems: Subscription | undefined;
  private onRecieveFeedback: Subscription | undefined;
  private onFinishUpdateStatus: Subscription | undefined;
  private onFinishDelete: Subscription | undefined;

  constructor(
    private usuarioFacade: UsuarioFacadeService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initSubscriptions();
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  updateStatus(id: number, status: boolean): void {
    this.usuarioFacade.updateStatus(id, status);
  }

  delete(id: number, nome: string): void {
    if (confirm(`Deseja realmente excluir o usuário "${nome}"?`)) {
      this.usuarioFacade.delete(id, nome);
    }
  }

  filtrar(): void {
    this.loadItems();
  }

  private initSubscriptions(): void {
    this.onRecieveItems = this.usuarioFacade.onRecieveUsuarios.subscribe(data => this.itemsOnSubscribe(data));
    this.onRecieveFeedback = this.usuarioFacade.onRecieveFeedback.subscribe(data => this.feedbackMessageOnSubscribe(data));
    this.onFinishUpdateStatus = this.usuarioFacade.onFinishUpdateStatus.subscribe(() => this.loadItems());
    this.onFinishDelete = this.usuarioFacade.onFinishDelete.subscribe(() => this.loadItems());
  }

  private destroySubscriptions(): void {
    this.onRecieveItems?.unsubscribe();
    this.onRecieveFeedback?.unsubscribe();
    this.onFinishUpdateStatus?.unsubscribe();
    this.onFinishDelete?.unsubscribe();
  }

  private itemsOnSubscribe(items: IUsuarioView[] | null): void {
    this.items = items || [];
  }

  private feedbackMessageOnSubscribe(message: string | null): void {
    if (message) {
      this.openSnackBar(message);
    }
  }

  private loadItems(): void {
    this.usuarioFacade.loadUsuarios(this.getFilters());
  }

  private getFilters(): IUsuarioFilter {
    return this.formFilters.value;
  }

  private openSnackBar(text: string): void {
    this.matSnackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
