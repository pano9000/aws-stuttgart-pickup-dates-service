export class EnvInitError extends Error {
  constructor(checkResultErrors: string[]) {
    const message = `Startup aborted. The following ${checkResultErrors.length} required ENV variables were undefined. Please fix these and restart:\n\t` + `${checkResultErrors.join("\n\t")}`;
    super(message);

    this.name = "EnvInitError";

    // stack not required, so delete to declutter log
    delete this.stack;
  }
}

export function envInitCheck(envVars: string[]): void {

  const checkResultErrors: string[] = [];

  envVars.forEach(entry => {
    if (process.env[entry] === undefined || process.env[entry] === "") {
      checkResultErrors.push(entry)
    }
  });

  if (checkResultErrors.length > 0) {
    throw new EnvInitError(checkResultErrors);
  }

}