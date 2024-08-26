# Bigip Report

## Overview
Bigip Report is a tool designed to pull configuration data from multiple load balancers and display it in a user-friendly table format. The tool provides three main tabs to navigate through the data: Virtual Servers, Pools, and iRules. Each tab contains specific columns relevant to its data type, and users can easily toggle the visibility of these columns.

## Features

### VirtualServers Tab
- **Name**: The name of the virtual server.
- **LoadBalancer**: The associated load balancer.
- **IP**: The IP address and port combination.
- **Pool/Members**: The associated pool and its members.

### Pools Tab
- **Name**: The name of the pool.
- **LoadBalancer**: The associated load balancer.
- **Orphan**: Indicates if the pool is orphaned.
- **Method**: The load-balancing method used.
- **Members**: The members of the pool.

### iRules Tab
- **Name**: The name of the iRule.
- **LoadBalancer**: The associated load balancer.
- **Associated Pool Members**: Pool members associated with the iRule.
- **Associated Data Groups**: Data groups associated with the iRule.
- **Associated Virtual Servers**: Virtual servers associated with the iRule.
- **Length**: The length of the iRule script.

## Technology Stack
- **Ag-grid**: Used for rendering and managing the data tables.
- **Bootstrap**: Provides various components and styling to enhance the UI.
- **React**: Powers the frontend application.

## Data Handling
The data displayed in the tables is fetched and mapped using JSON files. A script is implemented to regularly update these JSON files by pulling data from specified server URLs. The script runs once every 24 hours by default, ensuring that the data remains up-to-date.

## Customizing the Data Fetch Interval
The script runs every 24 hours by default. To change the interval:
-Open the fetchData.js file.
-Modify the cron schedule within the script to your desired interval:
 cron.schedule(" 0 0 * * * ", fetchData); // Example: Runs every 24 hours
 Adjust the cron schedule string to fit your needs (e.g., run every hour, every day at a specific time, etc.).


## Setup Instructions

### Prerequisites
- Ensure you have Node.js version 20.2 installed on your machine.
- Navigate to the project directory.

### Installation
1. Install the required npm packages:
   ```bash npm install```


2. Running the Data Fetch Script
   The data fetch script is responsible for pulling the latest configuration data from the server URLs and updating the JSON files. To run the script:
   Navigate To Scripts
   ```bash npm install axios node-cron```
   ```bash npm run fetch-data```

### HOW to Run:
-Install NodeJS  version 20.2
 ```bash npm install ```
 ```bash npm start ```