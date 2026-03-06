import { DrupalServerClient } from '@rareimagery/api';

const baseUrl = process.env.DRUPAL_BASE_URL || 'http://localhost:8088';

export const drupalServer = new DrupalServerClient(baseUrl);
