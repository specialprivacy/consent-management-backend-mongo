const Kafka = require("node-rdkafka")

const logger = require("./logger")

const changeLogsTopic = process.env["KAFKA_CHANGE_LOGS_TOPIC"] || "policies-audit"
const fullPolicyTopic = process.env["KAFKA_FULL_POLICIES_TOPIC"] || "full-policies"
const kafkaHost = process.env["KAFKA_BROKER_LIST"] || "localhost:9092, localhost:9094"
const kafkaConnectTimeout = process.env["KAFKA_TIMEOUT"] || 5000

let app = null
let producer = null

module.exports = function(application, onReady) {
    app = application

    producer = new Kafka.Producer({
        "metadata.broker.list": kafkaHost,
        "api.version.request": process.env["KAFKA_VERSION_REQUEST"] || false,
        "dr_cb": true,
    })
    producer.connect({ "timeout": kafkaConnectTimeout })
    
    producer.on("event.error", function (error) {
        logger.info("Kafka producer error: " + JSON.stringify(error))
    })

    producer.on("ready", async () => {
        logger.info("kafka producer started")
        
        app.handleUserCreate = async (userId, userPolicies) => {
            // logger.info("handle user create")
            // logger.info(userId)
            // logger.info(userPolicies)

            // get hash with all policies { policyId: policy }
            const allPoliciesHash = await getPoliciesHash(userPolicies)

            // create change log messages
            const changeLogMessages = generateAddPolicyMessages(userId, userPolicies, allPoliciesHash)

            // create full policy message
            const fullPolicyMessage = {
                "timestamp": new Date().getTime(),
                "userID": userId,
                "simplePolicies": userPolicies.map(policyId => {
                    let simplePolicy = { ...allPoliciesHash[policyId] }
                    delete simplePolicy["explanation"]
                    return simplePolicy
                }),
            }

            // post messages
            postChangeLogMessages(userId, changeLogMessages)
            postFullPolicyMessage(userId, fullPolicyMessage)
        }
        
        app.handleUserDelete = async (userId, userPolicies) => {
            // logger.info("handle user delete")
            // logger.info(userId)
            // logger.info(userPolicies)
            
            // get hash with all policies { policyId: policy }
            const allPoliciesHash = await getPoliciesHash(userPolicies)

            // create change log messages
            const changeLogMessages = generateRemovePolicyMessages(userId, userPolicies, allPoliciesHash)

            // post messages
            postChangeLogMessages(userId, changeLogMessages)
            postFullPolicyMessage(userId, null)
        }
        
        app.handleUserPatch = async (userId, oldPolicyIds, newPolicyIds) => {
            // logger.info("handle user policies update")
            // logger.info(userId)
            // logger.info(oldPolicyIds)
            // logger.info(newPolicyIds)

            // get hash with all policies { policyId: policy }
            const allPoliciesHash = await getPoliciesHash([ ...oldPolicyIds, ...newPolicyIds ])
            
            // create arrays with withdrawn and added policy ids
            const withdrawnIds = oldPolicyIds.filter(item => { return !newPolicyIds.includes(item) })
            const addedIds = newPolicyIds.filter(item => { return !oldPolicyIds.includes(item) })
            
            // create full policy message
            const fullPolicyMessage = {
                "timestamp": new Date().getTime(),
                "userID": userId,
                "simplePolicies": newPolicyIds.map(policyId => {
                    let simplePolicy = { ...allPoliciesHash[policyId] }
                    delete simplePolicy["explanation"]
                    return simplePolicy
                }),
            }
            
            // create change log messages
            const changeLogMessages = [
                ...generateRemovePolicyMessages(userId, withdrawnIds, allPoliciesHash),
                ...generateAddPolicyMessages(userId, addedIds, allPoliciesHash),
            ]

            // post messages
            postChangeLogMessages(userId, changeLogMessages)
            postFullPolicyMessage(userId, fullPolicyMessage)
        }
        
        onReady()
    })
}

const generateAddPolicyMessages = (userId, addedIds, allPolicies) => {
    const messages = []
    addedIds.forEach(policyId => {
        logger.debug(`Adding policy - ${policyId} - to user - ${userId}.`)

        let message = { ...allPolicies[policyId] }
        message["given"] = true
        message["data-subject"] = userId

        messages.push(message)
    })
    return messages
}

const generateRemovePolicyMessages = (userId, removedIds, allPolicies) => {
    const messages = []
    removedIds.forEach(policyId => {
        logger.debug(`Removing policy - ${policyId} - from user - ${userId}.`)
        let message = { ...allPolicies[policyId] }
        if (!message) {
            // Policy no longer exists in DB, checking deleted policies.
            logger.debug(`Policy deleted - ${policyId} - checking recently deleted policies`)
            message = app.deletedPolicies[policyId] || {}
            message["deleted-policy"] = true
        }
        message["given"] = false
        message["data-subject"] = userId
        delete message["id"]

        messages.push(message)
    })
    return messages
}

const getPoliciesHash = async (policyIds) => {
    const policiesService = app.service("policies")
    
    // fetch full policies for the ids
    const policiesArray = await policiesService.find({
        query: {
            _id : { $in: [ ...policyIds ] },
        },
    })

    // create hash { policyId: policy }
    const policies = {}
    policiesArray.data.forEach(policy => {
        policies[policy._id] = policy
    })
    
    return policies
}

const postChangeLogMessages = (userId, messages) => {
    for (let message of messages) {
        try {
            postMessage(userId, message, changeLogsTopic)
        }
        catch(error) {
            logger.error(`Could not produce policies-audit message - ${JSON.stringify(error)}`)
        }
    }
}

const postFullPolicyMessage = (userId, message) => {
    try {
        postMessage(userId, message, fullPolicyTopic)
    }
    catch(error) {
        logger.error(`Could not prodice full-policy message - ${JSON.stringify(error)}`)
    }
}

const postMessage = (userId, message, topic) => {
    logger.info(`Producing message - ${JSON.stringify(message)} - on topic - ${topic}.`)
    producer.produce(topic, null, message === null ? null : Buffer.from(JSON.stringify(message)), userId, Date.now())
}
