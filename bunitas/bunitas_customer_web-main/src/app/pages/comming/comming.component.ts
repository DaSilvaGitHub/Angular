/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-comming',
  templateUrl: './comming.component.html',
  styleUrls: ['./comming.component.scss']
})
export class CommingComponent implements OnInit {
  targetDate: Date = new Date('2023-10-31T23:59:59');
  timeRemaining: any;
  content: any;
  loaded: boolean;
  days: any = '';
  hours: any = '';
  minutes: any = '';
  seconds: any = '';

  constructor(
    public api: ApiService,
    public util: UtilService
  ) {
    this.loaded = false;
    this.getPageInfo();
  }

  getPageInfo() {
    const param = {
      id: 1
    };
    this.api.post_private('v1/pages/getContent', param).then((data: any) => {
      this.loaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        this.content = data.data.content;
      }
    }, error => {
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.loaded = true;
    }).catch(error => {
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.loaded = true;
    });
  }
  ngOnInit(): void {
    this.updateTimeRemaining();
    setInterval(() => {
      this.updateTimeRemaining();
    }, 1000);
  }

   updateTimeRemaining() {
    const now = new Date();
    const timeDifference = this.targetDate.getTime() - now.getTime();
    if (timeDifference <= 0) {
      this.timeRemaining = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    } else {
      this.timeRemaining = this.calculateTimeRemaining(timeDifference);
    }
  }

  calculateTimeRemaining(timeDifference: number) {
    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    this.days = days;
    this.seconds = seconds;
    this.minutes = minutes;
    this.hours = hours;
    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  onSubmit(formData: any) {
    console.log('Form data submitted:', formData);
    // You can perform further actions here, such as making an HTTP request.
  }

}
