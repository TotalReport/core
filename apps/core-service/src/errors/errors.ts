export class ReportNotFoundError extends Error {
  constructor(reportId: string) {
    super("Report with id " + reportId + " is not found.");
  }
}
