import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Eleitor } from '../../../models/eleitor';
import { EleitorService } from '../../../services/eleitor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eleitor-form',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './eleitor-form.component.html',
  styleUrl: './eleitor-form.component.scss'
})
export class EleitorFormComponent {

  eleitor: Eleitor = new Eleitor();

  eleitorService = inject(EleitorService);

  titleComponent = "Cadastro de Eleitores";

  router = inject(Router);

  activated = inject(ActivatedRoute);

  constructor(){
    this.eleitor.id = 0;

    let id = this.activated.snapshot.params['id'];

    if(id > 0){
      this.titleComponent = "Editar Eleitor";
      this.findById(id);
    }

  }
  findById(id : number){
    this.eleitorService.findById(id).subscribe({
      next: eleitor => {
        this.eleitor = eleitor;
      },
      error: erro => {
        alert("Erro");
      }
    });    
  }

  save(){
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
    this.eleitorService.save(this.eleitor).subscribe({
      next: msg => {
        this.router.navigate(["admin/eleitores"]).then(()=> {
          Toast.fire({
            icon: "success",
            title: msg
          });
        })
      },
      error: erro => {
        console.log("Erro completo:", erro);
        Toast.fire({
          icon: "error",
          title: "Erro"
        });
      }
    })
  }

  update(){

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
    this.eleitorService.update(this.eleitor, this.eleitor.id).subscribe({
      next: msg => {
        this.router.navigate(["admin/eleitores"]).then(()=> {
          Toast.fire({
            icon: "success",
            title: msg
          });
        })
      },
      error: erro => {
        console.log("Erro completo:", erro);
        Toast.fire({
          icon: "error",
          title: "Erro"
        });
      }
    })

  }


}
