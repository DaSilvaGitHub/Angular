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
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-salons',
  templateUrl: './salons.component.html',
  styleUrls: ['./salons.component.scss'],
})
export class SalonsComponent implements OnInit {
  @ViewChild('serviceDetails', { static: false })
  public serviceDetails: ModalDirective;
  @ViewChild('packageDetails', { static: false })
  public packageDetails: ModalDirective;

  id: any = '';
  categories: any[] = [];
  packages: any[] = [];
  specialist: any[] = [];
  productList: any[] = [];
  reviewList: any[] = [];
  categoryTypes: any[] = [{ id: 0, name: 'All' }];
  selectedType: number = 0;
  name: any = '';
  address: any = '';
  social: any = '';
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
  page: number = 1;

  serviceId: any = '';
  serviceName: any = '';
  tempServiceList: any[] = [];
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

  isDragging: boolean;

  apiMap: boolean = false;
  mapImage: any = '';

  nearSalons: any[] = [];

  oneCount: number = 0;
  twoCount: number = 0;
  threeCount: number = 0;
  fourCount: number = 0;
  fiveCount: number = 0;

  selectedReview: number = 5;
  optionsVisible: boolean = false;

  isZoomed: boolean[] = [];

  serviceCustomOptions: OwlOptions = {
    items: 3,
    loop: false,
    autoWidth: false,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 700,
    margin: 10,
    nav: true,
    dots: false,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1.25,
      },
      600: {
        items: 1.25,
      },
      1000: {
        items: 3,
      },
    },
  };

  packagesOptions: OwlOptions = {
    items: 1,
    loop: false,
    autoWidth: false,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 16,
    nav: true,
    dots: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 3,
      },
    },
  };

  week: any[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  customOptions: OwlOptions = {
    items: 3,
    loop: true,
    autoWidth: false,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 10,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 3,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
  };

  shopSliderOptions: OwlOptions = {
    items: 1,
    loop: false,
    autoWidth: true,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 10,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 4,
      },
    },
  };

  nearbySliderOptions: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: false,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 10,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 4,
      },
    },
  };

  nearbySalom: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: false,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 10,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 4,
      },
    },
  };

  serviceOptions: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: false,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 10,
    nav: false,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };

  reviewOptions: OwlOptions = {
    items: 2.5,
    loop: true,
    autoWidth: true,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 10,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2.5,
      },
      1000: {
        items: 3,
      },
    },
  };
  categoryOptions: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: false,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 15,
    nav: false,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 4,
      },
      600: {
        items: 6,
      },
      1000: {
        items: 4,
      },
    },
  };

  productOptions: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: false,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 10,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1.25,
      },
      600: {
        items: 1.5,
      },
      1000: {
        items: 4,
      },
    },
  };

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    private navParam: ActivatedRoute,
    public serviceCart: ServiceCartService,
    public productCart: ProductCartService,
    private location: Location,
    private platformLocation: PlatformLocation,
    @Inject(DOCUMENT) private document: any
  ) {
    if (this.navParam.snapshot.paramMap.get('id')) {
      this.id = this.navParam.snapshot.paramMap.get('id');
      this.getData();
    }
  }

  selectValue(value) {
    this.selectedReview = value;
  }

  getData() {
    let uid = localStorage.getItem('uid');

    if (!uid || uid === null || uid === 'null') {
      uid = '';
    }
    this.api
      .post('v1/salon/salonDetails', { id: this.id, uid: uid })
      .then(
        (data: any) => {
          this.apiCalled = true;
          if (data && data.status && data.status == 200) {
            const info = data.data;
            this.categories = data.categories;
            const tempType = [...this.categoryTypes, ...data.categoryTypes];
            this.categoryTypes = tempType.slice();
            this.packages = data.packages;
            this.specialist = data.specialist;
            this.servicesList = data.servicelist;
            this.tempServiceList = data.servicelist;
            this.name = info.name;
            this.address = info.address;
            this.social = JSON.parse(info.social);
            this.rating = info.rating;
            this.totalRating = info.total_rating;
            this.about = info.about;
            this.lng = info.lng;
            this.lat = info.lat;
            this.website = info.website;
            this.mobile = info.mobile;
            this.cover = info.cover;
            this.policy = info.policy;
            console.log(data);

            if (
              ((x) => {
                try {
                  JSON.parse(x);
                  return true;
                } catch (e) {
                  return false;
                }
              })(info.images)
            ) {
              this.gallery = JSON.parse(info.images);
            } else {
              this.gallery = [];
            }

            if (
              ((x) => {
                try {
                  JSON.parse(x);
                  return true;
                } catch (e) {
                  return false;
                }
              })(info.timing)
            ) {
              this.timing = JSON.parse(info.timing);
            } else {
              this.timing = [];
            }

            this.getMapImage();
            this.getSalonsNearby();
          }
        },
        (error) => {
          this.apiCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.apiCalled = true;
        this.util.apiErrorHandler(error);
      });

    this.gallery = new Array(this.gallery.length).fill(false);
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getReviews();
  }

  updateCarrousel() {
    this.nearbySliderOptions = {
      items: 3,
      loop: false,
      autoWidth: false,
      autoHeight: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      navSpeed: 700,
      margin: 10,
      nav: true,
      dots: false,
      navText: ['←', '→'],
      responsive: {
        0: {
          items: 1.25,
        },
        600: {
          items: 1.25,
        },
        1000: {
          items: this.tempServiceList.length < 3 ? 1 : 3,
        },
      },
    };
  }

  toggleZoom(index: number) {
    if (this.isZoomed[index]) this.isZoomed[index] = false;
    else {
      this.isZoomed.fill(false);
      this.isZoomed[index] = true;
    }
  }

  onCarrouselDrag(dragging: boolean) {
    setTimeout(() => {
      this.isDragging = dragging;
    }, 10);
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
    this.api
      .post('v1/owner_reviews/getMyReviews', { id: this.id })
      .then(
        (data: any) => {
          this.reviewsCalled = true;
          if (data && data.status && data.status == 200) {
            this.reviewList = data.data;

            this.reviewList.map((review) => {
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
        },
        (error) => {
          this.reviewsCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.reviewsCalled = true;
        this.util.apiErrorHandler(error);
      });
  }

  getAllProducts() {
    this.productsCalled = false;
    this.api
      .post('v1/products/getFreelancerProducts', { id: this.id })
      .then(
        (data: any) => {
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
        },
        (error) => {
          this.productsCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.productsCalled = true;
        this.util.apiErrorHandler(error);
      });
  }

  getQuanity(id: any) {
    const data = this.productCart.cart.filter((x) => x.id == id);
    return data[0].quantity;
  }

  remove(index: any) {
    if (this.productList[index].quantity == 1) {
      this.productList[index].quantity = 0;
      this.productCart.removeItem(this.productList[index].id);
    } else {
      this.productList[index].quantity = this.productList[index].quantity - 1;
      this.productCart.updateQuantity(
        this.productList[index].id,
        this.productList[index].quantity
      );
    }
  }

  add(index: any) {
    this.productList[index].quantity = this.productList[index].quantity + 1;
    this.productCart.updateQuantity(
      this.productList[index].id,
      this.productList[index].quantity
    );
  }

  addToCart(index: any) {
    if (this.productCart.cart.length == 0) {
      this.productList[index].quantity = 1;
      this.productCart.addItem(this.productList[index]);
    } else {
      if (
        this.productCart.cart[0].freelacer_id ==
        this.productList[index].freelacer_id
      ) {
        this.productList[index].quantity = 1;
        this.productCart.addItem(this.productList[index]);
      } else {
        this.util.errorMessage(
          this.util.translate('We already have product with other freelancer')
        );
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

  openProduct(productId: any) {
    this.router.navigate(['product-detail', productId]);
  }

  openService(id: any, name: any) {
    this.serviceId = id;
    this.serviceName = name;
    this.util.start();
    this.api
      .post('v1/freelancer_services/getByCategoryId', { id: id, uid: this.id })
      .then(
        (data: any) => {
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
        },
        (error) => {
          this.util.stop();
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.util.stop();
        this.util.apiErrorHandler(error);
      });
  }

  openPackage(id: any, name: any) {
    this.packageId = id;
    this.packageName = name;
    this.util.start();
    this.api
      .post('v1/packages/getPackageDetails', { id: id })
      .then(
        (data: any) => {
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
            if (
              ((x) => {
                try {
                  JSON.parse(x);
                  return true;
                } catch (e) {
                  return false;
                }
              })(info.images)
            ) {
              this.packageImages = JSON.parse(info.images);
            } else {
              this.packageImages = [];
            }
            this.packageOff = info.off;
            this.packagePrice = info.price;
            this.packageServices = info.services;
            this.packageSpecialist = info.specialist;
          }
        },
        (error) => {
          this.util.stop();
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.util.stop();
        this.util.apiErrorHandler(error);
      });
  }

  addService(item: any, index: any) {
    const existentProduct = this.serviceCart.serviceCart.find(
      ({ id }) => id == item.id
    );
    if (existentProduct) {
      this.util.errorMessage('you already have this service on cart');
      return;
    }

    if (
      this.serviceCart.serviceCart.length == 0 &&
      this.serviceCart.packagesCart.length == 0
    ) {
      this.servicesList[index].isChecked = true;
      this.serviceCart.addItem(this.servicesList[index], 'salon');
    } else if (this.serviceCart.packagesCart.length > 0) {
      const freelancerPackagesId = this.serviceCart.getPackageFreelancerId();
      if (freelancerPackagesId == this.id) {
        this.servicesList[index].isChecked = true;
        this.serviceCart.addItem(this.servicesList[index], 'salon');
      } else {
        this.util.errorMessage(
          'We already have service or package with other salon or with freelancer'
        );
      }
    } else {
      const freelancerIdServices = this.serviceCart.getServiceFreelancerId();
      if (freelancerIdServices == this.id) {
        this.servicesList[index].isChecked = true;
        this.serviceCart.addItem(this.servicesList[index], 'salon');
      } else {
        this.util.errorMessage(
          'We already have service or package with other salon or with freelancer'
        );
      }
    }
  }

  removeService(item: any, index: any) {
    this.servicesList[index].isChecked = false;
    this.serviceCart.removeItem(this.servicesList[index].id);
  }

  addPackage() {
    if (
      this.serviceCart.serviceCart.length == 0 &&
      this.serviceCart.packagesCart.length == 0
    ) {
      this.packageInfo['isBooked'] = true;
      this.isBooked = true;
      this.serviceCart.addPackage(this.packageInfo, 'salon');
    } else if (this.serviceCart.serviceCart.length > 0) {
      const freenlancerServiceId = this.serviceCart.getServiceFreelancerId();
      if (freenlancerServiceId == this.id) {
        this.packageInfo['isBooked'] = true;
        this.isBooked = true;
        this.serviceCart.addPackage(this.packageInfo, 'salon');
      } else {
        this.util.errorMessage(
          'We already have service or package with other salon or with freelancer'
        );
      }
    } else {
      const freelancerId = this.serviceCart.getPackageFreelancerId();
      if (freelancerId == this.id) {
        this.packageInfo['isBooked'] = true;
        this.isBooked = true;
        this.serviceCart.addPackage(this.packageInfo, 'salon');
      } else {
        this.util.errorMessage(
          'We already have service or package with other salon or with freelancer'
        );
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

  getMapImage() {
    this.mapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${this.lat},${this.lng}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C${this.lat},${this.lng}&key=${environment.googleMapsKeys}`;
    this.apiMap = true;
  }

  getGoogleMapsUrl(): string {
    return `https://www.google.com/maps?q=${this.lat},${this.lng}`;
  }

  getSalonsNearby() {
    const param = {
      lat: this.lat,
      lng: this.lng,
    };
    this.api
      .post_private('v1/salon/getSalonsNearby', param)
      .then(
        (data: any) => {
          if (data && data.status == 200) {
            this.nearSalons = data.data;
          } else {
          }
        },
        (error) => {
          this.apiCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.apiCalled = true;
        this.util.apiErrorHandler(error);
      });
  }

  onSalon(salonUID: String, name: String) {
    if (!this.isDragging) {
      const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      // this.router.navigate(['salons', salonUID, routeName]);
      this.location.go('salons/' + salonUID + '/' + routeName);
      location.reload();
    }
  }

  share() {
    if (navigator.share) {
      navigator
        .share({
          title: this.name,
          text: 'Please visit https://bunitas.com',
          url: this.document.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
    }
  }

  addToFavorite() {
    const uid = localStorage.getItem('uid');

    if (!uid) this.util.publishModalPopup('login');
    else {
      const param = {
        pid: this.id,
        type: 'salon',
        uid: localStorage.getItem('uid'),
      };
      this.util.start();
      this.api.post_private('v1/favorite/toggle', param).then(
        (data: any) => {
          this.util.stop();
          console.log(data);
          if (data.update) {
            this.util.successMessage(
              this.util.translate(
                'You have removed this item from the favorites list'
              )
            );
          } else {
            this.util.successMessage(
              this.util.translate(
                'You have set this item from the favorites list'
              )
            );
          }
        },
        (error) => {
          this.util.stop();
          this.util.errorMessage(this.util.translate(error.error.error));
        }
      );
    }
  }

  addTreatmentsToFavorite(id) {
    const uid = localStorage.getItem('uid');
    console.log(this.getTreatmentFavorite(id));

    if (!uid) this.util.publishModalPopup('login');
    else {
      const param = {
        pid: id,
        type: 'treatment',
        uid: localStorage.getItem('uid'),
      };
      this.util.start();
      this.api.post_private('v1/favorite/toggle', param).then(
        (data: any) => {
          this.util.stop();
          console.log(data);
          if (data.update) {
            this.util.successMessage(
              this.util.translate(
                'You have removed this item from the ffavorites list'
              )
            );

            const favoriteIndex = this.util.favoritesTreatments.findIndex(
              (item) => item.id == id
            );

            this.util.favoritesTreatments.splice(favoriteIndex, 1);
          } else {
            this.util.successMessage(
              this.util.translate(
                'You have set this item from the favorites list'
              )
            );

            this.util.favoritesTreatments.push(id);
          }
        },
        (error) => {
          this.util.stop();
          this.util.errorMessage(this.util.translate(error.error.error));
        }
      );
    }
  }

  getTreatmentFavorite(id) {
    return this.util.favoritesTreatments.includes(id);
  }

  addProductsToFavorite(id) {
    const uid = localStorage.getItem('uid');

    if (!uid) this.util.publishModalPopup('login');
    else {
      const param = {
        pid: id,
        type: 'product',
        uid: localStorage.getItem('uid'),
      };
      this.util.start();
      this.api.post_private('v1/favorite/toggle', param).then(
        (data: any) => {
          this.util.stop();
          console.log(data);
          if (data.update) {
            this.util.successMessage(
              this.util.translate(
                'You have removed this item from the favorites list'
              )
            );
          } else {
            this.util.successMessage(
              this.util.translate(
                'You have set this item from the favorites list'
              )
            );

            this.util.favoriteProducts.push(id);
          }
        },
        (error) => {
          this.util.stop();
          this.util.errorMessage(this.util.translate(error.error.error));
        }
      );
    }
  }

  getProductsFavorite(id) {
    return this.util.favoriteProducts.includes(id);
  }

  handleSeletedType(id: number) {
    this.selectedType = id;
    if (id > 0) {
      this.tempServiceList = this.servicesList.filter(
        (item: any) => item.cate_id == id
      );
    } else {
      this.tempServiceList = this.servicesList;
    }
  }

  onProductDetail(productId: string) {
    this.router.navigate(['product-detail', productId]);
  }

  scrollToServices() {
    const element = document.getElementById('servicesScroll');

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToMap() {
    const element = document.getElementById('mapScroll');

    element.scrollIntoView({ behavior: 'smooth' });
  }
}
