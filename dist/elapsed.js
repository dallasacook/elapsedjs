
/**
 * Elapsed JS v 0.2
*
* A jQuery plugin that calculates the amount of time elapsed between
* a given time, such as an event, and the current time which updates
* in real time on any given selector or by the default 'elapsed' class.
*
* @class Elapsed
* @author Dallas Cook
* @date 2/24/2016
*
* GNU GENERAL PUBLIC LICENSE
*
*/

(function($) {

	$.Elapsed = function(options) {

		init(options);

		return this;
	}

	/**
	* The elapsed defaults object contains a set of overridable parameters,
	* which gives developers full control over the plugin.
	*
	* @property defaults
	* @type {Object}
	*/
	$.Elapsed.defaults = {
		/**
		 * Displays if current time is less than the provided start time
		 *
		 * @property futurePhrase
		 * @type String
		 * @default 'has not yet occurred'
		 */
		futurePhrase: 'has not yet occurred',
		/**
		 * Word or phrase displayed when current time equals provided start time
		 *
		 * @property initPhrase
		 * @type String
		 * @default 'just occurred'
		 */
		initPhrase: 'just occurred',
		/**
		 * Word or phrase added to the end of the final string
		 *
		 * @property appendPhrase
		 * @type String
		 * @default 'ago'
		 */
		appendPhrase: 'ago',
		/**
		 * Word or phrase added to the beginning of the final string
		 *
		 * @property prependPhrase
		 * @type String
		 * @default ''
		 */
		prependPhrase: '',
		/**
		 * Turns on shorthand for hours, minutes, & seconds
		 *
		 * @property shortHand
		 * @type Boolean
		 * @default false
		 */
		shortHand: false,
		/**
		 * Overridable shorthand values for hours, minutes, & seconds
		 *
		 * @property shortHandValues
		 * @type Object
		 * @default {'hour' : 'hr', 'minute' : 'min', 'second' : 'sec' }
		 */
		shortHandValues: {'hour' : 'hr', 'minute' : 'min', 'second' : 'sec' },
		/**
		 * Initial time property. The time value
		 *
		 * @property initTime
		 * @type Integer
		 * @default 0
		 */
		initTime: null,
		/**
		 * dateType designates the type of date parameter that can be
		 * accepted by Elapsed. Defaults to ISO 8601. Also accepts 'seconds' and 'milliseconds'.
		 *
		 * @property dateType
		 * @type String
		 * @default 'ISO'
		 */
		dateType: 'ISO',
		/**
		 * The default selector property. Can be an HTML tag, class or ID. Basically
		 * anything accepted by jQuery's Selector.
		 *
		 * @property selector
		 * @type String
		 * @default '.elapsed'
		 */
		selector: '.elapsed',
		/**
		 * Determintes whether or not to display the number in the phrase as a
		 * string or an Integer. Specified by 'string' and 'integer'.
		 *
		 * Ex. One vs. 1
		 *
		 * @property number
		 * @type String
		 * @default 'string'
		 */
		number: 'string',
		/**
		 * If true, the exact property displays each number in the interval without
		 * abbreviations such as "a few minutes ago".
		 *
		 * @property exact
		 * @type Boolean
		 * @default true
		 */
		exact: true,
		/**
		 * The default interval at which to update the DOM element with the
		 * new elapsed time phrase.
		 *
		 * @property interval
		 * @type Integer
		 * @default 1000
		 */
		interval: 1000,
		/**
		 * If true, the interval is delayed after 5 & 10 seconds and after 1, 5 & 10 minutes.
		 * If false, active intervals will run at 'interval' time
		 *
		 * Settings to false can greatly increase the call stack.
		 *
		 * @property delay
		 * @type Boolean
		 * @default true
		 */
		delay: true,
		/**
		 * The number of minutes at which to stop the interval.
		 *
		 * @property stopIntervalMinutes
		 * @type Integer
		 * @default 30
		 */
		stopIntervalMinutes: 30,
		/**
		 * The clock option can display each time value of the
		 * the elapsed time difference as a single string.
		 *
		 * Warning: Not to be used in conjunction with the delay plugin.
		 *
		 * @property clock
		 * @type Boolean
		 * @default 30
		 */
		clock: false,
		/**
		 * clockOptions includes each unit, whether or not it should be displayed
		 * and the number of the next (lower) unit it takes to equal it.
		 *
		 * @property clockOptions
		 * @type Object
		 * @default mixed
		 */
		clockOptions: {
			decade: {
				display: true,
				lower: 10 // Century
			},
			year: {
				display: true,
				lower: 10 // Decade
			},
			month: {
				display: true,
				lower: 12 // Year
			},
			week: {
				display: true,
				lower: 4 // Month
			},
			day: {
				display: true,
				lower: 7 // Week
			},
			hour: {
				display: true,
				lower: 24 // Day
			},
			minute: {
				display: true,
				lower: 60 // Hours
			},
			second: {
				display: true,
				lower: 60 // Minutes
			}
		},
		/**
		 * Seperates each unit of time if provided.
		 *
		 * @property seperator
		 * @type String
		 * @default String
		 */
		 seperator: '',
 		/**
 		 * Time cache
 		 *
 		 * @property timeCache
 		 * @type Integer
 		 * @default null
 		 */
		 timeCache: null,
 		/**
 		 * Cache used when overriding with data-elapsed-time attribute
 		 *
 		 * @property timeCache
 		 * @type Integer
 		 * @default null
 		 */
		 attrTimeCache: null,
		 inlineDate: false
	};

	/**
	* Begins rendering elements on object instantiation
	*
	* @method init
	* @return Void
	*/
	function init(options) {

		renderElements(options);

	}

	/**
	* An object composed of three arrays. It includes an array of word equivalents of single
	* digit numbers, teen digits (10 - 19) and all those divisible by 10.
	*
	* Used to convert integers to strings. Up to 'ninety-nine', which serves the purpose
	* of this plugin since days beyond 'thirty-one' are not displayed.
	*
	* @property numStr
	* @type {Object}
	*/
	var numStr = {
		'single' :  [
				'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
			],
		'teens' : [
				'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
				'eighteen', 'nineteen'
		],
		'tens' : [
			'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
		]
	}


	/**
	* Determines how to build phrase and return the formatted phrase for
	* rendering. Returns a string and time difference object.
	*
	* @method getElapsedTimePhrase
	* @return {Object} Returns an object containing a string (phrase) and integer (time difference).
	*/
	function getElapsedTimePhrase(initTime, settings) {
		var phrase = null;
		var timeDiff = null;

		// Calculate the difference in start and end time
		timeDiff = getTimeDiff(initTime, settings);
		// If number setting is true, convert integer number to its word representation
		if(timeDiff <= 0) {
			phrase = timeDiff < 0 ? settings.futurePhrase : settings.initPhrase;
		} else {
			phrase = renderElapsedPhrase(timeDiff, settings);
		}

		return { 'str' : phrase, 'diff' : timeDiff };
	}

	/**
	* Accepts an object containing elapsed years, months, weeks, days,
	* hours, minutes, and seconds. This is used to build the string.
	*
	* @method renderElapsedPhrase
	* @return {String} word Returns a phrase based on the time difference object
	*/

	function renderElapsedPhrase(diff, settings){

		var phrase = '';
		var str = null;
		var unit = null;
		var article = null;
		var num = null;
		var singleDigit = null;

		// Loop through each unit of time to build phrase
		for(var i = 0; i < diff.length; i++) {

			// Get unit of time and value
			unit = diff[i]['unit'];
			num = diff[i]['value'];

			// Hide all zero values except minutes and seconds
			if(num === 0 && !(unit === 'second' || unit === 'sec')) {
				continue;
			}
			if(!settings.exact && num < 5) {
				// Get article for proper grammar
				article = (unit === 'hour' || unit === 'hr') ? 'an' : 'a';
			  	// Build this unit's portion of the phrase
				if(num !== 0) {
					str = (num === 1 && num !== null) ? article + ' ' + unit : article + ' few ' + unit + 's';
				} else {
					str = num + ' ' + unit + 's';
				}
			  	phrase += ' ' + (i < (diff.length - 1)) ? str + settings.seperator + ' ' : str + ' ';
			} else {
				// If settings.number setting is true, convert integer to string equivalent
				if(settings.number === 'string') {
					if(num < 10) {
						str = numStr.single[num];
					} else if(num >= 10 && num < 20) {
						str = numStr.teens[num - 10];
					} else if(num >= 20 && num < 100) {
						for(var x = 20; num >= x; x += 10) {
							singleDigit = (num - x > 0) ? '-' + numStr.single[num - x] : '';
							str = numStr.tens[(String(num).charAt(0) - 2)] + singleDigit;
						}
					}
				} else {
					// Add integer to string
					str = num + '';
				}
			    // Build this unit's portion of the phrase
				phrase += (num !== 1) ? ' ' + str + ' ' + unit + 's' : ' ' + str + ' ' + unit;
				phrase += (i < (diff.length - 1)) ? settings.seperator + ' ' : ' ';
			}
			if(i === (diff.length - 1) || diff[i + 1]['value'] === null) {
				phrase += settings.appendPhrase;
				break;
			}
		}
		return phrase;
	}

	/**
	* Returns key by value.
	*
	* @method getObjectKey
	* @param {Object} {String}
	* @return {String}
	*/
  function getObjectKey(obj, value) {
	  for(var key in obj) {
	    if(obj[key] === value){
	      return key;
	    }
	  }
	  return null;
	}

	/**
	* Gets the difference between current and start times,
	* by calculating the time elapsed and building an object
	* containing each unit of time measurement: years, months, weeks, days, hours, minutes, seconds.
	*
	* @method getTimeDiff
	* @param {Object} initTime Date time object (ISO, UNIX (seconds), JS Time (milliseconds))
	* @param {Object} settings
	* @return {Object} Always returns object
	*/
	function getTimeDiff(initTime, settings) {
		var start = null;
		var current = new Date();

		if(settings.timeCache === null) {
			// Get date type time format in milliseconds
			if(settings.dateType === 'seconds') {
				start = new Date(initTime * 1000);
			} else {
				start = new Date(initTime);
			}
			// Set timeCache to reduce date calculation
			settings.timeCache = start;
		} else if(settings.inlineDate) {
			// Get date type time format in milliseconds
			if(settings.dateType === 'seconds') {
				start = new Date(initTime * 1000);
			} else {
				start = new Date(initTime);
			}
		} else {
			// Get start value from cache
			start = settings.timeCache;
		}
		// Get time difference in seconds
		var timeDiff = (current.getTime() - start.getTime()) / 1000;
		if(timeDiff < 0) {
			return timeDiff;
		}
		// Set shorthand abbreviation for time keys
		var timeKeys = null;
		if(settings.shortHand) {
			timeKeys = {
				h : settings.shortHandValues.hour,
				m : settings.shortHandValues.minute,
				s : settings.shortHandValues.second
			};
		} else {
			timeKeys = {
				h : 'hour',
				m : 'minute',
				s : 'second'
			};
		}

		// Build time difference object
		var diff = [{
				unit: 'decade',
				func: function(t) {
					return Math.floor(t / 315360000);
				},
				value: null
			}, {
				unit: 'year',
				func: function(t) {
					return Math.floor(t / 31557000);
				},
				value: null
			}, {
				unit: 'month',
				func: function(t) {
					return Math.floor(t / 2628000);
				},
				value: null
			}, {
				unit: 'week',
				func: function(t) {
					return Math.floor((Math.floor(t / 86400) / 7));
				},
				value: null
			}, {
				unit: 'day',
				func: function(t) {
					return Math.floor(t / 86400);
				},
				value: null
			}, {
				unit: timeKeys.h,
				func: function(t) {
					return Math.floor(t / 3600);
				},
				value: null
			}, {
				unit: timeKeys.m,
				func: function(t) {
					return Math.floor(t / 60);
				},
				value: null
			}, {
				unit: timeKeys.s,
				func: function(t) {
					return Math.floor(t);
				},
				value: null
		}];
		// Calculate each unit of time
		for(var i = 0; i < diff.length; i++) {
			diff[i]['value'] = diff[i]['func'](timeDiff);
			if(!settings.clock && diff[i]['value'] > 0) {
				break;
			}
		}
		// Clock displays an exact elapsed time value with each unit specified as
		// true in clockOptions
		if(settings.clock) {
			// Set correct values based on upper unit value
			var count = null;
			var upper = null;
			var tmp = null;
			var unit = null;
			for(var i = 0; i < diff.length; i++) {
				if(diff[i]['value'] > 0) {
					// If shortHand values are used, convert string for loop - only get short values for hours, minutes, seconds
					unit = (settings.shortHand && i > 4) ? getObjectKey(settings.shortHandValues, diff[i]['unit']) : diff[i]['unit'];
					// Copy upper unit value before overwriting
					tmp = upper;
					// Assign new upper unit value before overwriting upperUnit
					upper = diff[i]['value']
					// If true, we've reached the upper unit value or the unit values that
					// must be modified by each of their upper (parent) unit value.
					if(count > 0) {
						if(settings.clockOptions[unit]['display'] && unit !== 'second' && unit !== 'year' && unit !== 'month' && unit !== 'week') {
							diff[i]['value'] = diff[i]['value'] - (tmp * settings.clockOptions[unit]['lower']);
						} else if(unit === 'year') {
							diff[i]['value'] = diff[i]['value'] % 10;
						} else if(unit === 'month') {
							diff[i]['value'] = diff[i]['value'] % 12;
						}  else if(unit === 'week') {
							diff[i]['value'] = diff[i]['value'] % 4;
						} else if(unit === 'second') {
							diff[i]['value'] = diff[i]['value'] % 60;
						}
					}
					count++;
				}
			}
		}
		return diff;
	}

	/**
	 * Renders a new string to the default or provided selector's DOM element(s)
	 * in a jQuery each() loop, after which renderElement() is called with
	 * the proper time interval to continually (recursively) update the object. If the
	 * interval.run property returns false, then the recursion ends.
	 *
	 * @method renderElements
	 * @param none
	 * @return void
	 *
	*/

	function renderElements(options) {

		var selector = (options.selector !== undefined) ? options.selector : $.Elapsed.defaults.selector;
		var $this = null;
		var attrTime = null;
		var initTime = null;
		var elapsedPhrase = null;
		var interval = null;
		var settings = $.extend({}, $.Elapsed.defaults, options);
		$(document).find(selector).each(function(index) {

			$this = $(this);
			if(settings.inlineDate) {
				attrTime = $this.attr('data-elapsed-time');
				if(attrTime !== undefined) {
					initTime = attrTime;
				} else {
					initTime = settings.initTime;
				}
			} else {
				initTime = settings.initTime;
			}
			elapsed = getElapsedTimePhrase(initTime, settings);

			$this.html(settings.prependPhrase + ' ' + elapsed.str);

			// Update interval to run depending on elapsed time for each element
			//interval = getRunInterval(elapsed.diff, settings);

			renderElement($this, settings);
		});

	}

	/**
	 * This is a recursive function which is called
	 * after each selected object is initially rendered.
	 * This enables the object to continue updating itself
	 * until its interval.run property returns false.
	 *
	 * @method renderElement
	 * @param {Object} $el A jQuery object to update recursively on interval
	 * @return void
	 */
	function renderElement($el, settings) {
		// Get updated phrase
		// If attrTimeCache is set, override initTime
		var initTime = null;
		if(settings.inlineDate) {
			attrTime = $el.attr('data-elapsed-time');
			if(attrTime !== undefined) {
				initTime = attrTime;
			} else {
				initTime = settings.initTime;
			}
		} else {
			initTime = settings.initTime;
		}
		var elapsed = getElapsedTimePhrase(initTime, settings);

		$el.html(settings.prependPhrase + ' ' + elapsed.str);

		//Update interval to run depending on elapsed time for each element
		var interval = getRunInterval(elapsed.diff, settings);
		if(interval.run) {
			setTimeout(function() {
				renderElement($el, settings);
			}, interval.time);
		}
	}

	/**
	* Sets the run interval in milliseconds for updating the DOM element. The interval
	* stops after running for a specified or default (30) number of minutes.
	*
	* If delay option is true, the interval runs on increments of 5, 10, and 30 (seconds & minutes).
	* If the initial load time of the difference is greater than the smaller digit, the difference
	* is calculated as the interval.
	*
	* Ternary operations calculate the difference between the next increment so as to set
	* an accurate interval in milliseconds.
	*
	* @method getRunInterval
	* @param {Object} diff Contains the difference in start and current time.
	* @return {Object} interval Returns a boolean for run and the interval in seconds.
	*/
	function getRunInterval(diff, settings) {

		// Build interval object to return
		var interval = { 'run' : false, 'time' : settings.interval };

		// Return default interval object if diff is less than or equal to zero
		if(diff <= 0) return interval;

		// Get key value for hours and seconds
		var m = null, s = null;
		if(settings.shortHand) {
			m = settings.shortHandValues['minute'];
			s = settings.shortHandValues['second'];
		} else {
			m = 'minute';
			s = 'second';
		}

		// Get difference value for minutes and seconds
		var diffMinute = jQuery.grep(diff, function(v){ return v.unit === m; })[0]['value'];
		// Disable interval is minute is null
		if(diffMinute === null) return interval;
		var diffSecond = jQuery.grep(diff, function(v){ return v.unit === s; })[0]['value'];

		// If the specified number of minutes have passed, stop interval
		if(diffMinute >= settings.stopIntervalMinutes && !settings.clock) {
			interval.run = false;
		} else {
			interval.run = true;
		}

		// Modify interval for minutes & seconds
		if(settings.delay === true && diffMinute < settings.stopIntervalMinutes && !settings.clock) {
			if(diffMinute >= 30) {
				interval.time = 1800000;
			} else if(diffMinute >= 10) {
				// Update every 10 minutes
				interval.time = (diffMinute > 10) ? (1800000 - (diffMinute * 60000)) : 600000;
			} else if(diffMinute >= 5) {
				// Update every 5 minute
				interval.time = (diffMinute > 5) ? (600000 - (diffMinute * 60000)) : 300000;
			} else if(diffMinute > 0) {
				// Update every 1 minute
				interval.time = 60000;
			} else if(diffSecond >= 30) {
				// Update every 30 seconds
				interval.time = (diffSecond > 30) ? (60000 - (diffSecond * 1000)) : 30000;
			} else if(diffSecond >= 10) {
				// Update every 10 seconds
				interval.time = (diffSecond > 10 ) ? (30000 - (diffSecond * 1000)) : 10000;
			} else if(diffSecond >= 5) {
				// Update every 5 seconds
				interval.time = (diffSecond > 5) ? (10000 - (diffSecond * 1000)) : 5000;
			}
		}
		return interval;
	}

})(jQuery);
