/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Button){
ColdFusion.Button={};
}
var $BT=ColdFusion.Button;
ColdFusion.Button.init=function(_683,_684,icon,tips,_687,_688,_689,_68a,_68b){
var _68c={renderTo:_683,enableToggle:_68b,text:_684,onClick:_687,onToggle:_688,onMouseOver:_689,onMouseout:_68a,tooltip:tips,icon:icon};
var _68d={renderTo:_683,enableToggle:_68b,text:_684};
if(tips!=null&&typeof tips!="undefined"){
_68d.tooltip=tips;
Ext.QuickTips.init();
}
if(icon!=null&&typeof icon!="undefined"){
_68d.icon=icon;
}
if(icon&&_684){
_68d.iconCls="x-btn-text-icon";
}else{
if(icon&&!_684){
_68d.iconCls="x-btn-icon";
}
}
var _68e=new Ext.Button(_68d);
if(_687!=null&&typeof _687=="function"){
_68e.on("click",_687,_68c);
}
if(_688!=null&&typeof _688=="function"){
_68e.on("toggle",_688,_68c);
}
if(_689!=null&&typeof _689=="function"){
_68e.on("mouseover",_689,_68c);
}
if(_68a!=null&&typeof _68a=="function"){
_68e.on("mouseout",_68a,_68c);
}
_68c.buttonComp=_68e;
ColdFusion.objectCache[_683]=_68c;
ColdFusion.Log.info("button.initialized","widget",[_683]);
};
$BT.show=function(_68f){
var _690=$BT.getButtonObject(_68f);
if(_690!=null){
_690.show();
}
ColdFusion.Log.info("button.show.shown","widget",[_68f]);
};
$BT.hide=function(_691){
var _692=$BT.getButtonObject(_691);
if(_692!=null){
_692.hide();
}
ColdFusion.Log.info("button.hide.hidden","widget",[_691]);
};
$BT.disable=function(_693){
var _694=$BT.getButtonObject(_693);
if(_694!=null){
_694.disable();
}
ColdFusion.Log.info("button.disable.disabled","widget",[_693]);
};
$BT.enable=function(_695){
var _696=$BT.getButtonObject(_695);
if(_696!=null){
_696.enable();
}
ColdFusion.Log.info("button.enable.enabled","widget",[_695]);
};
$BT.getButtonObject=function(_697){
var _698=$BT.getButtonConfigObj(_697);
if(_698!=null){
return _698.buttonComp;
}else{
ColdFusion.handleError(null,"button.component.notFound","widget",[_697],null,null,true);
}
};
$BT.setLabel=function(_699,_69a){
var _69b=$BT.getButtonObject(_699);
if(_69b!=null){
_69b.text=_69a;
}
};
$BT.getButtonConfigObj=function(_69c){
var _69d=ColdFusion.objectCache[_69c];
if(_69d==null||typeof (_69d)=="undefined"){
ColdFusion.handleError(null,"button.component.notFound","widget",[_69c],null,null,true);
}
return _69d;
};
$BT.toggle=function(_69e){
var _69f=$BT.getButtonObject(_69e);
if(_69f!=null){
_69f.toggle();
}
};
