import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";

const generator = new CoreEntititesGenerator(client);

describe("find before tests", () => {
  test("by id", async () => {
    const launch = await generator.launches.create();
    const testContext = await generator.contexts.create({
      launchId: launch.id,
    });
    const created = await generator.beforeTests.create({
      testContextId: testContext.id,
      title: "New before test",
      launchId: launch.id,
      arguments: [
        {
          name: "Argument1",
          type: "String",
          value: "value1",
        },
        {
          name: "Argument2",
          type: "Integer",
          value: "value2",
        },
      ],
    });

    const response = await client.readBeforeTest({
      params: { id: created.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: created,
    });
  });
});
