import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../testing/test-providers';

import { EditorInpector } from './inpector';

describe('Inpector', () => {
  let component: EditorInpector;
  let fixture: ComponentFixture<EditorInpector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInpector],
      providers: testProviders
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorInpector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
