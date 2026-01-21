/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Layout){
ColdFusion.Layout={};
}
var ACCORDION_TITLE_ICON_CSS_TEMPLATE=".{0} { background-image:url({1}); }";
ColdFusion.Layout.initializeTabLayout=function(id,_163,_164,_165,_166){
Ext.QuickTips.init();
var _167;
if(_164){
_167={renderTo:id,height:_164};
}else{
_167={renderTo:id,autoHeight:true};
}
if(_165&&_165!="undefined"){
_167.width=_165;
}else{
_167.autoWidth=true;
}
if(_163){
_167.tabPosition="bottom";
}else{
_167.enableTabScroll=true;
}
_167.plain=!_166;
var _168=new Ext.TabPanel(_167);
ColdFusion.objectCache[id]=_168;
return _168;
};
ColdFusion.Layout.getTabLayout=function(_169){
var _16a=ColdFusion.objectCache[_169];
if(!_16a||!(_16a instanceof Ext.TabPanel)){
ColdFusion.handleError(null,"layout.gettablayout.notfound","widget",[_169],null,null,true);
}
return _16a;
};
ColdFusion.Layout.onTabActivate=function(tab){
tab._cf_visible=true;
if(tab._cf_dirtyview){
var _16c=ColdFusion.bindHandlerCache[tab.contentEl];
if(_16c){
_16c();
}
tab._cf_dirtyview=false;
}
var el=Ext.get(tab.contentEl);
el.move("left",1);
el.move("right",1);
};
ColdFusion.Layout.onTabDeactivate=function(tab){
tab._cf_visible=false;
if(tab._cf_refreshOnActivate){
tab._cf_dirtyview=true;
}
};
ColdFusion.Layout.onTabClose=function(tab){
tab._cf_visible=false;
};
ColdFusion.Layout.addTab=function(_170,_171,name,_173,_174,_175,_176,_177,_178){
if(_174!=null&&_174.length==0){
_174=null;
}
var _179=_170.initialConfig.autoHeight;
if(typeof _179=="undefined"){
_179=false;
}
var _17a=new Ext.Panel({title:_173,contentEl:_171,_cf_body:_171,id:name,closable:_175,tabTip:_174,autoScroll:_178,autoShow:true,autoHeight:_179});
var tab=_170.add(_17a);
if(_177){
_17a.setDisabled(true);
}
tab._cf_visible=false;
tab._cf_dirtyview=true;
tab._cf_refreshOnActivate=_176;
tab.addListener("activate",ColdFusion.Layout.onTabActivate);
tab.addListener("deactivate",ColdFusion.Layout.onTabDeactivate);
tab.addListener("close",ColdFusion.Layout.onTabClose);
ColdFusion.objectCache[name]=tab;
var _17c=tab.height;
if(_17c&&_17c>1){
var _17d=document.getElementById(_171);
_17d.style.height=_17c;
}
};
ColdFusion.Layout.enableTab=function(_17e,_17f){
var _180=ColdFusion.objectCache[_17e];
var _181=ColdFusion.objectCache[_17f];
if(_180&&(_180 instanceof Ext.TabPanel)&&_181){
_181.setDisabled(false);
ColdFusion.Log.info("layout.enabletab.enabled","widget",[_17f,_17e]);
}else{
ColdFusion.handleError(null,"layout.enabletab.notfound","widget",[_17e],null,null,true);
}
};
ColdFusion.Layout.disableTab=function(_182,_183){
var _184=ColdFusion.objectCache[_182];
var _185=ColdFusion.objectCache[_183];
if(_184&&(_184 instanceof Ext.TabPanel)&&_185){
_185.setDisabled(true);
ColdFusion.Log.info("layout.disabletab.disabled","widget",[_183,_182]);
}else{
ColdFusion.handleError(null,"layout.disabletab.notfound","widget",[_182],null,null,true);
}
};
ColdFusion.Layout.selectTab=function(_186,_187){
var _188=ColdFusion.objectCache[_186];
var tab=ColdFusion.objectCache[_187];
if(_188&&(_188 instanceof Ext.TabPanel)&&tab){
_188.setActiveTab(tab);
ColdFusion.Log.info("layout.selecttab.selected","widget",[_187,_186]);
}else{
ColdFusion.handleError(null,"layout.selecttab.notfound","widget",[_186],null,null,true);
}
};
ColdFusion.Layout.hideTab=function(_18a,_18b){
var _18c=ColdFusion.objectCache[_18a];
if(_18c&&(_18c instanceof Ext.TabPanel)){
var _18d=ColdFusion.objectCache[_18b];
var _18e=false;
if(_18d){
if(_18c.getActiveTab()&&_18c.getActiveTab().getId()==_18b){
var i;
for(i=0;i<_18c.items.length;i++){
var _190=_18c.getComponent(i);
if(_190.hidden==false){
_18e=true;
_190.show();
break;
}
}
if(_18e==false){
document.getElementById(_18b).style.display="none";
}
}
_18c.hideTabStripItem(_18d);
ColdFusion.Log.info("layout.hidetab.hide","widget",[_18b,_18a]);
}
}else{
ColdFusion.handleError(null,"layout.hidetab.notfound","widget",[_18a],null,null,true);
}
};
ColdFusion.Layout.showTab=function(_191,_192){
var _193=ColdFusion.objectCache[_191];
var _194=ColdFusion.objectCache[_192];
if(_193&&(_193 instanceof Ext.TabPanel)&&_194){
_193.unhideTabStripItem(_194);
ColdFusion.Log.info("layout.showtab.show","widget",[_192,_191]);
}else{
ColdFusion.handleError(null,"layout.showtab.notfound","widget",[_191],null,null,true);
}
};
ColdFusion.Layout.disableSourceBind=function(_195){
var _196=ColdFusion.objectCache[_195];
if(_196==null||_196=="undefined"){
ColdFusion.handleError(null,"layout.disableSourceBind.notfound","widget",[_195],null,null,true);
}
_196._cf_dirtyview=false;
};
ColdFusion.Layout.enableSourceBind=function(_197){
var _198=ColdFusion.objectCache[_197];
if(_198==null||_198=="undefined"){
ColdFusion.handleError(null,"layout.enableSourceBind.notfound","widget",[_197],null,null,true);
}
_198._cf_dirtyview=true;
};
ColdFusion.Layout.createTab=function(_199,_19a,_19b,_19c,_19d){
var _19e=ColdFusion.objectCache[_199];
var _19f=_19a;
if(_199&&typeof (_199)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidname","widget",null,null,null,true);
return;
}
if(!_199||ColdFusion.trim(_199)==""){
ColdFusion.handleError(null,"layout.createtab.emptyname","widget",null,null,null,true);
return;
}
if(_19a&&typeof (_19a)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidareaname","widget",null,null,null,true);
return;
}
if(!_19a||ColdFusion.trim(_19a)==""){
ColdFusion.handleError(null,"layout.createtab.emptyareaname","widget",null,null,null,true);
return;
}
if(_19b&&typeof (_19b)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidtitle","widget",null,null,null,true);
return;
}
if(!_19b||ColdFusion.trim(_19b)==""){
ColdFusion.handleError(null,"layout.createtab.emptytitle","widget",null,null,null,true);
return;
}
if(_19c&&typeof (_19c)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidurl","widget",null,null,null,true);
return;
}
if(!_19c||ColdFusion.trim(_19c)==""){
ColdFusion.handleError(null,"layout.createtab.emptyurl","widget",null,null,null,true);
return;
}
_19a="cf_layoutarea"+_19a;
if(_19e&&(_19e instanceof Ext.TabPanel)){
var _1a0=null;
var ele=document.getElementById(_19a);
if(ele!=null){
ColdFusion.handleError(null,"layout.createtab.duplicateel","widget",[_19a],null,null,true);
return;
}
var _1a2=false;
var _1a3=false;
var _1a4=false;
var _1a5=false;
var _1a6=false;
var _1a7=null;
if((_19e.items.length<=0)){
_1a4=true;
}
if(_19d!=null){
if(typeof (_19d)!="object"){
ColdFusion.handleError(null,"layout.createtab.invalidconfig","widget",null,null,null,true);
return;
}
if(typeof (_19d.closable)!="undefined"&&_19d.closable==true){
_1a2=true;
}
if(typeof (_19d.disabled)!="undefined"&&_19d.disabled==true){
_1a3=true;
}
if(typeof (_19d.selected)!="undefined"&&_19d.selected==true){
_1a4=true;
}
if(typeof (_19d.inithide)!="undefined"&&_19d.inithide==true){
_1a5=true;
}
if(typeof (_19d.tabtip)!="undefined"&&_19d.tabtip!=null){
_1a7=_19d.tabtip;
}
}
var _1a8=document.getElementById(_199);
if(_1a8){
var _1a9=document.getElementById(_199);
var _1aa=document.createElement("div");
_1aa.id=_19a;
_1aa.className="ytab";
if(_19d!=null&&typeof (_19d.align)!="undefined"){
_1aa.align=_19d.align;
}
var _1ab="";
if(_19e.tabheight){
_1ab="height:"+_19e.tabheight+";";
}
if(_19d!=null&&typeof (_19d.style)!="undefined"){
var _1ac=new String(_19d.style);
_1ac=_1ac.toLowerCase();
_1ab=_1ab+_1ac;
}
if(_19d!=null&&typeof (_19d.overflow)!="undefined"){
var _1ad=new String(_19d.overflow);
_1ad=_1ad.toLowerCase();
if(_1ad!="visible"&&_1ad!="auto"&&_1ad!="scroll"&&_1ad!="hidden"){
ColdFusion.handleError(null,"layout.createtab.invalidoverflow","widget",null,null,null,true);
return;
}
if(_1ad.toLocaleLowerCase()==="hidden"){
_1a6=false;
}
_1ab=_1ab+"overflow:"+_1ad+";";
}else{
_1ab=_1ab+"; overflow:auto;";
}
_1aa.style.cssText=_1ab;
_1a9.appendChild(_1aa);
}
ColdFusion.Layout.addTab(_19e,_19a,_19f,_19b,_1a7,_1a2,false,_1a3,_1a6);
ColdFusion.Log.info("layout.createtab.success","http",[_19a,_199]);
if(_1a4==true){
ColdFusion.Layout.selectTab(_199,_19f);
}
if(_1a5==true){
ColdFusion.Layout.hideTab(_199,_19f);
}
if(_19c!=null&&typeof (_19c)!="undefined"&&_19c!=""){
if(_19c.indexOf("?")!=-1){
_19c=_19c+"&";
}else{
_19c=_19c+"?";
}
var _1ae;
var _1af;
if(_19d){
_1ae=_19d.callbackHandler;
_1af=_19d.errorHandler;
}
ColdFusion.Ajax.replaceHTML(_19a,_19c,"GET",null,_1ae,_1af);
}
}else{
ColdFusion.handleError(null,"layout.createtab.notfound","widget",[_199],null,null,true);
}
};
ColdFusion.Layout.getBorderLayout=function(_1b0){
var _1b1=ColdFusion.objectCache[_1b0];
if(!_1b1){
ColdFusion.handleError(null,"layout.getborderlayout.notfound","widget",[_1b0],null,null,true);
}
return _1b1;
};
ColdFusion.Layout.showArea=function(_1b2,_1b3){
var _1b4=ColdFusion.Layout.convertPositionToDirection(_1b3);
var _1b5=ColdFusion.objectCache[_1b2];
var _1b6;
if(_1b5){
var _1b7=_1b5.items;
for(var i=0;i<_1b7.getCount();i++){
var _1b9=_1b7.itemAt(i);
if(_1b9 instanceof Ext.Panel&&_1b9.region==_1b4){
_1b6=_1b9;
break;
}
}
if(_1b6){
_1b6.show();
_1b6.expand();
ColdFusion.Log.info("layout.showarea.shown","widget",[_1b3,_1b2]);
}else{
ColdFusion.handleError(null,"layout.showarea.areanotfound","widget",[_1b3],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.showarea.notfound","widget",[_1b2],null,null,true);
}
};
ColdFusion.Layout.hideArea=function(_1ba,_1bb){
var _1bc=ColdFusion.Layout.convertPositionToDirection(_1bb);
var _1bd=ColdFusion.objectCache[_1ba];
var _1be;
if(_1bd){
var _1bf=_1bd.items;
for(var i=0;i<_1bf.getCount();i++){
var _1c1=_1bf.itemAt(i);
if(_1c1 instanceof Ext.Panel&&_1c1.region==_1bc){
_1be=_1c1;
break;
}
}
if(_1be){
_1be.hide();
ColdFusion.Log.info("layout.hidearea.hidden","widget",[_1bb,_1ba]);
}else{
ColdFusion.handleError(null,"layout.hidearea.areanotfound","widget",[_1bb],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.hidearea.notfound","widget",[_1ba],null,null,true);
}
};
ColdFusion.Layout.collapseArea=function(_1c2,_1c3){
var _1c4=ColdFusion.Layout.convertPositionToDirection(_1c3);
var _1c5=ColdFusion.objectCache[_1c2];
var _1c6;
if(_1c5){
var _1c7=_1c5.items;
for(var i=0;i<_1c7.getCount();i++){
var _1c9=_1c7.itemAt(i);
if(_1c9 instanceof Ext.Panel&&_1c9.region==_1c4){
_1c6=_1c9;
break;
}
}
if(_1c6){
_1c6.collapse(true);
ColdFusion.Log.info("layout.collpasearea.collapsed","widget",[_1c3,_1c2]);
}else{
ColdFusion.handleError(null,"layout.collpasearea.areanotfound","widget",[_1c3],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.collpasearea.notfound","widget",[_1c3],null,null,true);
}
};
ColdFusion.Layout.expandArea=function(_1ca,_1cb){
var _1cc=ColdFusion.Layout.convertPositionToDirection(_1cb);
var _1cd=ColdFusion.objectCache[_1ca];
var _1ce;
if(_1cd){
var _1cf=_1cd.items;
for(var i=0;i<_1cf.getCount();i++){
var _1d1=_1cf.itemAt(i);
if(_1d1 instanceof Ext.Panel&&_1d1.region==_1cc){
_1ce=_1d1;
break;
}
}
if(_1ce){
_1ce.expand();
ColdFusion.Log.info("layout.expandarea.expanded","widget",[_1cb,_1ca]);
}else{
ColdFusion.handleError(null,"layout.expandarea.areanotfound","widget",[_1cb],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.expandarea.notfound","widget",[_1cb],null,null,true);
}
};
ColdFusion.Layout.printObject=function(obj){
var str="";
for(key in obj){
str=str+"  "+key+"=";
value=obj[key];
if(typeof (value)==Object){
value=$G.printObject(value);
}
str+=value;
}
return str;
};
ColdFusion.Layout.InitAccordion=function(_1d4,_1d5,_1d6,_1d7,_1d8,_1d9,_1da,_1db){
var _1dc=false;
if(_1d6.toUpperCase()=="LEFT"){
_1dc=true;
}
if(_1d9==null||typeof (_1d9)=="undefined"){
_1d8=false;
}
var _1dd={activeOnTop:_1d5,collapseFirst:_1dc,titleCollapse:_1d7,fill:_1d8};
var _1de={renderTo:_1d4,layoutConfig:_1dd,items:_1db,layout:"accordion"};
if(_1d9==null||typeof (_1d9)=="undefined"){
_1de.autoHeight=true;
}else{
_1de.height=_1d9;
}
if(_1da==null||typeof (_1da)=="undefined"){
_1de.autoWidth=true;
}else{
_1de.width=_1da;
}
var _1df=new Ext.Panel(_1de);
ColdFusion.objectCache[_1d4]=_1df;
ColdFusion.Log.info("layout.accordion.initialized","widget",[_1d4]);
return _1df;
};
ColdFusion.Layout.InitAccordionChildPanel=function(_1e0,_1e1,_1e2,_1e3,_1e4,_1e5,_1e6,_1e7){
if(_1e2==null||typeof (_1e2)==undefined||_1e2.length==0){
_1e2="  ";
}
var _1e8={contentEl:_1e0,id:_1e1,title:_1e2,collapsible:_1e3,closable:_1e4,animate:true,autoScroll:_1e5,_cf_body:_1e0};
if(_1e6&&typeof _1e6=="string"){
_1e8.iconCls=_1e6;
}
var _1e9=new Ext.Panel(_1e8);
_1e9._cf_visible=false;
_1e9._cf_dirtyview=true;
_1e9._cf_refreshOnActivate=_1e7;
_1e9.on("expand",ColdFusion.Layout.onAccordionPanelExpand,this);
_1e9.on("collapse",ColdFusion.Layout.onAccordionPanelCollapse,this);
_1e9.on("hide",ColdFusion.Layout.onAccordionPanelHide,this);
_1e9.on("show",ColdFusion.Layout.onAccordionPanelExpand,this);
ColdFusion.objectCache[_1e1]=_1e9;
ColdFusion.Log.info("layout.accordion.childinitialized","widget",[_1e1]);
return _1e9;
};
ColdFusion.Layout.getAccordionLayout=function(_1ea){
var _1eb=ColdFusion.objectCache[_1ea];
if(!_1eb||!(_1eb instanceof Ext.Panel)){
ColdFusion.handleError(null,"layout.getaccordionlayout.notfound","widget",[_1ea],null,null,true);
}
return _1eb;
};
ColdFusion.Layout.onAccordionPanelExpand=function(_1ec){
_1ec._cf_visible=true;
if(_1ec._cf_dirtyview){
var _1ed=ColdFusion.bindHandlerCache[_1ec.contentEl];
if(_1ed){
_1ed();
}
_1ec._cf_dirtyview=false;
}
var el=Ext.get(_1ec.contentEl);
el.move("left",1);
el.move("right",1);
};
ColdFusion.Layout.onAccordionPanelCollapse=function(_1ef){
_1ef._cf_visible=false;
if(_1ef._cf_refreshOnActivate){
_1ef._cf_dirtyview=true;
}
};
ColdFusion.Layout.onAccordionPanelHide=function(_1f0){
_1f0._cf_visible=false;
};
ColdFusion.Layout.hideAccordion=function(_1f1,_1f2){
var _1f3=ColdFusion.objectCache[_1f1];
var _1f4=ColdFusion.objectCache[_1f2];
if(!_1f3||!_1f3 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.hideaccordion.layoutnotfound","widget",[_1f1],null,null,true);
}
if(!_1f4||!_1f4 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.hideaccordion.panelnotfound","widget",[_1f2],null,null,true);
}
_1f4.hide();
ColdFusion.Log.info("layout.hideaccordion.hidden","widget",[_1f2,_1f1]);
};
ColdFusion.Layout.showAccordion=function(_1f5,_1f6){
var _1f7=ColdFusion.objectCache[_1f5];
var _1f8=ColdFusion.objectCache[_1f6];
if(!_1f7||!_1f7 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.showaccordion.layoutnotfound","widget",[_1f5],null,null,true);
}
if(!_1f8||!_1f8 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.showaccordion.panelnotfound","widget",[_1f6],null,null,true);
}
_1f8.show();
ColdFusion.Log.info("layout.showaccordion.shown","widget",[_1f6,_1f5]);
};
ColdFusion.Layout.expandAccordion=function(_1f9,_1fa){
var _1fb=ColdFusion.objectCache[_1f9];
var _1fc=ColdFusion.objectCache[_1fa];
if(!_1fb||!_1fb instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.expandaccordion.layoutnotfound","widget",[_1f9],null,null,true);
}
if(!_1fc||!_1fc instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.expandaccordion.panelnotfound","widget",[_1fa],null,null,true);
}
_1fc.expand();
ColdFusion.Log.info("layout.expandaccordion.expanded","widget",[_1fa,_1f9]);
};
ColdFusion.Layout.selectAccordion=function(_1fd,_1fe){
return ColdFusion.Layout.expandAccordion(_1fd,_1fe);
};
ColdFusion.Layout.collapseAccordion=function(_1ff,_200){
var _201=ColdFusion.objectCache[_1ff];
var _202=ColdFusion.objectCache[_200];
if(!_201||!_201 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.collapseaccordion.layoutnotfound","widget",[_1ff],null,null,true);
}
if(!_202||!_202 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.collapseaccordion.panelnotfound","widget",[_200],null,null,true);
}
_202.collapse();
ColdFusion.Log.info("layout.collapseaccordion.collapsed","widget",[_200,_1ff]);
};
ColdFusion.Layout.createAccordionPanel=function(_203,_204,_205,url,_207){
var _208=ColdFusion.objectCache[_203];
var _209=_204;
if(_203&&typeof (_203)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidname","widget",[_203],null,null,true);
return;
}
if(!_203||ColdFusion.trim(_203)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.emptyname","widget",[_203],null,null,true);
return;
}
if(_204&&typeof (_204)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidaccordionpanelname","widget",[_204],null,null,true);
return;
}
if(!_204||ColdFusion.trim(_204)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.emptyaccordionpanelname","widget",[_204],null,null,true);
return;
}
if(_205&&typeof (_205)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitle","widget",[_204],null,null,true);
return;
}
if(!_205||ColdFusion.trim(_205)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitle","widget",[_204],null,null,true);
return;
}
if(url&&typeof (url)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidurl","widget",[_204],null,null,true);
return;
}
if(!url||ColdFusion.trim(url)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidurl","widget",[_204],null,null,true);
return;
}
_204="cf_layoutarea"+_209;
if(_208&&(_208 instanceof Ext.Panel)){
var _20a=null;
var ele=document.getElementById(_204);
if(ele!=null){
ColdFusion.handleError(null,"layout.createaccordionpanel.duplicateel","widget",[_204],null,null,true);
return;
}
var _20c=true;
var _20d;
var _20e=false;
var _20f=null;
if(_207!=null){
if(typeof (_207)!="object"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidconfig","widget",[_204],null,null,true);
return;
}
}
if(_207&&typeof (_207.selected)!="undefined"&&_207.selected==true){
_20e=true;
}
if(_207&&_207.titleicon){
if(typeof _207.titleicon!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitleicon","widget",[_204],null,null,true);
return;
}
var _210=String.format(ACCORDION_TITLE_ICON_CSS_TEMPLATE,_204,_207.titleicon);
Ext.util.CSS.createStyleSheet(_210,_204+"_cf_icon");
_20f=_204;
}
var _211=_208.layoutConfig;
var _212=true;
if(_211&&typeof _211.fill!="undefined"){
_212=_211.fill;
}
if(_207!=null&&typeof (_207.overflow)!="undefined"){
var _20d=new String(_207.overflow);
_20d=_20d.toLowerCase();
if(_20d!="visible"&&_20d!="auto"&&_20d!="scroll"&&_20d!="hidden"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidoverflow","widget",[_204],null,null,true);
return;
}
if(!_212&&(_20d=="auto"||_20d=="scroll")){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidoverflowforfillheight","widget",[_204],null,null,true);
return;
}
if(_20d=="hidden"){
_20c=false;
}
}else{
_20d="auto";
_20c=true;
}
var _213=document.getElementById(_203);
if(_213){
var _214=document.getElementById(_203);
var _215=document.createElement("div");
_215.id=_204;
if(_207!=null&&typeof (_207.align)!="undefined"){
_215.align=_207.align;
}
var _216="";
if(_208.height){
_216="height:"+_208.height+";";
}
if(_207!=null&&typeof (_207.style)!="undefined"){
var _217=new String(_207.style);
_217=_217.toLowerCase();
_216=_216+_217;
}
_216=_216+"overflow:"+_20d+";";
_215.style.cssText=_216;
_214.appendChild(_215);
}
var _218=true;
var _219=true;
itemobj=ColdFusion.Layout.InitAccordionChildPanel(_204,_209,_205,_219,_218,_20c,_20f,false);
_208.add(itemobj);
if(url!=null&&typeof (url)!="undefined"&&url!=""){
if(url.indexOf("?")!=-1){
url=url+"&";
}else{
url=url+"?";
}
var _21a;
var _21b;
if(_207){
_21a=_207.callbackHandler;
_21b=_207.errorHandler;
}
ColdFusion.Ajax.replaceHTML(_204,url,"GET",null,_21a,_21b);
}
_208.doLayout();
if(_20e){
ColdFusion.Layout.expandAccordion(_203,_209);
}
ColdFusion.Log.info("layout.createaccordionpanel.created","widget",[_204]);
}else{
ColdFusion.handleError(null,"layout.createaccordionpanel.layoutnotfound","widget",[_203],null,null,true);
}
};
ColdFusion.Layout.initViewport=function(_21c,item){
var _21e=new Array();
_21e[0]=item;
var _21f={items:_21e,layout:"fit",name:_21c};
var _220=new Ext.Viewport(_21f);
return _220;
};
ColdFusion.Layout.convertPositionToDirection=function(_221){
if(_221.toUpperCase()=="LEFT"){
return "west";
}else{
if(_221.toUpperCase()=="RIGHT"){
return "east";
}else{
if(_221.toUpperCase()=="CENTER"){
return "center";
}else{
if(_221.toUpperCase()=="BOTTOM"){
return "south";
}else{
if(_221.toUpperCase()=="TOP"){
return "north";
}
}
}
}
}
};
