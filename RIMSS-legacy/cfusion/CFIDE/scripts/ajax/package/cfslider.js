/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Slider){
ColdFusion.Slider={};
}
var $SL=ColdFusion.Slider;
ColdFusion.Slider.init=function(_3c0,name,_3c2,_3c3,_3c4,_3c5,_3c6,_3c7,_3c8,_3c9,tip,_3cb,_3cc){
var _3cd={renderTo:_3c0,id:name};
if(_3c8!=null&&typeof (_3c8)!="undefined"){
_3cd.ClicktoChange=_3c8;
}else{
_3cd.ClicktoChange=false;
}
if(_3c9!=null&&typeof (_3c9)!="undefined"){
_3cd.increment=_3c9;
}else{
_3cd.increment=1;
}
if(_3c6!=null&&typeof (_3c6)!=undefined){
_3cd.minValue=_3c6;
}else{
_3cd.minValue=0;
}
if(_3c5!=null&&typeof (_3c5)!=undefined){
_3cd.value=_3c5;
}else{
_3cd.value=_3cd.minValue;
}
if(_3c3!=null&&typeof (_3c3)!=undefined){
_3cd.width=_3c3;
}else{
_3cd.width=200;
}
if(_3c4!=null&&typeof (_3c4)!="undefined"){
_3cd.height=_3c4;
}else{
_3cd.height=100;
}
if(_3c7!=null&&typeof (_3c7)!=undefined){
_3cd.maxValue=_3c7;
}else{
_3cd.maxValue=100;
}
if(_3c2!=null&&typeof (_3c2)!=undefined){
_3cd.vertical=_3c2;
}else{
_3cd.vertical=false;
}
if(_3cb!=null&&typeof (_3cb)=="function"){
_3cd.onChange=_3cb;
}
if(_3cc!=null&&typeof (_3cc)!="undefined"){
_3cd.onDrg=_3cc;
}
Ext.ux.ST=Ext.extend(Ext.Tip,{minWidth:10,offsets:[0,-10],init:function(_3ce){
_3ce.on("dragstart",this.onSlide,this);
_3ce.on("drag",this.onSlide,this);
_3ce.on("dragend",this.hide,this);
_3ce.on("destroy",this.destroy,this);
},onSlide:function(_3cf){
this.show();
this.body.update(this.getText(_3cf));
this.el.alignTo(_3cf.thumb,"b-t?",this.offsets);
this.doAutoWidth();
},getText:function(_3d0){
return _3d0.getValue()==0?"0":_3d0.getValue();
}});
if(tip!=null&&typeof (tip)!="undefined"){
if(tip){
_3cd.plugins=new Ext.ux.ST();
}
}
var _3d1=new Ext.Slider(_3cd);
_3d1.on("drag",$SL.onDragHandler,_3cd);
_3d1.on("changecomplete",$SL.onChangeHandler,_3cd);
_3cd.sliderComp=_3d1;
ColdFusion.objectCache[name]=_3cd;
ColdFusion.Log.info("slider.initialized","widget",[name]);
};
$SL.onDragHandler=function(_3d2,_3d3){
var _3d4=this.onDrg;
if(_3d4!=null&&typeof (_3d4)=="function"){
_3d4.call(this,_3d2,_3d3);
}
};
$SL.onChangeHandler=function(_3d5,_3d6){
var _3d7=this.onChange;
if(_3d7!=null&&typeof (_3d7)=="function"){
_3d7.call(this,_3d5,_3d6);
}
};
$SL.getValue=function(_3d8){
var _3d9=ColdFusion.objectCache[_3d8];
if(_3d9!=null||typeof (_3d9)!="undefined"){
var _3da=_3d9.sliderComp;
if(_3da){
return _3da.getValue();
}
}else{
ColdFusion.handleError(null,"slider.getvalue.notfound","widget",[_3d8],null,null,true);
}
};
$SL.getSliderObject=function(_3db){
var _3dc=ColdFusion.objectCache[_3db];
if(_3dc!=null||typeof (_3dc)!="undefined"){
return _3dc.sliderComp;
}else{
return null;
}
};
$SL.setValue=function(_3dd,_3de){
var _3df=ColdFusion.objectCache[_3dd];
if(_3df!=null||typeof (_3df)!="undefined"){
var _3e0=_3df.sliderComp;
if(_3e0){
return _3e0.setValue(_3de,true);
}
}else{
ColdFusion.handleError(null,"slider.setvalue.notfound","widget",[_3dd],null,null,true);
}
};
$SL.show=function(_3e1){
var _3e2=ColdFusion.objectCache[_3e1];
if(_3e2!=null||typeof (_3e2)!="undefined"){
var _3e3=_3e2.sliderComp;
if(_3e3){
return _3e3.show();
}
}else{
ColdFusion.handleError(null,"slider.show.notfound","widget",[_3e1],null,null,true);
}
ColdFusion.Log.info("slider.show.shown","widget",[_3e1]);
};
$SL.hide=function(_3e4){
var _3e5=ColdFusion.objectCache[_3e4];
if(_3e5!=null||typeof (_3e5)!="undefined"){
var _3e6=_3e5.sliderComp;
if(_3e6){
return _3e6.hide();
}
}else{
ColdFusion.handleError(null,"slider.hide.notfound","widget",[_3e4],null,null,true);
}
ColdFusion.Log.info("slider.hide.hidden","widget",[_3e4]);
};
$SL.enable=function(_3e7){
var _3e8=ColdFusion.objectCache[_3e7];
if(_3e8!=null||typeof (_3e8)!="undefined"){
var _3e9=_3e8.sliderComp;
if(_3e9){
return _3e9.enable();
}
}else{
ColdFusion.handleError(null,"slider.enable.notfound","widget",[_3e7],null,null,true);
}
ColdFusion.Log.info("slider.enable.enabled","widget",[_3e7]);
};
$SL.disable=function(_3ea){
var _3eb=ColdFusion.objectCache[_3ea];
if(_3eb!=null||typeof (_3eb)!="undefined"){
var _3ec=_3eb.sliderComp;
if(_3ec){
return _3ec.disable();
}
}else{
ColdFusion.handleError(null,"slider.disable.notfound","widget",[_3ea],null,null,true);
}
ColdFusion.Log.info("slider.disable.disabled","widget",[_3ea]);
};
