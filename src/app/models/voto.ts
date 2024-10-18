import { Timestamp } from "rxjs";
import { Candidato } from "./candidato";

export class Voto {

    id!: number;
    dataHora!: Date;
    comprovante!: string;

    prefeito!: Candidato;
    vereador!: Candidato;

}
