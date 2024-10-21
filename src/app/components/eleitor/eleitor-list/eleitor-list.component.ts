import { Component, inject } from '@angular/core';
import { Eleitor } from '../../../models/eleitor';
import { EleitorService } from '../../../services/eleitor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eleitor-list',
  standalone: true,
  imports: [],
  templateUrl: './eleitor-list.component.html',
  styleUrl: './eleitor-list.component.scss'
})
export class EleitorListComponent {

  eleitorService = inject(EleitorService);

  lista: Eleitor[] = [];

  constructor(){
    this.findAll();
  }

  findAll(){
    this.eleitorService.findAll().subscribe({
      next: eleitores =>{
        this.lista = eleitores;
      },
      error : erro =>{
        alert("Deu erro")
      }
    });

  }

  deleteById(eleitor: Eleitor){

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    this.eleitorService.delete(eleitor.id).subscribe({
      next: msg => {
        this.findAll();
        Toast.fire({
          icon: "info",
          title: "Eleitor desativado"
        });
      },
      error: erro =>{
        console.log("Erro completo:", erro);
        Toast.fire({
          icon: "error",
          title: "Erro"
        });
      }
    })

  }
}
