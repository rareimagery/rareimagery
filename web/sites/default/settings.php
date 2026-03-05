<?php

/**
 * @file
 * Drupal site configuration - RareImagery.net
 *
 * Database configured for PostgreSQL via Docker.
 */

$databases['default']['default'] = [
  'database' => getenv('DRUPAL_DB_NAME') ?: 'rareimagery',
  'username' => getenv('DRUPAL_DB_USER') ?: 'rareimagery',
  'password' => getenv('DRUPAL_DB_PASSWORD') ?: 'rareimagery_secret',
  'host' => getenv('DRUPAL_DB_HOST') ?: 'postgres',
  'port' => getenv('DRUPAL_DB_PORT') ?: '5432',
  'driver' => getenv('DRUPAL_DB_DRIVER') ?: 'pgsql',
  'prefix' => '',
  'namespace' => 'Drupal\\pgsql\\Driver\\Database\\pgsql',
  'autoload' => 'core/modules/pgsql/src/Driver/Database/pgsql/',
];

$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT') ?: 'rareimagery-change-this-in-production-' . php_uname('n');

$settings['update_free_access'] = FALSE;

$settings['container_yamls'][] = $app_root . '/' . $site_path . '/services.yml';

$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];

$settings['entity_update_batch_size'] = 50;
$settings['entity_update_backup'] = TRUE;

$settings['config_sync_directory'] = '../config/sync';

// Trusted host patterns.
$settings['trusted_host_patterns'] = [
  '^localhost$',
  '^127\.0\.0\.1$',
  '^rareimagery\.net$',
  '^www\.rareimagery\.net$',
  '^api\.rareimagery\.net$',
  '^srv1450030\.hstgr\.cloud$',
];

$settings['file_private_path'] = $app_root . '/../private';

// Cross-origin cookie settings for decoupled Vercel frontend.
// SameSite=None + Secure allows cookies across rareimagery.net (Vercel)
// and api.rareimagery.net (Drupal API).
if (php_sapi_name() !== 'cli') {
  ini_set('session.cookie_samesite', 'None');
  ini_set('session.cookie_secure', '1');
  ini_set('session.cookie_domain', '.rareimagery.net');
}
