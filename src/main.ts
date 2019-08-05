import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConfigService } from './app/shared/services';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

ConfigService
  .loadStatic()
  .then(
    () => {
      setTimeout(() => {
        platformBrowserDynamic()
          .bootstrapModule(AppModule)
          .catch(err => console.error(err));
      }, 1500);
  })
  .catch(err => console.error(err));

