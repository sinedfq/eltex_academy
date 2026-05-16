import { InjectionToken }
from '@angular/core';

import {
  ArticlesServiceInterface
} from './articles-service.interface';

export const ARTICLES_SERVICE_TOKEN =
  new InjectionToken<ArticlesServiceInterface>(
    'ARTICLES_SERVICE_TOKEN'
  );