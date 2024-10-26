
#!/bin/sh
echo 'Container started'
echo 'Environment variables:'
echo "env" 
echo 'Crontab contents:'
cat /etc/crontabs/root
echo 'Starting cron and tailing logs...'
crond -f & tail -f /var/log/cron.log & while true; do sleep 30; done
