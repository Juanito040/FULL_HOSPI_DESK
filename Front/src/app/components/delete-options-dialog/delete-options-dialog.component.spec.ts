import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOptionsDialogComponent } from './delete-options-dialog.component';

describe('DeleteOptionsDialogComponent', () => {
  let component: DeleteOptionsDialogComponent;
  let fixture: ComponentFixture<DeleteOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOptionsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
