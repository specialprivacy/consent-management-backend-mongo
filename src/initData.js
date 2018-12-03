const logger = require("./logger")

module.exports = async function(app) {
    const policiesService = app.service("policies")
    const applicationsService = app.service("applications")
    
    logger.info("creating initial policies - started")
    
    const policy1 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Anonymized",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#EU",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Collect",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Account",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsDelivery",
        "explanation": "I consent to the collection of my anonymized data in Europe for the purpose of accounting.",
    })
    
    const policy2 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Derived",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#EULike",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Copy",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Admin",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsSame",
        "explanation": "I consent to the copying of my derived data in Europe-like countries for the purpose of administration.",
    })
    
    const policy3 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Computer",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#ThirdParty",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Move",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Browsing",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsPublic",
        "explanation": "I consent to the moving of my computer data on third-party servers for the purpose of browsing.",
    })
    
    const policy4 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Activity",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#ControllerServers",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Aggregate",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Account",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsDelivery",
        "explanation": "I consent to the aggregation of my activity data on your servers for the purpose of accounting.",
    })
    
    const policy5 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Anonymized",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#EU",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Analyze",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Admin",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsOurs",
        "explanation": "I consent to the analysis of my anonymized data in Europe for the purpose of administration.",
    })
    
    const policy6 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#AudiovisualActivity",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#EULike",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Anonymize",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Admin",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsPublic",
        "explanation": "I consent to the anonymization of my activity data in Europe-like countries for the purpose of administration.",
    })    
    
    const policy7 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Computer",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#ThirdCountries",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Copy",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Arts",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsSame",
        "explanation": "I consent to the copying of my computer data in third countries for the purpose of artistic usage.",
    })
    
    const policy8 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Content",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#OurServers",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Derive",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#AuxPurpose",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsUnrelated",
        "explanation": "I consent to the derivation of my content data on your servers for auxiliary purposes.",
    })
    
    const policy9 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Demographic",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#ProcessorServers",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Move",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Browsing",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsDelivery",
        "explanation": "I consent to the moving of my demographic data on processor servers for the purpose of browsing.",
    })
    
    const policy10 = await policiesService.create({
        "dataCollection": "http://www.specialprivacy.eu/vocabs/data#Derived",
        "storageCollection": "http://www.specialprivacy.eu/vocabs/locations#ThirdParty",
        "processingCollection": "http://www.specialprivacy.eu/vocabs/processing#Aggregate",
        "purposeCollection": "http://www.specialprivacy.eu/vocabs/purposes#Charity",
        "recipientCollection": "http://www.specialprivacy.eu/vocabs/recipientsOtherRecipient",
        "explanation": "I consent to the aggregation of my derived data on third-party servers for the purpose of charity.",
    })
    
    await Promise.all([policy1, policy2, policy3, policy4, policy5, policy6, policy7, policy8, policy9, policy10])
    
    logger.info("creating initial policies - finished")
    
    
    logger.info("creating initial applications - started")
    
    const application1 = await applicationsService.create({
        "name": "Application A",
        "policies":
            [
                policy1._id,
                policy2._id,
                policy3._id,
                policy4._id,
                policy5._id,
                policy6._id,
            ],
    })
    
    const application2 = await applicationsService.create({
        "name": "Application B",
        "policies":
            [
                policy5._id,
                policy6._id,
                policy7._id,
                policy8._id,
                policy9._id,
                policy10._id,
            ],
    })
    
    const applicationsCreated =  await Promise.all([application1, application2])
    logger.info("creating initial applications - finished")
    
    return applicationsCreated
}
