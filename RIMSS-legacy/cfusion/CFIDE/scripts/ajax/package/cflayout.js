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
if(!ColdFusion.MapVsAccordion){
ColdFusion.MapVsAccordion={};
}
ColdFusion.Layout.initializeTabLayout=function(id,_b,_c,_d,_e){
Ext.QuickTips.init();
var _f;
if(_c){
_f={renderTo:id,height:_c};
}else{
_f={renderTo:id,autoHeight:true};
}
if(_d&&_d!="undefined"){
_f.width=_d;
}else{
_f.autoWidth=true;
}
if(_b){
_f.tabPosition="bottom";
}else{
_f.enableTabScroll=true;
}
_f.plain=!_e;
var _10=new Ext.TabPanel(_f);
ColdFusion.objectCache[id]=_10;
return _10;
};
ColdFusion.Layout.getTabLayout=function(_11){
var _12=ColdFusion.objectCache[_11];
if(!_12||!(_12 instanceof Ext.TabPanel)){
ColdFusion.handleError(null,"layout.gettablayout.notfound","widget",[_11],null,null,true);
}
return _12;
};
ColdFusion.Layout.onTabActivate=function(tab){
tab._cf_visible=true;
if(tab._cf_dirtyview){
var _14=ColdFusion.bindHandlerCache[tab.contentEl];
if(_14){
_14();
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
ColdFusion.Layout.addTab=function(_18,_19,_1a,_1b,_1c,_1d,_1e,_1f,_20){
if(_1c!=null&&_1c.length==0){
_1c=null;
}
var _21=_18.initialConfig.autoHeight;
if(typeof _21=="undefined"){
_21=false;
}
var _22=new Ext.Panel({title:_1b,contentEl:_19,_cf_body:_19,id:_1a,closable:_1d,tabTip:_1c,autoScroll:_20,autoShow:true,autoHeight:_21});
var tab=_18.add(_22);
if(_1f){
_22.setDisabled(true);
}
tab._cf_visible=false;
tab._cf_dirtyview=true;
tab._cf_refreshOnActivate=_1e;
tab.addListener("activate",ColdFusion.Layout.onTabActivate);
tab.addListener("deactivate",ColdFusion.Layout.onTabDeactivate);
tab.addListener("close",ColdFusion.Layout.onTabClose);
ColdFusion.objectCache[_1a]=tab;
var _24=tab.height;
if(_24&&_24>1){
var _25=document.getElementById(_19);
_25.style.height=_24;
}
};
ColdFusion.Layout.enableTab=function(_26,_27){
var _28=ColdFusion.objectCache[_26];
var _29=ColdFusion.objectCache[_27];
if(_28&&(_28 instanceof Ext.TabPanel)&&_29){
_29.setDisabled(false);
ColdFusion.Log.info("layout.enabletab.enabled","widget",[_27,_26]);
}else{
ColdFusion.handleError(null,"layout.enabletab.notfound","widget",[_26],null,null,true);
}
};
ColdFusion.Layout.disableTab=function(_2a,_2b){
var _2c=ColdFusion.objectCache[_2a];
var _2d=ColdFusion.objectCache[_2b];
if(_2c&&(_2c instanceof Ext.TabPanel)&&_2d){
_2d.setDisabled(true);
ColdFusion.Log.info("layout.disabletab.disabled","widget",[_2b,_2a]);
}else{
ColdFusion.handleError(null,"layout.disabletab.notfound","widget",[_2a],null,null,true);
}
};
ColdFusion.Layout.selectTab=function(_2e,_2f){
var _30=ColdFusion.objectCache[_2e];
var tab=ColdFusion.objectCache[_2f];
if(_30&&(_30 instanceof Ext.TabPanel)&&tab){
_30.setActiveTab(tab);
ColdFusion.Log.info("layout.selecttab.selected","widget",[_2f,_2e]);
}else{
ColdFusion.handleError(null,"layout.selecttab.notfound","widget",[_2e],null,null,true);
}
};
ColdFusion.Layout.hideTab=function(_32,_33){
var _34=ColdFusion.objectCache[_32];
if(_34&&(_34 instanceof Ext.TabPanel)){
var _35=ColdFusion.objectCache[_33];
var _36=false;
if(_35){
if(_34.getActiveTab()&&_34.getActiveTab().getId()==_33){
var i;
for(i=0;i<_34.items.length;i++){
var _38=_34.getComponent(i);
if(_38.hidden==false){
_36=true;
_38.show();
break;
}
}
if(_36==false){
document.getElementById(_33).style.display="none";
}
}
_34.hideTabStripItem(_35);
ColdFusion.Log.info("layout.hidetab.hide","widget",[_33,_32]);
}
}else{
ColdFusion.handleError(null,"layout.hidetab.notfound","widget",[_32],null,null,true);
}
};
ColdFusion.Layout.showTab=function(_39,_3a){
var _3b=ColdFusion.objectCache[_39];
var _3c=ColdFusion.objectCache[_3a];
if(_3b&&(_3b instanceof Ext.TabPanel)&&_3c){
_3b.unhideTabStripItem(_3c);
ColdFusion.Log.info("layout.showtab.show","widget",[_3a,_39]);
}else{
ColdFusion.handleError(null,"layout.showtab.notfound","widget",[_39],null,null,true);
}
};
ColdFusion.Layout.disableSourceBind=function(_3d){
var _3e=ColdFusion.objectCache[_3d];
if(_3e==null||_3e=="undefined"){
ColdFusion.handleError(null,"layout.disableSourceBind.notfound","widget",[_3d],null,null,true);
}
_3e._cf_dirtyview=false;
};
ColdFusion.Layout.enableSourceBind=function(_3f){
var _40=ColdFusion.objectCache[_3f];
if(_40==null||_40=="undefined"){
ColdFusion.handleError(null,"layout.enableSourceBind.notfound","widget",[_3f],null,null,true);
}
_40._cf_dirtyview=true;
};
ColdFusion.Layout.createTab=function(_41,_42,_43,_44,_45){
var _46=ColdFusion.objectCache[_41];
var _47=_42;
if(_41&&typeof (_41)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidname","widget",null,null,null,true);
return;
}
if(!_41||ColdFusion.trim(_41)==""){
ColdFusion.handleError(null,"layout.createtab.emptyname","widget",null,null,null,true);
return;
}
if(_42&&typeof (_42)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidareaname","widget",null,null,null,true);
return;
}
if(!_42||ColdFusion.trim(_42)==""){
ColdFusion.handleError(null,"layout.createtab.emptyareaname","widget",null,null,null,true);
return;
}
if(_43&&typeof (_43)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidtitle","widget",null,null,null,true);
return;
}
if(!_43||ColdFusion.trim(_43)==""){
ColdFusion.handleError(null,"layout.createtab.emptytitle","widget",null,null,null,true);
return;
}
if(_44&&typeof (_44)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidurl","widget",null,null,null,true);
return;
}
if(!_44||ColdFusion.trim(_44)==""){
ColdFusion.handleError(null,"layout.createtab.emptyurl","widget",null,null,null,true);
return;
}
_42="cf_layoutarea"+_42;
if(_46&&(_46 instanceof Ext.TabPanel)){
var _48=null;
var ele=document.getElementById(_42);
if(ele!=null){
ColdFusion.handleError(null,"layout.createtab.duplicateel","widget",[_42],null,null,true);
return;
}
var _4a=false;
var _4b=false;
var _4c=false;
var _4d=false;
var _4e=false;
var _4f=null;
if((_46.items.length<=0)){
_4c=true;
}
if(_45!=null){
if(typeof (_45)!="object"){
ColdFusion.handleError(null,"layout.createtab.invalidconfig","widget",null,null,null,true);
return;
}
if(typeof (_45.closable)!="undefined"&&_45.closable==true){
_4a=true;
}
if(typeof (_45.disabled)!="undefined"&&_45.disabled==true){
_4b=true;
}
if(typeof (_45.selected)!="undefined"&&_45.selected==true){
_4c=true;
}
if(typeof (_45.inithide)!="undefined"&&_45.inithide==true){
_4d=true;
}
if(typeof (_45.tabtip)!="undefined"&&_45.tabtip!=null){
_4f=_45.tabtip;
}
}
var _50=document.getElementById(_41);
if(_50){
var _51=document.getElementById(_41);
var _52=document.createElement("div");
_52.id=_42;
_52.className="ytab";
if(_45!=null&&typeof (_45.align)!="undefined"){
_52.align=_45.align;
}
var _53="";
if(_46.tabheight){
_53="height:"+_46.tabheight+";";
}
if(_45!=null&&typeof (_45.style)!="undefined"){
var _54=new String(_45.style);
_54=_54.toLowerCase();
_53=_53+_54;
}
if(_45!=null&&typeof (_45.overflow)!="undefined"){
var _55=new String(_45.overflow);
_55=_55.toLowerCase();
if(_55!="visible"&&_55!="auto"&&_55!="scroll"&&_55!="hidden"){
ColdFusion.handleError(null,"layout.createtab.invalidoverflow","widget",null,null,null,true);
return;
}
if(_55.toLocaleLowerCase()==="hidden"){
_4e=false;
}
_53=_53+"overflow:"+_55+";";
}else{
_53=_53+"; overflow:auto;";
}
_52.style.cssText=_53;
_51.appendChild(_52);
}
ColdFusion.Layout.addTab(_46,_42,_47,_43,_4f,_4a,false,_4b,_4e);
ColdFusion.Log.info("layout.createtab.success","http",[_42,_41]);
if(_4c==true){
ColdFusion.Layout.selectTab(_41,_47);
}
if(_4d==true){
ColdFusion.Layout.hideTab(_41,_47);
}
if(_44!=null&&typeof (_44)!="undefined"&&_44!=""){
if(_44.indexOf("?")!=-1){
_44=_44+"&";
}else{
_44=_44+"?";
}
var _56;
var _57;
if(_45){
_56=_45.callbackHandler;
_57=_45.errorHandler;
}
ColdFusion.Ajax.replaceHTML(_42,_44,"GET",null,_56,_57);
}
}else{
ColdFusion.handleError(null,"layout.createtab.notfound","widget",[_41],null,null,true);
}
};
ColdFusion.Layout.getBorderLayout=function(_58){
var _59=ColdFusion.objectCache[_58];
if(!_59){
ColdFusion.handleError(null,"layout.getborderlayout.notfound","widget",[_58],null,null,true);
}
return _59;
};
ColdFusion.Layout.showArea=function(_5a,_5b){
var _5c=ColdFusion.Layout.convertPositionToDirection(_5b);
var _5d=ColdFusion.objectCache[_5a];
var _5e;
if(_5d){
var _5f=_5d.items;
for(var i=0;i<_5f.getCount();i++){
var _61=_5f.itemAt(i);
if(_61 instanceof Ext.Panel&&_61.region==_5c){
_5e=_61;
break;
}
}
if(_5e){
_5e.show();
_5e.expand();
ColdFusion.Log.info("layout.showarea.shown","widget",[_5b,_5a]);
}else{
ColdFusion.handleError(null,"layout.showarea.areanotfound","widget",[_5b],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.showarea.notfound","widget",[_5a],null,null,true);
}
};
ColdFusion.Layout.hideArea=function(_62,_63){
var _64=ColdFusion.Layout.convertPositionToDirection(_63);
var _65=ColdFusion.objectCache[_62];
var _66;
if(_65){
var _67=_65.items;
for(var i=0;i<_67.getCount();i++){
var _69=_67.itemAt(i);
if(_69 instanceof Ext.Panel&&_69.region==_64){
_66=_69;
break;
}
}
if(_66){
_66.hide();
ColdFusion.Log.info("layout.hidearea.hidden","widget",[_63,_62]);
}else{
ColdFusion.handleError(null,"layout.hidearea.areanotfound","widget",[_63],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.hidearea.notfound","widget",[_62],null,null,true);
}
};
ColdFusion.Layout.collapseArea=function(_6a,_6b){
var _6c=ColdFusion.Layout.convertPositionToDirection(_6b);
var _6d=ColdFusion.objectCache[_6a];
var _6e;
if(_6d){
var _6f=_6d.items;
for(var i=0;i<_6f.getCount();i++){
var _71=_6f.itemAt(i);
if(_71 instanceof Ext.Panel&&_71.region==_6c){
_6e=_71;
break;
}
}
if(_6e){
_6e.collapse(true);
ColdFusion.Log.info("layout.collpasearea.collapsed","widget",[_6b,_6a]);
}else{
ColdFusion.handleError(null,"layout.collpasearea.areanotfound","widget",[_6b],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.collpasearea.notfound","widget",[_6b],null,null,true);
}
};
ColdFusion.Layout.expandArea=function(_72,_73){
var _74=ColdFusion.Layout.convertPositionToDirection(_73);
var _75=ColdFusion.objectCache[_72];
var _76;
if(_75){
var _77=_75.items;
for(var i=0;i<_77.getCount();i++){
var _79=_77.itemAt(i);
if(_79 instanceof Ext.Panel&&_79.region==_74){
_76=_79;
break;
}
}
if(_76){
_76.expand();
ColdFusion.Log.info("layout.expandarea.expanded","widget",[_73,_72]);
}else{
ColdFusion.handleError(null,"layout.expandarea.areanotfound","widget",[_73],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.expandarea.notfound","widget",[_73],null,null,true);
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
ColdFusion.Layout.InitAccordion=function(_7c,_7d,_7e,_7f,_80,_81,_82,_83){
var _84=false;
if(_7e.toUpperCase()=="LEFT"){
_84=true;
}
if(_81==null||typeof (_81)=="undefined"){
_80=false;
}
var _85={activeOnTop:_7d,collapseFirst:_84,titleCollapse:_7f,fill:_80};
var _86={renderTo:_7c,layoutConfig:_85,items:_83,layout:"accordion"};
if(_81==null||typeof (_81)=="undefined"){
_86.autoHeight=true;
}else{
_86.height=_81;
}
if(_82==null||typeof (_82)=="undefined"){
_86.autoWidth=true;
}else{
_86.width=_82;
}
var _87=new Ext.Panel(_86);
ColdFusion.objectCache[_7c]=_87;
ColdFusion.Log.info("layout.accordion.initialized","widget",[_7c]);
return _87;
};
ColdFusion.Layout.InitAccordionChildPanel=function(_88,_89,_8a,_8b,_8c,_8d,_8e,_8f){
if(_8a==null||typeof (_8a)==undefined||_8a.length==0){
_8a="  ";
}
var _90={contentEl:_88,id:_89,title:_8a,collapsible:_8b,closable:_8c,animate:true,autoScroll:_8d,_cf_body:_88};
if(_8e&&typeof _8e=="string"){
_90.iconCls=_8e;
}
var _91=new Ext.Panel(_90);
_91._cf_visible=false;
_91._cf_dirtyview=true;
_91._cf_refreshOnActivate=_8f;
_91.on("expand",ColdFusion.Layout.onAccordionPanelExpand,this);
_91.on("collapse",ColdFusion.Layout.onAccordionPanelCollapse,this);
_91.on("hide",ColdFusion.Layout.onAccordionPanelHide,this);
_91.on("show",ColdFusion.Layout.onAccordionPanelExpand,this);
ColdFusion.objectCache[_89]=_91;
ColdFusion.Log.info("layout.accordion.childinitialized","widget",[_89]);
return _91;
};
ColdFusion.Layout.getAccordionLayout=function(_92){
var _93=ColdFusion.objectCache[_92];
if(!_93||!(_93 instanceof Ext.Panel)){
ColdFusion.handleError(null,"layout.getaccordionlayout.notfound","widget",[_92],null,null,true);
}
return _93;
};
ColdFusion.Layout.onAccordionPanelExpand=function(_94){
_94._cf_visible=true;
if(_94._cf_dirtyview){
var _95=ColdFusion.bindHandlerCache[_94.contentEl];
if(_95){
_95();
}
_94._cf_dirtyview=false;
}
var el=Ext.get(_94.contentEl);
el.move("left",1);
el.move("right",1);
var _97=ColdFusion.MapVsAccordion[_94._cf_body];
if(_97!=undefined){
var _98=$MAP.getMapPanelObject(_97);
if(_98!=undefined){
if(_98.initShow===true){
$MAP.show(_97);
}
}
}
};
ColdFusion.Layout.onAccordionPanelCollapse=function(_99){
_99._cf_visible=false;
if(_99._cf_refreshOnActivate){
_99._cf_dirtyview=true;
}
};
ColdFusion.Layout.onAccordionPanelHide=function(_9a){
_9a._cf_visible=false;
};
ColdFusion.Layout.hideAccordion=function(_9b,_9c){
var _9d=ColdFusion.objectCache[_9b];
var _9e=ColdFusion.objectCache[_9c];
if(!_9d||!_9d instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.hideaccordion.layoutnotfound","widget",[_9b],null,null,true);
}
if(!_9e||!_9e instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.hideaccordion.panelnotfound","widget",[_9c],null,null,true);
}
_9e.hide();
ColdFusion.Log.info("layout.hideaccordion.hidden","widget",[_9c,_9b]);
};
ColdFusion.Layout.showAccordion=function(_9f,_a0){
var _a1=ColdFusion.objectCache[_9f];
var _a2=ColdFusion.objectCache[_a0];
if(!_a1||!_a1 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.showaccordion.layoutnotfound","widget",[_9f],null,null,true);
}
if(!_a2||!_a2 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.showaccordion.panelnotfound","widget",[_a0],null,null,true);
}
_a2.show();
ColdFusion.Log.info("layout.showaccordion.shown","widget",[_a0,_9f]);
};
ColdFusion.Layout.expandAccordion=function(_a3,_a4){
var _a5=ColdFusion.objectCache[_a3];
var _a6=ColdFusion.objectCache[_a4];
if(!_a5||!_a5 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.expandaccordion.layoutnotfound","widget",[_a3],null,null,true);
}
if(!_a6||!_a6 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.expandaccordion.panelnotfound","widget",[_a4],null,null,true);
}
_a6.expand();
ColdFusion.Log.info("layout.expandaccordion.expanded","widget",[_a4,_a3]);
};
ColdFusion.Layout.selectAccordion=function(_a7,_a8){
return ColdFusion.Layout.expandAccordion(_a7,_a8);
};
ColdFusion.Layout.collapseAccordion=function(_a9,_aa){
var _ab=ColdFusion.objectCache[_a9];
var _ac=ColdFusion.objectCache[_aa];
if(!_ab||!_ab instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.collapseaccordion.layoutnotfound","widget",[_a9],null,null,true);
}
if(!_ac||!_ac instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.collapseaccordion.panelnotfound","widget",[_aa],null,null,true);
}
_ac.collapse();
ColdFusion.Log.info("layout.collapseaccordion.collapsed","widget",[_aa,_a9]);
};
ColdFusion.Layout.createAccordionPanel=function(_ad,_ae,_af,url,_b1){
var _b2=ColdFusion.objectCache[_ad];
var _b3=_ae;
if(_ad&&typeof (_ad)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidname","widget",[_ad],null,null,true);
return;
}
if(!_ad||ColdFusion.trim(_ad)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.emptyname","widget",[_ad],null,null,true);
return;
}
if(_ae&&typeof (_ae)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidaccordionpanelname","widget",[_ae],null,null,true);
return;
}
if(!_ae||ColdFusion.trim(_ae)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.emptyaccordionpanelname","widget",[_ae],null,null,true);
return;
}
if(_af&&typeof (_af)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitle","widget",[_ae],null,null,true);
return;
}
if(!_af||ColdFusion.trim(_af)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitle","widget",[_ae],null,null,true);
return;
}
if(url&&typeof (url)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidurl","widget",[_ae],null,null,true);
return;
}
if(!url||ColdFusion.trim(url)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidurl","widget",[_ae],null,null,true);
return;
}
_ae="cf_layoutarea"+_b3;
if(_b2&&(_b2 instanceof Ext.Panel)){
var _b4=null;
var ele=document.getElementById(_ae);
if(ele!=null){
ColdFusion.handleError(null,"layout.createaccordionpanel.duplicateel","widget",[_ae],null,null,true);
return;
}
var _b6=true;
var _b7;
var _b8=false;
var _b9=null;
if(_b1!=null){
if(typeof (_b1)!="object"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidconfig","widget",[_ae],null,null,true);
return;
}
}
if(_b1&&typeof (_b1.selected)!="undefined"&&_b1.selected==true){
_b8=true;
}
if(_b1&&_b1.titleicon){
if(typeof _b1.titleicon!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitleicon","widget",[_ae],null,null,true);
return;
}
var _ba=String.format(ACCORDION_TITLE_ICON_CSS_TEMPLATE,_ae,_b1.titleicon);
Ext.util.CSS.createStyleSheet(_ba,_ae+"_cf_icon");
_b9=_ae;
}
var _bb=_b2.layoutConfig;
var _bc=true;
if(_bb&&typeof _bb.fill!="undefined"){
_bc=_bb.fill;
}
if(_b1!=null&&typeof (_b1.overflow)!="undefined"){
var _b7=new String(_b1.overflow);
_b7=_b7.toLowerCase();
if(_b7!="visible"&&_b7!="auto"&&_b7!="scroll"&&_b7!="hidden"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidoverflow","widget",[_ae],null,null,true);
return;
}
if(!_bc&&(_b7=="auto"||_b7=="scroll")){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidoverflowforfillheight","widget",[_ae],null,null,true);
return;
}
if(_b7=="hidden"){
_b6=false;
}
}else{
_b7="auto";
_b6=true;
}
var _bd=document.getElementById(_ad);
if(_bd){
var _be=document.getElementById(_ad);
var _bf=document.createElement("div");
_bf.id=_ae;
if(_b1!=null&&typeof (_b1.align)!="undefined"){
_bf.align=_b1.align;
}
var _c0="";
if(_b2.height){
_c0="height:"+_b2.height+";";
}
if(_b1!=null&&typeof (_b1.style)!="undefined"){
var _c1=new String(_b1.style);
_c1=_c1.toLowerCase();
_c0=_c0+_c1;
}
_c0=_c0+"overflow:"+_b7+";";
_bf.style.cssText=_c0;
_be.appendChild(_bf);
}
var _c2=true;
var _c3=true;
itemobj=ColdFusion.Layout.InitAccordionChildPanel(_ae,_b3,_af,_c3,_c2,_b6,_b9,false);
_b2.add(itemobj);
if(url!=null&&typeof (url)!="undefined"&&url!=""){
if(url.indexOf("?")!=-1){
url=url+"&";
}else{
url=url+"?";
}
var _c4;
var _c5;
if(_b1){
_c4=_b1.callbackHandler;
_c5=_b1.errorHandler;
}
ColdFusion.Ajax.replaceHTML(_ae,url,"GET",null,_c4,_c5);
}
_b2.doLayout();
if(_b8){
ColdFusion.Layout.expandAccordion(_ad,_b3);
}
ColdFusion.Log.info("layout.createaccordionpanel.created","widget",[_ae]);
}else{
ColdFusion.handleError(null,"layout.createaccordionpanel.layoutnotfound","widget",[_ad],null,null,true);
}
};
ColdFusion.Layout.initViewport=function(_c6,_c7){
var _c8=new Array();
_c8[0]=_c7;
var _c9={items:_c8,layout:"fit",name:_c6};
var _ca=new Ext.Viewport(_c9);
return _ca;
};
ColdFusion.Layout.convertPositionToDirection=function(_cb){
if(_cb.toUpperCase()=="LEFT"){
return "west";
}else{
if(_cb.toUpperCase()=="RIGHT"){
return "east";
}else{
if(_cb.toUpperCase()=="CENTER"){
return "center";
}else{
if(_cb.toUpperCase()=="BOTTOM"){
return "south";
}else{
if(_cb.toUpperCase()=="TOP"){
return "north";
}
}
}
}
}
};
ColdFusion.Layout.addMapInAccordionMapping=function(_cc,map){
ColdFusion.MapVsAccordion[_cc]=map;
};
