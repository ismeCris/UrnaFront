import { Component, inject } from '@angular/core';
import { ApuracaoService } from '../../services/apuracao.service';
import { CandidatoService } from '../../services/candidato.service';
import { Apuracao } from '../../models/apuracao';
import { Candidato } from '../../models/candidato';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apuracao',
  standalone: true,
  templateUrl: './apuracao.component.html',
  styleUrls: ['./apuracao.component.scss']
})
export class ApuracaoComponent {
  apuracao!: Apuracao; 
  candidatosPrefeito: Candidato[] = [];
  candidatosVereador: Candidato[] = [];
  
  router = inject(Router);
  rotaAtivada = inject(ActivatedRoute);
  apuracaoService = inject(ApuracaoService); 
  candidatoService = inject(CandidatoService);

  constructor() {
    this.getApuracao(); 
  }

  getApuracao(): void {
    // Obter apuração
    this.apuracaoService.getApuracao().subscribe({
      next: (data: Apuracao) => {
        this.apuracao = data;
       
        this.candidatosPrefeito = this.apuracao.candidatosPrefeito || [];
        this.candidatosVereador = this.apuracao.candidatosVereador || []; 
      },
      error: (err) => {
        console.error('Erro ao buscar dados da apuração:', err);
        Swal.fire('Erro', 'Não foi possível buscar dados da apuração', 'error');
      }
    });

    // Obter candidatos a prefeito ativos
    this.candidatoService.getPrefeitosAtivos().subscribe({
      next: (candidatos) => {
        this.candidatosPrefeito = candidatos;
      },
      error: (err) => {
        console.error('Erro ao buscar candidatos a prefeito', err);
        Swal.fire('Erro', 'Não foi possível buscar candidatos a prefeito', 'error');
      }
    });

    // Obter candidatos a vereador ativos
    this.candidatoService.getVereadoresAtivos().subscribe({
      next: (candidatos) => {
        this.candidatosVereador = candidatos;
      },
      error: (err) => {
        console.error('Erro ao buscar candidatos a vereador', err);
        Swal.fire('Erro', 'Não foi possível buscar candidatos a vereador', 'error');
      }
    });
  }
}
