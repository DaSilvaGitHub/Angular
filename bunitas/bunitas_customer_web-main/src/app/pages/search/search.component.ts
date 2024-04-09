/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface SearchInfoProps {
  icon: SafeHtml;
  label: string;
  placeholder: string;
  value: string;
  ngModelChange?: ($event: any) => void;
  dropDown?: boolean;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  lat: string = '';
  lng: string = '';
  address: string = '';
  placeId: string = '';
  treatmentCategory: string = '';
  categoryId: string = '';
  categoryType: string = '';
  zoom = 12; // example zoom level
  isDropdownOpen = false;
  salonList: any = [];
  iconUrl: any = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  places = [];
  autocompleteTreatmentItems: any = [];
  autocompleteLocationItems: any = [];
  selectedSort: any = '0';
  selectedSortTemp: any = '0';
  apiCalled: boolean = false;
  price: any = '';
  priceTemp: any = '';
  tab: 'cards' | 'map' = 'cards';

  searchInfo: SearchInfoProps[];
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
        items: 1.5,
      },
      1000: {
        items: 4,
      },
    },
  };

  @ViewChild('searchFilterModal') public searchFilterModal: ModalDirective;

  constructor(
    public util: UtilService,
    public api: ApiService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private sammiter: DomSanitizer
  ) {
    this.autocompleteLocationItems = [];
  }

  ngOnInit(): void {
    this.getParams();
    this.searchInfo = [
      {
        icon: this.sammiter.bypassSecurityTrustHtml(
          '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.9998 18.8931C13.1598 18.8931 10.8398 16.5864 10.8398 13.7331C10.8398 10.8798 13.1598 8.58643 15.9998 8.58643C18.8398 8.58643 21.1598 10.8931 21.1598 13.7464C21.1598 16.5998 18.8398 18.8931 15.9998 18.8931ZM15.9998 10.5864C14.2665 10.5864 12.8398 11.9998 12.8398 13.7464C12.8398 15.4931 14.2532 16.9064 15.9998 16.9064C17.7465 16.9064 19.1598 15.4931 19.1598 13.7464C19.1598 11.9998 17.7332 10.5864 15.9998 10.5864Z" fill="#5C6483"/><path d="M16.0002 30.3465C14.0269 30.3465 12.0402 29.5998 10.4936 28.1198C6.56023 24.3332 2.21357 18.2932 3.85357 11.1065C5.33357 4.5865 11.0269 1.6665 16.0002 1.6665C16.0002 1.6665 16.0002 1.6665 16.0136 1.6665C20.9869 1.6665 26.6802 4.5865 28.1602 11.1198C29.7869 18.3065 25.4402 24.3332 21.5069 28.1198C19.9602 29.5998 17.9736 30.3465 16.0002 30.3465ZM16.0002 3.6665C12.1202 3.6665 7.13357 5.73317 5.81357 11.5465C4.37357 17.8265 8.32023 23.2398 11.8936 26.6665C14.2002 28.8932 17.8136 28.8932 20.1202 26.6665C23.6802 23.2398 27.6269 17.8265 26.2136 11.5465C24.8802 5.73317 19.8802 3.6665 16.0002 3.6665Z" fill="#5C6483"/></svg>'
        ),
        label: 'Location',
        placeholder: 'Enter Your Location',
        value: this.address,
        ngModelChange: ($event) => this.onSearchChangeLocation($event),
      },
      {
        icon: this.sammiter.bypassSecurityTrustHtml(
          '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.6665 7.6665C10.1198 7.6665 9.6665 7.21317 9.6665 6.6665V2.6665C9.6665 2.11984 10.1198 1.6665 10.6665 1.6665C11.2132 1.6665 11.6665 2.11984 11.6665 2.6665V6.6665C11.6665 7.21317 11.2132 7.6665 10.6665 7.6665Z" fill="#5C6483"/><path d="M21.3335 7.6665C20.7868 7.6665 20.3335 7.21317 20.3335 6.6665V2.6665C20.3335 2.11984 20.7868 1.6665 21.3335 1.6665C21.8802 1.6665 22.3335 2.11984 22.3335 2.6665V6.6665C22.3335 7.21317 21.8802 7.6665 21.3335 7.6665Z" fill="#5C6483"/><path d="M11.3333 19.3331C11.16 19.3331 10.9867 19.2931 10.8267 19.2264C10.6533 19.1598 10.52 19.0664 10.3867 18.9464C10.1467 18.6931 10 18.3598 10 17.9998C10 17.8264 10.04 17.6531 10.1067 17.4931C10.1733 17.3331 10.2667 17.1864 10.3867 17.0531C10.52 16.9331 10.6533 16.8397 10.8267 16.7731C11.3067 16.5731 11.9067 16.6798 12.28 17.0531C12.52 17.3064 12.6667 17.6531 12.6667 17.9998C12.6667 18.0798 12.6533 18.1731 12.64 18.2664C12.6267 18.3464 12.6 18.4264 12.56 18.5064C12.5333 18.5864 12.4933 18.6664 12.44 18.7464C12.4 18.8131 12.3333 18.8798 12.28 18.9464C12.0267 19.1864 11.68 19.3331 11.3333 19.3331Z" fill="#5C6483"/><path d="M15.9998 19.3332C15.8265 19.3332 15.6532 19.2932 15.4932 19.2265C15.3198 19.1598 15.1865 19.0665 15.0532 18.9465C14.8132 18.6932 14.6665 18.3598 14.6665 17.9998C14.6665 17.8265 14.7065 17.6532 14.7732 17.4932C14.8398 17.3332 14.9332 17.1865 15.0532 17.0532C15.1865 16.9332 15.3198 16.8398 15.4932 16.7731C15.9732 16.5598 16.5732 16.6798 16.9465 17.0532C17.1865 17.3065 17.3332 17.6532 17.3332 17.9998C17.3332 18.0798 17.3198 18.1732 17.3065 18.2665C17.2932 18.3465 17.2665 18.4265 17.2265 18.5065C17.1998 18.5865 17.1598 18.6665 17.1065 18.7465C17.0665 18.8132 16.9998 18.8798 16.9465 18.9465C16.6932 19.1865 16.3465 19.3332 15.9998 19.3332Z" fill="#5C6483"/><path d="M20.6668 19.3332C20.4935 19.3332 20.3202 19.2932 20.1602 19.2265C19.9868 19.1598 19.8535 19.0665 19.7202 18.9465C19.6668 18.8798 19.6135 18.8132 19.5602 18.7465C19.5068 18.6665 19.4668 18.5865 19.4402 18.5065C19.4002 18.4265 19.3735 18.3465 19.3602 18.2665C19.3468 18.1732 19.3335 18.0798 19.3335 17.9998C19.3335 17.6532 19.4802 17.3065 19.7202 17.0532C19.8535 16.9332 19.9868 16.8398 20.1602 16.7731C20.6535 16.5598 21.2402 16.6798 21.6135 17.0532C21.8535 17.3065 22.0002 17.6532 22.0002 17.9998C22.0002 18.0798 21.9868 18.1732 21.9735 18.2665C21.9602 18.3465 21.9335 18.4265 21.8935 18.5065C21.8668 18.5865 21.8268 18.6665 21.7735 18.7465C21.7335 18.8132 21.6668 18.8798 21.6135 18.9465C21.3602 19.1865 21.0135 19.3332 20.6668 19.3332Z" fill="#5C6483"/><path d="M11.3333 24.0001C11.16 24.0001 10.9867 23.9601 10.8267 23.8934C10.6667 23.8268 10.52 23.7334 10.3867 23.6134C10.1467 23.3601 10 23.0134 10 22.6668C10 22.4934 10.04 22.3201 10.1067 22.1601C10.1733 21.9867 10.2667 21.8401 10.3867 21.7201C10.88 21.2268 11.7867 21.2268 12.28 21.7201C12.52 21.9734 12.6667 22.3201 12.6667 22.6668C12.6667 23.0134 12.52 23.3601 12.28 23.6134C12.0267 23.8534 11.68 24.0001 11.3333 24.0001Z" fill="#5C6483"/><path d="M15.9998 24.0001C15.6532 24.0001 15.3065 23.8534 15.0532 23.6134C14.8132 23.3601 14.6665 23.0134 14.6665 22.6668C14.6665 22.4934 14.7065 22.3201 14.7732 22.1601C14.8398 21.9867 14.9332 21.8401 15.0532 21.7201C15.5465 21.2268 16.4532 21.2268 16.9465 21.7201C17.0665 21.8401 17.1598 21.9867 17.2265 22.1601C17.2932 22.3201 17.3332 22.4934 17.3332 22.6668C17.3332 23.0134 17.1865 23.3601 16.9465 23.6134C16.6932 23.8534 16.3465 24.0001 15.9998 24.0001Z" fill="#5C6483"/><path d="M20.6668 23.9999C20.3202 23.9999 19.9735 23.8532 19.7202 23.6132C19.6002 23.4932 19.5068 23.3466 19.4402 23.1732C19.3735 23.0132 19.3335 22.8399 19.3335 22.6666C19.3335 22.4932 19.3735 22.3199 19.4402 22.1599C19.5068 21.9865 19.6002 21.8399 19.7202 21.7199C20.0268 21.4132 20.4935 21.2665 20.9202 21.3599C21.0135 21.3732 21.0935 21.3999 21.1735 21.4399C21.2535 21.4665 21.3335 21.5066 21.4135 21.5599C21.4802 21.5999 21.5468 21.6666 21.6135 21.7199C21.8535 21.9732 22.0002 22.3199 22.0002 22.6666C22.0002 23.0132 21.8535 23.3599 21.6135 23.6132C21.3602 23.8532 21.0135 23.9999 20.6668 23.9999Z" fill="#5C6483"/><path d="M27.3332 13.1201H4.6665C4.11984 13.1201 3.6665 12.6668 3.6665 12.1201C3.6665 11.5735 4.11984 11.1201 4.6665 11.1201H27.3332C27.8798 11.1201 28.3332 11.5735 28.3332 12.1201C28.3332 12.6668 27.8798 13.1201 27.3332 13.1201Z" fill="#5C6483"/><path d="M21.3333 30.3332H10.6667C5.8 30.3332 3 27.5332 3 22.6665V11.3332C3 6.4665 5.8 3.6665 10.6667 3.6665H21.3333C26.2 3.6665 29 6.4665 29 11.3332V22.6665C29 27.5332 26.2 30.3332 21.3333 30.3332ZM10.6667 5.6665C6.85333 5.6665 5 7.51984 5 11.3332V22.6665C5 26.4798 6.85333 28.3332 10.6667 28.3332H21.3333C25.1467 28.3332 27 26.4798 27 22.6665V11.3332C27 7.51984 25.1467 5.6665 21.3333 5.6665H10.6667Z" fill="#5C6483"/></svg>'
        ),
        label: 'Date',
        placeholder: 'Select your date',
        value: '',
      },
      {
        icon: this.sammiter.bypassSecurityTrustHtml(
          '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.0002 16.9998C11.7735 16.9998 8.3335 13.5598 8.3335 9.33317C8.3335 5.1065 11.7735 1.6665 16.0002 1.6665C20.2268 1.6665 23.6668 5.1065 23.6668 9.33317C23.6668 13.5598 20.2268 16.9998 16.0002 16.9998ZM16.0002 3.6665C12.8802 3.6665 10.3335 6.21317 10.3335 9.33317C10.3335 12.4532 12.8802 14.9998 16.0002 14.9998C19.1202 14.9998 21.6668 12.4532 21.6668 9.33317C21.6668 6.21317 19.1202 3.6665 16.0002 3.6665Z" fill="#5C6483"/><path d="M27.4535 30.3333C26.9069 30.3333 26.4535 29.88 26.4535 29.3333C26.4535 24.7333 21.7602 21 16.0002 21C10.2402 21 5.54687 24.7333 5.54687 29.3333C5.54687 29.88 5.09354 30.3333 4.54687 30.3333C4.00021 30.3333 3.54688 29.88 3.54688 29.3333C3.54688 23.64 9.13354 19 16.0002 19C22.8669 19 28.4535 23.64 28.4535 29.3333C28.4535 29.88 28.0002 30.3333 27.4535 30.3333Z" fill="#5C6483"/></svg>'
        ),
        label: 'Treatment',
        placeholder: 'Choose Treatment',
        value: this.treatmentCategory,
        ngModelChange: ($event) => this.onSearchChangeTreatmentCategory($event),
        dropDown: true,
      },
    ];

    this.initSearch();
  }

  getParams() {
    this.treatmentCategory =
      this.activatedRouter.snapshot.queryParams['category'];
    this.categoryId = this.activatedRouter.snapshot.queryParams['category_id'];
    this.categoryType =
      this.activatedRouter.snapshot.queryParams['category_type'];
    this.address = this.activatedRouter.snapshot.queryParams['address'];
    this.placeId = this.activatedRouter.snapshot.queryParams['place_id'];
  }

  initSearch() {
    if (this.address == undefined || this.placeId == undefined) {
      // get current location when the location is not selected
      this.getCurrentAddress();
    } else {
      this.selectSearchLocationResult(this.placeId, this.address);
    }
  }

  getSalonData() {
    // window.history.pushState({}, "", "/new-url");

    this.util.start();
    this.apiCalled = false;
    this.places = [];
    this.salonList = [];
    const param = {
      lat: this.lat,
      lng: this.lng,
      category_id: this.categoryId,
      category_type: this.categoryType,
      price: this.price,
      sort: this.selectedSort,
    };
    this.api
      .post('v1/salon/search', param)
      .then(
        (data: any) => {
          this.apiCalled = true;
          this.util.stop();
          console.log(data.data);

          if (data && data.status == 200) {
            this.salonList = data.data;

            this.salonList.forEach((salon) => {
              const distance = this.calculateDistance(
                salon.lat,
                salon.lng,
                Number(this.lat),
                Number(this.lng)
              );

              if (distance <= 50) this.places.push(salon);
            });
          } else {
          }
        },
        (error) => {
          this.apiCalled = true;
        }
      )
      .catch((error) => {
        this.apiCalled = true;
        this.util.stop();
      });
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const degreesToRadians = (deg: number): number => {
      return deg * (Math.PI / 180);
    };

    const EARTH_RADIUS = 6371; // Earth radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c; // Distance in kilometers
    return distance;
  }

  onSearchChangeTreatmentCategory(event) {
    this.autocompleteTreatmentItems = [];

    let query = this.searchInfo[2].value;
    this.util.categories.forEach((category) => {
      if (category.name.includes(query)) {
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
    this.searchInfo[2].value = item.name;
    this.categoryType = item.type;
    this.categoryId = item.id;
  }

  onSearchChangeLocation(event) {
    if (this.searchInfo[0].value == '') {
      this.autocompleteLocationItems = [];
      return;
    }
    this.util.GoogleAutocomplete.getPlacePredictions(
      { input: event },
      (predictions, status) => {
        if (predictions && predictions.length > 0) {
          this.autocompleteLocationItems = predictions;
        }
      }
    );
  }

  selectSearchLocationResult(placeId, address) {
    this.autocompleteLocationItems = [];
    this.searchInfo[0].value = address;
    this.util.geocoder.geocode({ placeId: placeId }, (results, status) => {
      if (status == 'OK' && results[0]) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        this.getSalonData();
      }
    });
  }

  getAddress(lat, lng) {
    this.util.stop();
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ location: location }, (results, status) => {
      if (results && results.length) {
        this.lat = lat;
        this.address = results[0].formatted_address;
        this.lng = lng;
        this.getSalonData();
      }
    });
  }

  removeTreatmentCategorySearchKey() {
    this.treatmentCategory = '';
    this.autocompleteTreatmentItems = [];
    this.categoryId = '';
    this.categoryType = '';
  }

  removeLocationSearchKey() {
    this.address = '';
    this.autocompleteLocationItems = [];
    this.lat = '';
    this.lng = '';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option) {
    this.selectOption = option;
    this.isDropdownOpen = false;
  }

  onMouseClick(infoWindow, gm) {
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
  }

  onMouseOver(gmaker) {
    gmaker.iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  }

  locate() {
    if (this.searchInfo[2].value == undefined) {
      this.getCurrentAddress();
    } else {
      this.getSalonData();
    }
  }

  getCurrentAddress() {
    if (window.navigator && window.navigator.geolocation) {
      this.util.start();
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          this.util.stop();
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
            default:
              console.log('defual');
          }
        }
      );
    }
  }

  onSalon(salonUID: String, name: String) {
    const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['salons', salonUID, routeName]);
  }

  showFilterModal() {
    this.searchFilterModal.show();
  }

  clickFilter(searchFilterModal) {
    this.searchFilterModal.hide();
    this.price = this.priceTemp;
    this.selectedSort = this.selectedSortTemp;
    this.getSalonData();
  }

  changeTab(tab: 'cards' | 'map') {
    this.tab = tab;
  }
}
