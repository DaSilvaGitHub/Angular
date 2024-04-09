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
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationExtras,
  Router,
} from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
declare var google;

interface IChats {
  sender_first_name: string;
  sender_id: number;
  receiver_name: string;
  receiver_id: number;
  sender_last_name: string;
  sender_cover: string;
  receiver_last_name: string;
  receiver_cover: string;
  sender_type: string;
  receiver_type: string;
  last_message: string;
  last_message_type: string | null;
  updated_at: Date | string;
}

interface ICurrentChat {
  receiverName: string; // Concatenação do primeiro e último nome do remetente
  receiverCover?: string; // Possivelmente uma capa do destinatário
  receiverId: number; // ID do destinatário
  senderId: number; // ID do remetente
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('addressFromMap') public addressFromMap: ModalDirective;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild('changedPlace') public changedPlace: ModalDirective;

  tabId = 'profile';
  haveItems: boolean = false;
  myOrders: any[] = [];
  dummy = Array(10);
  dummyOrders = Array(10);
  dummyAddress = Array(10);
  myaddress: any[] = [];
  page = 1;

  address_id: any;
  lat: any;
  lng: any;
  address: any = '';
  house: any = '';
  landmark: any = '';
  title: any = 0;
  // pincode: any = '';
  map: any;
  marker: any;

  // autocomplete1: { 'query': string };
  query: any = '';
  autocompleteLocationItems: any = [];
  addressSelected: boolean;

  editClicked: boolean;

  editProfileClick: boolean;
  changePasswordClicked: boolean;

  first_name: any = '';
  last_name: any = '';
  mobile: any;
  gender: any;
  old_password: any = '';
  new_password: any = '';
  confirm_password: any = '';

  addressName = ['Home', 'Work', 'Other'];
  optionalPhone: any = '';

  orderList: any[] = [];
  salonList: any[] = [];
  beauticiationList: any[] = [];
  productList: any[] = [];
  treatmentsList: any[] = [];

  chats: IChats[] = [];

  messageState: 'chats' | 'onMessage' = 'chats';
  chatMessages: Record<string, any>[] = [];
  currentParticipants: ICurrentChat = {
    receiverId: 0,
    receiverName: '',
    senderId: 0,
    receiverCover: '',
  };
  messageInput: string;
  roomId: number = 0;

