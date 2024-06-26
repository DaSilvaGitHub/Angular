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
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent implements OnInit {
  content: any;
  loaded: boolean;
  constructor(
    public api: ApiService,
    public util: UtilService
  ) {
    this.loaded = false;
    this.getPageInfo();
  }

  getPageInfo() {
    const param = {
      id: 8
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
  }

}
