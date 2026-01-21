/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Calendar){
ColdFusion.Calendar={};
}
ColdFusion.Calendar.monthNamesShort=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
ColdFusion.Calendar.monthNamesLong=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
ColdFusion.Calendar.dayNamesShort=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
ColdFusion.Calendar.dayNamesLong=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
ColdFusion.Calendar.calTableIdCounter=0;
if(navigator.userAgent.toLowerCase().indexOf("safari")>-1){
var set_month=Date.prototype.setMonth;
Date.prototype.setMonth=function(num){
if(num<=-1){
var n=Math.ceil(-num);
var _100=Math.ceil(n/12);
var _101=(n%12)?12-n%12:0;
this.setFullYear(this.getFullYear()-_100);
return set_month.call(this,_101);
}else{
return set_month.apply(this,arguments);
}
};
}
if(!String.escape){
String.escape=function(_102){
return _102.replace(/('|\\)/g,"\\$1");
};
}
ColdFusion.Calendar.setUpCalendar=function(_103,mask,_105,_106,_107,_108,_109){
var _10a=ColdFusion.DOM.getElement(_103+_108+"_cf_button",_108);
var _10b=ColdFusion.DOM.getElement(_103,_108);
var _10c=null;
var _10d=null;
if(_10b.value!=""){
_10c=_10b.value;
_10d=_10c.split("/");
}
var _10e=_103+"_cf_calendar"+ColdFusion.Calendar.calTableIdCounter;
ColdFusion.Calendar.calTableIdCounter++;
var _10f=ColdFusion.DOM.getElement(_103+_108+"_cf_container",_108);
var _110=_10b.offsetLeft;
ColdFusion.DOM.getElement(_103+_108+"_cf_container",_108).style.left=_110;
YAHOO.widget.Calendar.IMG_ROOT=_cf_ajaxscriptsrc+"/resources/yui/";
var _111;
if(_10d&&_10d[0]&&_10d[2]){
_111=new YAHOO.widget.Calendar(_10e,_103+_108+"_cf_container",{close:true,pagedate:_10d[0]+"/"+_10d[2]});
}else{
_111=new YAHOO.widget.Calendar(_10e,_103+_108+"_cf_container",{close:true});
}
_111.calendarinputid=_103;
_111.calendarinput=_10b;
_111.mask=mask;
_111.formname=_108;
_111.cfg.setProperty("MONTHS_LONG",_107);
_111.cfg.setProperty("WEEKDAYS_SHORT",_106);
_111.cfg.setProperty("START_WEEKDAY",_105);
ColdFusion.objectCache[_10e+_108]=_111;
_111.select(_10c);
_111.render();
_111.hide();
_111.selectEvent.subscribe(ColdFusion.Calendar.handleDateSelect,_111,true);
YAHOO.util.Event.addListener(_103+_108+"_cf_button","click",ColdFusion.Calendar.handleCalendarLinkClick,_111,true);
if(_109!=null){
var year=_109.year;
var _113=_109.month;
var day=_109.day;
var _115=new Date(year,_113.valueOf()-1,day);
_10b.value=ColdFusion.Calendar.createFormattedOutput(_103,mask,year,_113,day,_115);
}
};
ColdFusion.Calendar.openedCalendarInstance=null;
ColdFusion.Calendar.handleCalendarLinkClick=function(type,args){
var _118=args;
if(ColdFusion.Calendar.openedCalendarInstance){
ColdFusion.Calendar.openedCalendarInstance.hide();
}
if(!_118.extMask){
var _119=ColdFusion.Calendar.convertToExtMask(_118.mask);
_118.extMask=_119;
}
var _11a=ColdFusion.DOM.getElement(args.calendarinputid,_118.formname).value;
var _11b=null;
if(typeof (_11a)!="undefined"&&ColdFusion.trim(_11a)!=""){
_11b=Date.parseDate(_11a,_118.extMask);
}
if(_11b!=null){
_118.setMonth(_11b.getMonth());
_118.setYear(_11b.getFullYear());
_118.select(_11b);
_118.render();
}
ColdFusion.Calendar.openedCalendarInstance=_118;
_118.show();
};
ColdFusion.Calendar.handleDateSelect=function(type,args,_11e){
var _11f=args[0];
var date=_11f[0];
var year=date[0],month=date[1],day=date[2];
var _122=new Date(year,month.valueOf()-1,day);
_11e.calendarinput.value=ColdFusion.Calendar.createFormattedOutput(_11e.calendarinputid,_11e.mask,year,month,day,_122);
ColdFusion.Event.callBindHandlers(_11e.calendarinputid,null,"change");
_11e.hide();
};
ColdFusion.Calendar.convertToExtMask=function(mask){
mask=mask.toUpperCase();
if(mask.indexOf("DD")!=-1){
mask=mask.replace(/DD/g,"d");
}
if(mask.indexOf("D")!=-1){
mask=mask.replace(/D/g,"d");
}
if(mask.indexOf("MMMM")!=-1){
mask=mask.replace(/MMMM/g,"F");
}else{
if(mask.indexOf("MMM")!=-1){
mask=mask.replace(/MMM/g,"M");
}else{
if(mask.indexOf("MM")!=-1){
mask=mask.replace(/MM/g,"m");
}else{
if(mask.indexOf("M")!=-1){
mask=mask.replace(/M/g,"m");
}
}
}
}
if(mask.indexOf("YYYY")!=-1){
mask=mask.replace(/YYYY/g,"Y");
}
if(mask.indexOf("YY")!=-1){
mask=mask.replace(/YY/g,"y");
}
if(mask.indexOf("EEEE")!=-1){
mask=mask.replace(/EEEE/g,"l");
}
if(mask.indexOf("EEE")!=-1){
mask=mask.replace(/EEE/g,"D");
}
if(mask.indexOf("E")!=-1){
mask=mask.replace(/E/g,"w");
}
return mask;
};
ColdFusion.Calendar.createFormattedOutput=function(_124,mask,year,_127,day,date){
mask=mask.toUpperCase();
year=new String(year);
_127=new String(_127);
day=new String(day);
var _12a=date.getDay();
if(mask.indexOf("DD")!=-1){
if(day.length==1){
day="0"+day;
}
mask=mask.replace(/DD/g,day);
}
if(mask.indexOf("D"!=-1)){
if(day.length!=-1&&day.charAt(0)=="0"){
day=day.charAt(1);
}
mask=mask.replace(/D/g,day);
}
if(mask.indexOf("MMMM")!=-1){
_127=ColdFusion.Calendar.monthNamesLong[_127.valueOf()-1];
mask=mask.replace(/MMMM/g,_127);
}else{
if(mask.indexOf("MMM")!=-1){
_127=ColdFusion.Calendar.monthNamesShort[_127.valueOf()-1];
mask=mask.replace(/MMM/g,_127);
}else{
if(mask.indexOf("MM")!=-1){
if(_127.length==1){
_127="0"+_127;
}
mask=mask.replace(/MM/g,_127);
}else{
if(mask.indexOf("M")!=-1){
if(_127.length!=-1&&_127.charAt(0)=="0"){
_127=_127.charAt(1);
}
mask=mask.replace(/M/g,_127);
}
}
}
}
if(mask.indexOf("YYYY")!=-1){
mask=mask.replace(/YYYY/g,year);
}
if(mask.indexOf("YY")!=-1){
year=year.substring(2);
mask=mask.replace(/YY/g,year);
}
if(mask.indexOf("EEEE")!=-1){
_12a=ColdFusion.Calendar.dayNamesLong[_12a.valueOf()];
mask=mask.replace(/EEEE/g,_12a);
}
if(mask.indexOf("EEE")!=-1){
_12a=ColdFusion.Calendar.dayNamesShort[_12a.valueOf()];
mask=mask.replace(/EEE/g,_12a);
}
if(mask.indexOf("E")!=-1){
_12a=_12a.valueOf();
_12a=new String(_12a);
if(_12a.length!=-1&&_12a.charAt(0)=="0"&&_12a.charAt(1)){
_12a=_12a.charAt(1);
}
mask=mask.replace(/E/g,_12a);
}
return mask;
};
