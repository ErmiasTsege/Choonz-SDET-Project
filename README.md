# Choonz Website Testing Project
## Functional Testing


### Selenium 
A Selenium version 3.141.59 implimented

### Cucumber
A Cucumber template for version 6.10.4 was used

### How to run
From the project root, run:
1) java -jar Choonz-0.0.1-SNAPSHOT.jar
    and go to localhost:8082 on a browser 
2)mvn clean test
clean tidys up artifacts left from previous runs
test triggers the test phase of Maven and runs the tests using a supplied test runner, does not require packaging

## Non Functional Testing
## Apache JMeter (5.4.1)
### Load,Soak,Stress and Spike testing implemented using JMeter


## How to run
From the project root, run:
1)jmeter -n -t Choonzo_jmeter.jmx -l report.csv
  To get the reports in Excel
2)jmeter -n -t Choonzo_jmeter.jmx -l report.csv -e -o HTMLReport
To get comprensive reports in excel,json and HTML under HMTLReport 

