export class AwsApiServiceError<ErrorType> extends Error {

  reason: AwsApiServiceErrorReason;
  errorData?: ErrorType;
  constructor(reason: AwsApiServiceErrorReason, errorData?: ErrorType) {
    const message = `Fetching Data from AWS Stuttgart API failed.`
    super(message);

    this.name = `AwsApiServiceError.${reason}`;
    this.reason = reason;
    this.errorData = errorData;
  }
}

export type AwsApiServiceErrorReason = "VALIDATION" | "HTTP" | "GENERIC" | "UNKNOWN"