import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";

/**
 * This class is responsible for generating reports.
 */
export class ReportsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Generates a new report.
   *
   * @param args The arguments to generate the report with.
   * @returns The generated report.
   */
  async create(args: CreateReportArgs | undefined = undefined) {
    const title =
      args?.title ??
      faker.word.noun() +
        " " +
        faker.word.verb() +
        " " +
        faker.word.adjective();

    const response = await this.client.createReport({
      body: {
        title: title,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create report. Server response status ${response.status}, body ${JSON.stringify(
        response.body
      )}`
    );

    return response.body;
  }

  /**
   * Generates multiple reports.
   * 
   * @param count The number of reports to generate.
   * @returns The generated reports.
   */
  async createMultiple(count: number) {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(await this.create());
    }
    return result;
  }
}

/**
 * The arguments to generate a report with.
 */
export type CreateReportArgs = {
  title: string | null;
};
