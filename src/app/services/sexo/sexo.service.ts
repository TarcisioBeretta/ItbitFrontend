import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractService } from 'src/app/shared/abstract-service/abstract.service';
import { ISexoView } from './interfaces/sexo-view.interface';

@Injectable({
  providedIn: 'root'
})
export class SexoService extends AbstractService {

  private readonly CONTROLLER = 'sexo';

  constructor(private httpClient: HttpClient) {
    super();
  }

  get(): Observable<ISexoView[]> {
    const url = this.getUrl(this.CONTROLLER);
    return this.httpClient.get<ISexoView[]>(url);
  }
}
