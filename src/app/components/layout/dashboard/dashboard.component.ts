import { Component, inject } from '@angular/core';
import { CandidatoService } from '../../../services/candidato.service'; 
import { Candidato } from '../../../models/candidato'; 
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  candidatosPrefeito: Candidato[] = [];
  candidatosVereador: Candidato[] = [];

  candidatoService = inject(CandidatoService); 

  constructor() {
    this.getCandidatosAtivos(); 
  }

  getCandidatosAtivos(): void {
    // Obter candidatos a prefeito ativos
    this.candidatoService.getPrefeitosAtivos().subscribe({
      next: (candidatos) => this.candidatosPrefeito = candidatos,
      error: (err) => {
        console.error('Erro ao buscar candidatos a prefeito', err);
        Swal.fire('Erro', 'Não foi possível buscar candidatos a prefeito', 'error'); 
      }
    });

    // Obter candidatos a vereador ativos
    this.candidatoService.getVereadoresAtivos().subscribe({
      next: (candidatos) => this.candidatosVereador = candidatos,
      error: (err) => {
        console.error('Erro ao buscar candidatos a vereador', err);
        Swal.fire('Erro', 'Não foi possível buscar candidatos a vereador', 'error'); 
      }
    });
  }

  deleteCandidato(id: number): void {
    Swal.fire({
      title: "Tem certeza que deseja deletar este candidato?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidatoService.delete(id).subscribe({
          next: (mensagem) => {
            console.log(mensagem);
            this.getCandidatosAtivos(); 
            Swal.fire('Sucesso', 'Candidato deletado com sucesso', 'success'); 
          },
          error: (err) => {
            console.error('Erro ao deletar candidato', err);
            Swal.fire('Erro', 'Não foi possível deletar o candidato', 'error'); 
          }
        });
      }
    });
  }
}
