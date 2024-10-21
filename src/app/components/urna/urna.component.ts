import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-urna',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './urna.component.html',
  styleUrl: './urna.component.scss'
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
  
  inputValue: string = "";

  candidatoEncontrado: boolean = false;
  nomeCandidato!: string;

  hash!: string;

  document: Document = inject(DOCUMENT);

  constructor() {
    // Adiciona o listener para capturar teclas pressionadas
    this.document.addEventListener('keydown', (event: KeyboardEvent) => this.addKeyBoardNumber(event));
  }

  
  findEleitorByCpf(){
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

    this.eleitorService.findByCpf(this.cpf).subscribe({
      next: eleitor => {
        this.eleitor = eleitor;
      },
      error: erro => {
        console.log(erro);
        Toast.fire({
          icon: "error",
          title: "Erro"
        });
      }
    });
  }
  
  addKeyBoardNumber(event: KeyboardEvent){
      const key = event.key;

      console.log(key)
      if (key === 'Backspace') {
        this.backspace();
      } else if (/^\d$/.test(key)) {
        this.addNumber(parseInt(key));
      }
  }

  addNumber(num : number){
    if(this.eleitor != null){
      if(this.voto.prefeito == null ){
        if(this.inputValue.length < 2){
          this.inputValue += num;
        }
        if(this.inputValue.length == 2){
          this.verificaPrefeito();
        }
      }else{
        if(this.inputValue.length < 5){
          this.inputValue += num;
        }
        if(this.inputValue.length == 5){
          this.verificaVereador();
        }
  
      }
    }
  }

  backspace(){
    if(this.inputValue.length > 0){
      this.inputValue = this.inputValue.slice(0, -1);
      this.nomeCandidato = "";
    }
  }

  verificaPrefeito(){
    if(this.inputValue.length == 2){
      this.candidatoService.findCandidatoByNumero(this.inputValue).subscribe({
        next: candidato => {
          this.candidatoPrefeito = candidato;
          this.candidatoEncontrado = true;
          this.nomeCandidato = this.candidatoPrefeito.nome;
        },
        error: erro => {
          console.log(erro);
          this.nomeCandidato = "Candidato não encontrado";
        }
      });
    }
  }

  verificaVereador(){
    if(this.inputValue.length == 5){
      this.candidatoService.findCandidatoByNumero(this.inputValue).subscribe({
        next: candidato => {
          this.candidatoVereador = candidato;
          this.candidatoEncontrado = true
          this.nomeCandidato = this.candidatoVereador.nome;
        },
        error: erro => {
          console.log(erro);
          this.nomeCandidato = "Candidato não encontrado";
        }
      });
    }
  }

  confirmarVoto(){

    if(this.voto.prefeito == null){
      Swal.fire({
        title: "Deseja confirmar seu voto em " +this.nomeCandidato+ " como prefeito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      }).then((result) => {
        if (result.isConfirmed) {
          if(this.candidatoPrefeito.funcao == 1 && this.candidatoPrefeito.status == "ATIVO"){
            this.voto.prefeito = this.candidatoPrefeito;
            this.candidatoEncontrado = false;
            this.nomeCandidato = "";
            this.inputValue = "";
            console.log(this.voto);
          }else{
            alert("erro");
          }
        }
      });
    }else{
      if(this.candidatoVereador.funcao == 2 && this.candidatoVereador.status == "ATIVO"){
        Swal.fire({
          title: "Deseja confirmar seu voto em " +this.nomeCandidato+ " como vereador?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sim",
          cancelButtonText: "Não"
        }).then((result) => {
          if (result.isConfirmed) {
            this.voto.vereador = this.candidatoVereador;
            this.urnaService.votar(this.voto, this.eleitor.id).subscribe({
              next: hash =>{
                this.hash = hash;

                Swal.fire({
                  title: "Hash: "+ hash,
                  icon: "success"}).then(()=>{
                    this.router.navigate(["admin/dashboard"]);
                  })
              },
              error: erro => {
                Swal.fire({
                  title: "Erro",
                  icon: "success"}).then(()=>{
                    this.router.navigate(["admin/dashboard"]);
                  })
                console.log(erro);
              }
            });    
          }
        });
      }else{
        if(this.candidatoVereador.funcao != 2){
          alert("Não é candidato a vereador");
        }
        if(this.candidatoVereador.status != "ATIVO"){
          alert("Candidato inativo");
        }
      }

    }

  }

}
