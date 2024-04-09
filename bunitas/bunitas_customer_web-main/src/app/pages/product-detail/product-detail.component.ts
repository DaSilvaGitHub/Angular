/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  public radioModel: string = 'Left';

  productId: any = '';

  productCover: any = '';
  productName: any = '';
  originalPrice: any = '';
  sellPrice: any = '';
  soldBy: any = '';
  rating: any = '';
  totalRating: any = '';
  descriptions: any = '';
  highlight: any = '';
  disclaimer: any = '';
  images: any[] = [];
  productCnt: number = 1;

  relatedProductsList: any[] = [];
  reviewList: any[] = [];

  private routeSubscription: Subscription;

  currentTab = '1';

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    nav: this.util.deviceType != 'desktop' ? false : true,
    startPosition: 0,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  customOptionTestimonial: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    nav: false,
    responsive: {
      0: {
        items: 3,
      },
    },
  };

  productOption: OwlOptions = {
    items: 4,
    loop: true,
    autoWidth: true,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 24,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      769: {
        items: 4,
      },
    },
  };

  reviewOption: OwlOptions = {
    items: 3,
    loop: true,
    autoWidth: true,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 20,
    nav: true,
    navText: ['←', '→'],
    responsive: {
      0: {
        items: 1,
      },
      769: {
        items: 3,
      },
    },
  };

  productInfo: any;
  apiCalled: boolean;
  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    private navParam: ActivatedRoute,
    public productCart: ProductCartService
  ) {
    if (this.navParam.snapshot.paramMap.get('id')) {
      this.apiCalled = false;
      this.productId = this.navParam.snapshot.paramMap.get('id');
      this.navParam.snapshot.paramMap.get('id');
      this.getProductInfo();
      this.getProductReviews();
    }

    this.router.events.subscribe((data: any) => {
      if (data instanceof NavigationEnd) {
        this.apiCalled = false;
        this.getProductInfo();
        this.getProductReviews();
      }
    });

    console.log(this.reviewList);
  }

  getProductInfo() {
    this.apiCalled = false;
    this.api
      .post('v1/products/getProductInfo', { id: this.productId })
      .then(
        (data: any) => {
          this.apiCalled = true;
          if (data && data.status == 200) {
            this.productCover = data.data.cover;
            this.productName = data.data.name;
            this.rating = data.data.rating;
            this.totalRating = data.data.total_rating;
            this.originalPrice = data.data.original_price;
            this.sellPrice = data.data.sell_price;
            this.soldBy = data.soldby.name;
            this.descriptions =
              data.data.descriptions != '' && data.data.descriptions != null
                ? data.data.descriptions
                : '';
            this.highlight =
              data.data.key_features != '' && data.data.key_features != null
                ? data.data.key_features
                : '';
            this.disclaimer =
              data.data.disclaimer != '' && data.data.disclaimer != null
                ? data.data.disclaimer
                : '';

            this.relatedProductsList = data.related.filter(
              (x) => x.id != this.productId
            );

            //Mocked data for testing
            this.relatedProductsList = this.relatedProductsList
              .concat(this.relatedProductsList)
              .concat(this.relatedProductsList)
              .concat(this.relatedProductsList)
              .concat(this.relatedProductsList);

            if (this.productCart.itemId.includes(data.data.id)) {
              data.data['quantity'] = this.getQuanity(data.data.id);
            } else {
              data.data['quantity'] = 0;
            }
            this.productInfo = data.data;
            if (
              ((x) => {
                try {
                  JSON.parse(x);
                  return true;
                } catch (e) {
                  return false;
                }
              })(data.data.images)
            ) {
              this.images = JSON.parse(data.data.images);
            } else {
              this.images = [];
            }
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

  getProductReviews() {
    this.util.start();
    this.api
      .post('v1/product_reviews/getMyReviews', { id: this.productId })
      .then(
        (data: any) => {
          this.util.stop();
          if (data && data.status == 200) {
            this.reviewList = data.data;

            //Mocked data for testing
            /*  this.reviewList = this.reviewList.concat([
              {
                image:
                  'https://s3-alpha-sig.figma.com/img/5e9c/105e/930aea22bd61806331b237ae5a782e5b?Expires=1706486400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hlpLQnXD05esFs1yewHASpJmp-o-EdBpmNg-Lt-yzkXqNJLLyq8kImA2ckqkHwzyI7CRcwAjzH2FVvfEyNNNkEKBesI0BaOHtpYaYnqJKBzYHFoWfCKVPi4NyJ8~paIaBFXRAD45N7aNGep0pUsj-hrFNg7uwO9qhXAzZUYiqCD1xU-YUyPhLXrxFTLzErO7mgPm9YFSRghLyIP~E6Vqpo20MX8dbqjf3ziPaFn9xnzVCvi1FX0vISa7C77qEWgjpBkN14cCNRmvNZN7J1MzDXRir~kSBA9NyaaoLVlmMHspUZTW59ROO3uZiwEW6qt0SNvxgjKO~SqbTJTgTF~MbQ__',
                author: 'Vikram jit Singh',
                text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia gat duis enim velit mollit.',
                rating: 5,
              },
              {
                image:
                  'https://s3-alpha-sig.figma.com/img/c70d/86f1/d1c90c49c43ed529aaca66de8d1cb3c0?Expires=1706486400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FCFAX5Iuh71iZhKzUJebtAX7IkiYfqcM7AWqJ9IYh0A0Zulof78zaSzN93VVshsXDJ1axYtyy2gaJ1EvOQdEL-TcJMTtBJvFhPZtOWfsVj-H7W9K22znaOumP5YIk1zFxN7Q~Lzhs~lI8Lo8Yfbb5BY5skIn8s6Mg7-02k5XQdIEtRFESVU2QBaNlSpfFkEfIS~qpGEZ34InR6UgDWnT6OsoCMY8C08RRDjdqeKgdS1chwcMF30zZYpFa4t8r4K8bFzDAGdzQLYKfRucqYt3QSK0R9GhWP9DNpK2HDWl10--ZxHaLkgmWmBHVisGHhGR2-XJmgD2~bLpFjX2OXKEIA__',
                author: 'Vikram jit Singh',
                text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia gat duis enim velit mollit.',
                rating: 4.8,
              },
              {
                image:
                  'https://s3-alpha-sig.figma.com/img/2868/95cf/2d53793f52bb015da6083877b97d6c62?Expires=1706486400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NXwSNSi2uXUiLmEwSeDAq58Oh7pZgH4zYQwByfbU0S67pPog0JlpJHo2S-YbzfKXOkcJ~ZxYyOW2EBH5v1USwoAPMyNAF4JgQagQmrA8orqk3n5pBe-AogcKgGVwi6PJsHcyn7ivqrRrtzywt21EiXKdvuRAFkaPvCuiwtUvMMIY~t3T3W8cj7xKzFElPZiYP4BpDt704hSZ4On09Wmt-hJHWwN3C1FrjhEgkCv0Ksok6Z3ezOPhLEBJ32OpPLrCd0jCW66nH7jbPXLCSQD-B1id8ALAV~x0zp5GtbVaBNuovxE-5w3hsuUV3oPfHsCU-yk55VbY3sdus3goI5LW2g__',
                author: 'Vikram jit Singh',
                text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia gat duis enim velit mollit.',
                rating: 4.1,
              },
            ]); */
            console.log(this.reviewList);
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

  addToCart(id?: string) {
    const existentProduct = this.productCart.cart.find(
      (item) => item.id === this.productInfo.id
    );
    if (existentProduct) {
      existentProduct.quantity = existentProduct.quantity + this.productCnt;
      this.productCart.updateQuantity(
        existentProduct.id,
        existentProduct.quantity
      );
      return;
    }

    if (this.productCart.cart.length == 0) {
      this.productInfo.quantity = this.productCnt;
      this.productCart.addItem(this.productInfo);
    } else {
      if (
        this.productCart.cart[0].freelacer_id == this.productInfo.freelacer_id
      ) {
        this.productInfo.quantity = this.productCnt;
        this.productCart.addItem(this.productInfo);
      } else {
        this.util.errorMessage(
          this.util.translate('We already have product with other freelancer')
        );
      }
    }
    this.util.successMessage(
      this.util.translate('You have set this item to cart')
    );

    console.log(this.productInfo.quantity);
  }

  addToFavorite() {
    const uid = localStorage.getItem('uid');

    if (!uid) this.util.publishModalPopup('login');
    else {
      const param = {
        pid: this.productId,
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
          }
        },
        (error) => {
          this.util.stop();
          this.util.errorMessage(this.util.translate(error.error.error));
        }
      );
    }
  }

  getQuanity(id: any) {
    const data = this.productCart.cart.filter((x) => x.id == id);
    return data[0].length;
  }

  onProductDetail(productId: string) {
    console.log(productId);

    this.router.navigate(['product-detail', productId]);
  }

  remove() {
    if (this.productInfo.quantity == 1) {
      this.productInfo.quantity = 0;
      this.productCart.removeItem(this.productInfo.id);
    } else {
      this.productInfo.quantity = this.productInfo.quantity - 1;
      this.productCart.updateQuantity(
        this.productInfo.id,
        this.productInfo.quantity
      );
    }
  }

  add() {
    this.productInfo.quantity = this.productInfo.quantity + 1;
    this.productCart.updateQuantity(
      this.productInfo.id,
      this.productInfo.quantity
    );
  }

  ngOnInit(): void {
    this.routeSubscription = this.navParam.paramMap.subscribe((params) => {
      // Verifica se o parâmetro 'id' mudou
      if (params.has('id') && params.get('id') !== this.productId) {
        // Se mudou, atualiza o ID e recarrega os dados
        this.productId = params.get('id');
        this.apiCalled = false;
        this.getProductInfo();
        this.getProductReviews();
      }
    });
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

  subProduct() {
    if (this.productCnt > 1) this.productCnt--;
  }

  addProduct() {
    this.productCnt++;
  }
}
