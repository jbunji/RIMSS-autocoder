// © 2006 Adobe Macromedia Software LLC. All rights reserved.

// Create ColdFusion.Calendar namespace
if (!ColdFusion.Calendar) ColdFusion.Calendar = {};

ColdFusion.Calendar.monthNamesShort = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
ColdFusion.Calendar.monthNamesLong = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

ColdFusion.Calendar.dayNamesShort = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
ColdFusion.Calendar.dayNamesLong = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

ColdFusion.Calendar.calTableIdCounter = 0;

/**
 * setMonth function in safari is broken. So if the browser is safari, we are overriding the setMonth function with the 
 * correct version of setMonth.
 */

if(navigator.userAgent.toLowerCase().indexOf('safari')>-1)
{
	var set_month = Date.prototype.setMonth;
    Date.prototype.setMonth = function(num)
	{
    	if(num <= -1)
		{
       		var n = Math.ceil(-num);
      		var back_year = Math.ceil(n/12);
       		var month = (n % 12) ? 12 - n % 12 : 0 ;
       		this.setFullYear(this.getFullYear() - back_year);
       		return set_month.call(this, month);
	   	} 
	   	else 
	   	{
             return set_month.apply(this, arguments);
       	}
    }
}

/**
 * Also define String.escape function used by the date-min.js if it is not already defined 
 */	
if(!String.escape){
    String.escape = function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    };
};

// A function called to load the data dynamically for a node
ColdFusion.Calendar.setUpCalendar = function(calendarinputid, mask, startWeekDay, dayNames, monthNames, formname, initValue) 
{
	var calendarButton = ColdFusion.DOM.getElement(calendarinputid + formname + "_cf_button", formname);
	var calendarInput = ColdFusion.DOM.getElement(calendarinputid, formname);
	
	var initDate = null;
	var splitDateVals = null;
	if(calendarInput.value != "")
	{
		initDate = calendarInput.value;
		splitDateVals = initDate.split("/");
		
	}
	var calendarid = calendarinputid + "_cf_calendar" + ColdFusion.Calendar.calTableIdCounter;
	ColdFusion.Calendar.calTableIdCounter ++;
	var calendardiv = ColdFusion.DOM.getElement(calendarinputid + formname + "_cf_container", formname);
	
	var calendarinputleft = calendarInput.offsetLeft;
	ColdFusion.DOM.getElement(calendarinputid + formname + '_cf_container', formname).style.left = calendarinputleft;
	
	
	YAHOO.widget.Calendar.IMG_ROOT = _cf_ajaxscriptsrc + "/resources/yui/";
	var calendar;
	
	if(splitDateVals && splitDateVals[0] && splitDateVals[2])
	{
		calendar = new YAHOO.widget.Calendar(calendarid, calendarinputid + formname + "_cf_container",{close:true, pagedate: splitDateVals[0] + "/" + splitDateVals[2]});	
	}
	else
	{
		calendar = new YAHOO.widget.Calendar(calendarid, calendarinputid + formname + "_cf_container",{close:true});
	}

	calendar.calendarinputid = calendarinputid;
	calendar.calendarinput = calendarInput;
	calendar.mask = mask;
	calendar.formname = formname;
	
	calendar.cfg.setProperty("MONTHS_LONG", monthNames); 
	
	calendar.cfg.setProperty("WEEKDAYS_SHORT", dayNames);
	
	calendar.cfg.setProperty("START_WEEKDAY", startWeekDay);
	ColdFusion.objectCache[calendarid + formname] = calendar;
	calendar.select(initDate);
 	
	calendar.render();
	//hide now and show it when the link is clicked
	calendar.hide();
	
	calendar.selectEvent.subscribe(ColdFusion.Calendar.handleDateSelect, calendar, true);
	
	YAHOO.util.Event.addListener(calendarinputid + formname + "_cf_button", "click", ColdFusion.Calendar.handleCalendarLinkClick, calendar, true);

	//setup the initial value for the calendar now if onw is present
	if(initValue != null)
	{
		var year = initValue.year;
		var month = initValue.month;
		var day = initValue.day;
		var dateObj = new Date(year, month.valueOf() - 1, day);
		calendarInput.value =  ColdFusion.Calendar.createFormattedOutput(calendarinputid, mask, year, month, day, dateObj);
	}
};

ColdFusion.Calendar.openedCalendarInstance = null; 

//A function called when the calendar link is clicked
ColdFusion.Calendar.handleCalendarLinkClick = function (type,args) 
{
	var calendar = args;
	
	if(ColdFusion.Calendar.openedCalendarInstance)
	{
		ColdFusion.Calendar.openedCalendarInstance.hide();
	}
	
	if(!calendar.extMask)
	{
		var extMask = ColdFusion.Calendar.convertToExtMask(calendar.mask);
		calendar.extMask = extMask;	
	}
	
	var calval = ColdFusion.DOM.getElement(args.calendarinputid, calendar.formname).value;
	
	var initdate = null;
	
	if(typeof(calval) != "undefined" && ColdFusion.trim(calval) != "")
	{
		initdate = Date.parseDate(calval,calendar.extMask);		
	}

	if(initdate != null)
	{
		calendar.setMonth(initdate.getMonth());
		calendar.setYear(initdate.getFullYear());
		calendar.select(initdate);
		calendar.render();
	}
	
	ColdFusion.Calendar.openedCalendarInstance = calendar;
	calendar.show();
} 


