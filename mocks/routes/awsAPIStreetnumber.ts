//w 200 status
export const awsAPIStreetnumberSuccess = {
  "suggestions": [
    {
      "value": "2",
      "data": "2"
    },
    {
      "value": "20",
      "data": "20"
    },
    {
      "value": "21",
      "data": "21"
    },
    {
      "value": "22",
      "data": "22"
    },
    {
      "value": "24",
      "data": "24"
    },
    {
      "value": "26",
      "data": "26"
    },
    {
      "value": "26A",
      "data": "26A"
    },
    {
      "value": "26B",
      "data": "26B"
    },
    {
      "value": "26C",
      "data": "26C"
    },
    {
      "value": "26D",
      "data": "26D"
    },
    {
      "value": "26E",
      "data": "26E"
    }
  ]
}

export const awsAPIStreetnumberNoMatch = {
  suggestions: []
}

//https://service.stuttgart.de/lhs-services/aws/hausnummern?street=Balinger%20Str.&streetnr=1
export default [
  {
    id: "get-streetnumber", // route id
    //?street=Königstr.&streetnr=10
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
