/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.MediaPlayer){
ColdFusion.MediaPlayer={};
}
var $MP=ColdFusion.MediaPlayer;
$MP.defaultSWFLocation=_cf_ajaxscriptsrc+"/resources/cf/assets/StrobeMediaPlayback.swf",$MP.defaultOptions={swf:$MP.defaultSWFLocation,width:480,height:275,src:"",javascriptControls:true,playButtonOverlay:true,loop:false,autoPlay:false,controlBarMode:"docked",javascriptCallbackFunction:"triggerHandler"};
$MP.playerMap={};
$MP.playerWrapperMap={};
$MP.playerOptionsMap={};
$MP.jsFunctionMap={};
$MP.titleDataMap={};
$MP.videoMonitorMap={};
$MP.bindInfoMap={};
$MP.bindElements={};
$MP.baseURI;
$MP.fancyBoxLeftBorderOffset=5;
$MP.fancyBoxBottonBorderOffset=6;
$MP.hasHTML5VideoPlaybackSupport=!!document.createElement("video").canPlayType;
String.prototype.trim=function(){
return this.replace(/^\s+|\s+$/g,"");
};
ColdFusion.MediaPlayer.init=function(_6a0){
var _6a1=$MP.defaultOptions;
_6a1.id=_6a0.id;
var _6a2={};
var _6a3={};
var _6a4={};
var _6a5=null;
var _6a6={onStart:null,onComplete:null,onPause:null,onError:null,onLoad:null,onStartCallback:playbackStart,onPauseCallback:playbackPause};
if(_6a0.width!=null&&typeof (_6a0.width)!="undefined"){
_6a1.width=_6a0.width;
}else{
_6a1.width=480;
}
if(_6a0.height!=null&&typeof (_6a0.height)!="undefined"){
_6a1.height=_6a0.height;
}else{
_6a1.height=275;
}
if(_6a0.baseURI!=null){
$MP.baseURI=_6a0.baseURI;
}
if(_6a0.src!=null&&_6a0.src!=""){
_6a1.src=resolveSource(_6a0.src);
}else{
_6a1.src="";
}
if(_6a0.PosterImage!=null&&_6a0.PosterImage!=""){
_6a1.poster=resolveSource(_6a0.PosterImage);
}else{
_6a1.poster="";
}
if(_6a0.javascriptControls==null){
_6a1.javascriptControls=true;
}
if(_6a0.playButtonOverlay==null){
_6a1.playButtonOverlay=true;
}
if(_6a0.repeat!=null){
if(_6a0.repeat=="true"){
_6a1.loop=true;
}else{
_6a1.loop=false;
}
}else{
_6a1.loop=false;
}
if(_6a0.autoPlay!=null){
if(_6a0.autoPlay=="true"){
_6a1.autoPlay=true;
}else{
_6a1.autoPlay=false;
}
}else{
_6a1.autoPlay=false;
}
if(_6a0.bgcolor!=null){
_6a1.backgroundColor=_6a0.bgcolor;
_6a3.bgColor=_6a0.bgcolor;
}
if(_6a0.controlbar!=null){
if(_6a0.controlbar==false){
_6a1.controlBarMode="none";
}else{
_6a1.controlBarMode="docked";
}
}
if(_6a0.skin!=null){
_6a1.skin=resolveSource(_6a0.skin);
}else{
_6a1.skin="";
}
if(_6a0.onComplete!=null){
_6a6.onComplete=_6a0.onComplete;
}
if(_6a0.onLoad!=null){
_6a6.onLoad=_6a0.onLoad;
}
if(_6a0.onStart!=null){
_6a6.onStart=_6a0.onStart;
}
if(_6a0.onPause!=null){
_6a6.onPause=_6a0.onPause;
}
if(_6a0.onError!=null){
_6a6.onError=_6a0.onError;
}
if(_6a0.onBind!=null){
_6a6.onBind=_6a0.onBind;
}
if(_6a0.hideTitle!=null){
_6a2.hideTitle=_6a0.hideTitle;
}
if(_6a0.title!=null){
_6a2.title=_6a0.title;
}
if(_6a0.title_text_color!=null){
_6a2.title_text_color=_6a0.title_text_color;
}
if(_6a0.title_bgcolor!=null){
_6a2.title_bgcolor=_6a0.title_bgcolor;
}
if(_6a0.border_left!=null){
_6a3.border_left=_6a0.border_left;
}
if(_6a0.border_right!=null){
_6a3.border_right=_6a0.border_right;
}
if(_6a0.border_top!=null){
_6a3.border_top=_6a0.border_top;
}
if(_6a0.border_bottom!=null){
_6a3.border_bottom=_6a0.border_bottom;
}
if(_6a0.progress_color!=null){
_6a4.progress_color=_6a0.progress_color;
}
if(_6a0.progress_bgcolor!=null){
_6a4.progress_bgcolor=_6a0.progress_bgcolor;
}
if(_6a0.controls_color!=null){
_6a4.controls_color=_6a0.controls_color;
}
if(_6a0.controlbar_bgcolor!=null){
_6a4.controlbar_bgcolor=_6a0.controlbar_bgcolor;
}
if(!_6a1.javascriptControls){
$(".strobeMediaPlaybackControlBar,.smp-error,.playoverlay").show();
}
if(_6a0.bindData!=null&&_6a0.bindData!="undefined"){
_6a5=$.extend(true,{},_6a1);
handleBindingMediaPlayer(_6a5,_6a0.bindData,_6a0.type,_6a6);
return;
}
handleWmode(_6a0,_6a1);
playerInitialization(_6a1,_6a0.type,_6a6,_6a2,_6a3,_6a4);
};
function handleWmode(_6a7,_6a8){
if(navigator.platform.indexOf("Linux")!=-1){
_6a8.wmode="direct";
return;
}
if(_6a7.wmode!=null){
_6a8.wmode=_6a7.wmode;
}else{
_6a8.wmode="direct";
}
var _6a9=document.getElementById(_6a8.id+"_"+"videoTitle");
if((_6a9!==null&&(_6a7.hideTitle==null||_6a7.hideTitle==false))||(_6a8.backgroundColor!=null&&_6a8.backgroundColor.trim()!="")){
_6a8.wmode="transparent";
}
}
function isValidSourceElementExist(_6aa,type){
if(_6aa.src!=null&&_6aa.src!=""){
if(type=="html"&&$MP.hasHTML5VideoPlaybackSupport&&isHTMLFileFormatSupported(_6aa.src)){
return true;
}else{
if(type=="flash"&&isFlashSupported()&&isFlashFileFormatSupported(_6aa.src)){
return true;
}
}
}
var _6ac=document.getElementById(_6aa.id+"_extendData");
if(_6ac==null||_6ac.childNodes==null||!isFlashSupported()){
return false;
}
var _6ad=_6ac.getElementsByTagName("source");
for(var k=0;k<_6ad.length;k++){
var src=_6ad[k].getAttribute("src");
if(type=="html"&&$MP.hasHTML5VideoPlaybackSupport&&isHTMLFileFormatSupported(src)){
return true;
}else{
if(type=="flash"&&isFlashSupported()&&isFlashFileFormatSupported(src)){
return true;
}
}
}
return false;
}
function hideTitle(id){
var _6b1=document.getElementById(id+"_"+"videoTitle");
if(_6b1==null){
id=id.substring(0,id.indexOf("_strobemediaplayback-video"));
_6b1=document.getElementById(id+"_"+"videoTitle");
}
if(_6b1!=null){
$("#"+id+"_"+"videoTitle").fadeOut(600,null);
}
}
function playbackStart(id){
var _6b3=getFuncMap(id);
if(_6b3.onStart!=null){
_6b3.onStart();
}
var _6b4=getWrapper(id);
if(_6b4!=null){
_6b4.playOverlay.fadeOut(600);
}
hideTitle(id);
}
function showTitle(id){
var _6b6=document.getElementById(id+"_"+"videoTitle");
if(_6b6==null){
id=id.substring(0,id.indexOf("_strobemediaplayback-video"));
_6b6=document.getElementById(id+"_"+"videoTitle");
}
if(_6b6!=null){
$("#"+id+"_"+"videoTitle").fadeIn(1,null);
}
}
function playbackPause(id){
var _6b8=getFuncMap(id);
if(_6b8.onPause!=null){
_6b8.onPause();
}
var _6b9=getWrapper(id);
if(_6b9!=null){
_6b9.playOverlay.fadeIn(600);
}
showTitle(id);
}
function playbackComplete(id){
var _6bb=getFuncMap(id);
if(_6bb.onComplete!=null){
_6bb.onComplete();
}
var _6bc=getWrapper(id);
if(_6bc!=null){
_6bc.playOverlay.fadeIn(600);
_6bc.slider.css("left",0+"px");
_6bc.currenttime.html("0:00");
}
showTitle(id);
}
function updateFlashVideoSource(_6bd){
if(_6bd.src!=null&&_6bd.src!=""){
if(isFlashSupported()&&isFlashFileFormatSupported(_6bd.src)){
return;
}
}
var _6be=document.getElementById(_6bd.id+"_extendData");
if(_6be==null||_6be.childNodes==null||!isFlashSupported()){
return;
}
var _6bf=_6be.getElementsByTagName("source");
for(var k=0;k<_6bf.length;k++){
var src=_6bf[k].getAttribute("src");
if(isFlashSupported()&&isFlashFileFormatSupported(src)){
_6bd.src=resolveSource(src);
return;
}
}
return;
}
function playerInitialization(_6c2,type,_6c4,_6c5,_6c6,_6c7){
var _6c8=true;
var _6c9=isValidSourceElementExist(_6c2,"html");
var _6ca=isValidSourceElementExist(_6c2,"flash");
var _6cb=$MP.handleUserDefinedFlashParams(_6c2,type);
if(_6cb){
_6c2.favorFlashOverHtml5Video=true;
}else{
if(isFlashSupported()){
if(type==null||type=="flash"){
if(_6ca){
_6c2.favorFlashOverHtml5Video=true;
}else{
if(_6c9){
_6c2.favorFlashOverHtml5Video=false;
}else{
_6c8=false;
}
}
}else{
if(_6c9){
_6c2.favorFlashOverHtml5Video=false;
}else{
if(_6ca){
_6c2.favorFlashOverHtml5Video=true;
}else{
_6c8=false;
}
}
}
}else{
if($MP.hasHTML5VideoPlaybackSupport){
_6c2.favorFlashOverHtml5Video=false;
}else{
_6c8=false;
}
}
}
if(_6c2.favorFlashOverHtml5Video){
updateFlashVideoSource(_6c2);
}
if(!_6c8){
if($MP.hasHTML5VideoPlaybackSupport){
_6c2.favorFlashOverHtml5Video=false;
}else{
$(".playoverlay").hide();
ColdFusion.MediaPlayer.logError(_6c2.id,"The video could not be loaded");
return;
}
}
var _6cc={"tablet":{"startSize":{"width":+_6c2.width,"height":+_6c2.height},"name":_6c2.id+"_"+"strobemediaplayback-video"},"smartphone":{"startSize":{"width":+_6c2.width,"height":+_6c2.height},"name":_6c2.id+"_"+"strobemediaplayback-video"},"default":{"startSize":{"width":+_6c2.width,"height":+_6c2.height},"name":_6c2.id+"_"+"strobemediaplayback-video"}};
strobeMediaPlayback.draw(_6c2.id+"_"+"strobemediaplayback-video",_6cc,_6c2);
var _6cd=$("#"+_6c2.id+"_"+"strobemediaplayback-video");
var _6ce=$("#"+_6c2.id);
var _6cf=_6ce.get(0);
var _6d0;
if(_6cf==null){
_6c2.id=_6c2.id+"_strobemediaplayback-video";
$MP.playerOptionsMap[_6c2.id]=_6c2;
$MP.videoMonitorMap[_6c2.id]={paused:true,muted:false};
}else{
_6d0=$("#"+_6c2.id+"_"+"strobemediaplayback-video  .html5player").strobemediaplaybackhtml5(_6c2,_6c4);
$MP.playerMap[_6c2.id]=_6cf;
$MP.playerWrapperMap[_6c2.id]=_6d0;
$MP.playerOptionsMap[_6c2.id]=_6c2;
}
$MP.jsFunctionMap[_6c2.id]=_6c4;
$MP.titleDataMap[_6c2.id]=_6c5;
if(_6cf!=null&&_6cf.nodeName!=null&&_6cf.nodeName.toLowerCase()=="video"){
handleVolumeSlider(_6c2.id);
_6cf.volume=0.6;
handlePlayoverlay(_6c2.id,_6c2.width,_6c2.height);
handleErrorElement(_6c2.id,_6c2.width,_6c2.height);
var _6d1=$MP.playerWrapperMap[_6c2.id];
_6d1.playOverlay.css("display","block");
_6cd.css("width","100%");
_6cd.css("height","100%");
handlebackgroundColor(_6c2);
handleControlsStyle(_6c2.id,_6c7);
_6d0.useHTML5=true;
var _6d2=document.getElementById(_6c2.id+"_extendData");
if(_6d2!=null){
$MP.handleUserDefinedHTML5Element(_6cf,_6c2.id+"_extendData");
}else{
handleTitle(_6c2.id,_6c2.src,_6c5);
var _6d3=getFuncMap(_6c2.id);
var _6d4=document.getElementById(_6c2.id);
var _6d5=_6d4.getElementsByTagName("source");
if(_6d5!=null&&_6d5.length!=0){
_6d5[0].setAttribute("onerror","onError(event)");
}
}
}else{
handleTitle(_6c2.id,_6c2.src,_6c5);
}
handleBorderStyle(_6c2.id,_6c6);
if($MP.bindInfoMap[_6c2.id]==null){
var _6d6=document.getElementById(_6c2.id+"_extendData");
if(_6d6==null){
var id=_6c2.id.substring(0,_6c2.id.indexOf("_"));
_6d6=document.getElementById(id+"_extendData");
}
if(_6d6!=null&&_6d6.parentNode!=null){
_6d6.parentNode.removeChild(_6d6);
}
}
}
function handleVolumeChangeUI(_6d8,_6d9){
var _6da=getWrapper(_6d8);
if(_6d9<=0){
_6da.volumeHigh.css("background-position","0px -72px");
}else{
if(_6d9<=0.3){
_6da.volumeHigh.css("background-position","-24px -72px");
}else{
if(_6d9<=0.7){
_6da.volumeHigh.css("background-position","-48px -72px");
}else{
_6da.volumeHigh.css("background-position","-72px -72px");
}
}
}
}
function handleVolumeSlider(_6db){
var _6dc=getWrapper(_6db);
var _6dd=_6dc.volumeSlider;
_6dd.slider({orientation:"vertical",range:"min",min:0,max:90,value:60,slide:function(_6de,ui){
var _6e0=ui.value/100;
_6dc.currentVolume=_6e0;
handleChangeVolume(_6db,_6e0);
}});
_6dc.volumeHigh.mouseover(function(){
var _6e1=getWrapper(_6db);
var _6e2=_6e1.volumeSlider;
_6e2.css("display","block");
_6e1.volumeContainer.css("display","block");
});
_6dc.volumeHigh.mouseout(function(_6e3){
var _6e4=getWrapper(_6db);
var _6e5=_6e4.volumeSlider;
var _6e6=_6e4.volumeContainer;
var _6e7=_6e3.relatedTarget;
if(_6e7.className!="controls"){
_6e5.css("display","none");
_6e6.css("display","none");
}
});
_6dc.volumeHigh.click(function(_6e8){
var _6e9=getWrapper(_6db);
if(_6e9.currentVolume==null){
_6e9.currentVolume=0.6;
}
var pos=_6dc.volumeHigh.css("background-position");
if(pos.indexOf("0px")!=0){
_6dc.volumeHigh.css("background-position","0px -72px");
_6dc.volumeSlider.slider("value",0);
handleChangeVolume(_6db,0);
}else{
_6dc.volumeSlider.slider("value",_6e9.currentVolume*100);
if(_6e9.currentVolume<=0.1){
_6dc.volumeHigh.css("background-position","0px -72px");
}else{
if(_6e9.currentVolume<=0.3){
_6dc.volumeHigh.css("background-position","-24px -72px");
}else{
if(_6e9.currentVolume<=0.7){
_6dc.volumeHigh.css("background-position","-48px -72px");
}else{
_6dc.volumeHigh.css("background-position","-72px -72px");
}
}
}
handleChangeVolume(_6db,_6e9.currentVolume);
}
});
_6dc.controlbar.mouseout(function(_6eb){
if(_6eb.relatedTarget==null){
return;
}
var _6ec=_6eb.relatedTarget.className;
if(_6eb.relatedTarget.className!="controls"&&_6ec!="volume-container"&&_6ec.indexOf("ui-slider")==-1){
var _6ed=getWrapper(_6db);
var _6ee=_6ed.volumeSlider;
var _6ef=_6ed.volumeContainer;
_6ee.css("display","none");
_6ef.css("display","none");
}
});
}
function handleBindingMediaPlayer(_6f0,_6f1,type,_6f3){
var _6f4=document.getElementById(_6f0.id+"_"+"html5MediaPlayback");
if(_6f4==null){
return;
}
var _6f5=_6f4.innerHTML;
if(_6f5==null){
return;
}
var _6f6={};
_6f6.videoContent=_6f5;
_6f6.type=type;
_6f6.player_options=_6f0;
_6f6.jsfunction=_6f3;
$MP.bindInfoMap[_6f0.id]=_6f6;
var _6f7=-1;
var _6f8=0;
var _6f9=_6f1;
do{
var _6fa;
_6f7=_6f1.indexOf(",",_6f8);
if(_6f7!=-1){
_6fa=_6f1.substring(_6f8,_6f7);
_6f8=_6f7+1;
_6f9=_6f1.substring(_6f7+1);
}else{
_6fa=_6f9;
}
var _6fb=_6fa;
var _6fc;
if(_6fa.indexOf("@")!=-1){
_6fb=_6fa.substring(0,_6fa.indexOf("@"));
_6fc=_6fa.substring(_6fa.indexOf("@")+1);
}else{
_6fb=_6fa;
_6fc="onClick";
}
var _6fd=document.getElementById(_6fb);
if(_6fd==null){
continue;
}
handleTitle(_6f0.id,_6f0.src);
var _6fe=getVideoTitle(_6f0.src);
if(_6fc==null||_6fc.toLowerCase()=="onclick"){
bindFancyBox(false,true,_6fb,_6fc,_6f0,type,_6f3,_6f5,_6fe);
}else{
var _6ff=document.getElementById(_6fb);
_6fc=_6fc.substring(2);
$("#"+_6fb).live(_6fc.toLowerCase(),function(e){
bindFancyBox(true,true,_6fb,_6fc,_6f0,type,_6f3,_6f5,_6fe);
});
}
}while(_6f7!=-1);
var _701=document.getElementById(_6f0.id+"_"+"mediacontainer");
_701.parentNode.removeChild(_701);
}
function bindFancyBox(fire,_703,_704,_705,_706,type,_708,_709,_70a){
var _70b=document.getElementById(_706.id+"_"+"videoTitle");
if(_70b==null){
_70a="";
}else{
if(_70a==null||_70a==""){
_70a="video";
}
}
if(fire){
$("#"+_704).fancybox({content:_709,overlayShow:true,overlayOpacity:0.7,width:_706.width+$MP.fancyBoxLeftBorderOffset,height:_706.height+$MP.fancyBoxBottonBorderOffset,title:_70a,autoDimensions:false,onComplete:function(){
var _70c=$.extend(true,{},$MP.bindInfoMap[_706.id].player_options);
if(_703&&_708.onBind!=null){
_708.onBind(_704,_705);
}
var _70d=$MP.bindInfoMap[_706.id].player_options;
playerInitialization(_70d,type,_708);
handleBindEvents(_70d,$MP.bindInfoMap[_706.id]);
$MP.bindInfoMap[_706.id].player_options=$.extend(true,{},_70c);
}}).trigger("click");
}else{
$("#"+_704).fancybox({content:_709,overlayShow:true,overlayOpacity:0.7,width:_706.width+$MP.fancyBoxLeftBorderOffset,height:_706.height+$MP.fancyBoxBottonBorderOffset,title:_70a,autoDimensions:false,onComplete:function(){
var _70e=$.extend(true,{},$MP.bindInfoMap[_706.id].player_options);
if(_703&&_708.onBind!=null){
_708.onBind(_704,_705);
}
var _70f=$MP.bindInfoMap[_706.id].player_options;
playerInitialization(_70f,type,_708);
handleBindEvents(_70f,$MP.bindInfoMap[_706.id]);
$MP.bindInfoMap[_706.id].player_options=$.extend(true,{},_70e);
}});
}
}
function handleBindEvents(_710,_711){
var _712=$MP.getPlayer(_710.id);
if(_711.mute!=null){
_712.muted=mute;
}
if(_711.volume!=null){
handleChangeVolume(_710.id,_711.volume);
}
if(_711.startPlay!=null){
_712.start();
}
if(_711.stopPlay!=null){
_712.pause();
}
}
function updateVideoType(_713){
var _714=_713.childNodes;
if(_714==null){
return;
}
var _715=_713.getElementsByTagName("source");
if(_715==null||_715.length===0){
return;
}
var _716=_715[0].getAttribute("src");
if(_716==null){
return;
}
var type=_715[0].getAttribute("type");
if(type!=null){
return;
}
if(_716.lastIndexOf(".")==-1){
return;
}
var _718=_716.substring(_716.lastIndexOf(".")+1);
_718=_718.toLowerCase();
if(_718=="mp4"){
_715[0].setAttribute("type","video/mp4");
}else{
if(_718=="ogv"){
_715[0].setAttribute("type","video/ogg");
}else{
if(_718=="webm"){
_715[0].setAttribute("type","video/webm");
}
}
}
}
$MP.handleUserDefinedHTML5Element=function(_719,_71a){
var _71b=document.getElementById(_71a);
var _71c=_71b.childNodes;
var _71d=false;
updateVideoType(_719);
if(_71c!=null){
var _71e=null;
for(var k=0;k<_71c.length;k++){
var _720=_71c[k];
if(_720.tagName!=null&&_720.tagName.toLowerCase()=="video"){
_71e=_720;
break;
}
}
if(_71e==null){
return;
}
_71c=_71e.childNodes;
var _721=null;
var _722;
for(var i=0;i<_71c.length;i++){
var _720=_71c[i];
if(_720.tagName!=null&&_720.tagName.toLowerCase()=="track"){
_719.appendChild(_720);
}else{
if(_720.tagName!=null&&_720.tagName.toLowerCase()=="source"){
if(!_71d){
var _724=_719.getAttribute("src");
if(_724==null){
var _725=_719.childNodes;
if(_725!=null){
for(var l=0;l<_725.length;l++){
if(_725[l].tagName.toLowerCase()=="source"){
var src=_725[l].getAttribute("src");
if(src!=null&&src.trim()!=0&&isHTMLFileFormatSupported(src)){
_721=src;
break;
}
}
}
}
}
if(_724!=null&&_724!=""&&_724.lastIndexOf(".")!=-1){
var _728=document.createElement("source");
_728.setAttribute("src",_724);
var _729=_724.substring(_724.lastIndexOf(".")+1);
if(_729=="mp4"){
_728.setAttribute("type","video/mp4");
}else{
if(_729=="ogv"){
_728.setAttribute("type","video/ogg");
}else{
if(_729=="webm"){
_728.setAttribute("type","video/webm");
}
}
}
_719.appendChild(_728);
}
if(_721==null&&isHTMLFileFormatSupported(_724)){
_721=_724;
}
_719.removeAttribute("src");
}
var src=_720.getAttribute("src");
src=resolveSource(src);
_720.setAttribute("src",src);
_719.appendChild(_720);
_71d=true;
_722=_720;
if(_721==null&&isHTMLFileFormatSupported(src)){
_721=src;
}
}
}
}
if(_721!=null){
handleTitle(_719.id,_721);
}
if(_722!=null){
_722.setAttribute("onerror","onError(event)");
}
}
_719.load();
};
$MP.handleUserDefinedFlashParams=function(_72a,type){
var _72c=document.getElementById(_72a.id+"_extendData");
if(_72c==null||_72c.childNodes==null||!isFlashSupported()){
return;
}
var _72d=_72c.childNodes;
var _72e=false;
if(_72d!=null){
var _72f=null;
for(var k=0;k<_72d.length;k++){
var _731=_72d[k];
if(_731.tagName!=null&&(_731.tagName.toLowerCase()=="object"||_731.tagName.toLowerCase()=="video")){
_72f=_731;
var _732=_72f.childNodes;
for(var i=0;i<_732.length;i++){
var _731=_732[i];
if(_731.tagName!=null&&_731.tagName.toLowerCase()=="param"){
_72e=true;
var _734=_731.getAttribute("name");
if(_734=="flashvars"){
var _735=_731.getAttribute("value");
var _736=0;
var _737=_735;
do{
var _738=_737.indexOf("&");
var _739;
if(_738>0){
_739=_737.substring(_736,_738);
}else{
_739=_737;
}
if(_739.indexOf("=")>0){
var _73a=_739.substring(0,_739.indexOf("="));
var _73b=_739.substring(_739.indexOf("=")+1);
if(_73a!=""||_73b!=""){
_72a[_73a]=resolveSource(_73b);
}
}
_736=_738+1;
_737=_737.substring(_736);
}while(_738>0);
}
}
}
}
}
return _72e;
}
};
function isFlashSupported(){
return swfobject.hasFlashPlayerVersion("1");
}
function isFlashFileFormatSupported(_73c){
if(_73c.indexOf("rtmp")==0){
return true;
}
var _73d=["flv","f4v","f4m","m3u","mp4","swf","mpeg-4","m4v","f4f","3gpp","mp3","3gpp2","pbg","gif","jpg","jpeg","aac","speex","nellymoser","QuickTime"];
var _73e=_73c.lastIndexOf(".");
var _73f=_73c.substring(_73e+1,_73c.length);
_73f=_73f.toLowerCase();
for(var i=0;i<_73d.length;i++){
if(_73d[i]==_73f){
return true;
}
}
return false;
}
function isHTMLFileFormatSupported(_741){
if(_741==null){
return false;
}
var _742=["webm","mp4","ogv"];
var _743=_741.lastIndexOf(".");
var _744=_741.substring(_743+1,_741.length);
_744=_744.toLowerCase();
var elem=document.createElement("video");
var ogg=elem.canPlayType("video/ogg; codecs=\"theora\"");
var h264="video/mp4; codecs=\"avc1.42E01E";
var mp4=elem.canPlayType(h264+"\"")||elem.canPlayType(h264+", mp4a.40.2\"");
var webm=elem.canPlayType("video/webm; codecs=\"vp8, vorbis\"");
for(var i=0;i<_742.length;i++){
if(_742[i]==_744){
if(_744=="ogv"){
return ogg;
}else{
if(_744=="webm"){
return webm;
}else{
if(_744=="mp4"){
return mp4;
}
}
}
}
}
return false;
}
function getWrapper(name){
var _74c=$MP.playerWrapperMap[name];
if(_74c==null||typeof (_74c)=="undefined"){
return $MP.playerWrapperMap[name+"_strobemediaplayback-video"];
}
return _74c;
}
function getFuncMap(name){
var _74e=$MP.jsFunctionMap[name];
if(_74e==null||typeof (_74e)=="undefined"){
return $MP.jsFunctionMap[name+"_strobemediaplayback-video"];
}
return _74e;
}
ColdFusion.MediaPlayer.setMute=function(name,mute){
if($MP.bindInfoMap[name]!=null){
var _751=getBindInfo(name);
if(_751==null){
return;
}
_751.mute=mute;
return;
}
var _752=$MP.getPlayer(name);
var _753=$MP.getType(name);
var _754=getWrapper(name);
if(_753=="html"){
_752.muted=mute;
if(mute){
_754.volumeHigh.css("background-position","0px -72px");
_754.volumeSlider.slider("value",0);
}else{
handleChangeVolume(name,_752.volume);
}
}else{
if(_753=="flash"){
_752.setMuted(mute);
}
}
};
function resolveSource(src){
if(src==null){
return null;
}
if(src.charAt(0)!="/"&&src.indexOf("://")<0){
var _756="";
var _757=document.location.href;
if(_757||_757.indexOf("/")>-1){
_756=_757.substring(0,_757.lastIndexOf("/")+1);
}
var _758=_756+src;
var _759=_758.split("/");
var _75a=new Array();
var _75b=0;
for(var i=0;i<_759.length;i++){
if(_759[i]==".."){
_75a[--_75b]="";
}else{
_75a[_75b++]=_759[i];
}
}
src=_75a[0];
for(var i=1;i<_75b;i++){
src=src+"/"+_75a[i];
}
}
if(src.indexOf("/")==0){
src=$MP.baseURI+src;
}
return src;
}
ColdFusion.MediaPlayer.getPlayer=function(name){
var _75e=$MP.playerMap[name];
if(_75e==null||typeof (_75e)=="undefined"){
_75e=$MP.playerMap[name+"_strobemediaplayback-video"];
if(_75e==null||typeof (_75e)=="undefined"){
ColdFusion.handleError(null,"mediaplayer.getplayer.notfound","widget",[name],null,null,true);
}
}
return _75e;
};
ColdFusion.MediaPlayer.setTitle=function(name,_760){
if(_760==null){
ColdFusion.handleError(null,"mediaplayer.settitle.invalidtitle","widget",[name],null,null,true);
}
var _761=$MP.titleDataMap[name];
if(_761==null){
_761={};
$MP.titleDataMap[name]=_761;
}
var _762=document.getElementById(name+"_videoTitle");
if(_762==null){
var _763="<div id=\""+name+"_videoTitle\">";
$("#"+name+"_videoContainer").prepend(_763);
}
_761.hideTitle=false;
_761.title=_760;
handleTitle(name,_760,_761);
};
ColdFusion.MediaPlayer.setSource=function(name,src){
if(src==null||src=="undefined"){
ColdFusion.handleError(null,"mediaplayer.setsource.invalidsource","widget",[name],null,null,true);
}
if($MP.bindInfoMap[name]!=null){
var _766=getBindInfo(name);
if(_766==null){
return;
}
_766.player_options.src=resolveSource(src);
if(isFlashFileFormatSupported(src)&&isFlashSupported()){
_766.player_options.favorFlashOverHtml5Video=true;
}else{
_766.player_options.favorFlashOverHtml5Video=false;
}
_766.videoTitle=getVideoTitle(src);
return;
}
var _767=$MP.getPlayer(name);
var _768=$MP.getType(name);
src=resolveSource(src);
var _769=getWrapper(name);
var _76a,jsFunctionMap;
if(_769!=null&&_769.errorwindow!=null){
_769.errorwindow.html("");
_769.errorwindow.hide();
_76a=$MP.playerOptionsMap[_769.options.id];
}else{
_76a=$MP.playerOptionsMap[name+"_"+"strobemediaplayback-video"];
jsFunctionMap=$MP.jsFunctionMap[name+"_"+"strobemediaplayback-video"];
}
if(_76a==null){
_76a=$MP.defaultOptions;
}
var _76b={"tablet":{"name":_76a.id+"_"+"strobemediaplayback-video"},"smartphone":{"startSize":{"width":360,"height":200},"name":_76a.id+"_"+"strobemediaplayback-video"},"default":{"startSize":{"width":+_76a.width,"height":+_76a.height},"name":_76a.id+"_"+"strobemediaplayback-video"}};
if(_768=="html"){
if(isHTMLFileFormatSupported(src)){
_767.src=src;
_767.load();
_767.pause();
_769.playOverlay.fadeIn(600);
_769.playtoggle.removeClass("paused");
_769.slider.css({"left":"0%"});
_769.playedbar.css({"width":"0%"});
_769.currenttime.html("0:00");
_769.duration.html("0:00");
var css={"left":"0%","width":"0%"};
_769.bufferbar.removeClass("done");
_769.bufferbar.css(css);
var _76d=$MP.titleDataMap[_76a.id];
handleTitle(name,src,_76d);
}else{
if(isFlashFileFormatSupported(src)&&isFlashSupported()){
_76a.isHTML5=false;
_76a.favorFlashOverHtml5Video=true;
_76a.src=src;
var _76d=$MP.titleDataMap[_76a.id];
if(_76d.hideTitle!=null&&!_76d.hideTitle){
_76a.wmode="opaque";
}
strobeMediaPlayback.draw(_76a.id+"_"+"strobemediaplayback-video",_76b,_76a);
var _76e=$("#"+_76a.id+"_"+"strobemediaplayback-video");
var _76f=_76e.find("video");
var _770=_76f.get(0);
var _771=$("#"+_76a.id+"_"+"strobemediaplayback-video  .html5player").strobemediaplaybackhtml5(_76a,_769.jsCallbackFunctions);
$MP.playerMap[_76a.id]=_770;
$MP.playerWrapperMap[_76a.id]=_771;
handleTitle(_76a.id,_76a.src,_76d);
}
}
}else{
if(_768=="flash"){
if(isFlashFileFormatSupported(src)&&isFlashSupported()){
_767.setMediaResourceURL(src);
handleTitle(name,src,$MP.titleDataMap[id]);
}else{
if(isHTMLFileFormatSupported(src)){
var id=_76a.id+"_strobemediaplayback-video";
$("#"+id).replaceWith("<div  id=\""+id+"\"></div>");
$("#"+id).css("visibility","visible");
_76a.isHTML5=true;
_76a.favorFlashOverHtml5Video=false;
_76a.src=src;
strobeMediaPlayback.draw(id,_76b,_76a);
var _76e=$("#"+id);
var _76f=_76e.find("video");
var _770=_76f.get(0);
if(_770==null){
return;
}
var _773=getFuncMap(id);
var _771=$("#"+id+"  .html5player").strobemediaplaybackhtml5(_76a,_773);
$MP.playerMap[_76a.id]=_770;
$MP.playerWrapperMap[_76a.id]=_771;
handlePlayoverlay(_76a.id,_76a.width,_76a.height);
handleErrorElement(_76a.id,_76a.width,_76a.height);
_771.playOverlay.css("display","block");
handleTitle(_76a.id,_76a.src,$MP.titleDataMap[id]);
_770.load();
if(_76a.autoPlay==false){
_770.pause();
}
}
}
}
}
};
function getBindInfo(name){
var _775=$MP.bindInfoMap[name];
if(_775!=null){
return _775;
}
return;
}
function handleBindElements(_776){
if(_776!=null){
if(_776.bindEvent==null||_776.bindEvent.toLowerCase()=="onclick"){
bindFancyBox(false,false,_776.bindElement,_776.player_options,_776.type,_776.jsFuncc,_776.videoContent,_776.videoTitle);
}else{
var _777=document.getElementById(_776.bindElement);
var _778=_776.bindEvent.substring(2);
$("#"+_776.bindElement).live(_778.toLowerCase(),function(e){
bindFancyBox(true,false,_776.bindElement,_776.player_options,_776.type,_776.jsFuncc,_776.videoContent,_776.videoTitle);
});
}
}
}
function handleChangeVolume(name,_77b){
var _77c=$MP.getPlayer(name);
var _77d=$MP.getType(name);
if(_77d=="html"){
if(_77c.muted){
_77c.muted=false;
}
_77c.volume=_77b;
var _77e=getWrapper(name);
var _77f=_77e.volumeSlider;
_77f.slider("value",_77b*100);
handleVolumeChangeUI(name,_77b);
}else{
if(_77d=="flash"){
_77c.setVolume(_77b);
}
}
}
ColdFusion.MediaPlayer.setVolume=function(name,_781){
if(_781<=0){
ColdFusion.handleError(null,"mediaplayer.setvolume.invalidvalue","widget",[name],null,null,true);
}
if($MP.bindInfoMap[name]!=null){
var _782=getBindInfo(name);
if(_782==null){
return;
}
_782.volume=_781;
return;
}
handleChangeVolume(name,_781);
};
ColdFusion.MediaPlayer.resize=function(name,_784,_785){
if(_784<=0||_785<=0){
ColdFusion.handleError(null,"mediaplayer.resize.invalidvalue","widget",[name],null,null,true);
}
if($MP.bindInfoMap[name]!=null){
var _786=getBindInfo(name);
if(_786==null){
return;
}
_786.player_options.width=_784;
_786.player_options.height=_785;
return;
}
var _787=false;
var _788=$MP.getPlayer(name);
var _789=$MP.getType(name);
var _78a=getWrapper(name);
_788.width=_784;
_788.height=_785;
if(_78a!=null){
_78a.options.width=_784;
_78a.options.height=_785;
_78a.controlbar.css("width",_784-1.5);
if(_78a.options.width>180){
_78a.progressbar.css("width",_784-180);
_78a.trackswidth=_784-180;
}else{
_78a.progressbar.css("width","50%");
_78a.trackswidth="50%";
}
handlePlayoverlay(name,_784,_785);
handleErrorElement(name,_784,_785);
}
$("#"+name+"_"+"videoContainer").css("width",_784);
$("#"+name+"_"+"videoContainer").css("height",_785);
if(_788.paused==false){
_78a.playOverlay.hide();
}
};
ColdFusion.MediaPlayer.getType=function(name){
var elem=document.getElementById(name);
if(elem==null||elem=="undefined"){
elem=document.getElementById(name+"_strobemediaplayback-video");
if(elem==null||typeof (elem)=="undefined"){
return "unknown";
}
}
var type=elem.nodeName;
if(type==null){
return "unknown";
}
type=type.toLowerCase();
if(type=="video"){
return "html";
}else{
if(type=="object"){
return "flash";
}else{
return "unknown";
}
}
};
ColdFusion.MediaPlayer.startPlay=function(name){
if($MP.bindInfoMap[name]!=null){
var _78f=getBindInfo(name);
if(_78f==null){
return;
}
_78f.startPlay=true;
return;
}
var _790=$MP.getPlayer(name);
var _791=$MP.getType(name);
if(_791=="html"){
_790.play();
}else{
if(_791=="flash"){
_790.play2();
}
}
};
ColdFusion.MediaPlayer.stopPlay=function(name){
if($MP.bindInfoMap[name]!=null){
var _793=getBindInfo(name);
if(_793==null){
return;
}
_793.stopPlay=true;
return;
}
var _794=$MP.getPlayer(name);
_794.pause();
};
ColdFusion.MediaPlayer.logError=function(name,_796){
if(name==null||_796==null){
return;
}
var _797=$MP.playerWrapperMap[name];
if(_797==null){
_797=$MP.playerWrapperMap[name+"_strobemediaplayback-video"];
if(_797==null){
return;
}
}
_797.errorwindow.html(_796);
_797.errorwindow.show();
_797.playOverlay.hide();
};
function handlePlayoverlay(name,_799,_79a){
if(!isDesktop){
return;
}
var _79b=getWrapper(name);
_79b.playOverlay.css("left","");
_79b.playOverlay.css("top","");
_79b.playOverlay.css("left",(_799-116)/2+"px");
_79b.playOverlay.css("top",(_79a-107)/2+"px");
}
function handleErrorElement(name,_79d,_79e){
var _79f=getWrapper(name);
_79f.playOverlay.css("display","none");
_79f.errorwindow.css("left","");
_79f.errorwindow.css("top","");
_79f.errorwindow.css("display","none");
var _7a0=_79f.controlbar;
var _7a1=0;
if(_7a0!=null){
_7a1=_7a0.css("height");
if(_7a1!=null&&_7a1.indexOf("px")!=-1){
_7a1=_7a1.substring(0,_7a1.indexOf("px"));
}else{
_7a1=0;
}
}
_79f.errorwindow.css("margin-top",_79e/2-_7a1+"px");
}
function handleTitleResize(id,_7a3,_7a4){
$("#"+id+"_videoTitle").css("width","");
$("#"+id+"_videoTitle").css("width",_7a3+"px");
}
function handleTitle(_7a5,_7a6,_7a7){
var _7a8=document.getElementById(_7a5+"_"+"videoTitle");
if(_7a8==null){
_7a5=_7a5.substring(0,_7a5.indexOf("_strobemediaplayback-video"));
_7a8=document.getElementById(_7a5+"_"+"videoTitle");
}
var _7a9=document.getElementById("fancybox-title-float-main");
if(_7a8!=null){
if(_7a7==null){
_7a7=$MP.titleDataMap[_7a5];
if(_7a7==null||_7a7.hideTitle){
var _7aa=_7a8.parentNode;
_7aa.removeChild(_7a8);
return;
}
}else{
if(_7a7.hideTitle){
var _7aa=_7a8.parentNode;
_7aa.removeChild(_7a8);
return;
}
}
var _7ab=_7a7.title;
if(_7a7==null||_7a7.title==null||_7a7.title.trim()==""){
_7ab=getVideoTitle(_7a6);
}
if(_7ab!=""){
_7a8.innerHTML=_7ab;
}else{
return;
}
$("#"+_7a5+"_"+"videoTitle").css("position","absolute");
$("#"+_7a5+"_"+"videoTitle").css("z-index",2);
if(_7a7==null||_7a7.title_text_color==null){
$("#"+_7a5+"_"+"videoTitle").css("color","white");
}else{
$("#"+_7a5+"_"+"videoTitle").css("color",_7a7.title_text_color);
}
if(_7a7!=null&&_7a7.title_bgcolor!=null){
$("#"+_7a5+"_"+"videoTitle").css("background-color",_7a7.title_bgcolor);
}
$("#"+_7a5+"_"+"videoTitle").css("font-weight","bold");
$("#"+_7a5+"_"+"videoTitle").css("font-family","Arial,Helvetica,sans-serif");
$("#"+_7a5+"_"+"videoTitle").css("font-size","13px");
$("#"+_7a5+"_"+"videoTitle").css("word-wrap","break-word");
if(_7a8.style.backgroundColor==null||_7a8.style.backgroundColor==""){
$("#"+_7a5+"_"+"videoTitle").css("margin-left","5px");
}
$("#"+_7a5+"_"+"videoTitle").show();
$("#"+_7a5+"_"+"strobemediaplayback").css("z-index",1);
}else{
if(_7a9!=null&&_7a6!=null){
$("#fancybox-title-float-main").text(_7a6);
}
}
}
function getVideoTitle(_7ac){
var _7ad=null;
if(_7ac!=null&&_7ac!=""){
var _7ae=_7ac.lastIndexOf("/");
if(_7ae==-1){
_7ae=_7ac.lastIndexOf("\\");
}
if(_7ae==-1){
_7ad=_7ac;
}
if(_7ad==null){
_7ad=_7ac.substring(_7ae+1,_7ac.length);
}
}
if(_7ad==null||_7ad.indexOf(".")<0){
return _7ac;
}else{
return _7ad;
}
}
function handlebackgroundColor(_7af){
if(_7af.backgroundColor==null){
return;
}
var _7b0=document.getElementById(_7af.id);
if(_7b0==null){
return;
}
_7b0.setAttribute("style","background-color:"+_7af.backgroundColor+";");
}
function handleBorderStyle(_7b1,_7b2){
if(_7b2.hideBorder){
return;
}
var _7b3="#fff";
if(_7b2.bgColor){
_7b3=_7b2.bgColor;
}
var _7b4=document.getElementById(_7b1+"_"+"videoContainer");
if(_7b4==null){
_7b1=_7b1.substring(0,_7b1.indexOf("_"));
}
if(_7b2.border_left!=null){
$("#"+_7b1+"_"+"videoContainer").css("border-left",_7b2.border_left+"px"+" solid "+_7b3);
}
if(_7b2.border_right!=null){
$("#"+_7b1+"_"+"videoContainer").css("border-right",_7b2.border_right+"px"+" solid "+_7b3);
}
if(_7b2.border_top!=null){
$("#"+_7b1+"_"+"videoContainer").css("border-top",_7b2.border_top+"px"+" solid "+_7b3);
}
if(_7b2.border_bottom!=null){
$("#"+_7b1+"_"+"videoContainer").css("border-bottom",_7b2.border_bottom+"px"+" solid "+_7b3);
}
}
function handleControlsStyle(_7b5,_7b6){
var _7b7=getWrapper(_7b5);
if(_7b6.controlbar_bgcolor!=null){
_7b7.controlbar.css("background-color",_7b6.controlbar_bgcolor);
}
if(_7b6.controls_color!=null){
_7b7.playtoggle.css("background-color",_7b6.controls_color);
_7b7.slider.css("background-color",_7b6.controls_color);
_7b7.fullview.css("background-color",_7b6.controls_color);
_7b7.currenttime.css("color",_7b6.controls_color);
_7b7.duration.css("color",_7b6.controls_color);
_7b7.seekbar.css("background-color",_7b6.controls_color);
_7b7.volumeHigh.css("background-color",_7b6.controls_color);
}
if(_7b6.progress_bgcolor!=null){
_7b7.bufferbar.css("background-color",_7b6.progress_bgcolor);
}
if(_7b6.progress_color!=null){
_7b7.playedbar.css("background-color",_7b6.progress_color);
}
}
function triggerHandler(id,_7b9,_7ba){
if(_7b9=="onJavaScriptBridgeCreated"){
return;
}else{
if(_7b9=="play"){
var _7bb=getFuncMap(id);
var _7bc=$MP.videoMonitorMap[id];
if(_7bb.onStartCallback!=null&&_7bc.paused){
_7bb.onStartCallback(id);
_7bc.paused=false;
}
hideTitle(id);
}else{
if(_7b9=="pause"){
var _7bb=getFuncMap(id);
var _7bc=$MP.videoMonitorMap[id];
if(_7bb.onPauseCallback!=null&&!_7bc.paused){
_7bb.onPauseCallback(id);
_7bc.paused=true;
}
showTitle(id);
}else{
if(_7b9=="complete"){
var _7bb=getFuncMap(id);
if(_7bb.onComplete!=null){
_7bb.onComplete();
}
var _7bc=$MP.videoMonitorMap[id];
_7bc.paused=true;
showTitle(id);
}else{
if(_7b9=="loadedmetadata"){
var _7bb=getFuncMap(id);
if(_7bb.onLoad!=null){
_7bb.onLoad();
}
}else{
if(_7b9=="error"){
var _7bb=getFuncMap(id);
if(_7bb.onError!=null){
_7bb.onError();
}
}else{
if(_7b9=="volumechange"){
var _7bc=$MP.videoMonitorMap[id];
_7bc.muted=_7ba.muted;
}
}
}
}
}
}
}
}
function onError(_7bd){
var _7be;
var _7bf;
var _7c0;
var _7c1;
if(_7bd.target!=null&&_7bd.target.tagName.toLowerCase()=="video"){
_7c0=getFuncMap(_7bd.target.id);
if(_7bd.target.error!=null){
_7bf=_7bd.target.error.code;
}
_7c1=getWrapper(_7bd.target.id);
}else{
if(_7bd.target!=null&&_7bd.target.tagName.toLowerCase()=="source"){
var _7c2=_7bd.target.getAttribute("src");
var _7c3=_7bd.target.getAttribute("onerror");
if(_7c2!=null&&_7c3!=null){
_7bf=4;
}else{
return;
}
}
var _7c4=_7bd.target.parentNode;
_7c0=getFuncMap(_7c4.id);
_7c1=getWrapper(_7c4.id);
}
if(_7bf==null){
return;
}
if(_7c0.onError!=null){
_7c0.onError(_7bf);
return;
}
switch(_7bf){
case 1:
_7be="You aborted the video playback.";
break;
case 2:
_7be="A network error caused the video download to fail part-way.";
break;
case 3:
_7be="The video playback was aborted due to a corruption problem or because the video used features your browser did not support.";
break;
case 4:
_7be="The video could not be loaded, either because the server or network failed or because the format is not supported.";
break;
default:
_7be="An unknown error occurred.";
break;
}
_7c1.playOverlay.css("display","none");
_7c1.errorwindow.html(_7be);
_7c1.errorwindow.show();
}
function onFlashEmbedComplete(_7c5){
var _7c6=$("#"+_7c5.id);
var _7c7=_7c6.get(0);
$MP.playerMap[_7c5.id]=_7c7;
}
function removejscssfile(_7c8,_7c9){
var _7ca=(_7c9=="js")?"script":(_7c9=="css")?"link":"none";
var _7cb=(_7c9=="js")?"src":(_7c9=="css")?"href":"none";
var _7cc=document.getElementsByTagName(_7ca);
for(var i=_7cc.length;i>=0;i--){
if(_7cc[i]&&_7cc[i].getAttribute(_7cb)!=null&&_7cc[i].getAttribute(_7cb).indexOf(_7c8)!=-1){
_7cc[i].parentNode.removeChild(_7cc[i]);
}
}
}
