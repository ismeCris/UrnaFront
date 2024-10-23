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
    this.eleitorService.findAll().subscribe({
      next: eleitores =>{
        this.lista = eleitores;
      },
      error : erro =>{
        this.showErrorToast(erro.error)
      }
    });

  }

  deleteById(eleitor: Eleitor){
    console.log(eleitor);
    this.eleitorService.delete(eleitor.id).subscribe({
      next: msg => {
        this.findAll();
        this.showSuccessToast(msg)
      },
      error: erro =>{
        console.log("Erro completo:", erro);
       this.showErrorToast(erro.error)
      }
    })

  }

  showErrorToast(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: 'error',
      title: message,
    });
  }

  showSuccessToast(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: 'success',
      title: message,
    });
  }
}
