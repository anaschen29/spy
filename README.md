Single-device webapp for Spy using Node.js, created for Tuesday Tea and beyond. 

Can be locally started via npm start, and it is also deployed on https://spy-2.vercel.app/. 

## Vercel metrics

The app includes two separate React integrations:

- **Web Analytics** (`@vercel/analytics`): visitors and page views.
- **Speed Insights** (`@vercel/speed-insights`): performance metrics.

Enable each feature in the matching Vercel project's dashboard, then deploy the
commit containing its integration. Visit the deployed site with content blockers
disabled for that visit; local development visits do not populate these dashboards.
No API keys are needed in the app.

If visitor counts stay empty, inspect the browser's Network tab on the deployed
site. `/_vercel/insights/script.js` should load as JavaScript, and page views should
send a request to `/_vercel/insights/view`. A missing script or an HTML response
means the integration is not being served: check that Web Analytics is enabled on
the correct project and redeploy. A blocked request may indicate a content blocker.
Performance metrics use separate `/_vercel/speed-insights/` endpoints.

This is a single-page game. Web Analytics counts page views, not individual
rounds, button presses, or role reveals.

