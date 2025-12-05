import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BackupsComponent } from './backups.component';

describe('BackupsComponent', () => {
  let component: BackupsComponent;
  let fixture: ComponentFixture<BackupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackupsComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter backups', () => {
    component.backups = [
      { nombre_recurso: 'Servidor1', tipo_recurso: 'VM', fecha_backup: '2024-02-10', periodicidad: 'Diaria' }
    ];
    component.filterText = 'Servidor1';
    component.applyFilter();

    expect(component.filteredBackups.length).toBe(1);
  });
});
