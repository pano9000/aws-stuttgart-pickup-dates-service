//w 200 status
export const awsAPIStreetnameSuccess = {
  "suggestions": [
    {
      "value": "Bachgerstenstr.",
      "data": "Bachgerstenstr."
    },
    {
      "value": "Bachhalde",
      "data": "Bachhalde"
    },
    {
      "value": "Bachstelzenstr.",
      "data": "Bachstelzenstr."
    },
    {
      "value": "Bachstr.",
      "data": "Bachstr."
    },
    {
      "value": "Bachwiesenstr.",
      "data": "Bachwiesenstr."
    },
    {
      "value": "Backnanger Str.",
      "data": "Backnanger Str."
    },
    {
      "value": "Badbrunnenstr.",
      "data": "Badbrunnenstr."
    },
    {
      "value": "Badergasse",
      "data": "Badergasse"
    },
    {
      "value": "Badstr.",
      "data": "Badstr."
    },
    {
      "value": "Bahnhof Feuerbach",
      "data": "Bahnhof Feuerbach"
    },
    {
      "value": "Bahnhof Obert\u00fcrkheim",
      "data": "Bahnhof Obert\u00fcrkheim"
    },
    {
      "value": "Bahnhof Vaihingen",
      "data": "Bahnhof Vaihingen"
    }
  ]
}

export const awsAPIStreetnameNoMatch = {
  suggestions: []
}

//https://service.stuttgart.de/lhs-services/aws/strassennamen?street=b
export default [
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
];
