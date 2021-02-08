import { TestBed } from '@angular/core/testing';

import { UsuarioFacadeService } from './usuario-facade.service';

describe('UsuarioFacadeService', () => {
  let service: UsuarioFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
