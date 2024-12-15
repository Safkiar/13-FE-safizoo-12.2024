/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Register the Polish locale
registerLocaleData(localePl, 'pl');

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...appConfig.providers, { provide: LOCALE_ID, useValue: 'pl' }],
}).catch((err) => console.error(err));
