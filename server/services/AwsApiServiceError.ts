export class AwsApiServiceError extends Error {

  reason: AwsApiServiceErrorReason;
  errorData?: any;
  constructor(reason: AwsApiServiceErrorReason, errorData?: any) {
    const message = `AwsApiServiceError: Fetching Data from AWS Stuttgart API failed`
    super(message);

    this.name = "AwsApiServiceError";
    this.reason = reason;
    this.errorData = errorData;
  }
}

export type AwsApiServiceErrorReason = "validation" | "http" | "generic" | "unknown"