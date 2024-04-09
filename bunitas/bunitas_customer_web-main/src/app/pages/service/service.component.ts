/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { ServiceCartService } from 'src/app/services/service-cart.service';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  @ViewChild('serviceDetails', { static: false }) public serviceDetails: ModalDirective;
  @ViewChild('packageDetails', { static: false }) public packageDetails: ModalDirective;

  id: any = '';
  categories: any[] = [];
  packages: any[] = [];
  productList: any[] = [];
  reviewList: any[] = [];
  name: any = '';
  adddress: any = '';
  rating: any = '';
  totalRating: any = '';
  about: any = '';
  timing: any[] = [];
  lat: any = '';
  lng: any = '';
  gallery: any[] = [];
  website: any = '';
  mobile: any = '';
  cover: any = '';
  policy: any = '';
  apiCalled: boolean = false;
  currentTab: any = '1';
  serviceTab: any = '1';
  social: any = '';
  page: number = 1;

  serviceId: any = '';
  serviceName: any = '';
  servicesList: any[] = [];

  packageId: any = '';
  packageName: any = '';
  packageInfo: any;
  isBooked: boolean = false;
  packageCover: any = '';
  packageDescriptions: any = '';
  packageDiscount: any = '';
  packageDuration: any = '';
  packageImages: any[] = [];
  packageOff: any = '';
  packagePrice: any = '';
  packageServices: any[] = [];
  packageSpecialist: any[] = [];
  productsCalled: boolean = false;
  reviewsCalled: boolean = false;

  oneCount: number = 0;
  twoCount: number = 0;
  threeCount: number = 0;
  fourCount: number = 0;
  fiveCount: number = 0;
  nearFreelancers: any[] = [];

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    private navParam: ActivatedRoute,
    public serviceCart: ServiceCartService,
    public productCart: ProductCartService,
    private location: Location,
    private platformLocation: PlatformLocation, @Inject(DOCUMENT) private document: any,
  ) {
    if (this.navParam.snapshot.paramMap.get('id')) {
      this.id = this.navParam.snapshot.paramMap.get('id');
      this.getData();
    }

  }

  getData() {
    this.api.post('v1/individual/individualDetails', { id: this.id }).then((data: any) => {
      this.apiCalled = true;
      if (data && data.status && data.status == 200) {
        const info = data.data;
        this.categories = data.categories;
        this.packages = data.packages;
        this.name = data.userInfo.first_name + ' ' + data.userInfo.last_name;
        this.adddress = info.address;
        this.rating = info.rating;
        this.totalRating = info.total_rating;
        this.about = info.about;
        this.social = JSON.parse(info.social);
        this.lng = info.lng;
        this.lat = info.lat;
        this.website = info.website;
        this.mobile = data.userInfo.mobile;
        this.cover = data.userInfo.cover;
	      this.policy = info.policy;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.images)) {
          this.gallery = JSON.parse(info.images);
        } else {
          this.gallery = [];
        }

        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.timing)) {
          this.timing = JSON.parse(info.timing);
        } else {
          this.timing = [];
        }

        this.getFreelancersNearby();


      }
    }, error => {
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getReviews();
  }
  changeTab(id: any) {
    this.currentTab = id;
    if (this.currentTab == '1') {
    } else if (this.currentTab == '2') {
    } else if (this.currentTab == '3') {
    } else if (this.currentTab == '4') {
    } else if (this.currentTab == '5') {
    } else if (this.currentTab == '6') {
    }
  }

  getReviews() {
    this.reviewsCalled = false;
    this.api.post('v1/owner_reviews/getMyReviews', { id: this.id }).then((data: any) => {
      this.reviewsCalled = true;
      if (data && data.status && data.status == 200) {
        this.reviewList = data.data;
        this.reviewList.map(review => {
          switch (review.rating) {
            case 1:
              this.oneCount++;
              break;
            case 2:
              this.twoCount++;
              break;
            case 3:
              this.threeCount++;
              break;
            case 4:
              this.fourCount++;
              break;
            case 5:
              this.fiveCount++;
              break;
          }
        });
      }
    }, error => {
      this.reviewsCalled = true;
      this.util.apiErrorHandler(error);
    },
    ).catch(error => {
      this.reviewsCalled = true;
      this.util.apiErrorHandler(error);
    });
  }

  getAllProducts() {
    this.productsCalled = false;
    this.api.post('v1/products/getFreelancerProducts', { "id": this.id, }).then((data: any) => {
      this.productsCalled = true;
      if (data && data.status == 200) {
        if (data && data.data && data.data.length > 0) {
          data.data.forEach((productList: any) => {
            if (this.productCart.itemId.includes(productList.id)) {
              productList['quantity'] = this.getQuanity(productList.id);
            } else {
              productList['quantity'] = 0;
            }
          });
        }
        this.productList = data.data;
      }
    }, error => {
      this.productsCalled = true;
      this.util.apiErrorHandler(error);
    },
    ).catch(error => {
      this.productsCalled = true;
      this.util.apiErrorHandler(error);
    });
  }

  openService(id: any, name: any) {
    this.serviceId = id;
    this.serviceName = name;
    this.util.start();
    this.api.post('v1/freelancer_services/getByCategoryId', { "id": id, "uid": this.id }).then((data: any) => {
      this.util.stop();
      if (data && data.status && data.status == 200) {
        this.serviceDetails.show();
        this.servicesList = data.data;
        this.servicesList.forEach((element: any) => {
          if (this.serviceCart.serviceItemId.includes(element.id)) {
            element['isChecked'] = true;
          } else {
            element['isChecked'] = false;
          }
        });
      }

    }, error => {
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  openProduct(productId: any) {
    this.router.navigate(['product-detail', productId]);
  }

  openPackage(id: any, name: any) {
    this.packageId = id;
    this.packageName = name;
    this.util.start();
    this.api.post('v1/packages/getPackageDetails', { "id": id }).then((data: any) => {
      this.util.stop();
      if (data && data.status && data.status == 200) {
        this.packageDetails.show();
        const info = data.data;
        this.packageInfo = info;
        if (this.serviceCart.packageItemId.includes(this.packageId)) {
          this.packageInfo['isBooked'] = true;
          this.isBooked = true;
        } else {
          this.packageInfo['isBooked'] = false;
          this.isBooked = false;
        }
        this.packageCover = info.cover;
        this.packageDescriptions = info.descriptions;
        this.packageDiscount = info.discount;
        this.packageDuration = info.duration;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.images)) {
          this.packageImages = JSON.parse(info.images);
        } else {
          this.packageImages = [];
        }
        this.packageOff = info.off;
        this.packagePrice = info.price;
        this.packageServices = info.services;
        this.packageSpecialist = info.specialist;
      }
    }, error => {
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.stop();
      this.util.apiErrorHandler(error);
    });

  }

  addService(item: any, index: any) {
    if (this.serviceCart.serviceCart.length == 0 && this.serviceCart.packagesCart.length == 0) {
      this.servicesList[index].isChecked = true;
      this.serviceCart.addItem(this.servicesList[index], 'freelancer');
    } else if (this.serviceCart.packagesCart.length > 0) {
      const freelancerPackagesId = this.serviceCart.getPackageFreelancerId();
      if (freelancerPackagesId == this.id) {
        this.servicesList[index].isChecked = true;
        this.serviceCart.addItem(this.servicesList[index], 'freelancer');
      } else {
        this.util.errorMessage('We already have service or package with other salon or with freelancer');
      }
    } else {
      const freelancerIdServices = this.serviceCart.getServiceFreelancerId();
      if (freelancerIdServices == this.id) {
        this.servicesList[index].isChecked = true;
        this.serviceCart.addItem(this.servicesList[index], 'freelancer');
      } else {
        this.util.errorMessage('We already have service or package with other salon or with freelancer');
      }
    }

  }

  removeService(item: any, index: any) {
    this.servicesList[index].isChecked = false;
    this.serviceCart.removeItem(this.servicesList[index].id);
  }

  addPackage() {
    if (this.serviceCart.serviceCart.length == 0 && this.serviceCart.packagesCart.length == 0) {
      this.packageInfo['isBooked'] = true;
      this.isBooked = true;
      this.serviceCart.addPackage(this.packageInfo, 'freelancer');
    } else if (this.serviceCart.serviceCart.length > 0) {
      const freenlancerServiceId = this.serviceCart.getServiceFreelancerId();
      if (freenlancerServiceId == this.id) {
        this.packageInfo['isBooked'] = true;
        this.isBooked = true;
        this.serviceCart.addPackage(this.packageInfo, 'freelancer');
      } else {
        this.util.errorMessage('We already have service or package with other salon or with freelancer');
      }
    } else {
      const freelancerId = this.serviceCart.getPackageFreelancerId();
      if (freelancerId == this.id) {
        this.packageInfo['isBooked'] = true;
        this.isBooked = true;
        this.serviceCart.addPackage(this.packageInfo, 'freelancer');
      } else {
        this.util.errorMessage('We already have service or package with other salon or with freelancer');
      }
    }

  }

  removePackage() {
    this.packageInfo['isBooked'] = false;
    this.isBooked = false;
    this.serviceCart.removePackage(this.packageId);
  }

  clearServiceCart() {
    this.serviceCart.clearCart();
    this.servicesList.forEach((element) => {
      element.isChecked = false;
    });
  }

  clearProductCart() {
    this.productCart.clearCart();
    this.productList.forEach((element) => {
      element.quantity = 0;
    });
  }

  getQuanity(id: any) {
    const data = this.productCart.cart.filter(x => x.id == id);
    return data[0].quantity;
  }

  remove(index: any) {
    if (this.productList[index].quantity == 1) {
      this.productList[index].quantity = 0;
      this.productCart.removeItem(this.productList[index].id);
    } else {
      this.productList[index].quantity = this.productList[index].quantity - 1;
      this.productCart.updateQuantity(this.productList[index].id, this.productList[index].quantity);
    }
  }

  add(index: any) {
    this.productList[index].quantity = this.productList[index].quantity + 1;
    this.productCart.updateQuantity(this.productList[index].id, this.productList[index].quantity);
  }

  addToCart(index: any) {
    if (this.productCart.cart.length == 0) {
      this.productList[index].quantity = 1;
      this.productCart.addItem(this.productList[index]);
    } else {
      if (this.productCart.cart[0].freelacer_id == this.productList[index].freelacer_id) {
        this.productList[index].quantity = 1;
        this.productCart.addItem(this.productList[index]);
      } else {
        this.util.errorMessage(this.util.translate('We already have product with other freelancer'));
      }
    }
  }

  goToProductCheckout() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      this.router.navigate(['/product-checkout']);
    } else {
      this.util.publishModalPopup('login');
    }
  }

  goToCheckout() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      if (this.serviceCart.fromService == 'salon') {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/freelancer-checkout']);
      }
    } else {
      this.util.publishModalPopup('login');
    }
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: this.name,
        text: 'Please visit https://bunitas.com',
        url: this.document.location.href
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      console.log('Web Share API not supported');
    }
  }

  addToFavorite() {
    const param = {
      pid: this.id,
      type: 'beauticians',
      uid: localStorage.getItem('uid'),
    };
    this.util.start();
    this.api.post_private('v1/favorite/toggle', param).then(
      (data: any) => {
        this.util.stop();
        console.log(data);
        if (data.update) {
          this.util.successMessage(this.util.translate('You have removed this item from the favorites list'));
        } else {
          this.util.successMessage(this.util.translate('You have set this item from the favorites list'));
        }
      },
      (error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate(error.error.error));
      }
    );
  }

  onFreelancerDetail(freelancerId: any, name: any) {
    const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    // this.router.navigate(['salons', salonUID, routeName]);
    this.location.go('service/' + freelancerId + '/' + routeName);
    location.reload();
  }

  getFreelancersNearby() {
    const param = {
      "lat": this.lat,
      "lng": this.lng
    };
    this.api.post_private('v1/salon/getFreelancersNearby', param).then((data: any) => {
      if (data && data.status == 200) {
        this.nearFreelancers = data.data;
      } else {
      }
    }, error => {
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    });
  }
}
