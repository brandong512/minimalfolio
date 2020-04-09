# Minimalfolio
Minimalfolio is a simple, minimal app that allows the user to request data for any stock of choice. First the user types in the ticker or stock name of choice. The search prediction API endpoint assists the user in finding a stock that is indexed on the stock exchange. Next, the user searches for the stock, if the ticker is found, relevant information is displayed such as pricing, percentage change since last closing period, and many other valuable data points. In addition to these data points, a graph is rendered that is based on the last twelve months of the stock’s performance. The user can interact with this graph and view different historical prices of the searched stock for the last twelve months.

Since the API has a very low rate limit, there has been an additional error system in place that shows a message when the API limit has been reached. In order to compensate for the very low limit on API calls, the search prediction function on the search bar, has been modified to only perform search predictions based on the first letter that was typed in order to be conservative of the calls allowed to be placed within the allotted time frame. Because of this, the search bar will be disabled after typing in the first character in the search bar, to prevent a rapid succession by the user of API calls.

**If you search for a stock and the API limit has been reached, wait for some time, and then refresh the page to see your data.**

In order to set things up properly, first:

    $ npm install

After all packages have been downloaded `npm start` to start up the server:

    $ npm start

A testing suite (karma) is also available. To run it and generate coverage:

    $ ./node_modules/karma/bin/karma start --single-run
