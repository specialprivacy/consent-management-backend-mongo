const kafka = require("kafka-node")
const logger = require("./logger")

const changeLogsTopic = process.env["KAFKA_CHANGE_LOGS_TOPIC"] || "policies-audit"
const fullPolicyTopic = process.env["KAFKA_FULL_POLICIES_TOPIC"] || "full-policies"
const kafkaHost = process.env["KAFKA_BROKER_LIST"] || "localhost:9092, localhost:9094"
const kafkaConnectTimeout = process.env["KAFKA_TIMEOUT"] || 5000

module.exports = function(onReady) {
    const client =  new kafka.KafkaClient({
        autoConnect: true,
        kafkaHost: kafkaHost,
        connectTimeout: kafkaConnectTimeout,
        connectRetryOptions: {
            retries: 10,
            factor: 2,
            minTimeout: 500,
            maxTimeout: 1500,
            randomize: true,
        }
    })

    const producer = new kafka.Producer(client);
    
    producer.on("error", function (error) {
        logger.error({ err: error }, "Error from kafka producer")
    })

    producer.on("ready", async () => {
        logger.info("kafka producer started")
        onReady()
    })
}