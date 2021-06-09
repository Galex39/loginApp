import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public user:UserModel;
  recordarme:boolean = false;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() { 
    this.user = new UserModel();
  }

  onSubmit(form:NgForm){
    if(!form.valid){return;}
    
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.authService.newUser(this.user).subscribe(response => {
      Swal.close();
      if(this.recordarme){
        localStorage.setItem('email',this.user.email);
      }
      this.router.navigateByUrl('/home');
    },(err)=>{
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        text: 'Este email ya se encuentra en uso'
      });
    });
  }


}
