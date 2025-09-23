/**
 * Minesweeper MVP - Docker Health Check
 * 
 * Simple health check script to verify the application is running
 * and responding to requests on the specified port.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */

const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3001,
  path: '/',
  timeout: 2000,
  method: 'GET'
};

const request = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (error) => {
  console.error('Health check failed:', error.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('Health check timeout');
  request.destroy();
  process.exit(1);
});

request.end();