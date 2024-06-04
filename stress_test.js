/*
Objective of stress testing:
    - Determine hwo your system will behave under extreme conditions
    - Determine whet is the maximum capacity of your system in terms of users or througput
    - Determine the breaking point of your system and its failure mode
    - Determine if your system will recover without manual intervention after the stress test is over
*/

import http from 'k6/http'
import { sleep } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { requestConfigurations, StressTestOptions, StressSummaryFile } from './config.js';

const testName = 'Stress_Test';

export function handleSummary(data) {
    let report = {};
   report[`testResults/${testName}.html`] = htmlReport(data);
    return report;
}

  export let options = StressTestOptions;

  export default () => {
    http.batch(requestConfigurations);
    sleep(1);
};