  constructor(
    private route: ActivatedRoute,
    public util: UtilService,
    public api: ApiService,
    private router: Router,
    private chmod: ChangeDetectorRef,
    public productCart: ProductCartService
  ) {
    if (
      this.route.snapshot.paramMap.get('id') &&
      this.route.snapshot.paramMap.get('from') &&
      this.util.userInfo &&
      this.util.userInfo.first_name
    ) {
      const id = this.route.snapshot.paramMap.get('id');
      this.tabId = this.route.snapshot.paramMap.get('from');
      this.query = '';
      this.gender = this.util.userInfo.gender;
      this.first_name = this.util.userInfo.first_name;
      this.last_name = this.util.userInfo.last_name;
      this.mobile = this.util.userInfo.mobile;
      this.autocompleteLocationItems = [];
      this.addressSelected = false;
      this.editProfileClick = true;
      if (this.tabId == 'appointment') {
        this.getMyAppointments('', false);
      } else if (this.tabId == 'address') {
        this.getAddress();
      } else if (this.tabId == 'product-order') {
        this.getMyOrders();
      } else if (this.tabId == 'favorite') {
        this.getFavorites();
      } else {
        this.getProfileInfo();
      }
    } else {
      this.router.navigate(['']);
    }
    this.router.events.subscribe((data: any) => {
      if (data instanceof NavigationEnd) {
        this.tabId = this.route.snapshot.paramMap.get('from');
        if (this.tabId == 'appointment') {
          this.getMyAppointments('', false);
        } else if (this.tabId == 'address') {
          this.getAddress();
        } else if (this.tabId == 'product-order') {
          this.getMyOrders();
        } else if (this.tabId == 'favorite') {
          this.getFavorites();
        } else {
          this.getProfileInfo();
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.tabId == 'message') {
      this.getChats();
    }
  }

  getMyOrders() {
    const param = {
      id: localStorage.getItem('uid'),
    };
    this.dummyOrders = Array(5);
    this.api
      .post_private('v1/product_order/getByUID', param)
      .then(
        (data: any) => {
          this.dummyOrders = [];
          if (data && data.status == 200 && data.data && data.data) {
            data.data.forEach((element: any) => {
              element.orders = JSON.parse(element.orders);
            });
            data.data.forEach((element: any) => {
              element.address = JSON.parse(element.address);
            });
            this.orderList = data.data;
          }
        },
        (error) => {
          this.dummyOrders = [];
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.dummyOrders = [];
        this.util.apiErrorHandler(error);
      });
  }

  changeTab(val) {
    this.tabId = val;
  }

  getProfile() {
    return this.util.userInfo && this.util.userInfo.cover
      ? this.api.mediaURL + this.util.userInfo.cover
      : '';
  }

  pushOutsideLink(item) {
    this.router.navigate([item]);
  }

  openLink(item) {
    const name = (
      this.util.userInfo.first_name +
      '-' +
      this.util.userInfo.last_name
    ).toLowerCase();
    this.tabId = item;
    if (this.tabId == 'appointment') {
      this.getMyAppointments('', false);
    }
    if (this.tabId == 'message') {
      this.getChats();
      this.messageState = 'chats';
    }

    if (this.tabId == 'address') {
      this.getAddress();
    }
    this.router.navigate(['user', name, item]);
    this.chmod.detectChanges();
  }

  async getChats() {
    const chats = (await this.api.post_private('v1/chats/getChatListBUid', {
      id: localStorage.getItem('uid'),
    })) as {
      data: IChats[];
    };

    chats.data.map((c) => (c.updated_at = moment(c.updated_at).fromNow()));
    this.chats = chats.data;
    console.log(chats.data);
  }

  doRefresh(event) {
    this.getMyAppointments(event, true);
  }

  getMyAppointments(event, haveRefresh) {
    const param = {
      id: localStorage.getItem('uid'),
    };
    this.dummy = Array(10);
    this.api
      .post_private('v1/appoinments/getMyList', param)
      .then(
        (data: any) => {
          this.dummy = [];
          if (data && data.status == 200 && data.data.length) {
            this.haveItems = true;
            data.data.forEach((element) => {
              // element.orders = JSON.parse(element.orders);
              if (
                ((x) => {
                  try {
                    JSON.parse(x);
                    return true;
                  } catch (e) {
                    return false;
                  }
                })(element.items)
              ) {
                element.items = JSON.parse(element.items);
              }
            });
            this.myOrders = data.data;
          } else {
            this.haveItems = false;
            // this.router.navigate(['']);
          }
          this.chmod.detectChanges();
          if (haveRefresh) {
            event.target.complete();
          }
        },
        (error) => {
          this.dummy = [];
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.dummy = [];
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  getFavorites() {
    const param = {
      id: localStorage.getItem('uid'),
    };
    this.api
      .post_private('v1/favorite/getFavorite', param)
      .then(
        (data: any) => {
          console.log(data);

          this.salonList = data.salon;
          this.beauticiationList = data.beauticiation;
          this.productList = data.product;
          this.treatmentsList = data.treatments;
          if (data && data.product && data.product.length > 0) {
            data.product.forEach((productList: any) => {
              if (this.productCart.itemId.includes(productList.id)) {
                productList['quantity'] = this.getQuanity(productList.id);
              } else {
                productList['quantity'] = 0;
              }
            });
          }
          this.productList = data.product;
        },
        (error) => {
          this.util.apiErrorHandler(error);
        }
      )
      .catch((error) => {
        this.util.apiErrorHandler(error);
      });
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

  getCart() {
    this.router.navigate(['/tabs']);
  }

  openAppointments(orderId) {
    this.router.navigate(['appointment-details', orderId]);
  }

  openOrderDetails(orderId) {
    this.router.navigate(['order-details', orderId]);
  }

  getDate(date) {
    return moment(date).format('llll');
  }

  onSalon(salonUID: String, name: String) {
    const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['salons', salonUID, routeName]);
  }

  onFreelancerDetail(freelancerId: any, name: any) {
    const routeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['service', freelancerId, routeName]);
  }

  onProductDetail(productId: any) {
    this.router.navigate(['product-detail', productId]);
  }

  goToAllFavoriteList(type: String) {
    this.router.navigate(['favorite', type, 'list']);
  }

  getAddress() {
    const param = {
      id: localStorage.getItem('uid'),
    };
    this.api
      .post_private('v1/address/getByUID', param)
      .then(
        (data) => {
          this.dummyAddress = [];
          if (data && data.status == 200) {
            this.myaddress = data.data;
            this.chmod.detectChanges();
          } else {
            // this.router.navigate(['']);
          }
        },
        (error) => {
          this.dummyAddress = [];
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.dummyAddress = [];
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  addNewAddress() {
    ///
    this.util.start();
    this.editClicked = false;
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          this.util.stop();
          this.addressSelected = false;
          this.addressFromMap.show();
          this.getAddressFromMaps(
            position.coords.latitude,
            position.coords.longitude
          );
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
          }
        }
      );
    } else {
      this.util.stop();
    }
  }

  getAddressFromMaps(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ location: location }, (results, status) => {
      if (results && results.length) {
        this.address = results[0].formatted_address;
        this.chmod.detectChanges();
        this.loadMap(lat, lng);
      }
    });
  }

  loadMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [{ saturation: -100 }],
      },
    ];

