/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent implements OnInit {
  @ViewChild('ratingModal', { static: false })
  public ratingModal: ModalDirective;
  @ViewChild('addReviews', { static: false }) public addReviews: ModalDirective;
  @ViewChild('myModal3') public myModal3: ModalDirective;
  id: any = '';
  orders: any;
  address: any = '';
  myLat: any = '';
  myLng: any = '';
  itemTotal: any = 0;
  taxCharge: any = 0;
  distance_cost: any = 0;
  discount: any = 0;
  grand_total: any = 0;
  wallet_price: any = 0;
  pay_method: any = 0;
  status: any = 0;
  wallet_used: any = 0;
  save_date: any = '';
  addressName = ['home', 'work', 'other']; // 1 = home , 2 = work , 3 = other

  salonAddress: string;
  salonEmail: string;
  salonNumber: string;
  appointmentDate: string;
  paidAtCheckout: number;

  freelancerCover: any = '';
  freelancerName: any = '';
  freelancerMobile: any = '';
  freelancerEmail: any = '';
  apiCalled: boolean = false;
  cancelReason: any = '';
  paymentBy = [
    'NA',
    'COD',
    'Stripe',
    'PayPal',
    'PayTM',
    'Razorpay',
    'Instamojo',
    'Paystack',
    'Flutterwave',
  ];

  rate: any = 2;
  ratingsList: any[] = [];
  isLogin: boolean = false;
  ownerId: any = '';
  externalId: any = '';
  type: any = '';
  cover: any = '';
  name: any = '';
  notes: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id != '' && this.id != null) {
      this.getInfo();
    }
  }

  ngOnInit(): void {}

  getInfo() {
    this.apiCalled = false;
    this.api
      .post_private('v1/appoinments/getInfo', { id: this.id })
      .then(
        (data: any) => {
          this.apiCalled = true;
          if (
            data &&
            data.status &&
            data.status == 200 &&
            data.data &&
            data.data.id
          ) {
            const info = data.data;
            if (
              ((x) => {
                try {
                  JSON.parse(x);
                  return true;
                } catch (e) {
                  return false;
                }
              })(info.items)
            ) {
              this.orders = JSON.parse(info.items);
            } else {
              this.orders = [];
            }
            if (info.appointments_to == 1) {
              // if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.address)) {
              //   var address = JSON.parse(info.address);
              //   this.address = address.house + ' ' + address.landmark + ' ' + address.address + ' ' + address.pincode;
              //   this.myLat = address.lat;
              //   this.myLng = address.lng;
              // }
              this.address = 'Home';
            } else {
              this.address = 'Salon';
            }

            if (info.salon_id == 0 && info.individualInfo) {
              this.freelancerCover = info.ownerInfo.cover;
              this.freelancerName =
                info.ownerInfo.first_name + ' ' + info.ownerInfo.last_name;
              this.freelancerEmail = info.ownerInfo.email;
              this.freelancerMobile = info.ownerInfo.mobile;
              this.ownerId = info.freelancer_id;
            } else {
              this.freelancerCover = info.ownerInfo.cover;
              this.freelancerName = info.salonInfo.name;
              this.freelancerEmail = info.ownerInfo.email;
              this.freelancerMobile = info.ownerInfo.mobile;
              this.ownerId = info.salon_id;
              this.salonAddress = info.salonInfo.address;
            }

            this.salonEmail = info.ownerInfo.email;
            this.salonNumber = `${info.ownerInfo.country_code} ${info.ownerInfo.mobile}`;

            const appointmentDayAndMonth = new Date(info.save_date);
            const appointmentMonth =
              appointmentDayAndMonth.getUTCDate() <= 9 &&
              '0' + `${appointmentDayAndMonth.getUTCMonth() + 1}`;
            const appointmentDay =
              '0' + `${appointmentDayAndMonth.getUTCDate()}`;

            this.appointmentDate = `${appointmentDay}/${appointmentMonth}, ${info.slot}`;

            this.itemTotal = info.total;
            this.taxCharge = info.serviceTax;
            // this.distance_cost = info.distance_cost;
            let serviceList = info.services;

            if (this.address == 'Salon') this.distance_cost = 0;
            else this.distance_cost = info.distance_cost;

            /*   serviceList.map((service: any) => {
              this.distance_cost += service.distance;
            }); */
            this.discount = info.discount;
            this.grand_total = info.grand_total;
            this.pay_method = info.pay_method;
            this.wallet_price = info.wallet_price;
            this.wallet_used = info.wallet_used;
            this.save_date =
              moment(info.save_date).format('llll') + ' ' + info.slot;
            this.status = info.status;
            this.paidAtCheckout =
              Number(this.util.getProcessingFee(this.itemTotal)) +
              Number(this.util.general.booking_fee) +
              Number(this.util.getDepositFee(this.itemTotal));
          }
        },
        (error) => {
          this.apiCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error: any) => {
        this.apiCalled = true;
        this.util.apiErrorHandler(error);
      });
  }

  printInvoice() {
    window.open(
      this.api.baseUrl +
        'v1/appointments/printInvoice?id=' +
        this.id +
        '&token=' +
        localStorage.getItem('token'),
      '_blank'
    );
  }

  changeStatus() {
    this.util.start();
    this.api
      .post_private('v1/appoinments/update', {
        id: this.id,
        status: 5,
        cancel_reason: this.cancelReason,
      })
      .then(
        (data: any) => {
          this.util.stop();
          this.util.successMessage('Updated');
          this.navCtrl.back();
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
  }

  presentAlertConfirm() {
    this.ratingModal.show();
  }

  getOwnerRating() {
    this.ratingModal.hide();
    this.util.start();
    this.ratingsList = [];
    this.api
      .post_private('v1/owner_reviews/getOwnerReviews', { id: this.ownerId })
      .then(
        (data: any) => {
          this.util.stop();
          if (data && data.status && data.status == 200) {
            // this.ratingsList = data.data;
            data.data.forEach((element) => {
              this.ratingsList.push(parseInt(element.rating));
            });
          }
          this.type = 'owner';
          this.name = this.freelancerName;
          this.cover = this.freelancerCover;
          this.addReviews.show();
        },
        (error) => {
          this.util.stop();
          this.ratingsList = [];
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.util.stop();
        this.ratingsList = [];
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  openServiceRating(id: any, name: any, cover: any) {
    this.type = 'service';
    this.name = name;
    this.cover = cover;
    this.externalId = id;
    this.ratingModal.hide();
    this.addReviews.show();
  }

  openPackageRating(id: any, name: any, cover: any) {
    this.type = 'package';
    this.name = name;
    this.cover = cover;
    this.externalId = id;
    this.ratingModal.hide();
    this.addReviews.show();
  }

  saveReview() {
    if (this.notes == '') {
      this.util.errorMessage('Please add comments');
      return false;
    }
    if (this.type == 'owner') {
      this.saveOwnerRating();
    } else if (this.type == 'service') {
      this.saveServiceRating();
    } else if (this.type == 'package') {
      this.savePackageRating();
    }
  }

  savePackageRating() {
    const param = {
      uid: localStorage.getItem('uid'),
      package_id: this.externalId,
      freelancer_id: this.ownerId,
      notes: this.notes,
      rating: this.rate,
      status: 1,
    };
    this.isLogin = true;
    this.api
      .post_private('v1/packages_reviews/save', param)
      .then(
        (data: any) => {
          this.isLogin = false;
          this.util.successMessage('Review saved');
          this.addReviews.hide();
          this.rate = 2;
          this.cover = '';
          this.notes = '';
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

  saveServiceRating() {
    const param = {
      uid: localStorage.getItem('uid'),
      service_id: this.externalId,
      freelancer_id: this.ownerId,
      notes: this.notes,
      rating: this.rate,
      status: 1,
    };
    this.isLogin = true;
    this.api
      .post_private('v1/service_reviews/save', param)
      .then(
        (data: any) => {
          this.isLogin = false;
          this.util.successMessage('Review saved');
          this.addReviews.hide();
          this.rate = 2;
          this.cover = '';
          this.notes = '';
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

  saveOwnerRating() {
    this.ratingsList.push(this.rate);
    const sum = this.ratingsList.reduce((a, b) => a + b);
    const average = (sum / this.ratingsList.length).toFixed(2);
    const param = {
      uid: localStorage.getItem('uid'),
      freelancer_id: this.ownerId,
      notes: this.notes,
      rating: this.rate,
      status: 1,
    };
    this.isLogin = true;
    this.api
      .post_private('v1/owner_reviews/save', param)
      .then(
        (data: any) => {
          if (data && data.status && data.status == 200) {
            const updateParam = {
              id: this.ownerId,
              total_rating: this.ratingsList.length,
              rating: parseFloat(average).toFixed(2),
            };
            this.api
              .post_private('v1/owner_reviews/updateOwnerReviews', updateParam)
              .then(
                (updates: any) => {
                  this.isLogin = false;
                  this.util.successMessage('Review saved');
                  this.rate = 2;
                  this.cover = '';
                  this.notes = '';
                  this.addReviews.hide();
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
            this.isLogin = false;
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

  getProfile() {
    return this.api.mediaURL + this.cover;
  }
}
