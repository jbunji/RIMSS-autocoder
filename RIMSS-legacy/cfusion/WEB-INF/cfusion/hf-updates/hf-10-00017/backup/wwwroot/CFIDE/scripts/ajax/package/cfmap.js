/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Map){
ColdFusion.Map={};
}
var coldFusion_markerObjCache=new Array();
var $MAP=ColdFusion.Map;
$MAP.statusCodeObject={code200:"A directions request could not be successfully parsed. For example, the request may have been rejected if it contained more than the maximum number of waypoints allowed.",code400:"A directions request could not be successfully parsed. For example, the request may have been rejected if it contained more than the maximum number of waypoints allowed.",code500:"A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known",code601:"The HTTP query parameter was either missing or had no value. For geocoding requests, this means that an empty address was specified as input. For directions requests, this means that no query was specified in the input",code602:"No corresponding geographic location could be found for the specified address. This may be due to the fact that the address is relatively new, or it may be incorrect",code603:"The geocode for the given address or the route for the given directions query cannot be returned due to legal or contractual reasons",code604:"The GDirections object could not compute directions between the points mentioned in the query. This is usually because there is no route available between the two points, or because we do not have data for routing in that region",code610:"The given key is either invalid or does not match the domain for which it was given",code620:"The given key has gone over the requests limit in the 24 hour period or has submitted too many requests in too short a period of time. If you are sending multiple requests in parallel or in a tight loop, use a timer or pause in your code to make sure you do not send the requests too quickly"};
ColdFusion.Map._init=function(_826,_827,_828,type,_82a,_82b,_82c,_82d,_82e,_82f,_830,_831,_832,_833,_834,_835,_836,_837,_838,_839,_83a,_83b,_83c,_83d,_83e,_83f,_840,_841,_842,_843,_844){
var _845=null;
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(function(_846){
if(_844<1){
_839=_846.coords.latitude;
_83a=_846.coords.longitude;
_838=null;
}
if(_844!==0){
if(_844<0){
_844=_844*-1;
}
_83e[_844-1].latitude=_846.coords.latitude;
_83e[_844-1].longitude=_846.coords.longitude;
}
_845=ColdFusion.Map.init(_826,_827,_828,type,_82a,_82b,_82c,_82d,_82e,_82f,_830,_831,_832,_833,_834,_835,_836,_837,_838,_839,_83a,_83b,_83c,_83d,_83e,_83f,_840,_841,_842,_843);
},function(_847){
_845=ColdFusion.Map.init(_826,_827,_828,type,_82a,_82b,_82c,_82d,_82e,_82f,_830,_831,_832,_833,_834,_835,_836,_837,_838,_839,_83a,_83b,_83c,_83d,_83e,_83f,_840,_841,_842,_843);
});
}else{
_845=ColdFusion.Map.init(_826,_827,_828,type,_82a,_82b,_82c,_82d,_82e,_82f,_830,_831,_832,_833,_834,_835,_836,_837,_838,_839,_83a,_83b,_83c,_83d,_83e,_83f,_840,_841,_842,_843);
}
return _845;
};
ColdFusion.Map.init=function(_848,_849,_84a,type,_84c,_84d,_84e,_84f,_850,_851,_852,_853,_854,_855,_856,_857,_858,_859,_85a,_85b,_85c,_85d,_85e,_85f,_860,_861,_862,_863,_864,_865){
var _866={divName:_848,type:type,layout:"fit",renderTo:_848,centerAddress:_85a,centerLatitude:_85b,centerLongitude:_85c,markerItems:_860,onLoad:_861,onError:_862,showCenterMarker:_855,showAllMarker:_856,markerColor:_85e,markerIcon:_85f,markerBindListener:_864,initShow:_84f};
if(_84a!=null&&typeof (_84a)!="undefined"){
_866.width=_84a;
}else{
_866.width=400;
}
if(_849!=null&&typeof (_849)!="undefined"){
_866.height=_849;
}else{
_866.height=400;
}
if(_84c!=null&&typeof (_84c)!="undefined"){
_866.zoomLevel=_84c;
}else{
_866.zoomLevel=3;
}
_866.hideBorders=_84e;
if(!_84e){
if(_84d==null||typeof _84d==="undefined"||_84d.length==0){
_84d=" ";
}
_866.title=_84d;
_866.collapsible=_850;
}
if(_85e==null&&_85f==null){
_866.markerColor="#00FF00";
}
var _867=new Ext.Panel(_866);
ColdFusion.objectCache[_848]=_866;
_866.mapPanel=_867;
var _868=["enableDragging"];
if(_851){
_868.push("enableScrollWheelZoom");
}else{
_868.push("disableScrollWheelZoom");
}
if(_852){
_868.push("enableDoubleClickZoom");
}else{
_868.push("disableDoubleClickZoom");
}
if(_853){
_868.push("enableContinuousZoom");
}else{
_868.push("disableContinuousZoom");
}
var _869=$MAP.parseControlProperties(_854,_857,_858,_859);
var _86a=[];
for(i=0;i<_866.markerItems.length;i++){
var _86b=$MAP.parseMarker(_866.markerItems[i],_848);
_86a.push(_86b);
}
if(_85d==null||typeof _85d==="undefined"){
_85d="";
}
var _86c={marker:{title:_85d}};
if(_866.markerColor!=null&&typeof _866.markerColor!="undefined"){
_86c.marker.markercolor=_866.markerColor;
}else{
if(_866.markerIcon!=null&&typeof _866.markerIcon!="undefined"){
_86c.marker.markericon=_866.markerIcon;
}
}
if(_863===true){
_86c.listeners={click:$MAP.markerOnClickHandler};
if(_865!=null){
_86c.marker.markerwindowcontent=_865;
}else{
_86c.marker.bindcallback=_864;
}
_86c.marker.name=_848;
}
if(_866.centerAddress!=null&&typeof _866.centerAddress==="string"){
_86c.geoCodeAddr=_866.centerAddress;
_86c.marker.address=_866.centerAddress;
}else{
_86c.lat=_866.centerLatitude;
_86c.lng=_866.centerLongitude;
_86c.marker.address=_866.centerAddress;
}
var _86d=false;
if(_858!=null&&typeof _858=="string"&&_858.toUpperCase()=="ADVANCED"){
_86d=true;
}
var _86e=new Ext.ux.GMapPanel({xtype:"gmappanel",region:"center",zoomLevel:_866.zoomLevel,gmapType:_866.type,mapConfOpts:_868,mapControls:_869,setCenter:_86c,markers:_86a,border:!_866.hideBorders,onLoadhandler:$MAP.onLoadCompleteHandler,onErrorhandler:$MAP.onErrorHandler,name:_866.divName,noCenterMarker:!_855,showAllMarker:_856,advanceMapTypeControl:_86d});
_867.add(_86e);
_866.mapPanelObject=_86e;
if(_84f===false){
_867.hide();
}else{
_867.doLayout();
}
ColdFusion.Log.info("map.initialized","widget",[_848]);
return _867;
};
$MAP.addMarker=function(name,_870){
var _871=$MAP.getMapPanelObject(name);
var _872=$MAP.parseMarker(_870,name);
var _873=[];
_873.push(_872);
_871.addMarkers(_873);
ColdFusion.Log.info("map.addmarker.markeradded","widget",[name,_873.length]);
};
$MAP.setCenter=function(name,_875){
var _876=$MAP.getMapPanelObject(name);
var lat;
var lng;
if(_875.latitude&&_875.longitude){
if(typeof _875.latitude!="number"||typeof _875.longitude!="number"){
ColdFusion.handleError(null,"map.setcenter.latlngnonnumeric","widget",[name,_875.latitude,_875.longitude],null,null,true);
}else{
lat=_875.latitude;
lng=_875.longitude;
}
var _879=new GLatLng(lat,lng);
_876.getMap().setCenter(_879,_876.zoomLevel,_876.parsedMapType);
}else{
if(_875.address){
if(typeof _875.address!="string"){
ColdFusion.handleError(null,"map.setcenter.addressnotstring","widget",[name,_875.address],null,null,true);
}else{
_876.geoCodeLookup(_875.address);
}
}else{
ColdFusion.handleError(null,"map.setcenter.invalidcenter","widget",[name],null,null,true);
}
}
ColdFusion.Log.info("map.setcenter.centerset","widget",[name]);
};
$MAP.getLatitudeLongitude=function(_87a,_87b){
geocoder=new GClientGeocoder();
if(_87b==null||!typeof _87b==="function"){
_87b=$MAP.LatitudeLongitudeHanlder;
}
geocoder.getLatLng(_87a,_87b);
};
$MAP.addEvent=function(name,_87d,_87e,_87f){
var _880=$MAP.getMapPanelObject(name);
_880.addEventToMap(_87d,_87e,_87f);
};
$MAP.setZoomLevel=function(name,_882){
var _883=$MAP.getMapPanelObject(name);
_883.zoomLevel=_882;
_883.getMap().setZoom(_882);
};
$MAP.getMapObject=function(name){
var _885=$MAP.getMapPanelObject(name);
if(_885!=null){
return _885.getMap();
}
};
$MAP.parseMarker=function(_886,_887){
var _888={};
if(_886.latitude&&_886.longitude){
if(typeof _886.latitude!="number"||typeof _886.longitude!="number"){
ColdFusion.handleError(null,"map.marker.latlngnonnumeric","widget",[_886.latitude,_886.longitude],null,null,true);
}else{
_888.lat=_886.latitude;
_888.lng=_886.longitude;
}
}else{
if(_886.address!=null){
if(typeof _886.address!="string"){
ColdFusion.handleError(null,"map.marker.addressnotstring","widget",[_886.address],null,null,true);
}else{
_888.address=_886.address;
}
}
}
var _889={};
if(_886.tip==null){
_889.title="";
}else{
_889.title=_886.tip;
}
if(_886.markercolor!=null&&typeof _886.markercolor!="undefined"){
_889.markercolor=_886.markercolor;
}else{
if(_886.markericon!=null&&typeof _886.markericon!="undefined"){
_889.markericon=_886.markericon;
}
}
if(_886.showmarkerwindow===true||_886.markerwindowcontent!=null){
var _88a=ColdFusion.objectCache[_887];
var _88b;
if(_88a!=null||typeof (_88a)!="undefined"){
_88b=_88a.markerBindListener;
}
if(_88b!=null||_886.markerwindowcontent!=null){
_888.listeners={click:$MAP.markerOnClickHandler};
if(_886.markerwindowcontent!=null){
_889.markerwindowcontent=_886.markerwindowcontent;
}else{
_889.bindcallback=_88b;
}
_889.name=_886.name;
}
}
_888.marker=_889;
return _888;
};
$MAP.parseControlProperties=function(_88c,_88d,_88e,_88f){
var _890=["NonExistantControl"];
if(_88c){
_890.push("GScaleControl");
}
if(_88e&&_88e.toUpperCase()=="BASIC"){
_890.push("GMapTypeControl");
}else{
if(_88e&&_88e.toUpperCase()=="ADVANCED"){
_890.push("GMenuMapTypeControl");
}
}
if(_88d){
_890.push("GOverviewMapControl");
}
if(_88f!=null&&_88f!="undefined"){
_88f=_88f.toUpperCase();
switch(_88f){
case "SMALL":
_890.push("GSmallMapControl");
break;
case "SMALL3D":
_890.push("GSmallZoomControl3D");
break;
case "LARGE":
_890.push("GLargeMapControl");
break;
case "LARGE3D":
_890.push("GLargeMapControl3D");
break;
}
}
return _890;
};
$MAP.onErrorHandler=function(name,_892){
var _893=ColdFusion.objectCache[name];
var _894=$MAP.statusCodeObject;
var _895=$MAP.retrieveStatueMessage(_892);
var _896=_893.onError;
if(_896!=null&&typeof _896==="function"){
_896.call(null,_892,_895);
}else{
alert("Error: "+_895);
}
ColdFusion.handleError(null,"map.loadMap.error","map",[name,_892,_895],null,null,true);
};
$MAP.onLoadCompleteHandler=function(name){
var _898=ColdFusion.objectCache[name];
var _899=_898.onLoad;
if(_899!=null&&typeof _899==="function"){
_899.call();
}
};
$MAP.retrieveStatueMessage=function(code){
var _89b;
switch(code){
case 200:
_89b=$MAP.statusCodeObject.code200;
break;
case 400:
_89b=$MAP.statusCodeObject.code400;
break;
case 500:
_89b=$MAP.statusCodeObject.code500;
break;
case 601:
_89b=$MAP.statusCodeObject.code601;
break;
case 602:
_89b=$MAP.statusCodeObject.code602;
break;
case 603:
_89b=$MAP.statusCodeObject.code603;
break;
case 604:
_89b=$MAP.statusCodeObject.code604;
break;
case 610:
_89b=$MAP.statusCodeObject.code610;
break;
case 620:
_89b=$MAP.statusCodeObject.code620;
break;
}
return _89b;
};
$MAP.markerOnClickHandler=function(_89c){
coldFusion_markerObjCache[this.name]=this.marker;
if(this.bindcallback!=null&&typeof this.bindcallback=="function"){
var _89d=this.address;
if(_89d==null||typeof _89d=="undefined"){
_89d="";
}
this.bindcallback.call(null,this.name,_89c.lat(),_89c.lng(),_89d);
}else{
if(this.statictext!=null&&typeof this.statictext!="undefined"){
this.marker.openInfoWindowHtml(this.statictext);
}
}
};
ColdFusion.Map.loadMarkerWindowInfo=function(data,_89f){
var _8a0=coldFusion_markerObjCache[_89f._cf_marker_name];
_8a0.openInfoWindowHtml(data+"");
};
ColdFusion.Map.bindOnErrorHandler=function(data,_8a2){
ColdFusion.handleError(null,"map.markerbind.binderror","widget",[data],null,null,true);
};
$MAP.getMapPanelObject=function(name){
var _8a4=ColdFusion.objectCache[name];
if(_8a4==null||typeof (_8a4)=="undefined"){
ColdFusion.handleError(null,"map.getmappanelobject.notfound","widget",[name],null,null,true);
}
return _8a4.mapPanelObject;
};
$MAP.refresh=function(name){
var _8a6=ColdFusion.objectCache[name];
if(_8a6==null||typeof (_8a6)=="undefined"){
ColdFusion.handleError(null,"map.refresh.notfound","widget",[name],null,null,true);
}
_8a6.mapPanel.doLayout();
};
$MAP.hide=function(name){
var _8a8=ColdFusion.objectCache[name];
if(_8a8==null||typeof (_8a8)=="undefined"){
ColdFusion.handleError(null,"map.hide.notfound","widget",[name],null,null,true);
}
_8a8.mapPanel.hide();
};
$MAP.show=function(name){
var _8aa=ColdFusion.objectCache[name];
if(_8aa==null||typeof (_8aa)=="undefined"){
ColdFusion.handleError(null,"map.show.notfound","widget",[name],null,null,true);
}
_8aa.mapPanel.show();
_8aa.mapPanel.doLayout();
};
