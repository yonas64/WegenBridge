# Family-Reconnet
12/9/2015

## SIEM Detection Rules

- Impossible Travel: `siem-rules/impossible-travel-rule.md`

## SIEM Ingestion API

- `POST /api/siem/logs`
  - Accepts one event, an array of events, or `{ events: [...] }`.
  - Detects impossible travel on `event = "auth_login_success"`.
- `GET /api/siem/alerts?limit=50`
  - Returns buffered alerts emitted by the detector.

### Required Fields For Impossible Travel Detection

- `event`: must be `auth_login_success`
- `ts`: ISO timestamp (if omitted, server time is used)
- `context.email` (or `context.userId`)
- `context.clientIp` (or `context.ip`)

### Environment Variables

- `SIEM_IMP_TRAVEL_WINDOW_MIN` default `60`
- `SIEM_IMP_TRAVEL_SPEED_KMH` default `900`
- `SIEM_IMP_TRAVEL_MIN_DISTANCE_KM` default `500`
- `SIEM_GEOIP_URL_TEMPLATE` default `https://ipapi.co/{ip}/json/`
- `SIEM_GEO_LOOKUP_TIMEOUT_MS` default `4000`
- `SIEM_GEO_CACHE_TTL_MS` default `86400000`
- `SIEM_ALERT_WEBHOOK_URL` optional downstream alert webhook
