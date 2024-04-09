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
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss'],
})
export class OrdersDetailsComponent implements OnInit {
  @ViewChild('ratingModal', { static: false })
  public ratingModal: ModalDirective;
  @ViewChild('addReviews', { static: false }) public addReviews: ModalDirective;
  id: any = '';
  apiCalled: boolean = false;
  orders: any[] = [];
  address: any = '';
  myLat: any = '';
  myLng: any = '';
  itemTotal: any = 0;
  taxCharge: any = 0;
  distance_cost: any = 0;
  processing_fees: string = "";
  discount: any = 0;
  grand_total: any = 0;
  wallet_price: any = 0;
  pay_method: any = 0;
  status: any = 0;
  wallet_used: any = 0;
  date_time: any = '';
  addressName = ['home', 'work', 'other']; // 1 = home , 2 = work , 3 = other
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
  freelancerCover: any = '';
  freelancerName: any = '';
  freelancerEmail: string = '';
  freelancerPhone: string = '';
  freelancerAddress: string = '';
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
    private navCtrl: Location
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
      .post_private('v1/product_order/getInfo', { id: this.id })
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
              })(info.orders)
            ) {
              this.orders = JSON.parse(info.orders);
            } else {
              this.orders = [];
            }
            if (info.order_to == 1 || info.order_to == '1') {
              if (
                ((x) => {
                  try {
                    JSON.parse(x);
                    return true;
                  } catch (e) {
                    return false;
                  }
                })(info.address)
              ) {
                var address = JSON.parse(info.address);
                this.address =
                  address.house +
                  ' ' +
                  address.landmark +
                  ' ' +
                  address.address +
                  ' ' +
                  address.pincode;
                this.myLat = address.lat;
                this.myLng = address.lng;
              }
            }
            if (info && info.salonInfo) {
              this.freelancerCover = info.salonInfo.cover;
              this.freelancerName = info.salonInfo.name;
              this.ownerId = info.salon_id;
              this.freelancerAddress = info.salonInfo.address;
            }
            if (info && info.freelancerInfo) {
              this.freelancerCover = info.freelancerInfo.cover;
              this.freelancerName =
                info.freelancerInfo.first_name +
                ' ' +
                info.freelancerInfo.last_name;
              this.ownerId = info.freelancer_id;
            }
            this.freelancerEmail = info.ownerInfo.email;
            this.freelancerPhone = info.ownerInfo.mobile;
            console.log(this.freelancerEmail);

            this.itemTotal = info.total;
            this.taxCharge = info.tax;
            this.distance_cost = info.delivery_charge;
            this.processing_fees = (
              0.035 *
              (Number(this.itemTotal) +
                Number(this.distance_cost) +
                Number(this.util.booking_fee))
            ).toFixed(2);
            this.discount = info.discount;
            this.grand_total = info.grand_total;
            this.pay_method = info.paid_method;
            this.wallet_price = info.wallet_price;
            this.wallet_used = info.wallet_used;
            this.date_time = moment(info.date_time).format('llll');
            this.status = info.status;
            var address = JSON.parse(info.address);
            /*  Object.entries(address).map((item) => {
              item[1] = !item[1] ? ' ' : item[1];
            });
            console.log(address); */

            this.address =
              (address.house || '') +
              ' ' +
              (address.landmark || '') +
              ' ' +
              (address.address || '') +
              ' ' +
              (address.pincode || '');
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
        'v1/product_order/printInvoice?id=' +
        this.id +
        '&token=' +
        localStorage.getItem('token'),
      '_blank'
    );
  }

  changeStatus() {
    this.util.start();
    this.api
      .post_private('v1/product_order/update', { id: this.id, status: 5 })
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

  saveReview() {
    if (this.notes == '') {
      this.util.errorMessage('Please add comments');
      return false;
    }
    if (this.type == 'owner') {
      this.saveOwnerRating();
    } else if (this.type == 'products') {
      this.saveProductReview();
    }
  }

  saveProductReview() {
    this.ratingsList.push(this.rate);
    const sum = this.ratingsList.reduce((a, b) => a + b);
    const average = (sum / this.ratingsList.length).toFixed(2);
    const param = {
      uid: localStorage.getItem('uid'),
      product_id: this.externalId,
      notes: this.notes,
      rating: this.rate,
      status: 1,
    };
    this.isLogin = true;
    this.api
      .post_private('v1/products_reviews/save', param)
      .then(
        (data: any) => {
          if (data && data.status && data.status == 200) {
            const updateParam = {
              id: this.externalId,
              total_rating: this.ratingsList.length,
              rating: parseFloat(average).toFixed(2),
            };
            this.api
              .post_private('v1/products/update', updateParam)
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

  openProductRating(id: any, name: any, cover: any) {
    this.type = 'products';
    this.name = name;
    this.cover = cover;
    this.externalId = id;
    this.util.start();
    this.ratingsList = [];
    this.api
      .post_private('v1/products_reviews/getProductsReviews', {
        id: this.externalId,
      })
      .then(
        (data: any) => {
          this.util.stop();
          if (data && data.status && data.status == 200) {
            data.data.forEach((element) => {
              this.ratingsList.push(parseInt(element.rating));
            });
          }
          this.ratingModal.hide();
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
