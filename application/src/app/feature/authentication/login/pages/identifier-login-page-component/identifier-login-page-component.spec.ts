import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentifierLoginPageComponent } from './identifier-login-page-component';

describe('IdentifierLoginPageComponent', () => {
  let component: IdentifierLoginPageComponent;
  let fixture: ComponentFixture<IdentifierLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentifierLoginPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IdentifierLoginPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
