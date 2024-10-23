FROM grafana/k6:master-with-browser
COPY icbc.js icbc.js
USER root

RUN apk update && apk add --no-cache chromium

ENV K6_BROWSER_ENABLED=true
ENV TARGET_DATE=${TARGET_DATE}
ENV LOCATION=${LOCATION}
ENV LAST_NAME=${LAST_NAME}
ENV LICENCE_NUMBER=${LICENCE_NUMBER}
ENV KEYWORD=${KEYWORD}

ENTRYPOINT ["k6"]
#CMD ["run", "--quiet", "icbc.js", "--env", "TARGET_DATE=${TARGET_DATE}", "--env", "LOCATION=${LOCATION}", "--env", "LAST_NAME=${LAST_NAME}", "--env", "LICENCE_NUMBER=${LICENCE_NUMBER}", "--env", "KEYWORD=${KEYWORD}"]
CMD ["run", "--quiet", "icbc.js"]