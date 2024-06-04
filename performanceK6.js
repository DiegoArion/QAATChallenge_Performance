import http from 'k6/http'
import { sleep } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 1,
  duration: '10s'
};

export default () => {
  http.get('http://localhost:8080/api/v3/store/inventory')
  sleep(1)
}

