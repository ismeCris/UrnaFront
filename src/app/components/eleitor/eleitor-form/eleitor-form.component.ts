import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Eleitor } from '../../../models/eleitor';
import { EleitorService } from '../../../services/eleitor.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-eleitor-form',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './eleitor-form.component.html',
  styleUrl: './eleitor-form.component.scss',
})
export class EleitorFormComponent {
  eleitor: Eleitor = new Eleitor();

  eleitorService = inject(EleitorService);

  titleComponent = 'Cadastro de Eleitores';

  router = inject(Router);

  activated = inject(ActivatedRoute);

  constructor() {
    this.eleitor.id = 0;

    let id = this.activated.snapshot.params['id'];

    if (id > 0) {
      this.titleComponent = 'Editar Eleitor';
      this.findById(id);
    }
  }
  findById(id: number) {
    this.eleitorService.findById(id).subscribe({
      next: (eleitor) => {
        this.eleitor = eleitor;
      },
      error: (erro) => {
        if (erro.status == 404) {
          this.showErrorToast('Eleitor não encontrado');
        } else {
          this.showErrorToast('Ocorreu um erro inesperado.');
        }
      },
    });
  }

  save() {
    this.eleitorService.save(this.eleitor).subscribe({
      next: (msg) => {
        this.router.navigate(['admin/eleitores']).then(() => {
          this.showSuccessToast(msg);
        });
      },
      error: (erro) => {
        console.log('Erro completo:', erro);
        this.lidarErroSalvamento(erro);
      },
    });
  }

  update() {
    this.eleitorService.update(this.eleitor, this.eleitor.id).subscribe({
      next: (msg) => {
        this.router.navigate(['admin/eleitores']).then(() => {
          this.showSuccessToast(msg);
        });
      },
      error: (erro) => {
        console.log('Erro:', erro);
        this.lidarErroSalvamento(erro);
      },
    });
  }
  
  lidarErroSalvamento(erro: any) {
    console.log('Erro recebido do backend:', erro);
    let mensagemErro = '';

    if (erro.error) {

      if (erro.error.includes('Duplicate')) {
        mensagemErro = this.extractDuplicateEntryMessage(erro.error);
      }
      else if (erro.error.includes('Validation failed')) {
        mensagemErro = this.extractValidationMessages(erro.error);
      } else {
        mensagemErro = 'Erro ao salvar eleitor: ' + erro.error;
      }

    } 
    else if (erro.message) {
      mensagemErro = erro.message;
    }
    // Mensagem padrão se nenhuma outra for encontrada
    else {
      mensagemErro = 'Erro ao salvar eleitor';
    }
    console.log(mensagemErro);
    this.showErrorToast(mensagemErro);
  }

  private extractValidationMessages(error: string): string {
    const regex = /interpolatedMessage='([^']+)'/g;
    const matches = [...error.matchAll(regex)];

    const messages = matches.map((match) => match[1]);
    return messages.length > 0
      ? messages.join(', ')
      : 'Erro de validação desconhecido.';
  }

  private extractDuplicateEntryMessage(error: string): string {
    const duplicateEntryMatch = error.match(
      /Duplicate entry '([^']+)' for key/
    );
    if (duplicateEntryMatch) {
      return `O CPF ${duplicateEntryMatch[1]} já está cadastrado.`;
    }
    return 'Erro ao acessar o banco de dados.';
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
