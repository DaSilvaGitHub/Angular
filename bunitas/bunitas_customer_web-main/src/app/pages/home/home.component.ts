/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categoryList: any[] = [];
  freelancerList: any[] = [];
  productList: any[] = [];
  banners: any[] = [];
  apiCalled: boolean = false;
  salonList: any[] = [];
  haveData: boolean;
  isDragging: boolean = false;
  customOptions: OwlOptions = {
    items: 2,
    loop: true,
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
        items: 1.5,
      },
      600: {
        items: 1.5,
      },
      1000: {
        items: 1.5,
      },
    },
  };

  categoryOption: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: false,
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
        items: 1.5,
      },
      600: {
        items: 1.5,
      },
      1000: {
        items: 4,
      },
    },
  };

  productOption: OwlOptions = {
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

  private isMobile: boolean = !(this.util.deviceType != 'desktop');

  nearbySliderOptions: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: this.isMobile,
    autoHeight: this.isMobile,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    pullDrag: true,
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

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    public productCart: ProductCartService
  ) {
    this.haveData = true;
    this.util.subscribeNewAddress().subscribe((data) => {
      this.haveData = true;
      this.getHomeData();
    });
    this.getHomeData();
  }

  getHomeData() {
    this.apiCalled = false;
    const param = {
      lat: localStorage.getItem('lat'),
      lng: localStorage.getItem('lng'),
    };
    this.api
      .post('v1/salon/getHomeDataWeb', param)
      .then(
        (data: any) => {
          this.apiCalled = true;
          if (data && data.status == 200) {
            this.haveData = true;
            this.categoryList = data.categories;
            this.freelancerList = data.individual;
            this.productList = data.products;
            this.salonList = data.salon;
            data.products.forEach((productList: any) => {
              if (this.productCart.itemId.includes(productList.id)) {
                productList['quantity'] = this.getQuanity(productList.id);
              } else {
                productList['quantity'] = 0;
              }
            });
            this.banners = data.banners;
          } else {
            this.categoryList = [];
            this.freelancerList = [];
            this.productList = [];
            this.banners = [];
            this.haveData = false;
          }
        },
        (error) => {
          this.apiCalled = true;
          this.util.apiErrorHandler(error);
          this.categoryList = [];
          this.freelancerList = [];
          this.productList = [];
          this.banners = [];
          this.haveData = false;
        }
      )
      .catch((error) => {
        this.apiCalled = true;
        this.util.apiErrorHandler(error);
        this.categoryList = [];
        this.freelancerList = [];
        this.productList = [];
        this.banners = [];
        this.haveData = false;
      });
  }

  ngOnInit(): void {}

  openBanner(item: any) {
    if (item.type == '0' || item.type == 0) {
      this.router.navigate(['/service-listing', item.value, 'Offers']);
    } else if (item.type == '1' || item.type == 1) {
      this.router.navigate(['service', item.value, 'offers']);
    } else if (item.type == '2' || item.type == 2) {
      this.router.navigate(['salons', item.value, 'offers']);
    } else if (item.type == '3' || item.type == 3) {
      const param: NavigationExtras = {
        queryParams: {
          id: item.value,
        },
      };
      this.router.navigate(['shop'], param);
    } else if (item.type == '4' || item.type == 4) {
      this.router.navigate(['product-detail', item.value]);
    } else if (item.type == '5' || item.type == 5) {
      window.open(item.value, '_blank');
    }
  }

  onFreelancerDetail(freelancerId: any, name: any) {
    if (!this.isDragging) {
      const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      this.router.navigate(['service', freelancerId, routeName]);
    }
  }

  onSalon(salonUID: String, name: String) {
    if (!this.isDragging) {
      const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      this.router.navigate(['salons', salonUID, routeName]);
    }
  }

  onProductDetail(productId: any) {
    this.router.navigate(['product-detail', productId]);
  }

  goToProduct() {
    this.router.navigate(['/product']);
  }

  onServiceListing(id: any, name: any) {
    if (!this.isDragging) {
      const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      this.router.navigate(['/search'], {
        queryParams: {
          category: routeName,
          address: localStorage.getItem('address'),
        },
      });
    }
  }

  onCarrouselDrag(dragging: boolean) {
    setTimeout(() => {
      this.isDragging = dragging;
    }, 10);
  }

  getAddressName() {
    const location = localStorage.getItem('address');
    if (location && location != null && location !== 'null') {
      return location.length > 30 ? location.slice(0, 30) + '....' : location;
    }
    localStorage.clear();
    return 'No address';
  }

  getQuanity(id: any) {
    const data = this.productCart.cart.filter((x) => x.id == id);
    return data[0].quantity;
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

  gotoSalonList() {
    this.router.navigate(['search']);
  }
}
