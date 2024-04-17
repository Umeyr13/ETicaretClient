import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaswordComponent } from './update-pasword.component';

describe('UpdatePaswordComponent', () => {
  let component: UpdatePaswordComponent;
  let fixture: ComponentFixture<UpdatePaswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePaswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePaswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
