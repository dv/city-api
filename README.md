# City API

Query the details in JSON of a city based on its name or alternate names.

Using data from http://www.geonames.org/.

# Example

```
# Request:
GET /lookup?name=bruhhe

# Response:
{"country":"BE","name":"brugge","lat":"51.20892","lng":"3.22424"}
```

# Serve locally

```
yarn install
yarn run netlify-lambda serve functions
```

# Notes

To get the cities500.txt static file as string inside the Javascript source, the webpack configuration was necessary, as well as the `file-loader` module.

