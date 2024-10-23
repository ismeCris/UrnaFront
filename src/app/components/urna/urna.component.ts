import { Component, ErrorHandler, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Eleitor } from '../../models/eleitor';
import { EleitorService } from '../../services/eleitor.service';
import Swal from 'sweetalert2';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { UrnaService } from '../../services/urna.service';
import { Voto } from '../../models/voto';
import { Candidato } from '../../models/candidato';
import { CandidatoService } from '../../services/candidato.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-urna',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './urna.component.html',
  styleUrl: './urna.component.scss',
})
export class UrnaComponent {
  router = inject(Router);

  eleitor!: Eleitor;

  eleitorService = inject(EleitorService);

  candidatoService = inject(CandidatoService);

  urnaService = inject(UrnaService);

  voto: Voto = new Voto();

  candidatoPrefeito!: Candidato;
  candidatoVereador!: Candidato;

  cpf!: string;

  inputValue: string = '';

  candidatoEncontrado: boolean = false;
  nomeCandidato!: string;

  hash!: string;

  document: Document = inject(DOCUMENT);

  constructor() {
    this.document.addEventListener('keydown', (event: KeyboardEvent) =>
      this.addKeyBoardNumber(event)
    );
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
  
  findEleitorByCpf() {
    this.eleitorService.findByCpf(this.cpf).subscribe({
      next: (eleitor) => {
        if (eleitor.status == 'APTO' || eleitor.status == 'PENDENTE') {
          this.eleitor = eleitor;
          this.showSuccessToast('Eleitor encontrado!');
        } else {
          this.showErrorToast('Status do Eleitor: ' + eleitor.status);
        }
      },
      error: (erro) => {
        if (erro.status == 404) {
          this.showErrorToast('Eleitor não encontrado.');
        } else {
          this.showErrorToast('Um erro inesperado aconteceu.');
        }
      },
    });
  }

  addKeyBoardNumber(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'Backspace') {
      this.backspace();
    } else if (/^\d$/.test(key)) {
      this.addNumber(parseInt(key));
    }
  }

  addNumber(num: number) {
    if (this.eleitor != null) {
      if (this.voto.prefeito == null) {
        if (this.inputValue.length < 2) {
          this.inputValue += num;
        }
        if (this.inputValue.length == 2) {
          this.verificaPrefeito();
        }
      } else {
        if (this.inputValue.length < 5) {
          this.inputValue += num;
        }
        if (this.inputValue.length == 5) {
          this.verificaVereador();
        }
      }
    }
  }

  backspace() {
    if (this.inputValue.length > 0) {
      this.inputValue = this.inputValue.slice(0, -1);
      this.nomeCandidato = '';
      this.candidatoEncontrado = false;
    }
  }

  verificaPrefeito() {
    if (this.inputValue.length == 2) {
      this.candidatoService.findCandidatoByNumero(this.inputValue).subscribe({
        next: (candidato) => {
          this.candidatoPrefeito = candidato;
          this.candidatoEncontrado = true;
          this.nomeCandidato = this.candidatoPrefeito.nome;
        },
        error: (erro) => {
          this.nomeCandidato = 'Candidato não encontrado';
          this.candidatoEncontrado = false;
        },
      });
    }
  }

  verificaVereador() {
    if (this.inputValue.length == 5) {
      this.candidatoService.findCandidatoByNumero(this.inputValue).subscribe({
        next: (candidato) => {
          this.candidatoVereador = candidato;
          this.candidatoEncontrado = true;
          this.nomeCandidato = this.candidatoVereador.nome;
        },
        error: (erro) => {
          this.nomeCandidato = 'Candidato não encontrado';
        },
      });
    }
  }

  confirmarVoto() {
    if (!this.voto.prefeito) {
      this.showConffirmMessage(this.candidatoPrefeito, "prefeito");
    } else {
      this.showConffirmMessage(this.candidatoVereador, "vereador");
    }
  }

  validarCandidato(candidato: Candidato, cargo: string) {
    const cargoFuncao = cargo === 'prefeito' ? 1 : 2;
    return candidato.funcao === cargoFuncao && candidato.status === 'ATIVO';
  }

  registrarPrefeito() {
    this.voto.prefeito = this.candidatoPrefeito;
    this.showSuccessToast('Voto para prefeito registrado!');
    this.resetCampos();
  }
  registrarVereador() {
    this.voto.vereador = this.candidatoVereador;
    this.showSuccessToast('Voto para vereador registrado!');
    this.resetCampos();
    this.salvarVoto();
  }

  showConffirmMessage(candidato: Candidato, cargo: string) {
    if (this.validarCandidato(candidato, cargo)) {
      Swal.fire({
        title: `Deseja confirmar seu voto em ${this.nomeCandidato} como ${cargo}?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      }).then((result) => {
        if (result.isConfirmed) {
          if (candidato.funcao == 1) {
            this.registrarPrefeito();
          } else {
            this.registrarVereador();
          }
        }
      });
    } else {
      this.showErrorToast('Candidato inválido');
      this.resetCampos();
    }
  }

  salvarVoto() {
    this.urnaService.votar(this.voto, this.eleitor.id).subscribe({
      next: (hash) => {
        this.hash = hash;
        Swal.fire({
          title: 'Comprovante de votação: ' + hash,
          icon: 'success',
        }).then(() => {
          this.router.navigate(['admin/dashboard']);
        });
      },
      error: (erro) => {
        Swal.fire({
          title: erro.error,
          icon: 'error',
        }).then(() => {
          this.router.navigate(['admin/dashboard']);
        });
      },
    });
  }

  resetCampos() {
    this.candidatoEncontrado = false;
    this.nomeCandidato = '';
    this.inputValue = '';
  }
}
