import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Candidato } from '../../../models/candidato';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CandidatoService } from '../../../services/candidato.service';

@Component({
  selector: 'app-candidato-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './candidato-form.component.html',
  styleUrl: './candidato-form.component.scss' 
})

export class CandidatoFormComponent {
  tituloComponente: string = "Novo Candidato";
  candidato: Candidato = new Candidato(0, '', '', '', 0); 
  router = inject(Router);
  rotaAtivada = inject(ActivatedRoute);
  candidatosService = inject(CandidatoService);

  constructor() {
    let id = this.rotaAtivada.snapshot.params['id'];
    if (id > 0) {
      this.tituloComponente = "Editar Candidato";
      this.findById(id);
    }
  }

  findById(id: number) {
    this.candidatosService.findById(id).subscribe({
      next: cand => {
        this.candidato = cand;
      },
      error: erro => {
        this.showErrorAlert('Erro ao carregar candidato');
      }
    });
  }
  validateCandidato(): boolean {
    if (!this.candidato.nome) {
        this.showErrorAlert('Nome não pode ser nulo');
        return false;
    }

    if (!this.candidato.cpf) {
        this.showErrorAlert('CPF não pode ser nulo');
        return false;
    }

    // Remover pontos e hífens do CPF para a validação
    const cpfLimpo = this.candidato.cpf.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos

    if (cpfLimpo.length !== 11) {
        this.showErrorAlert('CPF inválido. O CPF deve conter 11 dígitos.');
        return false;
    }

    if (!this.candidato.numero) {
        this.showErrorAlert('Número não pode ser nulo');
        return false;
    }

  
    if (this.candidato.funcao !== 1 && this.candidato.funcao !== 2) {
        this.showErrorAlert('A função deve ser 1 para prefeito ou 2 para vereador');
        return false;
    }

    const numeroString = this.candidato.numero.toString().trim();

    if (this.candidato.funcao === 1 && numeroString.length !== 2) {
        this.showErrorAlert('O número do candidato a prefeito deve ter exatamente 2 caracteres.');
        return false;
    }

    if (this.candidato.funcao === 2 && numeroString.length !== 5) {
        this.showErrorAlert('O número do candidato a vereador deve ter exatamente 5 caracteres.');
        return false;
    }

    return true;
}



save() {
  if (!this.validateCandidato()) {
      return; 
  }

  this.candidatosService.save(this.candidato).subscribe({
      next: mensagem => {
          Swal.fire({
              title: mensagem,  
              icon: "success"
          }).then(() => {
              this.router.navigate(['admin/candidatos']);
          });
      },
      error: erro => {
          this.lidarErroSalvamento(erro); 
      }
  });
}
  update() {
    if (!this.validateCandidato()) {
      return; 
    }

    this.candidatosService.update(this.candidato).subscribe({
      next: mensagem => {
        Swal.fire({
          title: mensagem,
          icon: "success"
        }).then(() => {
          this.router.navigate(['admin/candidatos']);
        });
      },
      error: erro => {
        this.lidarErroSalvamento(erro);
      }
    });
  }

  lidarErroSalvamento(erro: any) {
    console.log('Erro recebido do backend:', erro);

    let mensagemErro = '';

    // Verifica a estrutura do erro e tenta acessar a mensagem correta
    if (erro.error) {
        mensagemErro = erro.error;  // Captura a mensagem de erro retornada pelo backend
    } else if (erro.message) {
        mensagemErro = erro.message;  // Outra tentativa para capturar a mensagem
    } else {
        mensagemErro = 'Erro ao salvar candidato';  // Mensagem padrão se nenhuma das estruturas anteriores for encontrada
    }

    // Exibe a mensagem de erro no SweetAlert
    Swal.fire({
        title: 'Erro',
        text: mensagemErro,
        icon: 'error'
    });
}



  showErrorAlert(message: string) {
    Swal.fire({
      title: message,
      icon: "error"
    });
  }
}
