import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojasVidaComponent } from './hojas-vida.component';

describe('HojasVidaComponent', () => {
  let component: HojasVidaComponent;
  let fixture: ComponentFixture<HojasVidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HojasVidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HojasVidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
