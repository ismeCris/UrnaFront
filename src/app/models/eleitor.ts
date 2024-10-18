export class Eleitor {
  id!: number;
  nomeCompleto!: string;
  cpf!: string;
  profissao!: string;
  celular!: string;
  telefone!: string;
  email!: string;
  status!: Status;
}
enum Status {
  APTO = 'APTO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
  PENDENTE = 'PENDENTE',
  VOTOU = 'VOTOU',
}

