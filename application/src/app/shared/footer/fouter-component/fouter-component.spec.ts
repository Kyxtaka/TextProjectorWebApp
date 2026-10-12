import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FouterComponent } from './fouter-component';

describe('FouterComponent', () => {
  let component: FouterComponent;
  let fixture: ComponentFixture<FouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FouterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
