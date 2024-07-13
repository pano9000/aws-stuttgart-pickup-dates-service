import AwsAPIClient from "../../services/AwsAPIClient";

export default defineEventHandler(async (event) => {
  //TODO add middleware for validation of query params before this step
  try {
    const query = getQuery(event);
    const awsAPIClient = new AwsAPIClient().setAddress(query.streetname as string, query.streetno as string);
    const data = await awsAPIClient.getUpcoming();

    return data

  } catch(error) {
    //TODO replace by propper logger
    console.error(error);
    setResponseStatus(event, 500)
    return {
      error: "Unexpected Server Error"
    }

    /* this returns HTML for some reason -> to be investigated -> is this a bug or PEBKAC :-)?
    throw createError({
      status: 500,
      data: {
        error: "Unexpected Server Error"
      }
    })
    */
  }

})