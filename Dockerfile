FROM grafana/k6:master-with-browser
COPY icbc.js /icbc.js
USER root

RUN apk update && apk add --no-cache chromium

ENV K6_BROWSER_ENABLED=true
ENV TARGET_DATE="2024-12-01"
ENV LOCATION="Victoria driver licensing"
ENV LAST_NAME="lau"
ENV LICENCE_NUMBER="00115734"
ENV KEYWORD="lau"

CMD ["k6" "run" "--quiet" "icbc.js"]
