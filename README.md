# How to capture memory and CPU usage information
### Description:
Above program written is used for getting the cpu and memory data. This data is send to pushgateway api url which is then processed by pushgateway and it sends this data to prometheus server 
## Steps:

### Prometheus
> Download Prometheus: Go to (https://www.digitalocean.com/community/tutorials/how-to-install-prometheus-on-ubuntu-16-04) and download the latest stable version of Prometheus suitable for your operating system and configure it

> After configuration run the following command to start the service and to check its status
 
 ```
 $ sudo systemctl start prometheus
 ```
 
  ```
$ sudo systemctl status prometheus
 ```
 * make sure you have systemd to run this command
 >> The status would be shown as active
 
 #### Imporatant Points to consider for installation:
 
 > Port Number the service is running on. Standard port Number is 9090
 
 > Proper configuration of prometheus.yml and prometheus.service files
 
 > 
 
### Pushgateway
Install Pushgateway and configure it and run the service at PORT 9091 
(https://www.devopsschool.com/blog/prometheus-pushgateway-installation-configuration-and-using-tutorials/) 

### prometheus.yml:

Install and configure Pushgateway: Follow the instructions in the official Prometheus Pushgateway documentation (https://www.devopsschool.com/blog/prometheus-pushgateway-installation-configuration-and-using-tutorials/) to install and configure the Pushgateway on your system.

``` 
# my global config
global:
  scrape_interval: 3s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 3s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "pushgateway"
    static_configs:
      - targets: ["localhost:9091"] 
``` 
*Replace target:['localhost:9091'] with the address and port where your Pushgateway and prometheus is running respectively. Save the prometheus.yml file.


Start Prometheus: Run the Prometheus server using the following command:

```
    $ sudo systemctl restart prometheus
```
```
    $ sudo systemctl start pushgateway
```
```
    $ sudo systemctl status prometheus
```
```
    $ sudo systemctl status pushgateway
```
>both the services should be active


Verify Prometheus is running: Open a web browser and access the Prometheus web interface by visiting (http://<Your-ip-or-localhost>:9090) You should see the Prometheus UI.


Push metrics to the Pushgateway: To push CPU and memory usage metrics to the Pushgateway, you can use the following example code snippets in NodeJS . Make sure you have the child_process,fs,express, pidusage, prom-client, axios library installed

### NodeJS:


```
npm install child_process fs express pidusage prom-client axios
```
 * Remember to change the localhost with the server ip where you want to run the service
 
 ### Service is running on three ports 
 > NodeJS:3001
 > prometheus: 9090
 > pushgateway: 9091
