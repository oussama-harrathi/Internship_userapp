import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonsTableComponent } from './sons-table.component';

describe('SonsTableComponent', () => {
  let component: SonsTableComponent;
  let fixture: ComponentFixture<SonsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SonsTableComponent]
    });
    fixture = TestBed.createComponent(SonsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
