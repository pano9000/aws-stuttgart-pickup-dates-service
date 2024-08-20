export class AwsApiServiceError extends Error {

  reason: AwsApiServiceErrorReason;
  errorData?: any;
  constructor(reason: AwsApiServiceErrorReason, errorData?: any) {
    const message = `Fetching Data from AWS Stuttgart API failed.`
    super(message);

    this.name = `AwsApiServiceError.${reason}`;
    this.reason = reason;
    this.errorData = errorData;
  }
}

export type AwsApiServiceErrorReason = "VALIDATION" | "HTTP" | "GENERIC" | "UNKNOWN"