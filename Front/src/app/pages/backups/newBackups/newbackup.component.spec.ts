import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewBackupComponent } from './newbackup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NewBackupComponent', () => {
  let component: NewBackupComponent;
  let fixture: ComponentFixture<NewBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBackupComponent, FormsModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
