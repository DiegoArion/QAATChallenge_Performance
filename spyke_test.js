/*
Objective of spyke testing:
    - Determine how your systems will perform under a sudder surge of traffic
    - Determine if your system wil recover once the traffic has subsided
    
Results:
    Success is based on expectations. Systems will generalli react in 1 of 4 ways.
    - Excellent: system performance is not degraded during the surge of traffic.
        Response time is similar during low traffic and high traffic.
    - Good: Response time is slower, but the system does not produce any errors
        All request are handled
    - Poor: System produces errors during the surge of traffic, but recovers to normal after the traffc subsided
    - Bad: System crashes, and does not recover after the traffic has subsided.
*/

import http from 'k6/http'
import { sleep } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { requestConfigurations, SpykeTestOptions } from './config.js';

const testName = 'Sypke_Test';

export function handleSummary(data) {
    let report = {};
   report[`testResults/${testName}.html`] = htmlReport(data);
    return report;
}
export let options = SpykeTestOptions;

export default () => {
    http.batch(requestConfigurations);
    sleep(1);
};