import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedDropdownComponent } from './typed-dropdown.component';

describe('TypedDropdownComponent', () => {
  let component: TypedDropdownComponent;
  let fixture: ComponentFixture<TypedDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypedDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
