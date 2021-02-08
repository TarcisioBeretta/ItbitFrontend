import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractService {

  protected getHttpParams(object: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(object).forEach((key) => {
      const value = `${object[key]}`;
      if (value) {
        httpParams = httpParams.append(key, value);
      }
    });
    return httpParams;
  }

  protected getUrl(controller: string): string {
    return `${environment.restAPI}/${controller}`;
  }
}