    const mapOptions = {
      zoom: 16,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Bunitas Salon by Cosonas'],
      },
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Bunitas Salon by cosonas', mapType);
    this.map.setMapTypeId('Bunitas Salon by cosonas');
    this.chmod.detectChanges();
    this.addMarker(location);
  }

  addMarker(location) {
    const dot = {
      url: 'assets/map-marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: dot,
    });
  }

  changeAddress() {
    this.addressFromMap.hide();
    this.changedPlace.show();
  }

  deleteAddress(item) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('to delete this address'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: this.util.translate('Cancel'),
    }).then((data) => {
      if (data && data.value) {
        this.util.start();
        const param = {
          id: item.id,
        };
        this.api
          .post_private('v1/address/delete', param)
          .then(
            (info) => {
              this.util.stop();
              this.getAddress();
            },
            (error) => {
              this.util.stop();
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          )
          .catch((error) => {
            this.util.stop();
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });
      }
    });
  }

  chooseFromMaps() {
    this.addressSelected = true;
    document.getElementById('map').style.height = '150px';
  }

  addAddress() {
    this.addressFromMap.hide();
    if (this.address == '' || this.landmark == '' || this.house == '') {
      //this.pincode == '' || this.optionalPhone == ''
      this.util.errorMessage(this.util.translate('all fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder();
    this.util.start();
    geocoder.geocode(
      { address: this.house + ' ' + this.landmark + ' ' + this.address },
      (results, status) => {
        if (status == 'OK' && results && results.length) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          var param = {
            uid: localStorage.getItem('uid'),
            is_default: 1,
            optional_phone: this.optionalPhone,
            title: this.title,
            address: this.address,
            house: this.house,
            landmark: this.landmark,
            // pincode: this.pincode,
            lat: this.lat,
            lng: this.lng,
            status: 1,
          };

          this.api.post_private('v1/address/save', param).then(
            (data: any) => {
              this.util.stop();
              if (data && data.status == 200) {
                this.getAddress();
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
                Toast.fire({
                  icon: 'success',
                  title: this.util.translate('Address added'),
                });
              } else {
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            },
            (error) => {
              this.util.stop();
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          );
        } else {
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      }
    );
  }

  onSearchChange(event) {
    if (this.query == '') {
      this.autocompleteLocationItems = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.util.GoogleAutocomplete.getPlacePredictions(
      { input: this.query },
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
    this.query = item.description;
    this.util.geocoder.geocode(
      { placeId: item.place_id },
      (results, status) => {
        if (status == 'OK' && results[0]) {
          this.address = this.query;
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          this.changedPlace.hide();
          this.addressFromMap.show();
          this.chmod.detectChanges();
          this.loadMap(this.lat, this.lng);
        }
      }
    );
  }

  editAddress(item) {
    this.editClicked = true;
    this.address = item.address;
    this.lat = item.lat;
    this.lng = item.lng;
    // this.pincode = item.pincode;
    this.landmark = item.landmark;
    this.house = item.house;
    this.title = item.title;
    this.address_id = item.id;
    this.optionalPhone = item.optional_phone;
    this.addressFromMap.show();
    this.getAddressFromMaps(this.lat, this.lng);
    this.chooseFromMaps();
  }

  editMyAddress() {
    this.addressFromMap.hide();
    if (
      this.address == '' ||
      this.landmark == '' ||
      this.house == '' ||
      this.optionalPhone == ''
    ) {
      this.util.errorMessage(this.util.translate('all fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder();
    this.util.start();
    geocoder.geocode(
      { address: this.house + ' ' + this.landmark + ' ' + this.address },
      (results, status) => {
        if (status == 'OK' && results && results.length) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          const param = {
            id: this.address_id,
            uid: localStorage.getItem('uid'),
            is_default: 1,
            optional_phone: this.optionalPhone,
            title: this.title,
            address: this.address,
            house: this.house,
            landmark: this.landmark,
            // pincode: this.pincode,
            lat: this.lat,
            lng: this.lng,
            status: 1,
          };

          this.api.post_private('v1/address/update', param).then(
            (data: any) => {
              this.util.stop();
              this.chmod.detectChanges();
              if (data && data.status == 200) {
                this.getAddress();
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });

                Toast.fire({
                  icon: 'success',
                  title: this.util.translate('Address updated'),
                });
              } else {
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            },
            (error) => {
              this.util.stop();
              this.util.errorMessage(
                this.util.translate('Something went wrong')
              );
            }
          );
        } else {
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      }
    );
  }

  updateProfile() {
    if (
      !this.first_name ||
      this.first_name == '' ||
      !this.last_name ||
      this.last_name == '' ||
      !this.mobile ||
      this.mobile == ''
    ) {
      this.util.errorMessage(this.util.translate('all fields are required'));
      return false;
    }
    const param = {
      first_name: this.first_name,
      last_name: this.last_name,
      gender: this.gender,
      mobile: this.mobile,
      id: localStorage.getItem('uid'),
    };
    this.util.start();
    this.api.post_private('v1/profile/update', param).then(
      (data: any) => {
        this.util.stop();
        this.getProfileInfo();
      },
      (error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    );
  }

  changePassword() {
    this.changePasswordClicked = true;
    if (
      !this.old_password ||
      this.old_password === '' ||
      !this.new_password ||
      this.new_password === '' ||
      !this.confirm_password ||
      this.confirm_password == ''
    ) {
      this.util.errorMessage(this.util.translate('all fields are required'));
      this.changePasswordClicked = false;
      return false;
    }
    if (this.old_password === this.new_password) {
      this.util.errorMessage(this.util.translate('Old password not equal'));
      this.changePasswordClicked = false;
      return false;
    }
    if (this.new_password != this.confirm_password) {
      this.util.errorMessage(this.util.translate('New password equal'));
      this.changePasswordClicked = false;
      return false;
    }
    const param = {
      old_password: this.old_password,
      new_password: this.new_password,
      confirm_password: this.confirm_password,
      id: localStorage.getItem('uid'),
    };
    this.util.start();
    this.api.post_private('v1/profile/changePassword', param).then(
      (data: any) => {
        this.util.stop();
        this.changePasswordClicked = false;
        this.old_password = '';
        this.new_password = '';
        this.confirm_password = '';
        this.util.successMessage(this.util.translate('Password Updated'));
      },
      (error) => {
        this.util.stop();
        this.util.errorMessage(this.util.translate(error.error.error));
        this.changePasswordClicked = false;
      }
    );
  }

  getProfileInfo() {
    this.api
      .post_private('v1/profile/getByID', { id: localStorage.getItem('uid') })
      .then(
        (data: any) => {
          if (data && data.status == 200 && data.data && data.data.id) {
            this.util.userInfo = data.data;
          }
        },
        (error) => {}
      )
      .catch((error) => {});
  }

  preview_banner(files) {
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
            const cover = data.data.image_name;
            const param = {
              cover: cover,
              id: localStorage.getItem('uid'),
            };
            this.util.start();
            this.api.post_private('v1/profile/update', param).then(
              (update: any) => {
                this.util.stop();
                this.getProfileInfo();
              },
              (error) => {
                this.util.stop();
                this.util.errorMessage(
                  this.util.translate('Something went wrong')
                );
              }
            );
          }
          // if (data && data.status == 200 && data.data) {
          //   // this.coverImage = data.data;

          // }
        },
        (err) => {
          this.util.stop();
        }
      );
    } else {
    }
  }

  getStatus(status: any) {
    const orderStatus = [
      'Created', // 0
      'Accepted', // 1
      'Rejected', // 2
      'Ongoing', // 3
      'Completed', // 4
      'Cancelled', // 5
      'Refunded', // 6
      'Delayed', // 7
      'Pending Payments', // 8
    ];
    return this.util.translate(orderStatus[status]);
  }

  handleKeyDown(e) {
    const typedValue = e.keyCode;
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
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

  async onChat(chat) {
    this.util.start();
    const { data } = await this.api.post_private('v1/chats/getChatRooms', {
      sender_id: chat.sender_id,
      receiver_id: chat.receiver_id,
    });
    const { data: chatMessages } = await this.api.post_private(
      'v1/chats/getById',
      {
        room_id: data.id,
      }
    );

    this.roomId = data.id;
    this.messageState = 'onMessage';

    const receiverCover =
      chat.receiver_cover == 'NA' || !chat.receiver_cover
        ? 'url(assets/icon.png)'
        : chat.receiver_cover;

    this.chatMessages = chatMessages;
    this.currentParticipants = {
      receiverName: chat.sender_first_name + chat.sender_last_name,
      receiverCover,
      receiverId: chat.receiver_id,
      senderId: chat.sender_id,
    };

    this.util.stop();
  }

  sendMessage() {
    this.chatMessages.push({
      message: this.messageInput,
    });

    this.api.post_private('v1/chats/sendMessage', {
      room_id: Number(this.roomId),
      sender_id: this.currentParticipants.senderId,
      message_type: 0,
      message: this.messageInput,
      status: 1,
    });
  }
}
