/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Tree){
ColdFusion.Tree={};
}
ColdFusion.Tree.AttributesCollection=function(){
this.cache=true;
this.fontname=null;
this.bold=false;
this.italic=false;
this.completepath=false;
this.appendkey=false;
this.delimiter=null;
this.formname=null;
this.fontsize=null;
this.formparamname=null;
this.prevspanid=null;
this.prevspanbackground=null;
this.images={};
this.images.folder=_cf_ajaxscriptsrc+"/resources/cf/images/FolderClose.gif";
this.images.cd=_cf_ajaxscriptsrc+"/resources/cf/images/Cd.png";
this.images.computer=_cf_ajaxscriptsrc+"/resources/cf/images/Computer.png";
this.images.document=_cf_ajaxscriptsrc+"/resources/cf/images/Document.gif";
this.images.element=_cf_ajaxscriptsrc+"/resources/cf/images/Elements.png";
this.images.floppy=_cf_ajaxscriptsrc+"/resources/cf/images/Floppy.png";
this.images.fixed=_cf_ajaxscriptsrc+"/resources/cf/images/HardDrive.png";
this.images.remote=_cf_ajaxscriptsrc+"/resources/cf/images/NetworkDrive.png";
this.imagesopen={};
this.imagesopen.folder=_cf_ajaxscriptsrc+"/resources/cf/images/FolderOpen.gif";
this.imagesopen.cd=_cf_ajaxscriptsrc+"/resources/cf/images/Cd.png";
this.imagesopen.computer=_cf_ajaxscriptsrc+"/resources/cf/images/Computer.png";
this.imagesopen.document=_cf_ajaxscriptsrc+"/resources/cf/images/Document.gif";
this.imagesopen.element=_cf_ajaxscriptsrc+"/resources/cf/images/Elements.png";
this.imagesopen.floppy=_cf_ajaxscriptsrc+"/resources/cf/images/Floppy.png";
this.imagesopen.fixed=_cf_ajaxscriptsrc+"/resources/cf/images/HardDrive.png";
this.imagesopen.remote=_cf_ajaxscriptsrc+"/resources/cf/images/NetworkDrive.png";
this.eventcount=0;
this.eventHandlers=new Array();
this.nodeCounter=0;
};
ColdFusion.Tree.refresh=function(_45b){
var tree=ColdFusion.objectCache[_45b];
var _45d=ColdFusion.objectCache[_45b+"collection"];
if(!tree||YAHOO.widget.TreeView.prototype.isPrototypeOf(tree)==false){
ColdFusion.handleError(null,"tree.refresh.notfound","widget",[_45b],null,null,true);
return;
}
if(!_45d.dynLoadFunction){
ColdFusion.Log.info("tree.refresh.statictree","widget");
return;
}
_45d.dynLoadFunction.call(null,tree.getRoot());
ColdFusion.Log.info("tree.refresh.success","widget",[_45b]);
};
ColdFusion.Tree.getTreeObject=function(_45e){
if(!_45e){
ColdFusion.handleError(null,"tree.gettreeobject.emptyname","widget",null,null,null,true);
return;
}
var _45f=ColdFusion.objectCache[_45e];
if(_45f==null||YAHOO.widget.TreeView.prototype.isPrototypeOf(_45f)==false){
ColdFusion.handleError(null,"tree.gettreeobject.notfound","widget",[_45e],null,null,true);
return;
}
return _45f;
};
ColdFusion.Tree.loadNodes=function(_460,_461){
var i=0;
var _463=ColdFusion.objectCache[_461.treeid+"collection"];
var tree=ColdFusion.objectCache[_461.treeid];
var _465;
var _466=false;
if(_460&&typeof (_460.length)=="number"&&!_460.toUpperCase){
if(_460.length>0&&typeof (_460[0])!="object"){
_466=true;
}
}else{
_466=true;
}
if(_466){
ColdFusion.handleError(tree.onbinderror,"tree.loadnodes.invalidbindvalue","widget",[_461.treeid]);
return;
}
if(_461.parent&&!_461.parent.isRoot()){
tree.removeChildren(_461.parent);
}else{
if(_461.parent&&_461.parent.hasChildren()){
tree.removeChildren(_461.parent);
_461.parent=tree.getRoot();
}
}
if(!_461.parent.leafnode){
for(i=0;i<_460.length;i++){
var _467=_463.nodeCounter++;
var node={};
node.id=_460[i].VALUE;
if(typeof (_460[i].DISPLAY)==undefined||_460[i].DISPLAY==null){
node.label=_460[i].VALUE;
}else{
node.label=_460[i].DISPLAY;
}
node.expand=_460[i].EXPAND;
node.appendkey=_460[i].APPENDKEY;
node.href=_460[i].HREF;
node.img=_460[i].IMG;
node.imgOpen=_460[i].IMGOPEN;
node.imgid="_cf_image"+_467;
node.spanid="_cf_span"+_467;
node.target=_460[i].TARGET;
if(_463.appendkey&&_463.appendkey==true&&node.href){
var _469=new String(node.href);
_469=_469.toLowerCase();
if(_469.indexOf("javascript")<0){
if(_469.indexOf("?")>=0){
node.href=_460[i].HREF+"&";
}else{
node.href=_460[i].HREF+"?";
}
node.href=node.href+"CFTREEITEMKEY="+node.id;
}
}
var _46a="";
if(node.img){
if(_463.images[node.img]){
_46a="<img src='"+_463.images[node.img]+"' id='"+node.imgid+"' style='border:0'/>&nbsp;";
}else{
_46a="<img src='"+node.img+"' id='"+node.imgid+"' style='border:0'/>&nbsp;";
}
}
if(_463.fontname||_463.italic==true||_463.bold==true||_463.fontsize){
_46a=_46a+"<span id='"+node.spanid+"' style='";
if(_463.fontname){
_46a=_46a+"font-family:"+_463.fontname+";";
}
if(_463.italic==true){
_46a=_46a+"font-style:italic;";
}
if(_463.bold==true){
_46a=_46a+"font-weight:bold;";
}
if(_463.fontsize){
_46a=_46a+"font-size:"+_463.fontsize+";";
}
_46a=_46a+"'>"+node.label+"</span>";
node.label=_46a;
}else{
node.label=_46a+"<span id='"+node.spanid+"'  >"+node.label+"</span>";
}
node.childrenFetched=false;
var _46b=new YAHOO.widget.TextNode(node,_461.parent,false);
var _46c=false;
if(_460[i].LEAFNODE&&_460[i].LEAFNODE==true){
_46c=true;
_46b.leafnode=true;
_46b.iconMode=1;
}
if(_46c==true||(node.expand&&node.expand==true)){
_46b.expand();
}
}
}
if(!_461.parent.isRoot()){
_461.parent.data.childrenFetched=true;
}
if(_461.onCompleteCallBack){
_461.onCompleteCallBack.call();
}else{
_461.parent.tree.draw();
}
ColdFusion.Log.info("tree.loadnodes.success","widget",[_461.treeid]);
};
ColdFusion.Tree.onExpand=function(node){
if(node.isRoot()){
return;
}
var _46e=ColdFusion.objectCache[node.tree.id+"collection"];
if(node.data.imgOpen&&typeof (node.leafnode)=="undefined"){
var _46f=ColdFusion.DOM.getElement(node.data.imgid,node.tree.id);
var src;
if(_46e.imagesopen[node.data.imgOpen]){
src=_46e.imagesopen[node.data.imgOpen];
}else{
src=node.data.imgOpen;
}
_46f.src=src;
}
if(_46e.cache==false&&node.data.childrenFetched==false&&_46e.dynLoadFunction){
node.tree.removeChildren(node);
}
};
ColdFusion.Tree.onCollapse=function(node){
if(node.isRoot()){
return;
}
var _472=ColdFusion.objectCache[node.tree.id+"collection"];
if(node.data.img){
var _473=ColdFusion.DOM.getElement(node.data.imgid,node.tree.id);
var src;
if(_472.images[node.data.img]){
src=_472.images[node.data.img];
}else{
src=node.data.img;
}
_473.src=src;
}
node.data.childrenFetched=false;
};
ColdFusion.Tree.formPath=function(node,_476){
var _477=ColdFusion.objectCache[node.tree.id+"collection"];
if(_477.completepath==true&&node.isRoot()){
return "";
}else{
if(_477.completepath==false&&node.parent.isRoot()){
return "";
}
}
if(!_476){
_476=node;
}
var _478=ColdFusion.Tree.formPath(node.parent,_476);
_478=_478+node.data.id;
if(_476.data.id!=node.data.id){
_478=_478+_477.delimiter;
}
return _478;
};
ColdFusion.Tree.onLabelClick=function(node){
var _47a="";
var _47b=ColdFusion.objectCache[node.tree.id+"collection"];
var _47a=ColdFusion.Tree.formPath(node);
if(_47b.prevspanid){
var _47c=ColdFusion.DOM.getElement(_47b.prevspanid,node.tree.id);
if(_47c.style){
_47c.style.backgroundColor=_47b.prevspanbackground;
}
}
var _47d=ColdFusion.DOM.getElement(node.data.spanid,node.tree.id);
if(_47d&&_47d.style){
_47b.prevspanbackground=_47d.style.backgroundColor;
}
_47d.style.backgroundColor="lightblue";
_47b.prevspanid=node.data.spanid;
node.tree._cf_path=_47a;
node.tree._cf_node=node.data.id;
var val="PATH="+_47a+"; NODE="+node.data.id;
updateHiddenValue(val,_47b.formname,_47b.formparamname);
ColdFusion.Tree.fireSelectionChangeEvent(node.tree.id,_47b.formname);
};
ColdFusion.Tree.fireSelectionChangeEvent=function(id,_480){
ColdFusion.Log.info("tree.fireselectionchangeevent.fire","widget",[id]);
ColdFusion.Event.callBindHandlers(id,_480,"change");
};
ColdFusion.Tree.getObject=function(_481){
var _482={};
_482.id=_481.value;
if(_481.href&&_481.href!="null"){
_482.href=_481.href;
}
_482.target=_481.target;
_482.label=_481.label;
_482.display=_481.display;
_482.img=_481.img;
_482.imgOpen=_481.imgOpen;
_482.imgid=_481.imgid;
_482.spanid=_481.spanid;
_482.childrenfetched=_481.childrenfetched;
return _482;
};
ColdFusion.Tree.initializeTree=function(_483,_484,_485,bold,_487,_488,_489,_48a,_48b,_48c,_48d,_48e){
var _48f=new YAHOO.widget.TreeView(_483);
_48f.subscribe("expand",ColdFusion.Tree.onExpand);
_48f.subscribe("collapse",ColdFusion.Tree.onCollapse);
_48f.subscribe("labelClick",ColdFusion.Tree.onLabelClick);
_48f._cf_getAttribute=function(_490){
_490=_490.toUpperCase();
if(_490=="PATH"){
return _48f._cf_path;
}else{
if(_490=="NODE"){
return _48f._cf_node;
}else{
return null;
}
}
};
_48f.onbinderror=_48c;
ColdFusion.objectCache[_483]=_48f;
var _491=new ColdFusion.Tree.AttributesCollection();
_491.cache=_484;
_491.italic=_485;
_491.bold=bold;
_491.completepath=_487;
_491.delimiter=_489;
_491.appendkey=_488;
_491.formname=_48a;
_491.formparamname=_48b;
_491.fontsize=_48d;
_491.fontname=_48e;
ColdFusion.objectCache[_483+"collection"]=_491;
ColdFusion.Log.info("tree.initializetree.success","widget",[_483]);
return _48f;
};
