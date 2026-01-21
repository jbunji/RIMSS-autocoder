/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Tooltip){
ColdFusion.Tooltip={};
}
ColdFusion.Tooltip.setToolTipOut=function(_ee,_ef){
var _f0=_ef.tooltip;
_f0.tooltipout=true;
};
ColdFusion.Tooltip.getToolTip=function(_f1,_f2){
var _f3=ColdFusion.objectCache[_f2.context];
if(!_f3){
if(_f2.style){
_f2.styleObj=ColdFusion.Tooltip.parseStyle(_f2.style);
}
_f3=new YAHOO.widget.Tooltip(_f2.context+"_cf_tooltip",_f2);
ColdFusion.objectCache[_f2.context]=_f3;
_f3.doShow(_f1,_f2.context);
if(_f2._cf_url){
var _f4=function(req,_f6){
_f6.tooltip.cfg.setProperty("text",req.responseText);
if(_f6.tooltip.tooltipout==false){
_f6.tooltip.doShow(_f6.event,_f6.id);
}
};
YAHOO.util.Event.addListener(_f2.context,"mouseout",ColdFusion.Tooltip.setToolTipOut,{"tooltip":_f3});
_f3.cfg.setProperty("text",_cf_loadingtexthtml);
_f3.doShow(_f1,_f2.context);
try{
ColdFusion.Log.info("tooltip.gettooltip.fetch","widget",[_f2.context]);
ColdFusion.Ajax.sendMessage(_f2._cf_url,"GET",_f2._cf_query,true,_f4,{tooltip:_f3,event:_f1,id:_f2.context});
}
catch(e){
tooltipdiv=ColdFusion.DOM.getElement(_f2.context);
tooltipdiv.innerHTML="";
ColdFusion.globalErrorHandler(null,e,tooltipdiv);
}
}
}
_f3.tooltipout=false;
};
ColdFusion.Tooltip.parseStyle=function(_f7){
var _f8={};
if(_f7&&typeof _f7==="string"){
var _f9=_f7.split(";");
for(var i=0;i<_f9.length;i++){
var _fb=_f9[i];
tempArray=_fb.split(":");
if(tempArray.length===2){
var key=tempArray[0];
key=key.toLowerCase();
var _fd=tempArray[1];
switch(key){
case "width":
_f8.width=_fd;
break;
case "color":
_f8.color=_fd;
break;
case "background-color":
_f8[key]=_fd;
break;
case "padding":
_f8.padding=_fd;
break;
default:
_f8[key]=_fd;
}
}
}
}
return _f8;
};
