export class Candidato {
    id!: number;
    nome!: string;
    cpf!: string;
    numero!: string;
    funcao!: number; // 1 para Prefeito, 2 para Vereador
    status!: Status;
    votosApurados!: number;

    constructor(
        id: number = 0, 
        nome: string = '', 
        cpf: string = '', 
        numero: string = '', 
        funcao: number = 0, 
        status: Status = Status.INATIVO, 
        votosApurados: number = 0
    ) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.numero = numero;
        this.funcao = funcao;
        this.status = status;
        this.votosApurados = votosApurados;
    }
}

export enum Status {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO'
}
export interface Apuracao {
    totalVotos: number;
    candidatosPrefeito: Candidato[];
    candidatosVereador: Candidato[];
  }