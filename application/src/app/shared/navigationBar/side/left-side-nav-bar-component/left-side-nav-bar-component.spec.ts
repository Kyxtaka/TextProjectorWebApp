import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftSideNavBarComponent } from './left-side-nav-bar-component';

describe('LeftSideNavBarComponent', () => {
  let component: LeftSideNavBarComponent;
  let fixture: ComponentFixture<LeftSideNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSideNavBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftSideNavBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
