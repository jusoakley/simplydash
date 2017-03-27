# SIMPLYdash
### A data dashboard that quickly retrieves site analytics.

SIMPLYdash is a data dashboard meant to be a quick, user-friendly way to get up-to-date data on website usage with minimal effort. The dashboard delivers results from the last 30 days, but could easily be tweaked to return results from any time period available to Google Analytics.

The dashboard uses two main technologies: the Google Analytics API (https://developers.google.com/analytics/) and Highcharts JS (https://www.highcharts.com/). First, it queries Google Analyitcs for the data on a specfic GA account, property, and view. Once it retrieves the data from GA, Highcharts draws the charts and fills it with the data specified (in this case, total number of users by day and by device, located on the top and bottom of the screen). Certain totals from GA are also inserted into the scorecards in the middle of the page, and a table is filled with data on pages with the highest pageviews.

Users: The number of individual user profiles (this is distinct from "sessions," which is a certain path of behavior followed by a user).
Pageviews: The total number of views for a particular page or group of pages.

## Getting Started

If you want to use SIMPLYdash, you'll need your own Google API Client ID. Once you've got one, download the repo and set the client ID as the value of the 'CLIENT_ID' variable.  Next, you'll need the specific GA Account, Property, and Profile ID's of the site you are looking to analyze. These can be located within your Google Analytics account. Set each equal to the variables "firstAccountId," "firstPropertyId," and "firstProfileId."

Open the site; once you do, an "Authorize" button will appear above the header after all the scripts have run. Click "Authorize," and you should get a pop-up to sign in to your Google account. After this, as long as you have permission to view this GA account, Google will do the rest. Sit back, and watch your charts animate to the screen.

NOTE: Make sure you are either running a local server or hosting it from somewhere, though, otherwise the script will not have access to GA.

## Authors

Justin Oakley - Design and Development - (justinoakley.info)

## Acknowledgments

Many thanks to Alison, Colin, and Luke! Your insights proved helpful and educational. Hope you get to have more fun with this project!
-Justin
