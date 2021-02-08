import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractService } from 'src/app/shared/abstract-service/abstract.service';
import { IUsuarioFilter } from './interfaces/usuario-filter.interface';
import { IUsuarioInput } from './interfaces/usuario-input.interface';
import { IUsuarioView } from './interfaces/usuario-view.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends AbstractService {

  private readonly CONTROLLER = 'usuario';

  constructor(private httpClient: HttpClient) {
    super();
  }

  get(filtro: IUsuarioFilter): Observable<IUsuarioView[]> {
    const url = this.getUrl(this.CONTROLLER);
    const params = this.getHttpParams(filtro);
    return this.httpClient.get<IUsuarioView[]>(url, { params });
  }

  getById(id: number): Observable<IUsuarioView> {
    const url = `${this.getUrl(this.CONTROLLER)}/${id}`;
    return this.httpClient.get<IUsuarioView>(url);
  }

  create(usuario: IUsuarioInput): Observable<IUsuarioView> {
    const url = this.getUrl(this.CONTROLLER);
    return this.httpClient.post<IUsuarioView>(url, usuario);
  }

  update(id: number, usuario: IUsuarioInput): Observable<IUsuarioView> {
    const url = `${this.getUrl(this.CONTROLLER)}/${id}`;
    return this.httpClient.put<IUsuarioView>(url, usuario);
  }

  updateStatus(id: number, status: boolean): Observable<IUsuarioView> {
    const url = `${this.getUrl(this.CONTROLLER)}/${id}/status/${status}`;
    return this.httpClient.put<IUsuarioView>(url, null);
  }

  delete(id: number): Observable<void> {
    const url = `${this.getUrl(this.CONTROLLER)}/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
