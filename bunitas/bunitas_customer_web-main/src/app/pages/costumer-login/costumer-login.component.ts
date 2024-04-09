import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-costumer-login',
  templateUrl: './costumer-login.component.html',
  styleUrls: ['./costumer-login.component.scss'],
})
export class CostumerLoginComponent implements OnInit {
  passwordHided: boolean = true;
  username: string = '';
  password: string = '';
  isDisable: boolean = false;

  constructor(
    public util: UtilService,
    public api: ApiService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  loginWithGoogle() {}

  loginWithTwitter() {}

  setPasswordHided() {
    this.passwordHided = !this.passwordHided;
  }

  signIn() {
    this.isDisable = true;
    this.util.start();

    if (this.username.includes('@') && this.username && this.password) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      /*     if (!emailfilter.test(this.password)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      } */

      const login = {
        email: this.username,
        password: this.password,
      };
      this.api
        .post('v1/auth/login', login)
        .then(
          (data: any) => {
            if (data && data.status == 200) {
              if (data && data.user && data.user.type == 'user') {
                if (data && data.user && data.user.status == 1) {
                  localStorage.setItem('uid', data.user.id);
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('firstName', data.user.first_name);
                  localStorage.setItem('lastName', data.user.last_name);
                  localStorage.setItem('email', data.user.email);
                  localStorage.setItem('mobile', data.user.mobile);
                  this.util.userInfo = data.user;
                  this.util.successMessage('Login Successful');
                  this.util.stop();
                  this.util.commingsoon = false;
                  this.router.navigate(['home']);
                  console.log(this.util.commingsoon);
                } else {
                  Swal.fire({
                    title: this.util.translate('Error'),
                    text: this.util.translate(
                      'Your are blocked please contact administrator'
                    ),
                    icon: 'error',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: this.util.translate('OK'),
                    backdrop: false,
                    background: 'white',
                  }).then((status) => {});
                  this.util.stop();
                }
              } else {
                this.util.stop();
                this.util.errorMessage(this.util.translate('Not valid user'));
              }
            } else if (data && data.status == 401) {
              this.util.stop();
              this.util.errorMessage(data.error.error);
            } else {
              this.util.stop();
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          },
          (error) => {
            this.util.stop();
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        )
        .catch((error) => {
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
      this.util.stop();
      this.util.commingsoon = true;
    } else {
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }
  }
}
