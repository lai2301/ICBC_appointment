FROM golang:1.19 as builder

WORKDIR /build

# Clone k6 repository and checkout a specific version
RUN git clone https://github.com/grafana/k6.git .


# Install xk6
RUN go install go.k6.io/xk6/cmd/xk6@latest

# Use xk6 to build k6 with the SMTP extension and a specific version of prometheus-remote
RUN xk6 build \
    --with github.com/grafana/xk6-output-prometheus-remote@v0.3.0 \
    --with github.com/gpiechnik2/xk6-smtp@latest \
    --output /tmp/k6


FROM grafana/k6:master-with-browser

COPY --from=builder /tmp/k6 /usr/bin/k6
COPY icbc.js /scripts/icbc.js
COPY entrypoint.sh /entrypoint.sh
USER root

RUN apk update && apk add ca-certificates chromium dcron 

ENV K6_BROWSER_ENABLED=true
ENV TARGET_DATE=${TARGET_DATE}
ENV LOCATION=${LOCATION}
ENV LAST_NAME=${LAST_NAME}
ENV LICENCE_NUMBER=${LICENCE_NUMBER}
ENV KEYWORD=${KEYWORD}

# Create a script to run k6
RUN echo '#!/bin/sh' > /scripts/run_k6.sh && \
    echo '/usr/bin/k6 run --quiet /scripts/icbc.js' >> /scripts/run_k6.sh && \
    chmod +x /scripts/run_k6.sh \
    && chmod +x /entrypoint.sh

# Set up cron job
RUN echo '*/15 * * * * /scripts/run_k6.sh >> /var/log/cron.log 2>&1' > /etc/crontabs/root

# Create the log file
RUN touch /var/log/cron.log
# Change the ENTRYPOINT to use shell form
ENTRYPOINT ["/bin/sh", "-c"]

# Use CMD to specify the command to run
CMD ["/entrypoint.sh"]