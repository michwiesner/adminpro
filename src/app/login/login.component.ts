import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {

  email: string;
  recuerdame = false;
  auth2: any;

  constructor(public router: Router, public _usuarioService: UsuarioService, private zone: NgZone) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '1045495545870-ausgoma6atuk8j6d8oruso7ds6tkf2l9.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      // const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle(token)
                          .subscribe( () =>
                            this.zone.run(() => {
                              this.router.navigate(['/dashboard']);
                            })
                          );
    });
  }

  ingresar( forma: NgForm ) {
    // this.router.navigate(['/dashboard']);
    if ( forma.invalid ) {
      return;
    }

    const usuario = new Usuario();
    usuario.email = forma.value.email;
    usuario.password = forma.value.password;

    this._usuarioService.login( usuario, forma.value.recuerdame )
                        .subscribe( resp => this.router.navigate(['/dashboard']));
  }

}
