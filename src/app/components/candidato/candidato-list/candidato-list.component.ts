import { Component, inject } from '@angular/core';
import { Candidato } from '../../../models/candidato';
import Swal from 'sweetalert2';
import { CandidatoService } from '../../../services/candidato.service';

@Component({
  selector: 'app-candidato-list',
  standalone: true,
  templateUrl: './candidato-list.component.html',
  styleUrls: ['./candidato-list.component.scss']
})
export class CandidatoListComponent {
  lista: Candidato[] = []; 
  candidatoService = inject(CandidatoService);

  constructor() {
    this.findAll();
  }

  findAll() {
    this.candidatoService.findAll().subscribe({
      next: list => {
        this.lista = list; 
      },
      error: erro =>{
        alert('Deu erro');
      }

    });
  }
  deleteById(candidato: Candidato) {
    Swal.fire({
        title: "Tem certeza que deseja desativar o candidato " + candidato.nome + "?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            this.candidatoService.delete(candidato.id).subscribe({
                next: (response: string) => {
                    Swal.fire({
                        title: "Sucesso!",
                        text: response, 
                        icon: "success"
                    });
                    const index = this.lista.findIndex(c => c.id === candidato.id);
                    if (index !== -1) {
                        this.lista.splice(index, 1); 
                    }
                },
                error: (erro) => {
                    console.error('Erro ao desativar candidato:', erro);
                    Swal.fire({
                        title: "Erro!",
                        text: erro.error?.message || "Não foi possível desativar o candidato.",
                        icon: "error"
                    });
                }
            });
        }
    });
}




  
}
