import {
  awsPickupDataSuccess,
  awsPickupDataNonExisting,
  awsPickupDataWrongUrlParam,

  awsAPIStreetnameSuccess,
  awsAPIStreetnameNoMatch,

  awsAPIStreetnumberSuccess,
  awsAPIStreetnumberNoMatch,

} from "../mockResponses.js"


export default [

  {
    //https://service.stuttgart.de/lhs-services/aws/api?street=Königstr.&streetnr=10
    id: "get-pickup", // route id
    url: "/lhs-services/aws/api", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "ok",
        type: "json",
        options: {
          status: 200,
          body: awsPickupDataSuccess,
        },
      },
      {
        id: "non-existing-street",
        type: "json",
        options: {
          status: 404,
          body: awsPickupDataNonExisting,
        },
      },
      {
        id: "wrongly-formatted-urlparam",
        type: "json",
        options: {
          status: 404,
          // body to send
          body: awsPickupDataWrongUrlParam,
        },
      },
    ],
  },

  //https://service.stuttgart.de/lhs-services/aws/strassennamen?street=b
  {
    id: "get-streetname", // route id
    url: "/lhs-services/aws/strassennamen", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "match",
        type: "json",
        options: {
          status: 200,
          body: awsAPIStreetnameSuccess,
        },
      },
      {
        id: "no-match",
        type: "json",
        options: {
          status: 200,
          body: awsAPIStreetnameNoMatch,
        },
      },
    ],
  },

  //https://service.stuttgart.de/lhs-services/aws/hausnummern?street=Balinger%20Str.&streetnr=1
  {
    id: "get-streetnumber", // route id
    url: "/lhs-services/aws/hausnummern", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "match",
        type: "json",
        options: {
          status: 200,
          body: awsAPIStreetnumberSuccess,
        },
      },
      {
        id: "no-match",
        type: "json",
        options: {
          status: 200,
          body: awsAPIStreetnumberNoMatch,
        },
      },
    ],
  },
];
