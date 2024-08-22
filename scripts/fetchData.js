import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// Define URLs and paths
const urls = {
    pools: 'https://loadbalancing.se/bigipreportdemo/json/pools.json',
    monitors: 'https://loadbalancing.se/bigipreportdemo/json/monitors.json',
    virtualservers: 'https://loadbalancing.se/bigipreportdemo/json/virtualservers.json',
    irules: 'https://loadbalancing.se/bigipreportdemo/json/irules.json',
    datagroups: 'https://loadbalancing.se/bigipreportdemo/json/datagroups.json',
    loadbalancers: 'https://loadbalancing.se/bigipreportdemo/json/loadbalancers.json',
    preferences: 'https://loadbalancing.se/bigipreportdemo/json/preferences.json',
    knowndevices: 'https://loadbalancing.se/bigipreportdemo/json/knowndevices.json',
    certificates: 'https://loadbalancing.se/bigipreportdemo/json/certificates.json',
    devicegroups: 'https://loadbalancing.se/bigipreportdemo/json/devicegroups.json',
    asmpolicies: 'https://loadbalancing.se/bigipreportdemo/json/asmpolicies.json',
    nat: 'https://loadbalancing.se/bigipreportdemo/json/nat.json',
    state: 'https://loadbalancing.se/bigipreportdemo/json/state.json',
    policies: 'https://loadbalancing.se/bigipreportdemo/json/policies.json',
    loggederrors: 'https://loadbalancing.se/bigipreportdemo/json/loggederrors.json'
};

const filePaths = {
    virtualservers: '../src/Data/virtualservers.json',
    state: '../src/Data/state.json',
    preferences: '../src/Data/preferences.json',
    pools: '../src/Data/pools.json',
    policies: '../src/Data/policies.json',
    nat: '../src/Data/nat.json',
    monitors: '../src/Data/monitors.json',
    loggederrors: '../src/Data/loggederrors.json',
    knowndevices: '../src/Data/knowndevices.json',
    irules: '../src/Data/irules.json',
    example: '../src/Data/example.json',
    devicegroups: '../src/Data/devicegroups.json',
    datagroups: '../src/Data/datagroups.json',
    certificates: '../src/Data/certificates.json',
    asmpolicies: '../src/Data/asmpolicies.json',
    loadbalancers: '../src/Data/loadbalancers.json'
};

// Convert __dirname to ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fetch data from a URL and update the corresponding file
async function fetchAndUpdate(url, filePath) {
    try {
        const response = await axios.get(url);
        fs.writeFileSync(path.resolve(__dirname, filePath), JSON.stringify(response.data, null, 2));
        console.log(`Updated ${filePath} successfully.`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
    }
}

// Function to fetch data from all URLs and update all files
async function updateData() {
    for (const [key, url] of Object.entries(urls)) {
        const filePath = filePaths[key];
        if (filePath) {
            await fetchAndUpdate(url, filePath);
        }
    }
}

// Schedule the task to run daily at 7:05 PM
cron.schedule('15 19 * * *', () => {
    console.log('Running daily update task at 7:05 PM...');
    updateData();
});

console.log('Scheduler started. Task will run daily at 7:05 PM.');
