# QR and Short Link Setup

## 1) Create the private feedback destination

- Preferred: create a dedicated feedback form page on Ascot domain.
- Temporary default in app: `https://www.ascotrehab.com/contact-us/`.

## 2) Create a short link

- Suggested format: `ascotrehab.com/feedback`.
- Point it to the final feedback form URL.
- Keep the short link static to avoid reprinting QR assets.

## 3) Update app configuration

In `ascot-rehab-display.jsx`, set:

- `feedbackConfig.formUrl` = final form destination
- `feedbackConfig.shortUrl` = short branded URL shown on screen
- optional: `feedbackConfig.endpoint` = private webhook/API for direct capture

## 4) Generate final QR asset

- App currently uses dynamic QR rendering from the form URL.
- If you prefer a static image asset, generate and replace with a hosted PNG.
- Recommended size for screen display: at least 600x600 source.

## 5) Validate on real devices

- Test QR scan distance from reception area.
- Test iPhone and Android camera scanning.
- Confirm short link matches QR destination.
