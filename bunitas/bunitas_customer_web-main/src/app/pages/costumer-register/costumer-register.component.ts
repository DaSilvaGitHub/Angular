import { Component, OnInit } from '@angular/core';
import { register } from 'src/app/interfaces/register';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-costumer-register',
  templateUrl: './costumer-register.component.html',
  styleUrls: ['./costumer-register.component.scss'],
})
export class CostumerRegisterComponent implements OnInit {
  passwordIsEqual: boolean = true;
  confirmPassword: string = '';
  autocompleteLocationItems: any = [];
  registerType = 0;
  isLogin = false;
  otpId: any;
  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;

  registerForm: register = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    dob: '',
    gender: '1',
    mobile: '',
    location: '',
    fcm_token: '',
    type: '',
    lat: '',
    lng: '',
    cover: '',
    status: '',
    verified: '',
    others: '',
    date: '',
    stripe_key: '',
    referral: '',
    cc: this.api.default_country_code,
    checkTermsAndCondition: false,
    checkAge: false,
    checkUpdate: false,
  };

  constructor(public api: ApiService, public util: UtilService) {}

  ngOnInit(): void {
    setTimeout(() => {
      firebase.default.initializeApp(environment.firebase);

      this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier(
        'sign-in-button',
        {
          size: 'invisible',
          callback: (response) => {},
          'expired-callback': () => {},
        }
      );
    }, 5000);
  }

  onSearchChange(event) {
    if (this.registerForm.location == '') {
      this.autocompleteLocationItems = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.util.GoogleAutocomplete.getPlacePredictions(
      { input: this.registerForm.location },
      (predictions, status) => {
        if (predictions && predictions.length > 0) {
          this.autocompleteLocationItems = predictions;
        }
      }
    );
  }

  selectSearchResult1(item) {
    this.autocompleteLocationItems = [];
    this.registerForm.location = item.description;
  }

  onRegister(registerType) {
    this.registerType = registerType;
    if (
      this.registerType == 0 &&
      this.registerForm.checkTermsAndCondition &&
      this.registerForm.checkAge &&
      this.registerForm.email &&
      this.registerForm.password &&
      this.registerForm.first_name &&
      this.registerForm.last_name &&
      this.registerForm.mobile &&
      this.registerForm.cc &&
      this.registerForm.dob &&
      this.registerForm.location
    ) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      const email = this.registerForm.email;

      const mobileIndex = this.registerForm.mobile.includes('+') ? 3 : 2;
      const mobile = this.registerForm.mobile.slice(mobileIndex);
      const cc = this.registerForm.mobile.slice(0, mobileIndex);
      this.registerForm.cc = cc;

      const dob = this.registerForm.dob;

      if (!emailfilter.test(email)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      }
      const dobDate = new Date(dob); // Convert the string value to a Date object
      const dobYear = dobDate.getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - dobYear < 18) {
        this.util.errorMessage(
          this.util.translate('Year of DOB must be greater than 18')
        );
        return false;
      }
      // this.verifyRegisterFirebaseOTP();
      if (this.util.user_verify_with == 1) {
        const param = {
          email: email,
          subject: this.util.translate('Verification'),
          header_text: this.util.translate('Use this code for verification'),
          thank_you_text: this.util.translate(
            "Don't share this otp to anybody else"
          ),
          mediaURL: this.api.baseUrl,
          country_code: '+' + cc,
          mobile: mobile,
        };
        this.isLogin = true;
        this.api
          .post('v1/sendVerificationOnMail', param)
          .then(
            (data: any) => {
              this.isLogin = false;
              if (data && data.status == 200) {
                this.util.publishModalPopup('OTP');
                this.otpId = data.otp_id;
              } else if (data && data.status == 401) {
                this.isLogin = false;
                this.util.errorMessage(data.error.error);
              } else if (data && data.status == 500) {
                this.isLogin = false;
                this.util.errorMessage(data.message);
              } else {
                this.isLogin = false;
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            },
            (error) => {
              this.isLogin = false;
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          )
          .catch((error) => {
            this.isLogin = false;
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });
      } else {
        if (this.util.sms_name == '2') {
          const param = {
            country_code: '+' + cc,
            mobile: mobile,
            email: email,
          };
          this.api
            .post('v1/auth/verifyPhoneForFirebaseRegistrations', param)
            .then(
              (data: any) => {
                if (data && data.status == 200) {
                  this.api
                    .signInWithPhoneNumber(
                      this.recaptchaVerifier,
                      '+' + cc + mobile
                    )
                    .then((success) => {
                      this.isLogin = false;
                      this.util.publishModalPopup('OTP');
                    })
                    .catch((error) => {
                      this.isLogin = false;
                      this.util.errorMessage(error);
                    });
                } else if (data && data.status == 401) {
                  this.isLogin = false;
                  this.util.errorMessage(data.error.error);
                } else if (data && data.status == 500) {
                  this.isLogin = false;
                  this.util.errorMessage(data.message);
                } else {
                  this.isLogin = false;
                  this.util.errorMessage(
                    this.util.translate('Something went wrong')
                  );
                }
              },
              (error) => {
                this.isLogin = false;
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            )
            .catch((error) => {
              this.isLogin = false;
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            });
        } else {
          this.isLogin = true;
          const param = {
            country_code: '+' + cc,
            mobile: mobile,
            email: email,
          };
          this.api
            .post('v1/verifyPhoneSignup', param)
            .then(
              (data: any) => {
                this.isLogin = false;
                if (data && data.status == 200) {
                  this.util.publishModalPopup('verifyModal');
                  this.otpId = data.otp_id;
                } else if (data && data.status == 401) {
                  this.isLogin = false;
                  this.util.errorMessage(data.error.error);
                } else if (data && data.status == 500) {
                  this.isLogin = false;
                  this.util.errorMessage(data.message);
                } else {
                  this.isLogin = false;
                  this.util.errorMessage(
                    this.util.translate('Something went wrong')
                  );
                }
              },
              (error) => {
                this.isLogin = false;
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            )
            .catch((error) => {
              this.isLogin = false;
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            });
        }
      }
    } else {
      this.util.errorMessage('All fields are required');
    }
  }
}
