/**
 * Suria Design — Site Access & Passkey Configuration
 * 
 * You can customize the accepted passkeys, hint message,
 * and text displayed on the password protection screen below.
 */

export const SITE_AUTH_CONFIG = {
  // List of passkeys that grant access (case-insensitive check)
  passwords: ['suria', 'suria2026', 'jewel', 'studio'],

  // Default hint shown beneath the input (set to '' or null to hide the hint)
  hint: 'Default passkey: suria',

  // Studio branding text displayed on the lock screen
  studioName: 'Suria Design',
  studioSubtitle: 'Fine Jewelry Studio',
  badge: 'Private Studio Access',
  headline: 'Private Studio Access',
  description: 'Suria Design works privately, by referral and appointment. Please enter the passkey to enter the studio.',
  
  // Storage key for session persistence
  storageKey: 'suria_site_authenticated',
};
