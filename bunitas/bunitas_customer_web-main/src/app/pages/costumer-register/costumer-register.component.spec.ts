import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumerRegisterComponent } from './costumer-register.component';

describe('CostumerRegisterComponent', () => {
  let component: CostumerRegisterComponent;
  let fixture: ComponentFixture<CostumerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostumerRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostumerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
