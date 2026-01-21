/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Window){
ColdFusion.Window={};
}
ColdFusion.Window.windowIdCounter=1;
ColdFusion.Window.TITLE_BGCOLOR_TEMPLATE="WINDOW_DIV_ID .x-window-tc , WINDOW_DIV_ID .x-window-tl, WINDOW_DIV_ID .x-window-tr, WINDOW_DIV_ID .x-window-bc, WINDOW_DIV_ID .x-window-br, WINDOW_DIV_ID"+" .x-window-bl, WINDOW_DIV_ID  .x-window-ml, WINDOW_DIV_ID .x-window-mr { background-image: none; background-color: COLOR_ID; }";
ColdFusion.Window.create=function(_3ed,_3ee,url,_3f0){
if(_3ed==null){
ColdFusion.handleError(null,"window.create.nullname","widget",null,null,null,true);
return;
}
if(_3ed==""){
ColdFusion.handleError(null,"window.create.emptyname","widget",null,null,null,true);
return;
}
var _3f1=ColdFusion.objectCache[_3ed];
var _3f2=false;
if(typeof (_3f1)!="undefined"&&_3f1!=null){
if(_3f1.callfromtag){
ColdFusion.handleError(null,"window.create.duplicatename","widget",[_3ed]);
}
if(typeof (_3f1.isConfObj)!="undefined"&&_3f1.isConfObj==true){
_3f2=true;
if(_3f0!=null&&typeof (_3f0.initshow)!="undefined"){
if(_3f0.initshow==false){
return;
}
}
}else{
if(!_3f0||(_3f0&&_3f0.initshow!==false)){
ColdFusion.Window.show(_3ed);
}
return;
}
}
if(!_3f1){
ColdFusion.Log.info("window.create.creating","widget",[_3ed]);
}
var _3f3=ColdFusion.Window.createHTML(_3ed,_3ee,url,_3f0,_3f2);
var _3f4=ColdFusion.objectCache[_3ed];
if(_3f4!=null&&typeof (_3f4.isConfObj)!="undefined"&&_3f4.isConfObj==true){
return;
}
return ColdFusion.Window.createJSObj(_3ed,url,_3f3);
};
ColdFusion.Window.createHTML=function(_3f5,_3f6,url,_3f8,_3f9){
var _3fa=null;
var _3fb=null;
if(_3f8&&_3f8.divid){
_3fa=document.getElementById(_3f8.divid);
}
if(_3fa==null){
_3fa=document.createElement("div");
_3fb="cf_window"+ColdFusion.Window.windowIdCounter;
ColdFusion.Window.windowIdCounter++;
_3fa.id=_3fb;
_3fa.className="x-hidden";
}
document.body.appendChild(_3fa);
var _3fc=false;
var _3fd=null;
if(_3f8!=null&&typeof (_3f8.headerstyle)!="undefined"&&_3f8.headerstyle!=null){
var _3fe=new String(_3f8.headerstyle);
_3fe=_3fe.toLowerCase();
var _3ff=_3fe.indexOf("background-color");
if(_3ff>=0){
_3fc=true;
var _400=_3fe.indexOf(";",_3ff+17);
if(_400<0){
_400=_3fe.length;
}
_3fd=_3fe.substring(_3ff+17,_400);
}
}
var _401=document.getElementById(_3f5+"_title");
if(_3fc==true&&_3fd){
var _402="#"+_3f8.divid;
var _403="NAME_ID .x-window-tc , NAME_ID .x-window-tl, NAME_ID .x-window-tr, NAME_ID .x-window-bc, NAME_ID .x-window-br, NAME_ID .x-window-bl,NAME_ID .x-window-ml, NAME_ID .x-window-mr { background-image: none; background-color: COLOR_ID; }";
var _404=ColdFusion.Util.replaceAll(ColdFusion.Window.TITLE_BGCOLOR_TEMPLATE,"WINDOW_DIV_ID",_402);
var _404=ColdFusion.Util.replaceAll(_404,"COLOR_ID",_3fd);
Ext.util.CSS.createStyleSheet(_404);
}
if(_401==null){
_401=document.createElement("div");
_401.id=_3f5+"_title";
var _405="x-window-header";
_401.className=_405;
if(_3f6){
_401.innerHTML=_3f6;
}else{
_401.innerHTML="&nbsp;";
}
_3fa.appendChild(_401);
}
var _406=document.getElementById(_3f5+"_body");
if(_406==null){
_406=document.createElement("div");
_406.id=_3f5+"_body";
_406.className="x-window-body";
_3fa.appendChild(_406);
}
var _407;
_407=ColdFusion.Window.getUpdatedConfigObj(_3f8,_3f5);
if(typeof (_407)=="undefined"){
_3fa.innerHTML="";
return;
}
if(_3fb){
_407.divid=_3fb;
}
_407.title=_3f6;
if(typeof (_407.initshow)!="undefined"&&_407.initshow===false){
_407.url=url;
ColdFusion.objectCache[_3f5]=_407;
ColdFusion.objectCache[_3f5+"_body"]=_407;
}
return _407;
};
ColdFusion.Window.createJSObj=function(_408,url,_40a){
var _40b;
var _40c=false;
if(typeof (_40a.childlayoutid)&&_40a.childlayoutid!=null){
_40c=true;
_40a.layout="border";
_40a.items=ColdFusion.objectCache[_40a.childlayoutid];
}else{
_40a.layout="fit";
}
if(typeof (_40a.autoScroll)=="undefined"){
_40a.autoScroll=true;
}
_40a.el=_40a.divid;
if(_40a.onShow){
_40a._cf_onShow=_40a.onShow;
_40a.onShow=null;
}
if(_40a.onHide){
_40a._cf_onHide=_40a.onHide;
_40a.onHide=null;
}
_40b=new Ext.Window(_40a);
_40b.cfwindowname=_408;
_40b.tempx=_40a.tempx;
_40b.tempy=_40a.tempy;
_40b.divid=_40a.divid;
if(typeof (_40a.headerstyle)!="undefined"&&_40a.headerstyle!=null){
var _40d=document.getElementById(_408+"_title");
if(_40d!=null){
_40d.style.cssText="background:none;"+_40a.headerstyle;
}
}
if(typeof (_40a.bodystyle)!="undefined"&&_40a.bodystyle!=null){
var _40e=document.getElementById(_408+"_body");
var _40f=_40e.parentNode;
if(_40f!=null){
_40f.style.cssText=_40a.bodystyle;
}
}
_40b.isConfObj=false;
_40b._cf_body=_408+"_body";
ColdFusion.objectCache[_408]=_40b;
if(_40c){
var _410=_40b.getLayout();
var _411=ColdFusion.objectCache[_40a.childlayoutid];
}
_40b.addListener("beforeclose",ColdFusion.Window.beforeCloseHandler);
var _412=null;
if(typeof (url)!="undefined"&&url!=""){
_412=url;
}
if(_412==null){
if(typeof (_40a.initshow)=="undefined"||_40a.initshow==true){
_40b.addListener("beforeshow",ColdFusion.Window.beforeShowHandler);
ColdFusion.Window.showandhide(_40b,_40a);
}
return;
}
ColdFusion.objectCache[_408+"_body"]=_40b;
if(typeof (_40a.callfromtag)=="undefined"){
var _413;
var _414;
_40b._cf_visible=false;
_40b._cf_dirtyview=true;
_40b.addListener("show",ColdFusion.Window.showHandler);
_40b.addListener("hide",ColdFusion.Window.hideHandler);
_40b.url=_412;
if(_40a){
if(typeof (_40a.initshow)=="undefined"||_40a.initshow==true){
ColdFusion.Window.showandhide(_40b,_40a);
}
_413=_40a.callbackHandler;
_414=_40a.errorHandler;
}
}else{
_40b.callfromtag=true;
_40b._cf_visible=false;
_40b._cf_dirtyview=true;
_40b.addListener("show",ColdFusion.Window.showHandler);
_40b.addListener("beforeshow",ColdFusion.Window.beforeShowHandler);
_40b.addListener("hide",ColdFusion.Window.hideHandler);
if(typeof (_40a.initshow)=="undefined"||_40a.initshow==true){
ColdFusion.Window.showandhide(_40b,_40a);
}
}
};
ColdFusion.Window.showandhide=function(_415,_416){
if(typeof (_416.tempinitshow)!="undefined"&&_416.tempinitshow==false){
var _417=Ext.Element.get(_415.el);
if(typeof _417!="undefined"){
_417.show();
}
_417.hide();
}else{
_415.show();
}
};
ColdFusion.Window.destroy=function(_418,_419){
if(_418){
var _41a=ColdFusion.Window.getWindowObject(_418);
if(_41a){
if(_419===true){
_41a.destroy(true);
}else{
_41a.destroy();
}
ColdFusion.objectCache[_418]=null;
}
}
};
ColdFusion.Window.resizeHandler=function(_41b,_41c,_41d){
if(typeof (_41b.fixedcenter)!="undefined"&&_41b.fixedcenter==true){
_41b.center();
}
};
ColdFusion.Window.beforeShowHandler=function(_41e){
if(typeof (_41e.fixedcenter)!="undefined"&&_41e.fixedcenter==true){
_41e.center();
}
};
ColdFusion.Window.beforeCloseHandler=function(_41f){
if(_41f.destroyonclose!="undefined"&&_41f.destroyonclose==true){
ColdFusion.objectCache[_41f.cfwindowname]=null;
return true;
}else{
_41f.hide();
return false;
}
};
ColdFusion.Window.showHandler=function(_420){
_420._cf_visible=true;
if(_420._cf_dirtyview){
if(typeof (_420.callfromtag)=="undefined"){
ColdFusion.Ajax.replaceHTML(_420._cf_body,_420.url,"GET",null,_420.callbackHandler,_420.errorHandler);
}else{
var _421=ColdFusion.bindHandlerCache[_420._cf_body];
if(_421){
_421();
}
}
_420._cf_dirtyview=false;
}
};
ColdFusion.Window.hideHandler=function(_422){
_422._cf_visible=false;
if(_422._cf_refreshOnShow){
_422._cf_dirtyview=true;
}
};
ColdFusion.Window.xPosition=50;
ColdFusion.Window.yPosition=50;
ColdFusion.Window.resetHTML=function(_423){
var _424=document.getElementById(_423);
if(_424){
_424.innerHTML="";
}
};
ColdFusion.Window.getUpdatedConfigObj=function(_425,_426){
var _427={};
if(_425!=null){
if(typeof (_425)!="object"){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidconfig","widget",[_426],null,null,true);
return;
}
for(var key in _425){
if(key=="center"&&ColdFusion.Util.isBoolean(_425["center"])){
_427["fixedcenter"]=_425["center"];
}else{
_427[key]=_425[key];
}
}
}
if(typeof (_427.initshow)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.initshow)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidinitshow","widget",[_426],null,null,true);
return;
}else{
_427.initshow=ColdFusion.Util.castBoolean(_427.initshow);
_427._cf_visible=_427.initshow;
}
}
_427.tempcenter=null;
if(typeof (_427.fixedcenter)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.fixedcenter)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidcenter","widget",[_426],null,null,true);
return;
}else{
_427.fixedcenter=ColdFusion.Util.castBoolean(_427.fixedcenter);
}
}
if(typeof (_427.resizable)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.resizable)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidresizable","widget",[_426],null,null,true);
return;
}else{
_427.resizable=ColdFusion.Util.castBoolean(_427.resizable);
}
}
if(typeof (_427.draggable)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.draggable)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invaliddraggable","widget",[_426],null,null,true);
return;
}else{
_427.draggable=ColdFusion.Util.castBoolean(_427.draggable);
}
}
if(typeof (_427.closable)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.closable)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidclosable","widget",[_426],null,null,true);
return;
}else{
_427.closable=ColdFusion.Util.castBoolean(_427.closable);
}
}
if(typeof (_427.modal)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.modal)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidmodal","widget",[_426],null,null,true);
return;
}else{
_427.modal=ColdFusion.Util.castBoolean(_427.modal);
}
}
if(typeof (_427.refreshonshow)!="undefined"){
if(ColdFusion.Util.isBoolean(_427.refreshonshow)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidrefreshonshow","widget",[_426],null,null,true);
return;
}else{
_427._cf_refreshOnShow=ColdFusion.Util.castBoolean(_427.refreshonshow);
}
}
_427.shadow=true;
if(!_427.height){
_427.height=300;
}else{
if(ColdFusion.Util.isInteger(_427.height)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidheight","widget",[_426],null,null,true);
return;
}
}
if(!_427.width){
_427.width=500;
}else{
if(ColdFusion.Util.isInteger(_427.width)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidwidth","widget",[_426],null,null,true);
return;
}
}
var _429=false;
if(_427.minwidth){
if(ColdFusion.Util.isInteger(_427.minwidth)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidminwidth","widget",[_426],null,null,true);
return;
}
var _42a=_427.minwidth;
var _42b=_427.width;
if(typeof (_42a)!="number"){
_42a=parseInt(_42a);
}
if(typeof (_42b)!="number"){
_42b=parseInt(_42b);
}
if(_42a>_42b){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidminwidth","widget",[_426],null,null,true);
return;
}
_427.minWidth=_427.minwidth;
_429=true;
}
if(_427.minheight){
if(ColdFusion.Util.isInteger(_427.minheight)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidminheight","widget",[_426],null,null,true);
return;
}
var _42c=_427.minheight;
var _42d=_427.height;
if(typeof (_42c)!="number"){
_42c=parseInt(_42c);
}
if(typeof (_42d)!="number"){
_42d=parseInt(_42d);
}
if(_42c>_42d){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidheightvalue","widget",[_426],null,null,true);
return;
}
_427.minHeight=_427.minheight;
_429=true;
}
if(_427.x){
if(ColdFusion.Util.isInteger(_427.x)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidx","widget",[_426],null,null,true);
return;
}
}
if(_427.y){
if(ColdFusion.Util.isInteger(_427.y)==false){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidy","widget",[_426],null,null,true);
return;
}
}
if(typeof (_427.x)=="undefined"&&(typeof (_427.fixedcenter)=="undefined"||_427.fixedcenter==false)){
_427.x=ColdFusion.Window.xPosition;
ColdFusion.Window.xPosition+=15;
}
if(typeof (_427.y)=="undefined"&&(typeof (_427.fixedcenter)=="undefined"||_427.fixedcenter==false)){
_427.y=ColdFusion.Window.yPosition;
ColdFusion.Window.yPosition+=15;
}
if(typeof (_427.initshow)!="undefined"&&_427.initshow===false){
_427.tempinitshow=false;
if(typeof (_427.fixedcenter)!="undefined"&&_427.fixedcenter===true){
_427.tempcenter=_427.fixedcenter;
_427.fixedcenter=null;
}else{
_427.tempx=_427.x;
_427.tempy=_427.y;
}
_427.x=-10000;
_427.y=-10000;
}
_427.constraintoviewport=true;
_427.initshow=true;
if(_427.resizable!=null&&_427.resizable==false&&_429==true){
ColdFusion.Window.resetHTML(_426);
ColdFusion.handleError(null,"window.getupdatedconfigobject.minhwnotallowed","widget",[_426],null,null,true);
return;
}
_427.collapsible=false;
_427.shadow=true;
_427.isConfObj=true;
return _427;
};
ColdFusion.Window.show=function(_42e){
var _42f=ColdFusion.objectCache[_42e];
if(typeof (_42f)!="undefined"&&_42f!=null){
if(typeof (_42f.isConfObj)!="undefined"&&_42f.isConfObj==true){
_42f.initshow=true;
var _430=ColdFusion.Window.createHTML(_42e,null,_42f.url,_42f,true);
ColdFusion.Window.createJSObj(_42e,_42f.url,_430);
}else{
if(_42f.isVisible()==false){
_42f.show();
ColdFusion.Log.info("window.show.shown","widget",[_42e]);
}
if(_42f.tempcenter!=null){
_42f.center();
_42f.tempcenter=null;
}else{
if(_42f.getEl()&&_42f.getEl().getX()>0&&_42f.getEl().getY()>0){
_42f.tempx=null;
_42f.tempy=null;
}else{
if(_42f.tempx!=null&&_42f.tempy!=null){
_42f.setPosition(_42f.tempx,_42f.tempy);
_42f.tempx=null;
_42f.tempy=null;
}else{
var x=_42f.getEl().getX();
var y=_42f.getEl().getY();
_42f.setPosition(x+1,y+1);
_42f.setPosition(x,y);
}
}
}
}
}else{
ColdFusion.handleError(null,"window.show.notfound","widget",[_42e],null,null,true);
}
};
ColdFusion.Window.hide=function(_433){
var _434=ColdFusion.objectCache[_433];
if(_434){
if(_434.isVisible&&_434.isVisible()==true){
_434.hide();
ColdFusion.Log.info("window.hide.hidden","widget",[_433]);
}
}else{
ColdFusion.handleError(null,"window.hide.notfound","widget",[_433],null,null,true);
}
};
ColdFusion.Window.onShow=function(_435,_436){
var _437=ColdFusion.objectCache[_435];
if(typeof (_437)!="undefined"&&_437!=null){
_437._cf_onShow=_436;
if(_437.addListener){
_437.addListener("show",ColdFusion.Window.onShowWrapper);
}
}else{
ColdFusion.handleError(null,"window.onshow.notfound","widget",[_435],null,null,true);
}
};
ColdFusion.Window.onShowWrapper=function(_438){
_438._cf_onShow.call(null,_438.cfwindowname);
};
ColdFusion.Window.onHide=function(_439,_43a){
var _43b=ColdFusion.objectCache[_439];
if(typeof (_43b)!="undefined"&&_43b!=null){
_43b._cf_onHide=_43a;
if(_43b.addListener){
_43b.addListener("hide",ColdFusion.Window.onHideWrapper);
}
}else{
ColdFusion.handleError(null,"window.onhide.notfound","widget",[_439],null,null,true);
}
};
ColdFusion.Window.onHideWrapper=function(_43c){
_43c._cf_onHide.call(null,_43c.cfwindowname);
};
ColdFusion.Window.getWindowObject=function(_43d){
if(!_43d){
ColdFusion.handleError(null,"window.getwindowobject.emptyname","widget",null,null,null,true);
return;
}
var _43e=ColdFusion.objectCache[_43d];
if(_43e==null||(typeof (_43e.isConfObj)=="undefined"&&Ext.Window.prototype.isPrototypeOf(_43e)==false)){
ColdFusion.handleError(null,"window.getwindowobject.notfound","widget",[_43d],null,null,true);
return;
}
if(typeof (_43e.isConfObj)!="undefined"&&_43e.isConfObj==true){
_43e.initshow=true;
var _43f=ColdFusion.Window.createHTML(_43d,null,_43e.url,_43e,true);
ColdFusion.Window.createJSObj(_43d,_43e.url,_43f);
ColdFusion.Window.hide(_43d);
_43e=ColdFusion.objectCache[_43d];
}
return _43e;
};
