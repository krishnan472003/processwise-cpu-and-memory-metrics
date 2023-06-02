const { exec } = require('child_process');
const { stat } = require('fs');
const express = require("express");
const pidusage = require('pidusage');
const { register, Gauge } = require('prom-client');
const axios = require('axios');

const app = express();
const gatewayUrl = 'http://localhost:9091/metrics/job/CPU_PROCESS_METRICS/'; // Replace with your Pushgateway URL

// Define custom metrics for CPU and memory usage
const cpuUsageGauge = new Gauge({
  name: 'process_cpu_usage',
  help: 'CPU usage of a process',
  labelNames: ['user', 'pid', 'name'],
  registers: [register],
});

const memoryUsageGauge = new Gauge({
  name: 'process_memory_usage',
  help: 'Memory usage of a process',
  labelNames: ['user', 'pid', 'name'],
  registers: [register],
});

// Run the `ps` command to get the list of all processes with PIDs
exec('ps -eo user,pid,comm', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Command execution returned an error: ${stderr}`);
    return;
  }

  const lines = stdout.trim().split('\n').slice(1); // Exclude the header row
  const processes = lines.map(line => {
    const [user, pid, name] = line.trim().split(/\s+/);
    return { user, pid, name };
  });

  // Fetch memory and CPU utilization for each process
  const fetchUsage = async () => {
    for (const process of processes) {
      try {
        const stats = await pidusage(process.pid);
        // not logging the root processes and process which has cpu utilization 0.
        if (process.user === 'root' || stats.cpu === 0) {
          continue;
        }

        cpuUsageGauge.labels(process.user, process.pid, process.name).set(stats.cpu);
        memoryUsageGauge.labels(process.user, process.pid, process.name).set(stats.memory);

      } catch (error) {
        console.error(`Error fetching resource usage for PID ${process.pid}: ${error.message}`);
      }
    }

    // Push metrics to Pushgateway
    try {
      const metrics = await register.metrics();
      console.log('====================================');
      console.log(metrics);
      console.log('====================================');
      await axios.post(gatewayUrl, metrics);
    } catch (error) {
      console.error(`Error pushing metrics to Pushgateway: ${error.message}`);
    }
  };

  setInterval(fetchUsage, 1000);
});

// Creating a server which listens at port 3001
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});