# consent-management-backend-mongo

## Description
This docker container hosts a backend service managing consents for all data subjects. 
It will also generate messages on a Kafka topic when the data subject consents change in order to propagate that change to other services.


## Configuration
* KAFKA_CHANGE_LOGS_TOPIC: The Kafka topic for all policy changes, by default "policies-audit".
* KAFKA_FULL_POLICIES_TOPIC: The Kafka topic where data subject policies are propagated, by default "full-policies".
* KAFKA_BROKER_LIST: The endpoint for Kafka, by default "localhost:9092, localhost:9094".
* KAFKA_TIMEOUT: The timeout for a Kafka connection, by default "5000".
* KAFKA_VERSION_REQUEST: Whether a version request should be made to Kafka, by default "false".
