import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderNavBarComponent } from './header-nav-bar-component';

describe('HeaderNavBarComponent', () => {
  let component: HeaderNavBarComponent;
  let fixture: ComponentFixture<HeaderNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNavBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNavBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
