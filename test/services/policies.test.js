const assert = require("assert")
const app = require("../../src/app")

describe("'policies' service", () => {
    it.skip("registered the service", () => {
        const service = app.service("policies")

        assert.ok(service, "Registered the service")
    })
})
