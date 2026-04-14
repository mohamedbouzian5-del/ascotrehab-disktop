# Ascot Rehab Display Deliverables

This project now includes all core artifacts from the approved plan:

- `ascot-rehab-display.jsx`: Front display experience with:
  - branded info screens
  - recurring feedback CTA
  - private touchscreen feedback form with consent
  - QR code panel and short URL slot
- `QR_AND_SHORTLINK_SETUP.md`: Steps for feedback link + QR deployment.
- `KIOSK_RUNTIME_CHECKLIST.md`: Windows browser kiosk setup and uptime controls.
- `PILOT_MEASUREMENT_TEMPLATE.md`: 1-week pilot metrics and review worksheet.
- `WEBSITE_CONTENT_NOTES.md`: Verified website details used for display content.

## Runtime Notes

- By default, the form stores submissions in browser local storage (`ascotPrivateFeedback`) as a fallback.
- To forward submissions to your private inbox or automation, set `feedbackConfig.endpoint` in `ascot-rehab-display.jsx`.
- QR currently points to `https://www.ascotrehab.com/contact-us/`. Update `feedbackConfig.formUrl` when your dedicated form URL is ready.
