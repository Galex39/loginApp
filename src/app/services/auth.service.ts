import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = 'https://identitytoolkit.googleapis.com/v1/';
  private apiKey:string = 'AIzaSyCZUZD48ozGVHvoOC4nYw1BHFk0Lgl1taU';
  private userToken:string;

  constructor(private http:HttpClient) {
    this.getToken();
  }

  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  newUser(user:UserModel){
    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    }

    return this.http.post(`${this.url}accounts:signUp?key=${this.apiKey}`,authData).pipe(map(response=>{
      this.saveToken(response['idToken']);
      return response;
    }));
  }
  logIn(user:UserModel){
    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}accounts:signInWithPassword?key=${this.apiKey}`,authData).pipe(map(response=>{
      this.saveToken(response['idToken']);
      return response;
    }));
  }

  logOut(){
    localStorage.removeItem('token');
  }

  private saveToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('token',idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira',hoy.getTime().toString());

  }

  private getToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }

    return this.userToken;
  }

  public isAutenticated(){

    if(this.userToken.length < 2){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
    
  }

}
