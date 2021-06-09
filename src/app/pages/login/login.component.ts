import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validation:UserModel;
  recordarme:boolean = false;

  constructor(private authService:AuthService, private router:Router) {
    this.validation = new UserModel;
  }

  ngOnInit() {
    if(localStorage.getItem('email')){
      this.validation.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }

  login( form:NgForm){
    if(!form.valid){return;}
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.authService.logIn(this.validation).subscribe(response =>{
      Swal.close();

      if(this.recordarme){
        localStorage.setItem('email',this.validation.email);
      }

      this.router.navigateByUrl('/home');
    },(err)=>{
      let message;
      err.error.error.message === 'INVALID_PASSWORD' ? message = 'Contraseña incorrecta' : message = 'El email no corresponde al de un usuario activo' 
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        text: message
      });
    });
  }

  
}
