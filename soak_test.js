/*
Objective of soak testing:
    - Verify that your system doesnt suffer from bugs or memory leaks, which result in a crash or restart after
    - Verify that expected application restar dont lose requests
    - Find bugs realted to race-conditions that appear sporadically
    - Make sure your database doesnt exhaust the alloted disk storage
    - Make sure your logs dont exhaust the allotted disk storage
    - Make sure the external services you depend on dont stop working after a certain amount of request

    - Determine the maximum amount of users your system can handle
    - Get the 75-85% of that value
    - Set VUS to that value
    - Run the test in 3 stages. Ramp up to VUS, stay a long period like 4-12 hours, rump down to 0


*/

import http from 'k6/http'
import { sleep } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { requestConfigurations, SoakTestOptions } from './config.js';

const testName = 'Soak_Test';

export function handleSummary(data) {
    let report = {};
   report[`testResults/${testName}.html`] = htmlReport(data);
    return report;
}

export let options = SoakTestOptions;

export default () => {
    http.batch(requestConfigurations);
    sleep(1);
};