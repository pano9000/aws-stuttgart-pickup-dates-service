
export default defineNitroPlugin((nitroApp) => {
  envInitCheck([
    "AWSAPPENV_REDIS_SERVER_PORT",
    "AWSAPPENV_REDIS_SERVER_HOST",
    "AWSAPPENV_REDIS_SERVER_PASSWORD",
    "AWSAPPENV_AWS_API_URL",
  ]);
})
