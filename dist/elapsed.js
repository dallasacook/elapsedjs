
/**
 * Elapsed JS v 0.1
*
* A jQuery plugin that calculates the amount of time elapsed between
* a given time, such as an event, and the current time which updates
* in real time on any given selector or by the default 'elapsed' class.
*
* @class Elapsed
* @author Dallas Cook
* @date 5/6/2015
*
* GNU GENERAL PUBLIC LICENSE
*
*/

(function($) {

 	/**
 	*/

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
		 * Start time property
		 *
		 * @property startTime
		 * @type Integer
		 * @default 0
		 */
		startTime: 0,
		/**
		 * Used to properly convert a UNIX timestamp using Javascript Date such
		 * as if passing UNIX timestamp from PHP as startTime property.
		 *
		 * @property unix
		 * @type Integer
		 * @default false
		 */
		unix: false,
		/**
		 * The default selector property. Can be an HTML tag, class or ID. Basically
		 * anything accepted by jQuery's Selector.
		 *
		 * @property selector
		 * @type string
		 * @default '.elapsed'
		 */
		selector: '.elapsed',
		/**
		 * Determintes whether or not to display the number in the phrase as a
		 * string or an integer. Specified by 'string' and 'integer'.
		 *
		 * Ex. One vs. 1
		 *
		 * @property number
		 * @type string
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
		 * @type integer
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
		 * @type integer
		 * @default 30
		 */
		stopIntervalMinutes: 30
	};

	/**
	* Begins rendering elements on object instantiation
	*
	* @method init
	* @return void
	*/
	function init(options) {

		renderElements(options);

	}

	/**
	* An object made up three arrays. It includes array of word equivalents of single
	* digit numbers, double digit teens and all those divisible by 10.
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
		'double' : [
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
	function getElapsedTimePhrase(attrTime, settings) {
		var startTime = 0;

		//If start time element attribute exists, override settings on instantiation
		if(attrTime !== undefined) {
			startTime = attrTime;
		} else {
			startTime = settings.startTime;
		}

		//Calculate the difference in start and end time
		var diff = getTimeDiff(startTime, settings);

		//If number setting is true, convert integer number to its word representation
		if(!(diff.minute > 0) && diff.second <= 0) {
			str = diff.second < 0 ? settings.futurePhrase : settings.initPhrase;
		} else {
			str = renderElapsedPhrase(diff, settings);
		}

		return { 'str' : str, 'diff' : diff };
	}

	/**
	* Accepts an object containing elapsed years, months, weeks, days,
	* hours, minutes, and seconds. This is used to build the string.
	*
	* @method renderElapsedPhrase
	* @return {String} word Returns a phrase based on the time difference object
	*/

	function renderElapsedPhrase(n, settings){

		var word = '';
		var str = '';

		for(var unit in n) {
			if(n[unit]) {
				var article = (unit===settings.shortHandValues.hour || unit==='hour') ? 'an' : 'a';
				var num = n[unit];
				if(settings.exact==false && num < 5) {
				  str = (num === 1) ? article+' ' + unit : article+' few ' + unit + 's';
				  word += str + ' ' + settings.appendPhrase;
				} else {
					//If settings.number settings is true, convert integer to string equivalent
					if(settings.number === 'string') {
						if(num < 10) {
							str = numStr.single[num];
						} else if(num >= 10 && num < 20) {
							str = numStr.double[num-10];
						} else if(num >= 20 && num < 100) {
							for(var i = 20; num >= i; i+=10) {
								var singleDigit = (num-i > 0) ? '-' + numStr.single[num-i] : '';
								str = numStr.tens[(String(num).charAt(0)-2)] + singleDigit;
							}
						}
					} else {
						//Add integer to string
						str = num+'';
					}
					word += (num > 1) ? str+' '+unit+'s' : str+' '+unit;
					word += ' ' + settings.appendPhrase;
				}

				break;
			}
		}
		return word;

	}

	/**
	* Accepts a UNIX timestamp or ISO formatted date as
	* well as any other date accepted by the native JavaScript
	* Date object. The 'unix' attribute must be set to true/false
	* for a UNIX timestamp to be accepted.
	*
	* Gets the difference between current and start times,
	* calculating the time elapsed and building an object.
	*
	* @method getTimeDiff
	* @param {Object} startTime Date time object (ISO, UNIX (seconds), JS Time (milliseconds))
	* @param {Boolean} unix True/False allows use of UNIX timestamp
	* @return {Object} Always returns object
	*/
	function getTimeDiff(startTime, settings) {
		var s = 0;
		var c = new Date();

		if(settings.unix) {
			s = new Date(startTime*1000);
		} else {
			s = new Date(startTime);
		}

		//Get time difference in seconds
		var d = (c.getTime() - s.getTime()) / 1000;

		//Set shorthand abbreviation for time keys
		if(settings.shortHand) {
			h = settings.shortHandValues.hour;
			m = settings.shortHandValues.minute;
			s = settings.shortHandValues.second;
		} else {
			h = 'hour';
			m = 'minute';
			s = 'second';
		}

		var diff = {
			'year' : Math.floor(d/31556926),
			'month' : Math.floor(d/2629743),
			'week' : Math.floor((Math.floor(d/86400)/7)),
			'day' : Math.floor(d/86400)
		};

		diff[h] = Math.floor(d/3600);
		diff[m] = Math.floor(d/60);
		diff[s] = Math.floor(d);

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

		$(document).find(selector).each(function(index) {

			var $this = $(this);
			var settings = $.extend({}, $.Elapsed.defaults, options);

			var attrTime = $this.attr('data-elapsed-time');
			var elapsed = getElapsedTimePhrase(attrTime, settings);

			$this.html(settings.prependPhrase + ' ' + elapsed.str);

			//Update interval to run depending on elapsed time for each element
			var interval = getRunInterval(elapsed.diff, settings);

			if(interval.run) {
				setTimeout(function() {
					renderElement($this, settings);
				}, interval.time);
			}
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

		var attrTime = $el.attr('data-elapsed-time');
		var elapsed = getElapsedTimePhrase(attrTime, settings);

		$el.html(settings.prependPhrase + ' ' + elapsed.str);

		//Update interval to run depending on elapsed time for each element
		var interval = getRunInterval(elapsed.diff, settings);

		if(interval.run) {
			setTimeout(function() {
				renderElement($el, settings);
				console.log('I ran');
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

		if(settings.shortHand) {
			m = settings.shortHandValues['minute'];
			s = settings.shortHandValues['second'];
			diffMinute = diff[m];
			diffSecond = diff[s];
		} else {
			diffMinute = diff.minute;
			diffSecond = diff.second;
		}

		var interval = { 'run' : false, 'time' : settings.interval };

		//If the specified number of minutes have passed, stop interval
		if(diffMinute >= settings.stopIntervalMinutes) {
			interval.run = false;
		} else {
			interval.run = true;
		}

		if(settings.delay === true && diffMinute < settings.stopIntervalMinutes) {
			//Shorten interval for minutes & seconds while respecting initial load time
			if(diffMinute >= 30) {
				interval.time  =  1800000;
			} else if(diffMinute >= 10) {
				//Update every 10 minutes
				interval.time  =  (diffMinute > 10) ? (1800000 - (diffMinute * 60000)) : 600000;
			} else if(diffMinute >= 5) {
				//Update every 5 minute
				interval.time  =  (diffMinute > 5) ? (600000 - (diffMinute * 60000)) : 300000;
			} else if(diffMinute > 0) {
				//Update every 1 minute
				interval.time  = 60000;
			} else if(diffSecond >= 30) {
				//Update every 30 seconds
				interval.time  = (diffSecond > 30) ? (60000 - (diffSecond * 1000)) : 30000;
			}  else if(diffSecond >= 10) {
				//Update every 10 seconds
				interval.time  = (diffSecond > 10 ) ? (30000 - (diffSecond * 1000)) : 10000;
			} else if(diffSecond >= 5) {
				//Update every 5 seconds
				interval.time  = (diffSecond > 5) ? (10000 - (diffSecond * 1000)) : 5000;
			}

		}
		return interval;
	}

})(jQuery);
