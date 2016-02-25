# Elapsed JS

![alt tag](https://img.shields.io/badge/release-0.1.0-blue.svg)
![alt tag](https://img.shields.io/travis/joyent/node/v0.6.svg)
![alt tag](https://img.shields.io/badge/jQuery-1.11.3-blue.svg)
![alt tag](https://img.shields.io/badge/jQuery-2.1.4-blue.svg)


Elapsed JS provides an easy way to format a human readable version of an elapsed period of time, which would be suited for use in a notification or chat system. Elapsed JS provides a number of options such as:

* Complete control of the phrase text with included defaults.
* Formatting of the elapsed number by 'string' or 'integer.
* Default interval cut off of 30 minutes, which can be overridden.
* The interval at which the number is updated.
* Whether to use the built in delay or not. Delays interval every 5, 10, & 30 seconds & minutes
* The ability to show abbreviations during certain time intervals Ex. "a few minutes ago" (elapsed time less than 5).
* The ability to use UNIX timestamps.
* Inline data attribute 'data-elapsed-time' for setting different start times with a single instantiation.

### Requirements
jQuery 1.11.x + or jQuery 2.1.x +

## Getting Started

### Examples

Note: To view more current elapsed times, edit the timestamps in the index.html file.

### Installation

To install Elapsed JS in your website or application:

1. Include the elapsed.js file in an HTML script tag (don't forget to include jQuery)
2. Assign the default selector 'elapsed' class to any DOM element
3. Instantiate the Elapsed object supplying necessary options

The Elapsed object by default will attach to any number of DOM elements with the class 'elapsed'. You may also obstantiate multiple instances of Elapsed, attaching it to any selector of your choice.

#### Example 1.

HTML:
```
<span class="elapsed"></span>
```
JavaScript:
```
$.Elapsed({
	startTime: '2015-05-07T00:08:38-05:00',
	number: 'integer',
	delay: true,
	exact: true
});

```
**Result:**
Would produce something similar to "2 seconds ago" or "20 minutes ago".

#### Example 2.

HTML:
```
<span class="elapsed" data-elapsed-time="1431013280"></span>
```
JavaScript:
```
$.Elapsed({
	dateType: 'seconds',
	number: 'string',
	delay: true,
	exact: false
});

```
**Result:**
Would produce something similar to "two seconds ago" or "a few minutes ago".


## Properties

**dateType**

The dateType property designates the type of date parameter that can be passed to the Elapsed object. Defaults to ISO 8601 format. Also accepts 'seconds' (UNIX timestamp) and 'milliseconds' (JS Date.getTime()).

	default: 'ISO'

**startTime**

The start time is passed into the plugin to calculate the difference time object that is rendered on the DOM element. This can be supplied to Elapsed in two ways.  The time object can be passed into the instantiation of the Elapsed object in the 'startTime' property or it can be included in the element as an attribute 'data-elapsed-time'.
Also the start time object can be in any format accepted by the JavaScript date object including ISO and JavaScript time as well as UNIX timestamps.


### Phrase Properties

The phrase that is built and inserted into the DOM elements can be modified by four different properties.

**futurePhrase** - Word or phrase displayed if current time is less than the provided start time.

  	default: 'has not yet occurred'

**initPhrase** - Word or phrase displayed when current time equals provided start time.

  	default: 'just occurred'

**appendPhrase** - Word or phrase added to the end of the final string.

  	default: 'ago'

**prependPhrase** - Word or phrase added to the beginning of the final string.

  	default: ''


# Docs

Included in the repository in the /docs directory is a detailed outline of the Elapsed object, its methods and properties.

Please report any suggestions or bug fixes.

Happy coding.
