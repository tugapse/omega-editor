import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../app/api/api-url.token';
import '../app/extensions/string-extensions';

/** What the app config provides, for TestBed: HTTP (testing backend), router and API URL. */
export const testProviders = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  { provide: API_URL, useValue: 'http://localhost:5000/api' },
];
