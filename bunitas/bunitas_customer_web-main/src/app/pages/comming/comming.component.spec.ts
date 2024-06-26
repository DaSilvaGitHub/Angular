/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommingComponent } from './comming.component';

describe('CommingComponent', () => {
  let component: CommingComponent;
  let fixture: ComponentFixture<CommingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommingComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