//A function called when a date in the calendar is selected
ColdFusion.Calendar.handleDateSelect = function (type,args,calendar) 
{
    var dates = args[0];  
    var date = dates[0]; 
    var year = date[0], month = date[1], day = date[2]; 
	
	var dateObj = new Date(year, month.valueOf() - 1, day);
	var oldvalue = calendar.calendarinput.value;
	calendar.calendarinput.value =  ColdFusion.Calendar.createFormattedOutput(calendar.calendarinputid, calendar.mask, year, month, day, dateObj);
	
	//call all bind handlers registered for the onchange event
	ColdFusion.Event.callBindHandlers(calendar.calendarinputid, null, 'change');
    calendar.hide();
	//onchange event was not getting fired when values were changed using the calendar. Now forcing it to fire in case date value changes
	var node = document.getElementById(calendar.calendarinputid);
	if(node)
        if(node.onchange)
		  if(node.value != oldvalue)
		   node.onchange();
} 

ColdFusion.Calendar.convertToExtMask = function(mask)
{
	mask = mask.toUpperCase();
	
	if(mask.indexOf("DD") != -1)
	{
		mask = mask.replace(/DD/g, 'd');
	}
	if(mask.indexOf("D") != -1)
	{
		mask = mask.replace(/D/g, 'd');
	}

	if(mask.indexOf("MMMM") != -1)
	{
		mask = mask.replace(/MMMM/g, 'F');
	}
	else if(mask.indexOf("MMM") != -1)
	{
		mask = mask.replace(/MMM/g, 'M');
	}
	else if(mask.indexOf("MM") != -1)
	{
		mask = mask.replace(/MM/g, 'm');
	}
	else if(mask.indexOf("M") != -1)
	{
		mask = mask.replace(/M/g, 'm');
	}
	
	if(mask.indexOf("YYYY") != -1)
	{
		mask = mask.replace(/YYYY/g, 'Y');
	}

	if(mask.indexOf("YY") != -1)
	{
		mask = mask.replace(/YY/g, 'y');
	}
	
	if(mask.indexOf("EEEE") != -1)
	{
		mask = mask.replace(/EEEE/g, 'l');
	}

	if(mask.indexOf("EEE") != -1)
	{
		mask = mask.replace(/EEE/g, 'D');
	}

	if(mask.indexOf("E") != -1)
	{
		mask = mask.replace(/E/g, 'w');
	}
	
	return mask;	
};

//A function that returns the appropirate string back given the mask and the year, month and date
ColdFusion.Calendar.createFormattedOutput = function(calendarinputid, mask, year, month, day, date)
{
	mask = mask.toUpperCase();
	
	year = new String(year);
	month = new String(month);
	day = new String(day);
	var weekday = date.getDay();
	 
	if(mask.indexOf("DD") != -1)
	{
		//Replace DD with the format of day in 01 or 28
		if(day.length == 1)
		{
			day = "0" + day;
		}
		mask = mask.replace(/DD/g, day);
	}
	if(mask.indexOf("D" != -1))
	{
		//Replace D with the format of day in 1 or 28
		if(day.length != -1 && day.charAt(0) == '0')
		{
			day = day.charAt(1);
		}
		mask = mask.replace(/D/g, day);
	}
	
	if(mask.indexOf("MMMM") != -1)
	{
		month = ColdFusion.Calendar.monthNamesLong[month.valueOf() - 1];
		mask = mask.replace(/MMMM/g, month);
	}
	else if(mask.indexOf("MMM") != -1)
	{
		month = ColdFusion.Calendar.monthNamesShort[month.valueOf() - 1];
		mask = mask.replace(/MMM/g, month);
	}
	else if(mask.indexOf("MM") != -1)
	{
		//Replace MM with the format of day in 01 or 28
		if(month.length == 1)
		{
			month = "0" + month;
		}
		mask = mask.replace(/MM/g, month);
	}
	else if(mask.indexOf("M") != -1)
	{
		//Replace M with the format of month in 1 or 12
		if(month.length != -1 && month.charAt(0) == '0')
		{
			month = month.charAt(1);
		}
		mask = mask.replace(/M/g, month);
	}
	
	if(mask.indexOf("YYYY") != -1)
	{
		mask = mask.replace(/YYYY/g, year);
	}

	if(mask.indexOf("YY") != -1)
	{
		year = year.substring(2);
		mask = mask.replace(/YY/g, year);
	}

	if(mask.indexOf("EEEE") != -1)
	{
		weekday = ColdFusion.Calendar.dayNamesLong[weekday.valueOf()];
		mask = mask.replace(/EEEE/g, weekday);
	}
	if(mask.indexOf("EEE") != -1)
	{
		weekday = ColdFusion.Calendar.dayNamesShort[weekday.valueOf()];
		mask = mask.replace(/EEE/g, weekday);
	}
	if(mask.indexOf("E") != -1)
	{
		//Replace E with the format of month in 0 or 6
		weekday = weekday.valueOf();

		weekday = new String(weekday);
		if(weekday.length != -1 && weekday.charAt(0) == '0' && weekday.charAt(1))
		{
			weekday = weekday.charAt(1);
		}
		mask = mask.replace(/E/g, weekday);
	}

	return mask;
}
