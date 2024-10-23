import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';
import { sleep } from 'k6';
import { scenario } from 'k6/execution';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://onlinebusiness.icbc.com/webdeas-ui/");

    //console.log(`Last Name: ${__ENV.LAST_NAME}`);
    //console.log(`Licence Number: ${__ENV.LICENCE_NUMBER}`);
    //console.log(`Keyword: ${__ENV.KEYWORD}`);
    //console.log(`Target Date: ${__ENV.TARGET_DATE}`);

    await page.locator('button[class="primary"]').click();
    await page.locator('input[formcontrolname="drvrLastName"]').type(__ENV.LAST_NAME);
    await page.locator('input[formcontrolname="licenceNumber"]').type(__ENV.LICENCE_NUMBER);
    await page.locator('input[formcontrolname="keyword"]').type(__ENV.KEYWORD);
    
    // Wait for the checkbox to be visible and clickable
    const checkbox = await page.waitForSelector('input[type="checkbox"]', { state: 'visible', timeout: 5000 });
    
    // Scroll the checkbox into view if needed
    await checkbox.scrollIntoViewIfNeeded();
    
    // Use JavaScript click instead of .check()
    await checkbox.evaluate(el => el.click());
    
    // Verify if the checkbox is checked
    const isChecked = await checkbox.isChecked();
    //console.log(`Checkbox is checked: ${isChecked}`);

    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[type="submit"]').click(),
    ]);

    await page.locator('button[class="raised-button primary"]').click();
    await page.locator('button[class="primary ng-star-inserted"]').click();

    await page.waitForSelector('div.mat-tab-label-content', { state: 'visible', timeout: 5000 });

    // Find all divs with the class and then click the one with the correct text
    const divs = await page.$$('div.mat-tab-label-content');
    for (const div of divs) {
      const text = await div.textContent();
      if (text.trim() === 'By office') {
        await div.click();
        //console.log('Clicked "By office" tab');
        break;
      }
    }

    // Optional: Add a short wait to allow the page to react to the click
    //await page.waitForTimeout(1000);

    await page.locator('input[formcontrolname="officeControl"]').type(__ENV.LOCATION);
    await page.waitForTimeout(2000); // Wait for 2 seconds

    // Find and click the span with "Victoria driver licensing"
    const spans = await page.$$('span.mat-option-text');
    for (const span of spans) {
      const text = await span.textContent();
      if (text.trim().includes(__ENV.LOCATION)) {
        await span.scrollIntoViewIfNeeded();
        await span.click();
        //console.log('Clicked "Victoria driver licensing" option');
        break;
      }
    }

    await page.waitForSelector('div.appointment-listings', { state: 'visible', timeout: 10000 });

    // Add a delay to ensure content is loaded
    await page.waitForTimeout(5000);

    // Extract and log the appointment data
    const appointmentData = await page.evaluate((targetDate) => {
      const appointments = [];
      const dateElements = document.querySelectorAll('div.date-title');
      
      dateElements.forEach(dateElement => {
        const dateText = dateElement.textContent.trim();
        const date = new Date(dateText);
        
        // Only process dates before the target date
        if (date < new Date(targetDate)) {
          const timeElements = dateElement.nextElementSibling.querySelectorAll('mat-button-toggle');
          
          timeElements.forEach(timeElement => {
            const time = timeElement.textContent.trim();
            appointments.push({ date: dateText, time });
          });
        }
      });

      return appointments;
    }, __ENV.TARGET_DATE);

    if (appointmentData.length > 0) {
      const logContent = `Available Appointments: (${new Date().toISOString()}):\n` +
        appointmentData.map(app => `${app.date} at ${app.time}`).join('\n') +
        '\n\n';

      // Log to console
      console.log("Timespamp: " + getCurrentTimestamp() + " " + logContent);
    } else {
      console.log("Timespamp: " + getCurrentTimestamp() + " No appointments available before " + __ENV.TARGET_DATE);
    }

  } finally {
    sleep(5);
    await page.close();
  }
}

function getCurrentTimestamp() {
  const now = new Date();
  return now.toISOString();
}