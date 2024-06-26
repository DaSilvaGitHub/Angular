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
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss'],
})
export class FootersComponent implements OnInit {
  qty = 2;
  visibility: any = true;
  constructor(
    location: Location,
    private router: Router,
    public util: UtilService
  ) {
    router.events.subscribe((val) => {
      if (location.path() != '' && location.path().includes('search')) {
        this.visibility = false;
      } else {
        this.visibility = true;
      }
    });
  }

  ngOnInit(): void {}

  getCopyright() {
    return moment().format('YYYY');
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToHome() {
    this.router.navigate(['/welcome']);
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  goToReview() {
    this.router.navigate(['/review']);
  }

  goToInspire() {
    this.router.navigate(['/be-inspired-bunitas']);
  }

  goToPartner() {
    this.router.navigate(['partner']);
  }

  goToRestaurants(item) {
    const navData: NavigationExtras = {
      queryParams: {
        val: item,
      },
    };

    this.router.navigate(['/home'], navData);
  }

  goToRest(item) {
    const navData: NavigationExtras = {
      queryParams: {
        val: JSON.stringify(item),
      },
    };

    this.router.navigate(['/cityrest'], navData);
  }

  goToPrivacy() {
    this.router.navigate(['/privacy-policy']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }

  goToAbout() {
    this.router.navigate(['/about-bunitas']);
  }

  goToFaqs() {
    this.router.navigate(['/faq']);
  }

  goToNotice() {
    this.router.navigate(['/notice']);
  }

  goToCookies() {
    this.router.navigate(['/cookie']);
  }

  blogs() {
    this.router.navigate(['blog']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }

  goToTracker() {
    this.router.navigate(['/tracker']);
  }
}
