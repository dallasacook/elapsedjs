# Elapsed JS
Elapsed JS provides an easy way to format a human readable version of an elapsed period of time which would be suited for use in a notification or chat system.

# Requirements
jQuery 1.11.x + or jQuery 2.1.x +

# Getting Started

To view the included examples:

1. Install node.js from https://nodejs.org/download/
2. Clone the repository onto your local machine
3. In terminal or command prompt, browse to the directory and issue the command "node index.js"
4. Browse to http://localhost:3010 to view the examples. 
Note: To view more current elapsed times, edit the timestamps in the index.html file.

To install Elapsed JS in your app:

1. Include the elapsed.js file in an HTML script tag (don't forget to include jQuery)
2. Assign the default selector 'elapsed' class to any DOM element
3. Instantiate the Elapsed object supplying necessary options

# Start Time

The start time is passed into the plugin to calculate the difference time object that is rendered on the DOM element. This can be supplied to Elapsed in two ways.  The time object can be passed into the instantiation of the Elapsed object in the 'startTime' property or it can be included in the element as an attribute 'data-elapsed-time'.
Also the start time object can be in any format accepted by the JavaScript date object including ISO and JavaScript time as well as UNIX timestamps. 

# Docs

Included in the repository in the /docs directory is a detailed outline of the Elapsed object, it's methods and properties.

Please report any suggestions or bug fixes.

Happy coding. 
