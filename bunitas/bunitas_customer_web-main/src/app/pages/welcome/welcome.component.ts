/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { AppComponent } from 'src/app/app.component';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  autocomplete1: { query_treatment: string; query_location: string };
  autocompleteTreatmentItems: any = [];
  autocompleteLocationItems: any = [];
  selectedLat: any;
  selectedLng: any;
  selectedTreatmentCategoryId: any;
  selectedTreatmentCategoryType: any;
  selectedPlaceId: any;

  @ViewChild('downloadLocation') downloadLocation: ElementRef;

  searchFocus: boolean = false;
  traeatmentFocus: boolean = false;
  date: any;
  time: any;

  blogs: any;

  recommendedSalonList: any = [];

  productsSliderOptions: OwlOptions = {
    items: 3,
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
    rtl: this.util.deviceType === 'desktop',
    navText: this.util.deviceType === 'desktop' ? ['→', '←'] : ['←', '→'],
    responsive: {
      0: {
        items: 3,
      },
      769: {
        items: 2.5,
      },
    },
  };

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    public appComponent: AppComponent
  ) {
    this.autocomplete1 = { query_treatment: '', query_location: '' };
    this.autocompleteLocationItems = [];
    this.getBlogs();
    // this.getRecommendedSalons();
  }

  ngOnInit(): void {}

  goToRest() {
    this.util.publishModalPopup('location');
  }

  getBlogs() {
    this.api
      .get('v1/blogs/getTop')
      .then(
        (data: any) => {
          if (data && data.status == 200) {
            this.blogs = data.data;
          }
        },
        (error) => {
          this.util.errorMessage(this.util.translate('something went wrong'));
        }
      )
      .catch((error: any) => {
        this.util.errorMessage(this.util.translate('something went wrong'));
      });
  }

  apiCalled: boolean = false;

  getRecommendedSalons() {
    this.apiCalled = false;

    const uid = localStorage.getItem('uid');
    if (uid && uid !== null && uid !== 'null') {
      const param = {
        uid: uid,
        lat: localStorage.getItem('lat'),
        lng: localStorage.getItem('lng'),
      };
      this.api
        .post_private('v1/salon/getRecommenedSalons', param)
        .then(
          (data: any) => {
            this.apiCalled = true;
            if (data && data.status == 200) {
              this.recommendedSalonList = data.data;
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
  }

  onServiceListing(id: any, name: any) {
    const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['/service-listing', id, routeName]);
  }

  onSalon(salonUID: String, name: String) {
    const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['salons', salonUID, routeName]);
  }

  goToBlogs(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        title: item.title.replace(/\s+/g, '-').toLowerCase(),
      },
    };
    this.router.navigate(['/blog-detail'], param);
  }
  locate() {
    const param: NavigationExtras = {
      queryParams: {
        category: this.autocomplete1.query_treatment,
        category_id: this.selectedTreatmentCategoryId,
        category_type: this.selectedTreatmentCategoryType, // 0: main category, 1: sub category
        address: this.autocomplete1.query_location,
        place_id: this.selectedPlaceId,
      },
    };
    this.router.navigate(['search'], param);
  }

  onSearchChangeTreatmentCategory(event) {
    this.autocompleteTreatmentItems = [];

    let query = this.autocomplete1.query_treatment;
    this.util.categories.forEach((category) => {
      let categoryName = category.name.toLowerCase();
      if (categoryName.includes(query.toLowerCase())) {
        category.type = 0; // parent
        this.autocompleteTreatmentItems.push(category);
        category.types.forEach((type) => {
          type.type = 1; // child
          this.autocompleteTreatmentItems.push(type);
        });
      }
    });
  }

  selectSearchTreatmentResult(item) {
    this.autocompleteTreatmentItems = [];
    this.autocomplete1.query_treatment = item.name;
    this.selectedTreatmentCategoryType = item.type;
    this.selectedTreatmentCategoryId = item.id;
  }

  onSearchChangeLocation(event) {
    if (this.autocomplete1.query_location == '') {
      this.autocompleteLocationItems = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.util.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete1.query_location },
      (predictions, status) => {
        if (predictions && predictions.length > 0) {
          this.autocompleteLocationItems = predictions;
        }
      }
    );
  }

  selectSearchLocationResult(item) {
    localStorage.setItem('addsSelected', 'true');
    this.autocompleteLocationItems = [];
    this.autocomplete1.query_location = item.description;
    this.selectedPlaceId = item.place_id;
    this.util.geocoder.geocode(
      { placeId: item.place_id },
      (results, status) => {
        if (status == 'OK' && results[0]) {
          this.selectedLat = results[0].geometry.location.lat();
          this.selectedLng = results[0].geometry.location.lng();
          this.selectedLng = results[0].geometry.location.lng();
        }
      }
    );
  }

  getAddress(lat, lng) {
    this.util.stop();
    this.util.geocoder.geocode(
      { location: this.util.getLocation(lat, lng) },
      (results, status) => {
        if (results && results.length) {
          localStorage.setItem('location', 'true');
          localStorage.setItem('lat', lat);
          localStorage.setItem('address', results[0].formatted_address);
          localStorage.setItem('lng', lng);
          this.router.navigate(['home']);
        }
      },
      (error) => {}
    );
  }

  getContent(item) {
    return item.short_content.length > 50
      ? item.short_content.slice(0, 50) + '...'
      : item.short_content;
  }

  getDate(item) {
    return moment(item).format('DD');
  }

  getMonth(item) {
    return moment(item).format('MMM');
  }

  removeTreatmentCategorySearchKey() {
    this.autocomplete1.query_treatment = '';
    this.autocompleteTreatmentItems = [];
    this.selectedTreatmentCategoryId = '';
  }

  removeLocationSearchKey() {
    this.autocomplete1.query_location = '';
    this.autocompleteLocationItems = [];
    this.selectedLat = '';
    this.selectedLng = '';
  }

  scrollToDownload() {
    this.downloadLocation.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  replaceString(input: string): string {
    return input.replace(
      this.autocomplete1.query_treatment,
      '<b>' + this.autocomplete1.query_treatment + '</b>'
    );
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  goToPartner() {
    this.router.navigate(['/partner']);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  setSearchFocusFalse() {
    setTimeout(() => {
      this.searchFocus = false;
    }, 100);
  }

  settTreatmentFocusFalse() {
    setTimeout(() => {
      this.traeatmentFocus = false;
    }, 100);
  }
}
