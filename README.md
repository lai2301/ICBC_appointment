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
- [ ] Maybe - Auto book appointment? Depends on if I can get the appointment after it's available.

## FAQ
Q: Why using k6?
A: I jsut happen to use k6 to test some API at work. And I also want to try something the browser-based feature. No matter what, it's just a script.

## Authors
- [@LiamCHAN](https://github.com/lai2301/ICBC_appointment)
