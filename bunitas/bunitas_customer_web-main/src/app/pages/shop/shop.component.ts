/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  categoryList: any[] = [];
  subCategoryList: any[] = [];
  productList: any[] = [];
  cateID: any = '';
  subCateID: any = '';
  subCategoryID: any = '';
  productId: any = '';
  topProducts: any[] = [];
  favoritedProducts: any[] = [];

  mobileCarrouselProps: {
    width: number;
    height: number;
  } = {
    width: this.util.deviceType != 'desktop' ? 250 : 120,
    height: this.util.deviceType != 'desktop' ? 300 : 140,
  };

  categoryCalled: boolean = false;
  subCategoryCalled: boolean = false;
  productsCalled: boolean = false;
  renderProductList = 0;

  inOffer: boolean = false;

  categoryOption: OwlOptions = {
    items: 1.5,
    loop: true,
    autoWidth: true,
    autoHeight: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: this.util.deviceType != 'desktop' ? 10 : 24,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      769: {
        items: 3.5,
      },
    },
  };

  productOption: OwlOptions = {
    items: 1,
    loop: true,
    autoWidth: true,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: this.util.deviceType != 'desktop' ? 10 : 24,
    nav: true,
    startPosition: 0,
    navText: ['←', '→'],
    responsive: {
      769: {
        items: 3,
      },
    },
  };

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    private navParam: ActivatedRoute,
    public productCart: ProductCartService,
    private cdr: ChangeDetectorRef
  ) {
    this.navParam.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.cateID = data.id;
        this.inOffer = true;
      } else {
        this.inOffer = false;
      }
    });
    this.getAllCategories();
  }

  onCateId(cateID: any) {
    this.cateID = cateID;
    const selected = this.categoryList.filter((x) => x.id == this.cateID);
    console.log(selected);
    if (selected && selected.length > 0) {
      if (selected[0].subCates && selected[0].subCates.length > 0) {
        this.subCategoryList = selected[0].subCates;
        this.getAllProducts();
      } else {
        this.subCategoryList = [];
        this.productList = [];
      }
    }
    //this.getAllSubCategories();
  }

  onSubCateId(subCateID: any) {
    this.subCateID = subCateID;
    this.getAllProducts();
  }

  onSubCategoryId(subCategoryID: any) {
    this.subCategoryID = subCategoryID;

    this.subCategoryList = this.categoryList.find(
      (cat) => cat.id === subCategoryID
    ).subCates;
    this.cateID = subCategoryID;
    this.productList = [];
    this.getAllProducts();
  }

  onProductDetail(productId: any) {
    this.router.navigate(['product-detail', productId]);
  }

  getAllCategories() {
    this.categoryCalled = false;
    this.categoryList = [];
    this.api
      .get('v1/product_categories/getHome')
      .then(
        (data: any) => {
          this.categoryCalled = true;
          this.subCategoryCalled = true;
          if (data && data.status == 200) {
            //this.categoryList = data.data
            //Mocked data
            this.categoryList = data.data
              .concat(data.data)
              .map((cat, i) => ({ ...cat, id: i + 1 }));
            if (this.categoryList.length > 0) {
              if (this.inOffer == false) {
                this.cateID = this.categoryList[0].id;
              }
              this.subCategoryList = data.data[0].subCates;
              this.subCateID = this.subCategoryList[0].id;
              this.getAllProducts();
              //this.getAllSubCategories();
            }
          }
        },
        (error) => {
          this.subCategoryCalled = true;
          this.categoryCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.subCategoryCalled = true;
        this.categoryCalled = true;
        this.util.apiErrorHandler(error);
      });
  }

  getAllSubCategories() {
    this.subCategoryCalled = false;
    this.subCategoryList = [];
    this.api
      .post('v1/product_sub_categories/getbycate', { id: this.cateID })
      .then(
        (data: any) => {
          this.subCategoryCalled = true;
          console.log(data);
          if (data && data.status == 200) {
            this.subCategoryList = data.data;
            if (this.subCategoryList.length > 0) {
              this.subCateID = this.subCategoryList[0].id;
              this.getAllProducts();
            }
            console.log(this.subCategoryList);
          }
        },
        (error) => {
          console.log('Error', error);
          this.subCategoryCalled = true;
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        console.log('Err', error);
        this.subCategoryCalled = true;
        this.util.apiErrorHandler(error);
      });
  }

  getAllProducts() {
    this.productList = [];
    this.productsCalled = false;
    this.api
      .post('v1/products/getProducts', {
        cate_id: this.cateID,
        sub_cate_id: this.subCateID,
      })
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
            this.favoritedProducts = this.util.favoriteProducts;
            if (data.data.length <= 2)
              this.productOption.items = data.data.length;
            console.log(this.productOption.items);
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

  addToCart(index: any) {
    const existentProduct = this.productCart.cart.find(
      (item) => item.id === this.productList[index].id
    );
    if (existentProduct) {
      existentProduct.quantity = existentProduct.quantity + 1;
      this.productCart.updateQuantity(
        existentProduct.id,
        existentProduct.quantity
      );
      return;
    }

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

  getProductsFavorite(id) {
    return this.util.favoriteProducts.includes(id);
  }

  addToFavorite(id: any) {
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

          this.util.favoriteProducts.push(data.favorite.pid);
        }
      },
      (error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate(error.error.error));
      }
    );

    // to re-render component then add to favorite
    this.renderProductList++;
    this.cdr.detectChanges();
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

  ngOnInit(): void {}

  goToProductDetail() {
    this.router.navigate(['/product-detail']);
  }

  goToProductCheckout() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      this.router.navigate(['/product-checkout']);
    } else {
      this.util.publishModalPopup('login');
    }
  }
}
