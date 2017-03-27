  // CLIENT ID
  var CLIENT_ID = ' ';

  // Set authorized scope.
  var SCOPES = ['https://www.googleapis.com/auth/analytics'];


  var jsonArray = [ ];
  //Array to hold JSON objects of each query result

  function authorize(event) {
    // Handles the authorization flow.
    // `immediate` should be false when invoked from the button click.
    var useImmdiate = event ? false : true;
    var authData = {
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: useImmdiate
    };

    gapi.auth.authorize(authData, function(response) {
      var authButton = document.getElementById('auth-button');
      if (response.error) {
        authButton.hidden = false;
      }
      else {
        authButton.hidden = true;
        queryAccounts();
      }
    });
  }


function queryAccounts() {
  // Load the Google Analytics client library.
  gapi.client.load('analytics', 'v3').then(function() {

    // Get a list of all Google Analytics accounts for this user
    gapi.client.analytics.management.accounts.list().then(handleAccounts);
  });
}


function handleAccounts(response) {
  // Handles the response from the accounts list method.
  if (response.result.items && response.result.items.length) {
    // Get the first Google Analytics account.
    var firstAccountId = " ";

    // Query for properties.
    queryProperties(firstAccountId);
  } else {
    console.log('No accounts found for this user.');
  }
}


function queryProperties(accountId) {
  // Get a list of all the properties for the account.
  gapi.client.analytics.management.webproperties.list(
      {'accountId': accountId})
    .then(handleProperties)
    .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProperties(response) {
  // Handles the response from the webproperties list method.
  if (response.result.items && response.result.items.length) {

    // Get the first Google Analytics account
    var firstAccountId = " ";

    // Get the first property ID
    var firstPropertyId = " ";

    // Query for Views (Profiles).
    queryProfiles(firstAccountId, firstPropertyId);
  } else {
    console.log('No properties found for this user.');
  }
}


function queryProfiles(accountId, propertyId) {
  // Get a list of all Views (Profiles) for the first property
  // of the first Account.
  gapi.client.analytics.management.profiles.list({
      'accountId': accountId,
      'webPropertyId': propertyId
  })
  .then(handleProfiles)
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
    })
       

}

function processData(data){
  console.log(data.rows);

  $.each(data.rows, function (key,value) {
  //  console.log("key:"+key+" val:"+value);

     console.log("date:"+data.rows[key][0] +", value:"+ data.rows[key][1]);
   //return key[0];
  });
}


function handleProfiles(response) {
  // Handles the response from the profiles list method.
  if (response.result.items && response.result.items.length) {
    // Get the first View (Profile) ID.
    var firstProfileId = " ";

    // Query the Core Reporting API.
    //queryCoreReportingApi(firstProfileId);
    usersQuery(firstProfileId);
    totalPageviewsQuery(firstProfileId);
    totalEntrancesQuery(firstProfileId);
    exitRateQuery(firstProfileId);
    pageviewsQuery(firstProfileId);
    deviceCatQuery(firstProfileId);
  } else {
    console.log('No views (profiles) found for this user.');
  }
}

