import { ISexoView } from '../../sexo/interfaces/sexo-view.interface';

export interface IUsuarioView {
  id: number;
  nome: string;
  dataNascimento: Date;
  email: string;
  sexo: ISexoView;
  ativo: boolean;
}
