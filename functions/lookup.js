var fs = require('fs');
var readline  = require('linebyline');
var cities = {};
var file = readline('output/cities500.txt');
var done = false;

const { exec } = require('child_process');

var run = function(cmd) {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

run("pwd");
run("ls -lha");

var http_lookup_city = function(city, callback) {
  if (city == "bruhhe") {
    city = "brugge";
  }

  if (result = JSON.stringify(cities[city])) {
    callback(
      null,
      {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: result
      }
    );
  } else {
    callback(
      null,
      {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: '{error: "city not found", error_code: 404}'
      }
    );
  }
}

file.on('line', function(line, lineCount, byteCount) {
  // Inspired by https://github.com/lutangar/cities.json)
  city = line.split("\t");

  if (lineCount !== 0) {
    // geonameid         : integer id of record in geonames database
    // name              : name of geographical point (utf8) varchar(200)
    // asciiname         : name of geographical point in plain ascii characters, varchar(200)
    // alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
    // latitude          : latitude in decimal degrees (wgs84)
    // longitude         : longitude in decimal degrees (wgs84)
    // feature class     : see http://www.geonames.org/export/codes.html, char(1)
    // feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
    // country code      : ISO-3166 2-letter country code, 2 characters
    // cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
    // admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
    // admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
    // admin3 code       : code for third level administrative division, varchar(20)
    // admin4 code       : code for fourth level administrative division, varchar(20)
    // population        : bigint (8 byte int)
    // elevation         : in meters, integer
    // dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
    // timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
    // modification date : date of last modification in yyyy-MM-dd format
    var name = city[1].replace('"', '').replace('"', '').toLowerCase();
    var alternate_names = city[3].split(',');

    cities[name] = {
      country: city[8],
      name: name,
      lat: city[4],
      lng: city[5]
    }

    for (alternate_name of alternate_names) {
      cities[alternate_name] = cities[name];
    }
  }
})

file.on('error', function(e) {
  console.error(e);
});

file.on('end', function() {
  done = true;
});

exports.handler = function(event, context, callback) {
  var city_name = event.queryStringParameters["name"].toLowerCase();

  run("pwd");
  run("ls -lha");
  run("ls -lha ..");

  if (done) {
    http_lookup_city(city_name, callback);
  } else {
    file.on('end', function() {
      http_lookup_city(city_name, callback);
    });
  }
}
