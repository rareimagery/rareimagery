# RareImagery.net – X Creator Merch Platform  
**Full Conversation History & Final Build Specification**  
March 2026

## Project Overview
Goal: Build a multi-creator merchandise platform where any X (Twitter) profile can become a branded storefront selling physical (POD + custom) and digital products.  
Monetization model for platform owner (@RareImagery):
- $100 one-time store launch fee
- $5/month recurring maintenance fee
- Platform processing fee per completed order:
  - $1.00 per physical order (POD or custom/handmade)
  - $0.05 per digital order
- Automatic payouts to creators via Stripe Connect (application fees model)
- Future: First platform to integrate X Money payments when merchant API becomes publicly available

## Conversation Timeline & Key Evolutions

### 1. Initial Architecture Specification (User provided detailed spec)
- 1:1 mapping: X profile → branded store (`x_creator_store`)
- URL: `/store/[field_x_handle]`
- Three product types:
  - `physical_pod` (Printful integration)
  - `physical_custom` (manual fulfillment)
  - `digital_download` (instant license + file delivery)
- Store-level X profile fields (handle, bio, avatar, banner, followers, verified, brand color, tagline, Printful store ID)
- Taxonomy vocabularies: product_category, design_style, audience, animal_type, breed
- Order types + mixed-cart splitting logic
- Printful sync & fulfillment routing
- Storefront layout: header (X profile elements), product grid with facets, optional viral X posts embed
- Required modules list (commerce stack + printful, facets, search_api, jsonapi, etc.)
- SKU convention: `[STORE]-[TYPE]-[PRODUCT]-[VARIANT]`

### 2. Business Model Introduction
- Platform charges creators:
  - $100 one-time setup
  - $5/month maintenance
  - Per-sale fee (initially flat $1, later refined)
- Goal: be first platform to integrate **X Money** payments

### 3. Fee Model Refinement
- Final per-order platform fee structure:
  - **$1.00** per physical order (pod_order or custom_order)
  - **$0.05** per digital order (digital_order)
- Fees applied automatically via event subscriber on order pre-save
- Fees added as locked, non-taxable adjustments labeled "RareImagery Platform Fee"

### 4. Platform Fee Implementation (Drupal code)
Custom module: `rareimagery_xstore`

```php
// src/EventSubscriber/PlatformFeeSubscriber.php
<?php

namespace Drupal\rareimagery_xstore\EventSubscriber;

use Drupal\commerce_order\Adjustment;
use Drupal\commerce_order\Event\OrderEvent;
use Drupal\commerce_order\Event\OrderEvents;
use Drupal\commerce_price\Price;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class PlatformFeeSubscriber implements EventSubscriberInterface {

  public static function getSubscribedEvents() {
    return [
      OrderEvents::ORDER_PRE_SAVE => 'addPlatformFee',
    ];
  }

  public function addPlatformFee(OrderEvent $event) {
    $order = $event->getOrder();

    if (!$order->isNew() || $order->getState()->getId() !== 'draft') {
      return;
    }

    $fee = new Price('0.00', 'USD');
    $type = $order->bundle();

    if (in_array($type, ['pod_order', 'custom_order'])) {
      $fee = new Price('1.00', 'USD');
    }
    elseif ($type === 'digital_order') {
      $fee = new Price('0.05', 'USD');
    }

    if ($fee->getNumber() > 0) {
      $order->addAdjustment(new Adjustment([
        'type' => 'fee',
        'label' => 'RareImagery Platform Fee',
        'amount' => $fee,
        'included' => FALSE,
        'locked' => TRUE,
      ]));
    }
  }
}