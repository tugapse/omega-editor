import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../testing/test-providers';

import { ObjectInspector } from './object-inspector';

describe('ObjectInspector', () => {
  let component: ObjectInspector;
  let fixture: ComponentFixture<ObjectInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectInspector],
      providers: testProviders
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectInspector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
