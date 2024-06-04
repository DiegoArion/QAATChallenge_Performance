import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { getStoreInventory } from "./EndPoints/Store/get_store_inventory.js";
import { putPet } from "./EndPoints/Pet/put_pet.js";
import { check } from 'k6';
import http from 'k6/http'

// ===============================================================
//                    API CONFIG
// ===============================================================
export const API_BASE_URL = 'http://localhost:8080/api/v3';

export const requestConfigurations = [
    [getStoreInventory.rest, API_BASE_URL + getStoreInventory.endpoint, null, {name: 'getStoreInventory'} ],
    [putPet.rest, API_BASE_URL + putPet.endpoint, putPet.generateRequestBody, {name: 'putPet'}]
];

export function sendRequests() {
    requestConfigurations.forEach((config, index) => {
        const [method, url, body, tags] = config;
        const response = http.request(method, url, body ? JSON.stringify(body) : null, {
            headers: { 'Content-Type': 'application/json' },
            tags: tags
        });
        check(response, {
            'La solicitud fue exitosa': (res) => res.status === 200
        });

        if (__ENV.SUMMARY) {
            handleSummary(index, response, summaryFileName);
        }
    });
}

// ===============================================================
//                    REPORT CONFIG
// ===============================================================
export function handleSummary(index, data, summaryFileName) {
    let report = {};
    report[`${summaryFileName}.html`] = htmlReport(data);
    return report;
}

// ===============================================================
//                    LOAD TEST CONFIG
// ===============================================================
export let LoadSummaryFile = "LoadTestResult";
let rampLoadVUS = 100;
// ...............................................................

export let LoadTestOptions = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '2s', target: rampLoadVUS }, // simulate a ramp-up of traffic - predefined: 5m
        { duration: '5s', target: rampLoadVUS }, // stay at 100 users for 10 minutes - predefined: 10m
        { duration: '2s', target: 0 } // ramp-down to 0 users - predefined: 5m
    ],
    thresholds: {
        http_req_duration: ['p(99)<150'] // 99% of request must complete below 150 ms
    }
}


// ===============================================================
//                    SOAK TEST CONFIG
// ===============================================================
let SoakSummaryFile = "SoakTestResult";
let rampSoakVUS = 400;
// ...............................................................
export let SoakTestOptions = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '2m', target: rampSoakVUS }, // ramp up
        { duration: '3h56m', target: rampSoakVUS }, // stay for long periods of time
        { duration: '2m', target: 0 }, // scale down 
    ]
}

// ===============================================================
//                    SPYKE TEST CONFIG
// ===============================================================
let SpykeSummaryFile = "SypkeTestResult";
let normalSpykeVUS = 100;
let spykeSypkeVUS = 1400;
// ...............................................................
export let SypkeTestOptions = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '10s', target: normalSpykeVUS }, // below normal load
        { duration: '1m', target: normalSpykeVUS },
        { duration: '10s', target: spykeSypkeVUS }, // spyke to an insane load
        { duration: '3m', target: spykeSypkeVUS },   // stay for a period of time
        { duration: '10s', target: normalSpykeVUS }, // scale down. Recovery stage
        { duration: '3m', target: normalSpykeVUS },
        { duration: '10s', target: 0 },
    ]
}

// ===============================================================
//                    STRESS TEST CONFIG
// ===============================================================
let StressSummaryFile = "StressTestResult";
let belowStressVUS = 100;
let normalStressVUS = 200;
let breakingStressVUS = 300;
let beyondStressVUS = 400;
// ...............................................................
export let StressTestOptions = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '2m', target: belowStressVUS }, // below normal load
        { duration: '5m', target: belowStressVUS },
        { duration: '2m', target: normalStressVUS }, // normal load
        { duration: '5m', target: normalStressVUS },
        { duration: '2m', target: breakingStressVUS }, // around the breaking point
        { duration: '5m', target: breakingStressVUS },
        { duration: '2m', target: beyondStressVUS }, // beyond the breaking point
        { duration: '5m', target: beyondStressVUS },
        { duration: '10', target: 0 }, // scale down. Recovery stage
    ]
}