/*
*Grab the "Users" information from GA
*/
var users;
function usersQuery(profileId){
   users = new gapi.client.analytics.data.ga.get({
        'ids': 'ga:'+ profileId,
        'dimensions': 'ga:date',
        'metrics': 'ga:users',
        'start-date': '30daysAgo',
        'end-date': 'yesterday',
      });

   users.then(function(response) {
    jsonArray[0] = response.result;
    
    //Make the chart
    var data = [];
    $.each(response.result.rows, function (key,value) { 
      data.push({name: Date.parse(value[0].substr(0,4)+"-"+value[0].substr(4,2)+"-"+value[0].substr(6,2)), y: parseInt(value[1])}); //value needed to be parsed
    });
    console.log(data);

    //var usersChartContainer = $("#usersChart");
    var usersChart = Highcharts.chart('usersChart', {
      chart: {
        type:'line',
        style: {
          fontFamily: 'Helvetica',
          fontSize: '32px'
        }
      },
      title: {
        text: 'Users in Last 30 Days',
        style: {
                fontSize: '32px',
                color: '#666666'
            }
      },
      plotOptions: {
            series: {
                color: '#000000'
            }
      },
      yAxis: {
        title: {
          text: 'Users'
        }
      },
      legend: {
            enabled: false
        },
      credits: {
            enabled: false
        },
      xAxis: {
        type: 'datetime',
        labels: {
          enabled: false
        }
      },
      series: [{
              name: 'Users',
              data: data
          }]
      })
  })
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

/*
*Grab the "Pageviews" information from GA to be used
*for the scorecard. This needed to be separate because
*to get the total pageviews I needed to remove the
*'max-results' attribute from the other pageviews query
*and remove the "ga:pagepath" dimension.
*/
var totalPageviews;
var pageviewsScore;
function totalPageviewsQuery(profileId){
   totalPageviews = new gapi.client.analytics.data.ga.get({
        'ids': 'ga:'+ profileId,
        'metrics': 'ga:pageviews',
        'start-date': '30daysAgo',
        'end-date': 'yesterday'
    });

  totalPageviews.then(function(response) {
    pageviewsScore = response.result.rows[0][0];
    $("#totalPageviews").text(pageviewsScore);
  })

  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

/*
*Grab the "Entrances" information from GA to be used
*for the scorecard. 
*/
var totalEntrances;
var entrancesScore;
function totalEntrancesQuery(profileId){
   totalEntrances = new gapi.client.analytics.data.ga.get({
        'ids': 'ga:'+ profileId,
        'metrics': 'ga:entrances',
        'start-date': '30daysAgo',
        'end-date': 'yesterday'
    });

  totalEntrances.then(function(response) {
    entrancesScore = response.result.rows[0][0];
    $("#totalEntrances").text(entrancesScore);
  })

  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

/*
*Grab the "Exits" information from GA to be used
*for the scorecard. 
*/
var exitRate;
var exitScore;
function exitRateQuery(profileId){
   exitRate = new gapi.client.analytics.data.ga.get({
        'ids': 'ga:'+ profileId,
        'metrics': 'ga:exitRate',
        'start-date': '30daysAgo',
        'end-date': 'yesterday'
    });

  exitRate.then(function(response) {
    exitScore = response.result.rows[0][0];
    exitScore = Math.floor(exitScore);
    $("#exitRate").text(exitScore + "%");
  })

  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

/*
*Grab the "Pageviews" information from GA by page path to be used in the pageview table.
*/
var pageviews;
function pageviewsQuery(profileId){
   pageviews = new gapi.client.analytics.data.ga.get({
        'ids': 'ga:'+ profileId,
        'dimensions': 'ga:pagePath',
        'metrics': 'ga:pageviews',
        'sort': '-ga:pageviews',
        'start-date': '30daysAgo',
        'end-date': 'yesterday',
        'max-results': 10
    });

  pageviews.then(function(response) {
    jsonArray[1] = response.result;
    $.each(response.result.rows, function (key,value) {
      $( "table" ).append("<tr> <td> <div> " + response.result.rows[key][0] + "</td> </div> <td>" + response.result.rows[key][1] + "</td> </tr>" );
    });
  })

  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

/*
*Grab the "Device Category" information from GA
*/
var deviceCat;
function deviceCatQuery(profileId){
   deviceCat = new gapi.client.analytics.data.ga.get({
        'ids': 'ga:'+ profileId,
        'dimensions': 'ga:deviceCategory',
        'metrics': 'ga:users',
        'start-date': '30daysAgo',
        'end-date': 'yesterday',
      } );

 deviceCat.then(function(response) {
    jsonArray[2] = response.result;
    
    //Make the chart
    var data = [];
    $.each(response.result.rows, function (key,value) { 
      data.push({name: value[0], y: parseInt(value[1])}); //value needed to be parsed
    });
    //console.log(data);

    var deviceChart = Highcharts.chart('deviceChart', {
      chart: {
        type:'column',
        style: {
          fontFamily: 'Helvetica',
          fontSize: '32px'
        }
      },
      title: {
        text: 'Users in Last 30 Days by Device',
        style: {
                fontSize: '32px',
                color: '#666666'
            }
      },
      plotOptions: {
            series: {
                color: '#000000'
            }
      },
      yAxis: {
        title: {
          text: 'Users'
        }
      },
      legend: {
            enabled: false
        },
      credits: {
            enabled: false
        },
      xAxis: {
        categories: ['Desktop', 'Mobile', 'Tablet']
      },
      series: [{
              name: 'Device Category',
              data: data
        }]
     })
 })  
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}
 //Check jsonArray
 console.log(jsonArray);
  // Add an event listener to the 'auth-button'.
  document.getElementById('auth-button').addEventListener('click', authorize);
  