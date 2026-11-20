import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import './app/extensions/string-extensions';

import * as OmegaEngine from 'omega-game-engine';
(window as any)['omega-game-engine'] = OmegaEngine;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
