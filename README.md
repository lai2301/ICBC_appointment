# ICBC_appointment
Scrap Appointment from ICBC

## Prerequisites
- k6
- chrome

## Run locally

```bash
# With browser
K6_BROWSER_HEADLESS=false k6 run --quiet --console-output=stdout LAST_NAME=Bellick -e LICENCE_NUMBER=00123424 -e KEYWORD=Bellick -e TARGET_DATE=2024-12-01 icbc.js

# Without browser
k6 run --quiet --console-output=stdout -e LAST_NAME=Bellick -e LICENCE_NUMBER=00123424 -e KEYWORD=Bellick -e TARGET_DATE=2024-12-01 icbc.js
```

## Next Step
- [ ] Add location as variable
- [ ] Add Target Date as variable
- [ ] Make it as a cron job
- [ ] Notify via Telegram/Email
- [ ] Dockerize

## Authors

- [@LiamCHAN](https://github.com/lai2301/ICBC_appointment)
