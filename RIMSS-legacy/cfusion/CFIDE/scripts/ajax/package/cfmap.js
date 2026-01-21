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
$MAP.statusCodeObject={code200:"A directions request could not be successfully parsed. For example, the request may have been rejected if it contained more than the maximum number of waypoints allowed.",code400:"A directions request could not be successfully parsed. For example, the request may have been rejected if it contained more than the maximum number of waypoints allowed.",code500:"A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known",code601:"The HTTP query parameter was either missing or had no value. For geocoding requests, this means that an empty address was specified as input. For directions requests, this means that no query was specified in the input",code602:"No corresponding geographic location could be found for the specified address. This may be due to the fact that the address is relatively new, or it may be incorrect",code603:"The geocode for the given address or the route for the given directions query cannot be returned due to legal or contractual reasons",code604:"The GDirections object could not compute directions between the points mentioned in the query. This is usually because there is no route available between the two points, or because we do not have data for routing in that region",code610:"This request was invalid.",code620:"The webpage has gone over the requests limit in too short a period of time."};
ColdFusion.Map._init=function(_50a,_50b,_50c,type,_50e,_50f,_510,_511,_512,_513,_514,_515,_516,_517,_518,_519,_51a,_51b,_51c,_51d,_51e,_51f,_520,_521,_522,_523,_524,_525,_526,_527,_528){
var _529=null;
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(function(_52a){
if(_528<1){
_51d=_52a.coords.latitude;
_51e=_52a.coords.longitude;
_51c=null;
}
if(_528!==0){
if(_528<0){
_528=_528*-1;
}
_522[_528-1].latitude=_52a.coords.latitude;
_522[_528-1].longitude=_52a.coords.longitude;
}
_529=ColdFusion.Map.init(_50a,_50b,_50c,type,_50e,_50f,_510,_511,_512,_513,_514,_515,_516,_517,_518,_519,_51a,_51b,_51c,_51d,_51e,_51f,_520,_521,_522,_523,_524,_525,_526,_527);
},function(_52b){
_529=ColdFusion.Map.init(_50a,_50b,_50c,type,_50e,_50f,_510,_511,_512,_513,_514,_515,_516,_517,_518,_519,_51a,_51b,_51c,_51d,_51e,_51f,_520,_521,_522,_523,_524,_525,_526,_527);
});
}else{
_529=ColdFusion.Map.init(_50a,_50b,_50c,type,_50e,_50f,_510,_511,_512,_513,_514,_515,_516,_517,_518,_519,_51a,_51b,_51c,_51d,_51e,_51f,_520,_521,_522,_523,_524,_525,_526,_527);
}
return _529;
};
ColdFusion.Map.init=function(_52c,_52d,_52e,type,_530,_531,_532,_533,_534,_535,_536,_537,_538,_539,_53a,_53b,_53c,_53d,_53e,_53f,_540,_541,_542,_543,_544,_545,_546,_547,_548,_549){
var _54a={divName:_52c,type:type,layout:"fit",renderTo:_52c,centerAddress:_53e,centerLatitude:_53f,centerLongitude:_540,markerItems:_544,onLoad:_545,onError:_546,showCenterMarker:_539,showAllMarker:_53a,markerColor:_542,markerIcon:_543,markerBindListener:_548,initShow:_533};
if(_52e!=null&&typeof (_52e)!="undefined"){
_54a.width=_52e;
}else{
_54a.width=400;
}
if(_52d!=null&&typeof (_52d)!="undefined"){
_54a.height=_52d;
}else{
_54a.height=400;
}
if(_530!=null&&typeof (_530)!="undefined"){
_54a.zoomLevel=_530;
}else{
_54a.zoomLevel=3;
}
_54a.hideBorders=_532;
if(!_532){
if(_531==null||typeof _531==="undefined"||_531.length==0){
_531=" ";
}
_54a.title=_531;
_54a.collapsible=_534;
}
if(_542==null&&_543==null){
_54a.markerColor="#00FF00";
}
var _54b=new Ext.Panel(_54a);
ColdFusion.objectCache[_52c]=_54a;
_54a.mapPanel=_54b;
var _54c=["enableDragging"];
var swz=false;
if(_535){
swz=true;
}
if(_536){
_54c.push("enableDoubleClickZoom");
}else{
_54c.push("disableDoubleClickZoom");
}
if(_537){
_54c.push("enableContinuousZoom");
}else{
_54c.push("disableContinuousZoom");
}
var _54e=["NonExistantControl"];
if(_538){
_54e.push("scaleControl");
}
var mtc=false;
var mtco="";
if(_53c&&_53c.toUpperCase()=="BASIC"){
mtc=true;
mtco="google.maps.MapTypeControlStyle.HORIZONTAL_BAR";
}else{
if(_53c&&_53c.toUpperCase()=="ADVANCED"){
mtc="true";
mtco=google.maps.MapTypeControlStyle.DROPDOWN_MENU;
}
}
if(_53b){
_54e.push("overviewMapControl");
}
var zc=false;
var zco="";
if(_53d!=null&&_53d!="undefined"){
_53d=_53d.toUpperCase();
switch(_53d){
case "SMALL":
zco=google.maps.ZoomControlStyle.SMALL;
zc=true;
break;
case "SMALL3D":
zco=google.maps.ZoomControlStyle.SMALL;
zc=true;
break;
case "LARGE":
zco=google.maps.ZoomControlStyle.LARGE;
zc=true;
break;
case "LARGE3D":
zco=google.maps.ZoomControlStyle.LARGE;
zc=true;
break;
}
}
var _553=[];
for(i=0;i<_54a.markerItems.length;i++){
var _554=$MAP.parseMarker(_54a.markerItems[i],_52c);
_553.push(_554);
}
if(_541==null||typeof _541==="undefined"){
_541="";
}
var _555={marker:{title:_541,iscenter:true}};
if(_54a.markerColor!=null&&typeof _54a.markerColor!="undefined"){
_555.marker.markercolor=_54a.markerColor;
}else{
if(_54a.markerIcon!=null&&typeof _54a.markerIcon!="undefined"){
_555.marker.markericon=_54a.markerIcon;
}
}
if(_547===true){
_555.listeners={click:$MAP.markerOnClickHandler};
if(_549!=null){
_555.marker.markerwindowcontent=_549;
}else{
_555.marker.bindcallback=_548;
}
_555.marker.name=_52c;
}
if(_54a.centerAddress!=null&&typeof _54a.centerAddress==="string"){
_555.geoCodeAddr=_54a.centerAddress;
_555.marker.address=_54a.centerAddress;
}else{
_555.lat=_54a.centerLatitude;
_555.lng=_54a.centerLongitude;
_555.marker.address=_54a.centerAddress;
}
var _556=false;
if(_53c!=null&&typeof _53c=="string"&&_53c.toUpperCase()=="ADVANCED"){
_556=true;
}
var _557=new Ext.ux.GMapPanel({xtype:"gmappanel",region:"center",zoomLevel:_54a.zoomLevel,gmapType:_54a.type,mapConfOpts:_54c,mapControls:_54e,setCenter:_555,markers:_553,border:!_54a.hideBorders,onLoadhandler:$MAP.onLoadCompleteHandler,onErrorhandler:$MAP.onErrorHandler,name:_54a.divName,noCenterMarker:!_539,showAllMarker:_53a,advanceMapTypeControl:_556,initShow:_533,zc:zc,zco:zco,mtc:mtc,mtco:mtco,swz:swz});
_54b.add(_557);
_54a.mapPanelObject=_557;
if(_533===false){
_54b.hide();
}else{
_54b.doLayout();
}
ColdFusion.Log.info("map.initialized","widget",[_52c]);
return _54b;
};
$MAP.addMarker=function(name,_559){
var _55a=$MAP.getMapPanelObject(name);
var _55b=$MAP.parseMarker(_559,name);
var _55c=[];
_55c.push(_55b);
_55a.addMarkers(_55c);
ColdFusion.Log.info("map.addmarker.markeradded","widget",[name,_55c.length]);
};
$MAP.setCenter=function(name,_55e){
var _55f=$MAP.getMapPanelObject(name);
var lat;
var lng;
if(_55e.latitude&&_55e.longitude){
if(typeof _55e.latitude!="number"||typeof _55e.longitude!="number"){
ColdFusion.handleError(null,"map.setcenter.latlngnonnumeric","widget",[name,_55e.latitude,_55e.longitude],null,null,true);
}else{
lat=_55e.latitude;
lng=_55e.longitude;
}
var _562=new google.maps.LatLng(lat,lng);
_55f.getMap().setCenter(_562,_55f.zoomLevel);
}else{
if(_55e.address){
if(typeof _55e.address!="string"){
ColdFusion.handleError(null,"map.setcenter.addressnotstring","widget",[name,_55e.address],null,null,true);
}else{
_55f.geoCodeLookup(_55e.address,null,null,true);
}
}else{
ColdFusion.handleError(null,"map.setcenter.invalidcenter","widget",[name],null,null,true);
}
}
ColdFusion.Log.info("map.setcenter.centerset","widget",[name]);
};
$MAP.getLatitudeLongitude=function(_563,_564){
geocoder=new google.maps.Geocoder();
if(_564==null||!typeof _564==="function"){
_564=$MAP.LatitudeLongitudeHanlder;
}
geocoder.geocode({"address":_563},_564);
};
$MAP.addEvent=function(name,_566,_567,_568){
if(_566=="singlerightclick"){
_566="rightclick";
}
if(_566=="maptypechanged"){
_566="maptypeid_changed";
}
var _569=$MAP.getMapPanelObject(name);
_569.addEventToMap(_566,_567,_568);
};
$MAP.setZoomLevel=function(name,_56b){
var _56c=$MAP.getMapPanelObject(name);
_56c.zoomLevel=_56b;
_56c.getMap().setZoom(_56b);
};
$MAP.getMapObject=function(name){
var _56e=$MAP.getMapPanelObject(name);
if(_56e!=null){
return _56e.getMap();
}
};
$MAP.parseMarker=function(_56f,_570){
var _571={};
if(_56f.latitude&&_56f.longitude){
if(typeof _56f.latitude!="number"||typeof _56f.longitude!="number"){
ColdFusion.handleError(null,"map.marker.latlngnonnumeric","widget",[_56f.latitude,_56f.longitude],null,null,true);
}else{
_571.lat=_56f.latitude;
_571.lng=_56f.longitude;
}
}else{
if(_56f.address!=null){
if(typeof _56f.address!="string"){
ColdFusion.handleError(null,"map.marker.addressnotstring","widget",[_56f.address],null,null,true);
}else{
_571.address=_56f.address;
}
}
}
var _572={};
if(_56f.tip==null){
_572.title="";
}else{
_572.title=_56f.tip;
}
if(_56f.markercolor!=null&&typeof _56f.markercolor!="undefined"){
_572.markercolor=_56f.markercolor;
}else{
if(_56f.markericon!=null&&typeof _56f.markericon!="undefined"){
_572.markericon=_56f.markericon;
}
}
if(_56f.showmarkerwindow===true||_56f.markerwindowcontent!=null){
var _573=ColdFusion.objectCache[_570];
var _574;
if(_573!=null||typeof (_573)!="undefined"){
_574=_573.markerBindListener;
}
if(_574!=null||_56f.markerwindowcontent!=null){
_571.listeners={click:$MAP.markerOnClickHandler};
if(_56f.markerwindowcontent!=null){
_572.markerwindowcontent=_56f.markerwindowcontent;
}else{
_572.bindcallback=_574;
}
_572.name=_56f.name;
}
}
_571.marker=_572;
return _571;
};
$MAP.onErrorHandler=function(name,_576){
var _577=ColdFusion.objectCache[name];
var _578=$MAP.statusCodeObject;
var _579=$MAP.retrieveStatueMessage(_576);
var _57a=_577.onError;
if(_57a!=null&&typeof _57a==="function"){
_57a.call(null,_576,_579);
}else{
alert("Error: "+_579);
}
ColdFusion.handleError(null,"map.loadMap.error","map",[name,_576,_579],null,null,true);
};
$MAP.onLoadCompleteHandler=function(name){
var _57c=ColdFusion.objectCache[name];
var _57d=_57c.onLoad;
if(_57d!=null&&typeof _57d==="function"){
_57d.call();
}
};
$MAP.retrieveStatueMessage=function(code){
var _57f;
switch(code){
case "ZERO_RESULTS":
_57f=$MAP.statusCodeObject.code602;
break;
case "OVER_QUERY_LIMIT":
_57f=$MAP.statusCodeObject.code620;
break;
case "REQUEST_DENIED":
_57f=$MAP.statusCodeObject.code610;
break;
case "INVALID_REQUEST":
_57f=$MAP.statusCodeObject.code610;
break;
}
return _57f;
};
var currentopenwindow="";
$MAP.markerOnClickHandler=function(_580){
coldFusion_markerObjCache[this.name]=this.scope.marker;
if(this.bindcallback!=null&&typeof this.bindcallback=="function"){
var _581=this.address;
if(_581==null||typeof _581=="undefined"){
_581="";
}
this.bindcallback.call(null,this.name,_580.latLng.lat(),_580.latLng.lng(),_581);
}else{
if(this.scope.statictext!=null&&typeof this.scope.statictext!="undefined"){
var me=this,infoWindow=new google.maps.InfoWindow({content:this.scope.statictext,position:this.scope.marker.position});
if(currentopenwindow!=""){
currentopenwindow.close();
}
infoWindow.open(this.scope.marker.map);
currentopenwindow=infoWindow;
}
}
};
ColdFusion.Map.loadMarkerWindowInfo=function(data,_584){
var _585=coldFusion_markerObjCache[_584._cf_marker_name];
var me=this,infoWindow=new google.maps.InfoWindow({content:data,position:_585.position});
infoWindow.open(_585.map);
};
ColdFusion.Map.bindOnErrorHandler=function(data,_588){
ColdFusion.handleError(null,"map.markerbind.binderror","widget",[data],null,null,true);
};
$MAP.getMapPanelObject=function(name){
var _58a=ColdFusion.objectCache[name];
if(_58a==null||typeof (_58a)=="undefined"){
ColdFusion.handleError(null,"map.getmappanelobject.notfound","widget",[name],null,null,true);
}
return _58a.mapPanelObject;
};
$MAP.refresh=function(name){
var _58c=ColdFusion.objectCache[name];
if(_58c==null||typeof (_58c)=="undefined"){
ColdFusion.handleError(null,"map.refresh.notfound","widget",[name],null,null,true);
}
_58c.mapPanel.doLayout();
};
$MAP.hide=function(name){
var _58e=ColdFusion.objectCache[name];
if(_58e==null||typeof (_58e)=="undefined"){
ColdFusion.handleError(null,"map.hide.notfound","widget",[name],null,null,true);
}
_58e.mapPanel.hide();
};
$MAP.show=function(name){
var _590=ColdFusion.objectCache[name];
if(_590==null||typeof (_590)=="undefined"){
ColdFusion.handleError(null,"map.show.notfound","widget",[name],null,null,true);
}
_590.mapPanel.show();
_590.mapPanel.doLayout();
};
