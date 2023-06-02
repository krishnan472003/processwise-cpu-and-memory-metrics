# processwise-cpu-and-memory-metrics
The script uses the `child_process` module to execute a command or spawn a child process and then retrieves CPU and memory usage metrics for that process using the `pidusage` package. It then pushes these metrics to the Pushgateway for further processing and visualization.
# How to capture memory and CPU usage information
## Architecture:
>Prometheus Server: The main Prometheus server that collects and stores time series data. It regularly scrapes metrics from various targets to build a time series database.

>Pushgateway: This component receives metrics pushed by external jobs or processes that cannot be directly scraped by Prometheus. It acts as an intermediary, accepting metric data and exposing it as an HTTP endpoint for the Prometheus server to scrape.

>Jobs or Processes: This component is used to scrape data from the system and send to the pushgateway server using language of choice.

## Steps:

>>Download Prometheus: Go to the Prometheus official website (https://prometheus.io/) and download the latest stable version of Prometheus suitable for your operating system.

>Extract the Prometheus package: Extract the downloaded Prometheus package to a directory of your choice.

>Configure Prometheus: Open the prometheus.yml configuration file located in the Prometheus directory. This file defines the scraping targets and other configuration options.

>Add Pushgateway as a target: In the scrape_configs section of the prometheus.yml file, add a new job to scrape metrics from the Pushgateway. Here's an example configuration:

### yaml:
``` 
scrape_configs:
  - job_name: 'pushgateway'
    static_configs:
      - targets: ['pushgateway:9091']
```  
*Replace 'pushgateway:9091' with the address and port where your Pushgateway is running. Save the prometheus.yml file.

Start Prometheus: Run the Prometheus server using the following command:

    $ sudo systemctl start prommetheus

Make sure you navigate to the directory where Prometheus is installed before executing this command.

Verify Prometheus is running: Open a web browser and access the Prometheus web interface by visiting (http://localhost:9090) You should see the Prometheus UI.

Install and configure Pushgateway: Follow the instructions in the official Prometheus Pushgateway documentation (https://www.devopsschool.com/blog/prometheus-pushgateway-installation-configuration-and-using-tutorials/) to install and configure the Pushgateway on your system.

Push metrics to the Pushgateway: To push CPU and memory usage metrics to the Pushgateway, you can use the following example code snippets in NodeJS(). Make sure you have the child_process,fs,express, pidusage, prom-client, axios library installed

### NodeJS:

```
npm install child_process fs express pidusage prom-client axios
```

Visualize metrics: You can now use Grafana or other visualization tools to connect to Prometheus and create dashboards to visualize the collected metrics.

Remember to adapt the steps according to your specific environment and requirements.
