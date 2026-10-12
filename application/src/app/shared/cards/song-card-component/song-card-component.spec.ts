import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongCardComponent } from './song-card-component';

describe('SongCardComponent', () => {
  let component: SongCardComponent;
  let fixture: ComponentFixture<SongCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SongCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
