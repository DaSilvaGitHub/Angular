/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationExtras,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { ModalDirective } from 'angular-bootstrap-md';
import { login } from './interfaces/login';
import { mobile } from './interfaces/mobile';
import { mobileLogin } from './interfaces/mobileLogin';
import { register } from './interfaces/register';
import { registerPartner } from './interfaces/registerPartner';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';
import * as firebase from 'firebase';
import { ProductCartService } from './services/product-cart.service';
import { ServiceCartService } from './services/service-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('verifyModal', { static: false })
  public verifyModal: ModalDirective;
  @ViewChild('registerModal', { static: false })
  public registerModal: ModalDirective;
  @ViewChild('registerPartnerModal', { static: false })
  public registerPartnerModal: ModalDirective;
  @ViewChild('loginModal', { static: false }) public loginModal: ModalDirective;
  @ViewChild('otpModal', { static: false }) public otpModal: ModalDirective;
  @ViewChild('locationModal', { static: false })
  public locationModal: ModalDirective;
  @ViewChild('forgotPwd', { static: false }) public forgotPwd: ModalDirective;
  @ViewChild('sideMenu', { static: false }) public sideMenu: ModalDirective;
  @ViewChild('basicModal', { static: false }) public basicModal: ModalDirective;
  @ViewChild('scrollMe', { static: false }) private scrollMe: ElementRef;
  @ViewChild('topScrollAnchor', { static: false }) topScroll: ElementRef;
  @ViewChild('firebaseOTP') public firebaseOTP: ModalDirective;
  @ViewChild('firebaseOTPRegister') public firebaseOTPRegister: ModalDirective;

  login: login = { email: '', password: '' };
  mobile: mobile = {
    ccCode: this.api.default_country_code,
    phone: '',
    password: '',
  };
  mobileLogin: mobileLogin = {
    ccCode: this.api.default_country_code,
    phone: '',
  };
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

  registerPartnerForm: registerPartner = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    dob: '',
    gender: '1',
    mobile: '',
    cid: '',
    fcm_token: '',
    type: -1,
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
    idCard: '',
    qualification: '',
    salon_name: '',
    fee_start: 0,
    about: '',
    category: [],
    address: '',
    zipcode: '',
  };

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: false,
  };

  registerType: number;
  viewAcc = false;
  autocomplete1: string;
  autocompleteLocationItems: any = [];
  submitted = false;
  partnerSubmitted = false;
  ccCode: any;
  userCode: any = '';
  resendCode: boolean;
  otpId: any;
  uid: any;

  firebaseOTPText: any = '';

  languageClicked: boolean = false;
  title = 'Bunitas - Book Salon and Mobile Beautician';
  loaded: boolean;
  loading = true;
  loadingWidth: any = 70;
  deviceType = 'desktop';
  innerHeight: string;
  windowWidth: number;

  verticalNavType = 'expanded';
  verticalEffect = 'shrink';
  isLogin: boolean = false;

  div_type;
  sent: boolean;
  reset_email: any;
  reset_otp: any;
  reset_myOPT: any;
  reset_verified: any;
  reset_userid: any;
  reset_password: any;
  reset_repass: any;
  reset_loggedIn: boolean;
  reset_id: any;

  reset_phone: any;
  reset_cc: any = this.api.default_country_code;
  temp: any = '';
  name: any;
  msg: any = '';
  messages: any[] = [];
  uid_chat: any;
  id_chat: any;
  loaded_chat: boolean;
  yourMessage: boolean;
  interval: any;
  router$: Subscription;
  authToken: any;
  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  idCardTitle: any = 'Upload ID Card/Proof Address';
  qualificationTitle: any = 'Upload Beauty Certificate';

  currentPath: string | any = 'home';

  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private titleService: Title,
    private chmod: ChangeDetectorRef,
    private translate: TranslateService,
    public productCart: ProductCartService,
    public serviceCart: ServiceCartService,
    public activatedRoute: ActivatedRoute
  ) {
    let urlString = window.location.href;
    const url = new URL(urlString);
    const pathAndParams = url.pathname + url.search;
    console.log(pathAndParams);
    if (
      pathAndParams === '/' ||
      pathAndParams === '/comming' ||
      pathAndParams === '/costumer-login' ||
      pathAndParams == '/costumer-register'
    ) {
      this.util.commingsoon = true;
    } else if (pathAndParams === '/welcome') {
      this.util.commingsoon = false;
    }
    //   else {
    //   this.commingsoon = true;
    // }
    const lng = localStorage.getItem('selectedLanguage');
    if (!lng || lng == null) {
      localStorage.setItem('selectedLanguage', 'en');
      localStorage.setItem('direction', 'ltr');
    }

    // this.setDefaultLocationAsUk();

    this.translate.use(localStorage.getItem('selectedLanguage'));
    document.documentElement.dir = localStorage.getItem('direction');
    const selectedLanguages = this.util.allLanguages.filter(
      (x) => x.code == localStorage.getItem('selectedLanguage')
    );
    if (selectedLanguages && selectedLanguages.length) {
      this.util.savedLanguages = selectedLanguages[0].name;
    }
    this.div_type = 1;
    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributs(this.windowWidth);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        window.scrollTo(10, 10);
      });
    this.router.events.subscribe((e: any) => {
      this.navigationInterceptor(e);
    });
    this.util.onSubscribe().subscribe(() => {
      this.loginModal.show();
    });
    this.resendCode = false;
    this.autocomplete1 = '';
    this.autocompleteLocationItems = [];
    this.util.subscribeAddressPopup().subscribe(() => {
      this.locationModal.show();
    });
    this.util.subscribeModalPopup().subscribe((data: any) => {
      if (data && data == 'location') {
        this.locationModal.show();
      } else if (data && data == 'login') {
        /*      this.loginModal.show(); */
      } else if (data && data == 'verifyModal') {
        this.verifyModal.show();
      } else if (data && data == 'register') {
        this.registerModal.show();
      } else if (data && data == 'sideMenu') {
        this.sideMenu.show();
      } else if (data && data == 'registerJoin') {
        this.registerPartnerModal.show();
      } else if (data && data == 'OTP') this.firebaseOTP.show();
    });
    this.api
      .getLocalAssets('country.json')
      .then(
        (data: any) => {
          this.util.countrys = data;
        },
        (error) => {}
      )
      .catch((error) => {});
    this.initializeApp();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url.substring(1, event.url.length);
        console.log(this.currentPath);
      }
    });

    this.api
      .post_private('v1/favorite/getFavorite', {
        id: localStorage.getItem('uid'),
      })
      .then(
        (data: any) => {
          // this.salonList = data.salon;
          this.util.favoritesTreatments = data.treatments.map(
            (item) => item.id
          );
          this.util.favoriteProducts = data.product.map((item) => item.id);
          console.log(data);

          console.log({ products: data.product }, data.beauticiation);
        },
        (error) => {
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.util.apiErrorHandler(error);
      });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
      this.loaded = false;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
      this.loadingWidth = 99;
      this.loaded = true;
      window.scrollTo(0, 0);
      const data = this.getTitle(
        this.router.routerState,
        this.router.routerState.root
      );
      this.titleService.setTitle(
        data && data[0]
          ? this.util.translate(data[0]) + ' | ' + environment.app_name
          : this.util.translate('Home') + ' | ' + environment.app_name
      );
    }

    if (event instanceof NavigationCancel) {
      this.loading = false;
      this.loadingWidth = 99;
      this.loaded = true;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      this.loadingWidth = 99;
      this.loaded = true;
    }
  }

  getTitle(state: any, parent: any) {
    const data: any[] = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (
      this.deviceType == 'tablet' &&
      this.windowWidth >= 768 &&
      this.windowWidth <= 1024
    ) {
      reSizeFlag = false;
    } else if (this.deviceType == 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    this.util.deviceType = this.deviceType;
    if (reSizeFlag) {
      this.setMenuAttributs(this.windowWidth);
    }
  }

  setMenuAttributs(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
    this.util.deviceType = this.deviceType;
  }

  private smoothScrollTop(): void {
    this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private onRouteUpdated(event: any): void {
    if (event instanceof NavigationEnd) {
      this.smoothScrollTop();
    }
  }

  ngOnInit() {
    this.router$ = this.router.events.subscribe((next) =>
      this.onRouteUpdated(next)
    );
    const currentRoute = this.activatedRoute.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    console.log(currentRoute);

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

  initializeApp() {
    this.util.cityAddress = localStorage.getItem('address');
    this.api
      .get('v1/settings/getDefault')
      .then(
        (data: any) => {
          if (
            data &&
            data.status &&
            data.status == 200 &&
            data.data &&
            data.data.settings &&
            data.data.support &&
            data.data.cities
          ) {
            const settings = data.data.settings;
            const support = data.data.support;
            console.log({ settings });

            this.util.direction = settings.appDirection;
            this.util.allowDistance = settings.allowDistance;
            this.util.cside = settings.currencySide;
            this.util.currecny = settings.currencySymbol;
            this.util.logo = settings.logo;
            this.util.user_login = settings.user_login;
            this.util.sms_name = settings.sms_name;
            this.util.booking_fee = settings.booking_fee;
            this.util.deposit_now = settings.deposit_now;
            this.util.processing_fee = settings.processing_fee;
            this.api.default_country_code = settings.default_country_code;
            this.util.deliveryCharge = parseFloat(settings.delivery_charge);
            this.util.delivery = settings.delivery_type;
            this.productCart.serviceTax = parseFloat(settings.tax);
            this.serviceCart.serviceTax = parseFloat(settings.tax);
            this.productCart.orderTax = parseFloat(settings.tax);
            this.serviceCart.orderTax = parseFloat(settings.tax);
            document.documentElement.dir = this.util.direction;
            this.util.cities = data.data.cities;
            this.util.categories = data.data.categories;
            this.util.services = data.data.services;

            this.util.general = settings;
            if (
              ((x) => {
                try {
                  JSON.parse(x);
                  return true;
                } catch (e) {
                  return false;
                }
              })(settings.social)
            ) {
              const links = JSON.parse(settings.social);
              this.util.google_playstore = links.playstore;
              this.util.apple_appstore = links.appstore;

              this.util.facebook_link = links.facebook;
              this.util.instagram_link = links.instagram;
              this.util.twitter_link = links.twitter;
            }

            this.util.app_color = settings.app_color;
            this.util.user_verify_with = settings.user_verify_with;
          } else {
            this.util.direction = 'ltr';
            this.util.cside = 'right';
            this.util.currecny = '$';
            document.documentElement.dir = this.util.direction;
          }
        },
        (error) => {
          this.util.appClosed = false;
          this.util.direction = 'ltr';
          this.util.cside = 'right';
          this.util.currecny = '$';
          document.documentElement.dir = this.util.direction;
        }
      )
      .catch((error: any) => {
        this.util.appClosed = false;
        this.util.direction = 'ltr';
        this.util.cside = 'right';
        this.util.currecny = '$';
        document.documentElement.dir = this.util.direction;
      });

    const uid = localStorage.getItem('uid');
    if (uid && uid !== null && uid !== 'null') {
      this.api
        .post_private('v1/profile/getByID', { id: localStorage.getItem('uid') })
        .then(
          (data: any) => {
            if (
              data &&
              data.status &&
              data.status == 200 &&
              data.data &&
              data.data.type == 'user'
            ) {
              this.util.userInfo = data.data;
            }
          },
          (error) => {}
        );
    }
  }

  locate(modal) {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationModal.hide();
          this.getAddressOf(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          switch (error.code) {
            case 1:
              this.util.errorMessage(
                this.util.translate('Location Permission Denied')
              );
              break;
            case 2:
              this.util.errorMessage(
                this.util.translate('Position Unavailable')
              );
              break;
            case 3:
              this.util.errorMessage(
                this.util.translate('Failed to fetch location')
              );
              break;
          }
        }
      );
    }
  }

  onSearchChange(event) {
    if (this.autocomplete1 == '') {
      this.autocompleteLocationItems = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.util.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete1 },
      (predictions, status) => {
        if (predictions && predictions.length > 0) {
          this.autocompleteLocationItems = predictions;
        }
      }
    );
  }

  selectSearchResult1(item) {
    localStorage.setItem('addsSelected', 'true');
    this.autocompleteLocationItems = [];
    this.autocomplete1 = item.description;
    this.util.geocoder.geocode(
      { placeId: item.place_id },
      (results, status) => {
        if (status == 'OK' && results[0]) {
          localStorage.setItem('location', 'true');
          localStorage.setItem('lat', results[0].geometry.location.lat());
          localStorage.setItem('lng', results[0].geometry.location.lng());
          localStorage.setItem('address', this.autocomplete1);
          this.locationModal.hide();
          this.chmod.detectChanges();
          this.util.publishNewAddress();
          this.router.navigate(['']);
        }
      }
    );
  }

  /**
   * @author onetechwolf
   * @description set default location as UK
   */
  setDefaultLocationAsUk() {
    if (
      !localStorage.getItem('addsSelected') ||
      localStorage.getItem('addsSelected') == 'false'
    ) {
      localStorage.setItem('addsSelected', 'true');
      localStorage.setItem('location', 'true');
      localStorage.setItem('lat', '51.5072178');
      localStorage.setItem('lng', '-0.1275862');
      localStorage.setItem('address', 'London, UK');
    }
  }

  getAddressOf(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ location: location }, (results, status) => {
      if (results && results.length) {
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', lat);
        localStorage.setItem('address', results[0].formatted_address);
        localStorage.setItem('lng', lng);
        this.util.publishNewAddress();
        this.router.navigate(['home']);
      }
    });
  }

  loginWithEmailPassword(form: NgForm, modal) {
    this.submitted = true;
    if (form.valid && this.login.email && this.login.password) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      }

      this.isLogin = true;
      this.api
        .post('v1/auth/login', this.login)
        .then(
          (data: any) => {
            this.isLogin = false;
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
                  this.loginModal.hide();
                } else {
                  this.loginModal.hide();
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
                }
              } else {
                this.util.errorMessage(this.util.translate('Not valid user'));
              }
            } else if (data && data.status == 401) {
              this.util.errorMessage(data.error.error);
            } else {
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          },
          (error) => {
            this.isLogin = false;
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        )
        .catch((error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
    } else {
    }
  }

  onOtpChangeFirebase(event) {
    this.firebaseOTPText = event;
  }

  loginWithMobileAndPassword(form: NgForm, modal) {
    this.submitted = true;
    if (
      form.valid &&
      this.mobile.ccCode &&
      this.mobile.phone &&
      this.mobile.password
    ) {
      const param = {
        country_code: '+' + this.mobile.ccCode,
        mobile: this.mobile.phone,
        password: this.mobile.password,
      };
      this.isLogin = true;
      this.api
        .post('v1/auth/loginWithPhonePassword', param)
        .then(
          (data: any) => {
            this.isLogin = false;
            if (data && data.status == 200) {
              if (data && data.user && data.user.type == 1) {
                if (data && data.user && data.user.status == 1) {
                  localStorage.setItem('uid', data.user.id);
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('firstName', data.user.first_name);
                  localStorage.setItem('lastName', data.user.last_name);
                  localStorage.setItem('email', data.user.email);
                  localStorage.setItem('mobile', data.user.mobile);
                  this.mobile.phone = '';
                  this.mobile.password = '';
                  this.util.userInfo = data.user;
                  this.loginModal.hide();
                } else {
                  this.loginModal.hide();
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
                }
              } else {
                this.util.errorMessage(this.util.translate('Not valid user'));
              }
            } else if (data && data.status == 401) {
              this.util.errorMessage(data.error.error);
            } else {
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          },
          (error) => {
            this.isLogin = false;
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        )
        .catch((error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
    } else {
    }
  }

  otpLogin() {
    if (this.userCode == '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.otpId,
        otp: this.userCode,
      };
      this.isLogin = true;
      this.api.post('v1/otp/verifyOTP', param).then(
        (data: any) => {
          this.isLogin = false;
          if (data && data.status == 200) {
            const param = {
              mobile: this.mobileLogin.phone,
              country_code: '+' + this.mobileLogin.ccCode,
            };

            this.api
              .post('v1/auth/loginWithMobileOtp', param)
              .then(
                (data: any) => {
                  if (data && data.status == 200) {
                    if (data && data.user && data.user.type == 1) {
                      if (data && data.user && data.user.status == 1) {
                        localStorage.setItem('uid', data.user.id);
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('firstName', data.user.first_name);
                        localStorage.setItem('lastName', data.user.last_name);
                        localStorage.setItem('email', data.user.email);
                        localStorage.setItem('mobile', data.user.mobile);
                        this.mobile.phone = '';
                        this.mobile.password = '';
                        this.util.userInfo = data.user;
                        this.otpModal.hide();
                        this.loginModal.hide();
                      } else {
                        this.otpModal.hide();
                        this.loginModal.hide();
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
                      }
                    } else {
                      this.util.errorMessage(
                        this.util.translate('Not valid user')
                      );
                    }
                  } else if (data && data.status == 401) {
                    this.util.errorMessage(data.error.error);
                  } else {
                    this.util.errorMessage(
                      this.util.translate('Something went wrong')
                    );
                  }
                },
                (error) => {}
              )
              .catch((error) => {});
          } else {
            if (data && data.status == 500 && data.data && data.data.message) {
              this.util.errorMessage(data.data.message);
              return false;
            }
            this.util.errorMessage(this.util.translate('Something went wrong'));
            return false;
          }
        },
        (error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      );
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  onVerifyOTPFirebase() {
    if (
      this.firebaseOTPText == '' ||
      !this.firebaseOTPText ||
      this.firebaseOTPText == null
    ) {
      this.util.errorMessage('OTP Missing');
      return false;
    }
    this.util.start();
    this.api
      .enterVerificationCode(this.firebaseOTPText)
      .then((userData) => {
        this.util.stop();
        this.loginModal.hide();
        this.firebaseOTP.hide();
        const param = {
          mobile: this.mobileLogin.phone,
          country_code: '+' + this.mobileLogin.ccCode,
        };

        this.api
          .post('v1/auth/loginWithMobileOtp', param)
          .then(
            (data: any) => {
              if (data && data.status == 200) {
                if (data && data.user && data.user.type == 1) {
                  if (data && data.user && data.user.status == 1) {
                    localStorage.setItem('uid', data.user.id);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('firstName', data.user.first_name);
                    localStorage.setItem('lastName', data.user.last_name);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('mobile', data.user.mobile);
                    this.mobile.phone = '';
                    this.mobile.password = '';
                    this.util.userInfo = data.user;
                    this.otpModal.hide();
                    this.loginModal.hide();
                  } else {
                    this.otpModal.hide();
                    this.loginModal.hide();
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
                  }
                } else {
                  this.util.errorMessage(this.util.translate('Not valid user'));
                }
              } else if (data && data.status == 401) {
                this.util.errorMessage(data.error.error);
              } else {
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            },
            (error) => {}
          )
          .catch((error) => {});
      })
      .catch((error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  loginWithMobileAndOTP(form: NgForm, modal) {
    this.submitted = true;
    if (form.valid && this.mobileLogin.ccCode && this.mobileLogin.phone) {
      if (this.util.sms_name == '2' || this.util.sms_name == 2) {
        this.isLogin = true;
        const param = {
          mobile: this.mobileLogin.phone,
          country_code: '+' + this.mobileLogin.ccCode,
        };
        this.api
          .post('v1/auth/verifyPhoneForFirebase', param)
          .then(
            (data: any) => {
              this.isLogin = false;
              this.api
                .signInWithPhoneNumber(
                  this.recaptchaVerifier,
                  '+' + this.mobileLogin.ccCode + this.mobileLogin.phone
                )
                .then((success) => {
                  this.isLogin = false;
                  this.firebaseOTP.show();
                })
                .catch((error) => {
                  this.isLogin = false;
                  this.util.errorMessage(error);
                });
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
        const param = {
          mobile: this.mobileLogin.phone,
          country_code: '+' + this.mobileLogin.ccCode,
        };
        this.isLogin = true;
        this.api
          .post('v1/otp/verifyPhone', param)
          .then(
            (data) => {
              this.isLogin = false;
              if (data && data.status == 200) {
                this.uid = data.otp_id;
                this.otpId = data.otp_id;
                this.otpModal.show();
              } else if (
                data &&
                data.status == 500 &&
                data.error &&
                data.error.error
              ) {
                this.util.errorMessage(data.error.error);
              } else {
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
      }
    } else {
    }
  }

  onOtpChange(event) {
    this.userCode = event;
  }

  verify() {
    if (this.userCode == '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.otpId,
        otp: this.userCode,
      };
      this.isLogin = true;
      this.api.post('v1/otp/verifyOTP', param).then(
        (data: any) => {
          this.isLogin = false;
          if (data && data.status == 200) {
            var registerParam = {};
            var url = '';
            if (this.registerType == 0) {
              registerParam = {
                first_name: this.registerForm.first_name,
                last_name: this.registerForm.last_name,
                email: this.registerForm.email,
                password: this.registerForm.password,
                gender: this.registerForm.gender,
                mobile: this.registerForm.mobile,
                country_code: '+' + this.registerForm.cc,
                dob: this.registerForm.dob,
                cid: this.registerForm.location,
              };
              url = 'v1/auth/create_user_account';
            } else if (this.registerType == 1) {
              let temp = this.registerPartnerForm.category.map(
                (category) => category.id
              );
              let categories = temp.join(',');
              registerParam = {
                email: this.registerPartnerForm.email,
                password: this.registerPartnerForm.password,
                first_name: this.registerPartnerForm.first_name,
                last_name: this.registerPartnerForm.last_name,
                gender: this.registerPartnerForm.gender,
                mobile: this.registerPartnerForm.mobile,
                country_code: '+' + this.registerPartnerForm.cc,
                dob: this.registerPartnerForm.dob,
                cid: this.registerPartnerForm.cid,
                id_card: this.registerPartnerForm.idCard,
                qualification: this.registerPartnerForm.qualification,
                type: this.util.partnerTypes[this.registerPartnerForm.type],
                categories: categories,
                lat: this.registerPartnerForm.lat,
                lng: this.registerPartnerForm.lng,
                fee_start: this.registerPartnerForm.fee_start,
                about: this.registerPartnerForm.about,
                zipcode: this.registerPartnerForm.zipcode,
                address: this.registerPartnerForm.address,
                extra_field: 'NA',
                status: 0,
                cover: this.registerPartnerForm.cover,
                name: this.registerPartnerForm.salon_name,
              };
              url = 'v1/register_request/save';
            }

            this.util.start();
            this.api
              .post(url, registerParam)
              .then(
                (data: any) => {
                  this.isLogin = false;
                  this.util.stop();
                  if (data && data.status == 200) {
                    if (this.registerType == 0) {
                      this.util.userInfo = data.user;
                      localStorage.setItem('uid', data.user.id);
                      localStorage.setItem('token', data.token);
                      localStorage.setItem('firstName', data.user.first_name);
                      localStorage.setItem('lastName', data.user.last_name);
                      localStorage.setItem('email', data.user.email);
                      localStorage.setItem('mobile', data.user.mobile);
                      this.redeemCode();
                    } else {
                      this.util.successMessage(
                        this.util.translate('Registrated Successfully')
                      );
                    }
                    this.verifyModal.hide();
                    this.registerModal.hide();
                    this.registerPartnerModal.hide();
                  } else if (data && data.status == 500) {
                    if (data.error.error != undefined) {
                      this.util.errorMessage(data.error.error);
                    } else if (data.error.message != undefined) {
                      this.util.errorMessage(data.error.message);
                    }
                  } else {
                    this.util.errorMessage(
                      this.util.translate('Something went wrong')
                    );
                  }
                },
                (error) => {
                  this.util.stop();
                  this.isLogin = false;
                  this.util.errorMessage(
                    this.util.translate('Something went wrong')
                  );
                }
              )
              .catch((error) => {
                this.util.stop();
                this.isLogin = false;
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              });
          } else {
            if (data && data.status == 500 && data.data && data.data.message) {
              this.util.errorMessage(data.data.message);
              return false;
            }
            this.util.errorMessage(this.util.translate('Something went wrong'));
            return false;
          }
        },
        (error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      );
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  redeemCode() {
    var referral = '';
    if (this.registerType == 0) {
      referral = this.registerForm.referral;
    } else if (this.registerType == 1) {
      referral = this.registerPartnerForm.referral;
    }
    if (referral && referral != '' && referral != null) {
      const body = { id: localStorage.getItem('uid'), code: referral };
      this.util.start();
      this.api
        .post_private('v1/referral/redeemReferral', body)
        .then(
          (data: any) => {
            this.util.stop();
            if (data && data.status && data.status == 200) {
              const info = data.data;
              let msg = '';
              if (info && info.who_received == 1) {
                msg =
                  this.util.translate(
                    'Congratulations your friend have received the'
                  ) +
                  this.util.currencySymbol +
                  info.amount +
                  ' ' +
                  this.util.translate('on wallet');
              } else if (info && info.who_received == 2) {
                msg =
                  this.util.translate(
                    'Congratulations you have received the '
                  ) +
                  this.util.currencySymbol +
                  info.amount +
                  ' ' +
                  this.util.translate('on wallet');
              } else if (info && info.who_received == 3) {
                msg =
                  this.util.translate(
                    'Congratulations you & your friend have received the '
                  ) +
                  this.util.currencySymbol +
                  info.amount +
                  ' ' +
                  this.util.translate('on wallet');
              }
              Swal.fire({
                title: this.util.translate('Success'),
                text: msg,
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.util.translate('OK'),
                backdrop: false,
                background: 'white',
              }).then((status) => {});
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
    } else {
    }
  }

  /**
   * @author onetechwolf
   * @param form
   * @param registerModal
   * @param verification
   * @param registerType 0: customer register, 1: partner register
   * @returns
   */
  onRegister(form: NgForm, registerModal, verification, registerType) {
    this.registerType = registerType;
    if (this.registerType == 0) this.submitted = true;
    else this.partnerSubmitted = true;
    if (
      (form.valid &&
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
        this.registerForm.location) ||
      (this.registerType == 1 &&
        this.registerForm.checkTermsAndCondition &&
        this.registerForm.checkAge &&
        this.registerPartnerForm.email &&
        this.registerPartnerForm.password &&
        this.registerPartnerForm.first_name &&
        this.registerPartnerForm.last_name &&
        this.registerPartnerForm.mobile &&
        this.registerPartnerForm.cc &&
        this.registerPartnerForm.dob &&
        this.registerPartnerForm.cid &&
        this.registerPartnerForm.idCard)
    ) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      const email =
        this.registerType == 0
          ? this.registerForm.email
          : this.registerPartnerForm.email;
      const mobile =
        this.registerType == 0
          ? this.registerForm.mobile
          : this.registerPartnerForm.mobile;
      const cc =
        this.registerType == 0
          ? this.registerForm.cc
          : this.registerPartnerForm.cc;
      const dob =
        this.registerType == 0
          ? this.registerForm.dob
          : this.registerPartnerForm.dob;
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
      if (
        registerType == 1 &&
        (this.registerPartnerForm.lat == '' ||
          this.registerPartnerForm.lng == '')
      ) {
        this.util.errorMessage(
          this.util.translate('Please enter valid Post Code')
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
                verification.show();
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
                      this.registerModal.hide();
                      this.registerPartnerModal.hide();
                      this.firebaseOTPRegister.show();
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
                  verification.show();
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

  changeAttachment(files: any, attachementType) {
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      this.util.start();
      this.api.uploadFile(files).subscribe(
        (data: any) => {
          this.util.stop();
          if (data && data.data.image_name) {
            if (attachementType == 0) {
              this.registerPartnerForm.idCard = data.data.image_name;
              this.idCardTitle = files[0].name;
            } else if (attachementType == 1) {
              this.registerPartnerForm.qualification = data.data.image_name;
              this.qualificationTitle = files[0].name;
            }
          }
        },
        (error) => {
          this.util.stop();
          this.util.apiErrorHandler(error);
        }
      );
    } else {
    }
  }

  verifyRegisterFirebaseOTP() {
    if (
      this.firebaseOTPText == '' ||
      !this.firebaseOTPText ||
      this.firebaseOTPText == null
    ) {
      this.util.errorMessage('OTP Missing');
      return false;
    }
    this.util.start();
    this.api
      .enterVerificationCode(this.firebaseOTPText)
      .then((userData) => {
        this.util.stop();
        this.firebaseOTPRegister.hide();
        var registerParam = {};
        var url = '';
        if (this.registerType == 0) {
          registerParam = {
            first_name: this.registerForm.first_name,
            last_name: this.registerForm.last_name,
            email: this.registerForm.email,
            password: this.registerForm.password,
            gender: this.registerForm.gender,
            mobile: this.registerForm.mobile,
            country_code: '+' + this.registerForm.cc,
            dob: this.registerForm.dob,
            cid: this.registerForm.location,
          };
          url = 'v1/auth/create_user_account';
        } else if (this.registerType == 1) {
          let temp = this.registerPartnerForm.category.map(
            (category) => category.id
          );
          let categories = temp.join(',');

          registerParam = {
            email: this.registerPartnerForm.email,
            password: this.registerPartnerForm.password,
            first_name: this.registerPartnerForm.first_name,
            last_name: this.registerPartnerForm.last_name,
            gender: this.registerPartnerForm.gender,
            mobile: this.registerPartnerForm.mobile,
            country_code: '+' + this.registerPartnerForm.cc,
            dob: this.registerPartnerForm.dob,
            cid: this.registerPartnerForm.cid,
            id_card: this.registerPartnerForm.idCard,
            qualification: this.registerPartnerForm.qualification,
            type: this.util.partnerTypes[this.registerPartnerForm.type],
            categories: categories,
            lat: this.registerPartnerForm.lat,
            lng: this.registerPartnerForm.lng,
            fee_start: this.registerPartnerForm.fee_start,
            about: this.registerPartnerForm.about,
            zipcode: this.registerPartnerForm.zipcode,
            address: this.registerPartnerForm.address,
            extra_field: 'NA',
            status: 0,
            cover: this.registerPartnerForm.cover,
            name: this.registerPartnerForm.salon_name,
          };
          url = 'v1/register_request/save';
        }

        this.util.start();
        this.api
          .post(url, registerParam)
          .then(
            (data: any) => {
              this.isLogin = false;
              this.util.stop();
              if (data && data.status == 200) {
                if (this.registerType == 0) {
                  this.util.userInfo = data.user;
                  localStorage.setItem('uid', data.user.id);
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('firstName', data.user.first_name);
                  localStorage.setItem('lastName', data.user.last_name);
                  localStorage.setItem('email', data.user.email);
                  localStorage.setItem('mobile', data.user.mobile);
                  this.redeemCode();
                } else {
                  this.util.successMessage(
                    this.util.translate('Registrated Successfully')
                  );
                }
              } else if (data && data.status == 500) {
                if (data.error.error != undefined) {
                  this.util.errorMessage(data.error.error);
                } else if (data.error.message != undefined) {
                  this.util.errorMessage(data.error.message);
                }
              } else {
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            },
            (error) => {
              this.util.stop();
              this.isLogin = false;
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          )
          .catch((error) => {
            this.util.stop();
            this.isLogin = false;
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });
      })
      .catch((error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  preview_banner(files: any) {
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      this.util.start();
      this.api.uploadFile(files).subscribe(
        (data: any) => {
          this.util.stop();
          if (data && data.data.image_name) {
            this.registerPartnerForm.cover = data.data.image_name;
          }
        },
        (error) => {
          this.util.stop();
          this.util.apiErrorHandler(error);
        }
      );
    } else {
    }
  }

  getLatLngWithPostCode(event: KeyboardEvent) {
    this.api
      .getLatLngFromPostcode(this.registerPartnerForm.zipcode)
      .subscribe((response) => {
        if (
          response &&
          response.results instanceof Array &&
          response.results.length > 0
        ) {
          this.registerPartnerForm.lat =
            response.results[0].geometry.location.lat;
          this.registerPartnerForm.lng =
            response.results[0].geometry.location.lng;
        }
      });
  }

  sendVerification(mail, link) {
    const param = {
      email: mail,
      url: link,
    };

    this.api.post('users/sendVerificationMail', param).then(
      (data) => {},
      (error) => {}
    );
  }

  openLink(type) {
    if (type == 'eula') {
      window.open('https://cosonas.com/foodiesaagya/eula.html');
    } else {
      window.open('https://cosonas.com/foodiesaagya/privacy.html');
    }
  }

  sendResetLink() {
    if (!this.reset_email) {
      this.util.errorMessage(this.util.translate('Email is required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.reset_email)) {
      this.util.errorMessage(this.util.translate('Please enter valid email'));
      return false;
    }
    this.isLogin = true;
    const param = {
      email: this.reset_email,
    };
    this.api.post('v1/auth/verifyEmailForReset', param).then(
      (data: any) => {
        this.isLogin = false;
        if (data && data.status == 200) {
          this.reset_id = data.otp_id;
          this.isLogin = false;
          this.div_type = 2;
        } else {
          if (data && data.status == 500 && data.error && data.error.error) {
            this.util.errorMessage(data.error.error);
            return false;
          }
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      },
      (error) => {
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  verifyOTPOfReset() {
    if (!this.reset_otp || this.reset_otp == '') {
      this.util.errorMessage(this.util.translate('otp is required'));
      return false;
    }
    this.isLogin = true;
    const param = {
      id: this.reset_id,
      otp: this.reset_otp,
      email: this.reset_email,
    };
    this.api.post('v1/otp/verifyOTPReset', param).then(
      (data: any) => {
        this.isLogin = false;
        if (data && data.status == 200) {
          this.isLogin = false;
          this.temp = data.temp;
          this.div_type = 3;
        } else {
          if (data && data.status == 500 && data.error && data.error.error) {
            this.util.errorMessage(data.error.error);
            return false;
          }
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      },
      (error) => {
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  sendEmailResetPasswordMail() {
    if (
      !this.reset_password ||
      !this.reset_repass ||
      this.reset_password == '' ||
      this.reset_repass == ''
    ) {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }
    const param = {
      email: this.reset_email,
      password: this.reset_password,
      id: this.reset_id,
    };
    this.isLogin = true;
    this.api
      .post_temp('v1/password/updateUserPasswordWithEmail', param, this.temp)
      .then(
        (data: any) => {
          this.isLogin = false;
          if (data && data.status == 200) {
            this.isLogin = false;
            this.util.successMessage(this.util.translate('Password Updated'));
            this.forgotPwd.hide();
          } else {
            if (
              data &&
              data.status == 500 &&
              data.error &&
              data.error.message
            ) {
              this.util.errorMessage(data.error.error);
              return false;
            }
            this.util.errorMessage(this.util.translate('Something went wrong'));
            return false;
          }
        },
        (error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      );
  }

  sendOTPOnMobile() {
    const param = {
      phone: this.reset_phone,
    };
    this.isLogin = true;
    this.api
      .post('users/validatePhoneForReset', param)
      .then(
        (data: any) => {
          this.isLogin = false;
          if (data && data.status == 200) {
            this.sendOTPForReset();
            this.div_type = 2;
          } else if (data && data.status == 500) {
            this.util.errorMessage(data.data.message);
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        },
        (error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  sendOTPForReset() {
    const message = this.util.translate(
      'Your Bunitas Salon app verification code : '
    );
    const param = {
      msg: message,
      to: '+' + this.reset_cc + this.reset_phone,
    };
    this.util.start();
    this.api.post('users/twilloMessage', param).then(
      (data: any) => {
        this.reset_id = data.data.id;
        this.util.stop();
      },
      (error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  verifyResetCode() {
    if (this.reset_otp == '' || !this.reset_otp) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.reset_otp) {
      const param = {
        id: this.reset_id,
        otp: this.reset_otp,
      };
      this.isLogin = true;
      this.api.post('users/verifyOTP', param).then(
        (data: any) => {
          this.isLogin = false;
          if (data && data.status == 200) {
            this.div_type = 3;
            // this.modalCtrl.dismiss('', 'ok');
          } else {
            if (data && data.status == 500 && data.data && data.data.message) {
              this.util.errorMessage(data.data.message);
              return false;
            }
            this.util.errorMessage(this.util.translate('Something went wrong'));
            return false;
          }
        },
        (error) => {
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      );
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  resetPasswordWithPhone() {
    if (
      !this.reset_password ||
      !this.reset_repass ||
      this.reset_password == '' ||
      this.reset_repass == ''
    ) {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }
    const param = {
      phone: this.reset_phone,
      pwd: this.reset_password,
    };
    this.isLogin = true;
    this.api.post('users/resetPasswordWithPhone', param).then(
      (data: any) => {
        this.isLogin = false;
        if (data && data.status == 200) {
          this.isLogin = false;
          this.util.successMessage(this.util.translate('Password Updated'));
          this.forgotPwd.hide();
        } else {
          if (data && data.status == 500 && data.data && data.data.message) {
            this.util.errorMessage(data.data.message);
            return false;
          }
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      },
      (error) => {
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  onPage(item) {
    this.sideMenu.hide();
    this.router.navigate([item]);
  }

  onProfile(item) {
    this.sideMenu.hide();
    if (this.util && this.util.userInfo && this.util.userInfo.first_name) {
      const name = (
        this.util.userInfo.first_name +
        '-' +
        this.util.userInfo.last_name
      ).toLowerCase();
      this.router.navigate(['user', name, item]);
    } else {
      this.loginModal.show();
    }
  }

  changeLanguage(value) {
    const item = this.util.allLanguages.filter((x) => x.code == value.code);
    if (item && item.length > 0) {
      localStorage.setItem('selectedLanguage', value.code);
      localStorage.setItem('direction', value.direction);
      window.location.reload();
    }
  }

  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    return false;
  }

  logout() {
    this.util.start();
    this.api
      .post_private('v1/profile/logout', {})
      .then(
        (data: any) => {
          this.util.stop();
          this.sideMenu.hide();
          localStorage.removeItem('uid');
          localStorage.removeItem('token');
          this.chmod.detectChanges();
          this.router.navigate(['']);
        },
        (error) => {
          this.util.stop();
          localStorage.removeItem('token');
          this.chmod.detectChanges();
          this.router.navigate(['']);
        }
      )
      .catch((error: any) => {
        this.util.stop();
      });
  }

  closeModal() {
    clearInterval(this.interval);
    this.basicModal.hide();
  }

  sendMessage() {
    // store to opponent
    if (!this.msg || this.msg == '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.id_chat,
      uid: this.id_chat + '_' + this.uid_chat,
      from_id: this.uid_chat,
      message: msg,
      message_type: 'users',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    // this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post_token('chats/save', param, this.authToken).then(
      (data: any) => {
        if (data && data.status == 200) {
          this.getInbox();
        } else {
          this.yourMessage = true;
        }
      },
      (error) => {
        this.yourMessage = true;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  getInbox() {
    const param = {
      id: this.id_chat + '_' + this.uid_chat,
      oid: this.id_chat,
    };
    this.api.post_token('chats/getById', param, this.authToken).then(
      (data: any) => {
        this.loaded_chat = true;
        this.yourMessage = true;
        if (data && data.status == 200) {
          this.messages = data.data;
          this.scrollToBottom();
        }
      },
      (error) => {
        this.loaded_chat = true;
        this.yourMessage = true;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  scrollToBottom() {
    this.scrollMe.nativeElement.scrollTop =
      this.scrollMe.nativeElement.scrollHeight;
    // try {

    // } catch (err) { }
  }

  handleKeyDown(e) {
    const typedValue = e.keyCode;
    if (typedValue < 48 && typedValue > 57) {
      // If the value is not a number, we skip the min/max comparison
      return;
    }

    const typedNumber = parseInt(e.key);
    const min = parseInt(e.target.min);
    const max = parseInt(e.target.max);
    const currentVal = parseInt(e.target.value) || '';
    const newVal = parseInt(typedNumber.toString() + currentVal.toString());

    if (newVal > max) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  public showRegisterPartnerDailog() {
    this.registerPartnerModal.show();
  }

  removeLocation() {
    localStorage.removeItem('location');
    localStorage.removeItem('lat');
    localStorage.removeItem('lng');
    localStorage.removeItem('address');
    location.href = location.href;
  }
}
