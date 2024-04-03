# STADVDB MCO2
 
## RUNNING THE APP

Type **npm install**

run with **node app.js**

Create a local database for testing by running this on MySQL:

```
CREATE DATABASE all_appointments;

USE all_appointments;

CREATE TABLE appointments(apptid VARCHAR(255),  `status` VARCHAR(255), TimeQueued DATETIME(6), QueueDate DATETIME, StartTime DATETIME, EndTime DATETIME, type VARCHAR(255), `Virtual` VARCHAR(255));
```

## NODE CONNECTION HANDLING

You need to change the connections you want to connect to. Since we need to have three different connection types. We have 3 types of connections that you can input.

### All Nodes
uncomment all of the code for the connections.

### Luzon Node

uncomment Luzon Node and central node.

### Visayas Mindanao Node

uncomment VisMin Node and centtral node.

Since we're running it locally for development, use the local connection