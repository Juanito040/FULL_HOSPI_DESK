import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatoBackupComponent } from './formatobackup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('FormatoBackupComponent', () => {
  let component: FormatoBackupComponent;
  let fixture: ComponentFixture<FormatoBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatoBackupComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
