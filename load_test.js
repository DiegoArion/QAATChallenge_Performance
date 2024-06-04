/*
Objective of Load Tesing :
Assess the current performance of your system in terms of concurrent users or request per seconds
    - Used when you want to understed if your system is meeting the performance goals, this is the type of test you'll run
    - Assess the correct performance after changes are made
    - Used to simulate a normal day in the bussiness
*/

import { sleep } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { LoadTestOptions, sendRequests } from './config.js';

const testName = 'Load_Test';

export function handleSummary(data) {
    let report = {};
   report[`testResults/${testName}.html`] = htmlReport(data);
    return report;
}

export let options = LoadTestOptions;

export default () => {
    sendRequests();
    sleep(1);
};