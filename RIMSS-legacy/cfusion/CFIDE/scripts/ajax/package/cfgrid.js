/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
cfinitgrid=function(){
if(!ColdFusion.Grid){
ColdFusion.Grid={};
}
var $G=ColdFusion.Grid;
var $L=ColdFusion.Log;
$G.init=function(id,name,_270,_271,edit,_273,_274,_275,_276,_277,_278,_279,_27a,_27b,_27c,_27d,_27e,_27f,_280,_281,_282,_283,_284,_285,_286,_287,_288,_289,_28a){
var grid;
var _28c;
var _28d=false;
if(_27f&&typeof (_27f)!="undefined"){
_28c=_27f;
_28d=true;
}else{
_28c=new Ext.grid.RowSelectionModel({singleSelect:true});
}
var _28e=new Ext.grid.ColumnModel(_276);
var _28f={ds:_277,cm:_28e,sm:_28c,autoSizeColumns:_274,autoSizeHeaders:_274,stripeRows:_27a,autoExpandColumnId:_275};
if(_289!=null&&typeof _289!="undefined"){
_28f.plugins=_289;
}
if(!_278||typeof (_278)=="undefined"){
_278=100*(_276.length-1);
}
var _290=ColdFusion.objectCache[id];
var _291=document.getElementById(_290.gridId);
if(_291!=null){
var _292=_291.style.cssText;
if(typeof _292=="undefined"){
_292="";
}
_292="width:"+_278+"px;"+_292;
_291.style.cssText=_292;
}
_28f.width=_278;
if(_274===true){
_28f.viewConfig={forceFit:true};
}else{
if(_27f&&typeof (_27f)!="undefined"){
_28f.autoExpandColumn=_275;
}else{
_28f.autoExpandColumn=_275;
}
}
if(_279){
_28f.height=_279;
}else{
_28f.autoHeight=true;
var _293=".x-grid3-header {position: relative;}";
Ext.util.CSS.createStyleSheet(_293,"_cf_grid"+id);
}
if(_281&&typeof (_281)!="undefined"){
_28f.view=new Ext.grid.GroupingView({forceFit:false,groupTextTpl:"{[values.text.indexOf(\"x-grid3-check-col\") > 0 ? (values.text.indexOf(\"x-grid3-check-col-on\") > 0 ? \"Yes\" : \"No\") : values.text]} ({[values.rs.length]} {[values.rs.length > 1 ? \"Items\" : \"Item\"]})"});
}
_28f.title=_282;
_28f.collapsible=_280;
if(_280&&_282==null){
_28f.title="  ";
}
var _294=ColdFusion.objectCache[id];
_294.bindOnLoad=_273;
_294.dynamic=_271;
_294.styles=_27b;
_294.grouping=_281;
_294.onLoadFunction=_288;
_294.multiRowSelection=_28d;
_28f.renderTo=_294.gridId;
_28f.tbar=new Ext.Toolbar({hidden:true});
if(_271){
_28f.bbar=new Ext.PagingToolbar({pageSize:_27c,store:_277,emptyMsg:"No topics to display"});
if(_286&&(_283||_284)){
var _295=_28f.bbar;
if(_283){
_295.addButton({text:_283,handler:$G.insertRow,scope:_294});
_295.addButton({text:" save ",handler:$G.saveNewRecord,scope:_294});
_295.addButton({text:" cancel ",handler:$G.cancelNewRecord,scope:_294});
}
if(_284){
_295.addButton({text:_284,handler:$G.deleteRow,scope:_294});
}
}
}
if(edit&&!_271){
if(_283||_284){
var bbar=new Ext.Toolbar();
if(_283){
bbar.addButton({text:_283,xtype:"button",handler:$G.insertRow,scope:_294});
}
if(_284){
bbar.addButton({text:_284,handler:$G.deleteRow,scope:_294});
}
}else{
var bbar=new Ext.Toolbar({hidden:true});
}
_28f.bbar=bbar;
}
if(edit){
_28f.clicksToEdit=1;
grid=new Ext.grid.EditorGridPanel(_28f);
}else{
grid=new Ext.grid.GridPanel(_28f);
}
$G.Ext_caseInsensitive_sorting();
_277.addListener("load",$G.Actions.onLoad,_294,{delay:50});
grid.view.colMenu.addListener("beforeshow",function(menu){
var _298=_28e.getColumnCount();
for(var i=0;i<_298;i++){
if("CFGRIDROWINDEX"==_28e.getDataIndex(i)){
menu.remove(menu.items["items"][i]);
break;
}
}
},this);
_294.grid=grid;
grid.render();
if(!_271){
_277.addListener("load",$G.Actions.onLoad,_294,{delay:50});
_277.load();
}
if(_271){
_277.addListener("load",$G.Actions.onLoad,_294,{delay:50});
_277._cf_errorHandler=_287;
_277.proxy._cf_actions=_294;
_277.load({params:{start:0,limit:_27c}});
}else{
$G.applyStyles(_294);
}
if(_28a){
ColdFusion.Bind.register(_28a,{actions:_294},$G.bindHandler,false);
}
$L.info("grid.init.created","widget",[id]);
_294.init(id,name,_270,_285,_271,edit,_286,_287,_27e,_27c,_27d,_281);
};
$G.applyStyles=function(_29a){
if(_29a.stylesApplied){
return;
}
Ext.util.CSS.createStyleSheet(_29a.styles);
_29a.stylesApplied=true;
};
$G.bindHandler=function(e,_29c){
$G.refresh(_29c.actions.id);
};
$G.bindHandler._cf_bindhandler=true;
$G.refresh=function(_29d,_29e){
var _29f=ColdFusion.objectCache[_29d];
if(_29f&&$G.Actions.prototype.isPrototypeOf(_29f)==true){
var _2a0=_29f.grid.getStore();
if(_29f.dynamic){
_29f.editOldValue=null;
_29f.selectedRow=-1;
if(_29e){
_2a0.reload();
}else{
_2a0.lastOptions.page=1;
_2a0.currentPage=1;
_2a0.reload({params:{start:0,limit:_29f.pageSize}});
}
}
}else{
ColdFusion.handleError(null,"grid.refresh.notfound","widget",[_29d],null,null,true);
return;
}
if(_29f.multiRowSelection){
var _2a1=_29f.grid.getView().getHeaderCell(0);
if(_2a1!=null){
var _2a2=Ext.Element.get(_2a1).first();
if(_2a2){
_2a2.replaceClass("x-grid3-hd-checker-on");
}
}
}
$L.info("grid.refresh.success","widget",[_29d]);
};
$G.Ext_caseInsensitive_sorting=function(){
Ext.data.Store.prototype.sortData=function(f,_2a4){
_2a4=_2a4||"ASC";
var st=this.fields.get(f).sortType;
var fn=function(r1,r2){
var v1=st(r1.data[f]),v2=st(r2.data[f]);
if(v1.toLowerCase){
v1=v1.toLowerCase();
v2=v2.toLowerCase();
}
return v1>v2?1:(v1<v2?-1:0);
};
this.data.sort(_2a4,fn);
if(this.snapshot&&this.snapshot!=this.data){
this.snapshot.sort(_2a4,fn);
}
};
};
$G.getTopToolbar=function(_2aa){
var _2ab=ColdFusion.objectCache[_2aa];
if(!_2ab){
ColdFusion.handleError(null,"grid.getTopToolbar.notfound","widget",[_2aa],null,null,true);
return;
}
return _2ab.grid.getTopToolbar();
};
$G.showTopToolbar=function(_2ac){
var _2ad=ColdFusion.objectCache[_2ac];
if(!_2ad){
ColdFusion.handleError(null,"grid.showTopToolbar.notfound","widget",[_2ac],null,null,true);
return;
}
var tbar=_2ad.grid.getTopToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.showTopToolbar.toolbarNotDefined","widget",[_2ac],null,null,true);
return;
}
tbar.show();
};
$G.hideTopToolbar=function(_2af){
var _2b0=ColdFusion.objectCache[_2af];
if(!_2b0){
ColdFusion.handleError(null,"grid.hideTopToolbar.notfound","widget",[_2af],null,null,true);
return;
}
var tbar=_2b0.grid.getTopToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.hideTopToolbar.toolbarNotDefined","widget",[_2af],null,null,true);
return;
}
tbar.hide();
};
$G.refreshTopToolbar=function(_2b2){
var _2b3=ColdFusion.objectCache[_2b2];
if(!_2b3){
ColdFusion.handleError(null,"grid.refreshTopToolbar.notfound","widget",[_2b2],null,null,true);
return;
}
var tbar=_2b3.grid.getTopToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.refreshTopToolbar.toolbarNotDefined","widget",[_2b2],null,null,true);
return;
}
tbar.doLayout();
if(tbar.isVisible()==false){
tbar.show();
}
};
$G.getBottomToolbar=function(_2b5){
var _2b6=ColdFusion.objectCache[_2b5];
if(!_2b6){
ColdFusion.handleError(null,"grid.getBottomToolbar.notfound","widget",[_2b5],null,null,true);
return;
}
return _2b6.grid.getBottomToolbar();
};
$G.showBottomToolbar=function(_2b7){
var _2b8=ColdFusion.objectCache[_2b7];
if(!_2b8){
ColdFusion.handleError(null,"grid.showBottomToolbar.notfound","widget",[_2b7],null,null,true);
return;
}
var tbar=_2b8.grid.getBottomToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.showBottomToolbar.toolbarNotDefined","widget",[_2b7],null,null,true);
return;
}
tbar.show();
};
$G.hideBottomToolbar=function(_2ba){
var _2bb=ColdFusion.objectCache[_2ba];
if(!_2bb){
ColdFusion.handleError(null,"grid.hideBottomToolbar.notfound","widget",[_2ba],null,null,true);
return;
}
var tbar=_2bb.grid.getBottomToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.hideBottomToolbar.toolbarNotDefined","widget",[_2ba],null,null,true);
return;
}
tbar.hide();
};
$G.refreshBottomToolbar=function(_2bd){
var _2be=ColdFusion.objectCache[_2bd];
if(!_2be){
ColdFusion.handleError(null,"grid.refreshBottomToolbar.notfound","widget",[_2bd],null,null,true);
return;
}
var tbar=_2be.grid.getBottomToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.refreshBottomToolbar.toolbarNotDefined","widget",[_2bd],null,null,true);
return;
}
tbar.doLayout();
if(tbar.isVisible()==false){
tbar.show();
}
};
$G.sort=function(_2c0,_2c1,_2c2){
var _2c3=ColdFusion.objectCache[_2c0];
if(!_2c3){
ColdFusion.handleError(null,"grid.sort.notfound","widget",[_2c0],null,null,true);
return;
}
_2c1=_2c1.toUpperCase();
var _2c4=-1;
var _2c5=_2c3.grid.getColumnModel().config;
for(var i=0;i<_2c5.length-1;i++){
if(_2c1==_2c5[i].colName){
_2c4=i;
break;
}
}
if(_2c4==-1){
ColdFusion.handleError(null,"grid.sort.colnotfound","widget",[_2c1,_2c0],null,null,true);
return;
}
if(!_2c2){
_2c2="ASC";
}
_2c2=_2c2.toUpperCase();
if(_2c2!="ASC"&&_2c2!="DESC"){
ColdFusion.handleError(null,"grid.sort.invalidsortdir","widget",[_2c2,_2c0],null,null,true);
return;
}
var _2c7=_2c3.grid.getStore();
_2c7.sort(_2c1,_2c2);
};
$G.getGridObject=function(_2c8){
if(!_2c8){
ColdFusion.handleError(null,"grid.getgridobject.missinggridname","widget",null,null,null,true);
return;
}
var _2c9=ColdFusion.objectCache[_2c8];
if(_2c9==null||$G.Actions.prototype.isPrototypeOf(_2c9)==false){
ColdFusion.handleError(null,"grid.getgridobject.notfound","widget",[_2c8],null,null,true);
return;
}
return _2c9.grid;
};
$G.getSelectedRows=function(_2ca){
if(!_2ca){
ColdFusion.handleError(null,"grid.getSelectedRowData.missinggridname","widget",null,null,null,true);
return;
}
var _2cb=ColdFusion.objectCache[_2ca];
var _2cc=new Array();
var _2cd=_2cb.grid.getSelectionModel();
var _2ce=_2cd.getSelections();
var _2cf=_2cb.grid.getColumnModel();
var _2d0=0;
if(_2cb.multiRowSelection===true&&_2cb.dynamic===false){
_2d0++;
}
for(i=0;i<_2ce.length;i++){
var _2d1=_2ce[i].data;
var _2d2={};
for(var _2d3=_2d0;_2d3<_2cf.getColumnCount()-1;_2d3++){
var key=_2cf.getDataIndex(_2d3);
_2d2[key]=_2d1[key];
}
_2cc[i]=_2d2;
}
return _2cc;
};
$G.clearSelectedRows=function(_2d5){
if(!_2d5){
ColdFusion.handleError(null,"grid.getSelectedRowData.missinggridname","widget",null,null,null,true);
return;
}
var _2d6=ColdFusion.objectCache[_2d5];
var _2d7=_2d6.grid.getSelectionModel();
_2d7.clearSelections();
if(_2d6.multiRowSelection){
var _2d8=_2d6.grid.getView().getHeaderCell(0);
if(_2d8!=null){
var _2d9=Ext.Element.get(_2d8).first();
if(_2d9){
_2d9.replaceClass("x-grid3-hd-checker-on");
}
}
}
};
$G.Actions=function(_2da){
this.gridId=_2da;
this.init=$G.Actions.init;
this.onChangeHandler=$G.Actions.onChangeHandler;
this.onChangeHandler_MultiRowsDelete=$G.Actions.onChangeHandler_MultiRowsDelete;
this.selectionChangeEvent=new ColdFusion.Event.CustomEvent("cfGridSelectionChange",_2da);
this.fireSelectionChangeEvent=$G.fireSelectionChangeEvent;
this._cf_getAttribute=$G.Actions._cf_getAttribute;
this._cf_register=$G.Actions._cf_register;
};
$G.Actions.init=function(id,_2dc,_2dd,_2de,_2df,edit,_2e1,_2e2,_2e3,_2e4,_2e5,_2e6){
this.id=id;
this.gridName=_2dc;
this.formId=_2dd;
this.form=document.getElementById(_2dd);
this.cellClickInfo=_2de;
this.edit=edit;
this.onChangeFunction=_2e1;
this.onErrorFunction=_2e2;
this.preservePageOnSort=_2e3;
this.pageSize=_2e4;
this.selectedRow=-1;
this.selectOnLoad=_2e5;
this.grouping=_2e6;
this.grid.addListener("cellclick",$G.cellClick,this,true);
this.editField=document.createElement("input");
this.editField.setAttribute("name",_2dc);
this.editField.setAttribute("type","hidden");
this.form.appendChild(this.editField);
if(edit){
if(!_2df){
var _2e7=this.grid.getColumnModel().config;
this.editFieldPrefix="__CFGRID__EDIT__=";
var i=0;
var _2e9=_2e7.length-1;
if(this.multiRowSelection===true&&this.dynamic===false){
i++;
_2e9--;
}
this.editFieldPrefix+=_2e9+$G.Actions.fieldSep;
var _2ea=true;
for(i;i<_2e7.length-1;i++){
if(!_2ea){
this.editFieldPrefix+=$G.Actions.fieldSep;
}
this.editFieldPrefix+=_2e7[i].colName;
this.editFieldPrefix+=$G.Actions.valueSep;
if(_2e7[i].editor){
this.editFieldPrefix+="Y";
}else{
this.editFieldPrefix+="N";
}
_2ea=false;
}
this.editFieldPrefix+=$G.Actions.fieldSep;
}
this.editFieldState=[];
this.editFieldState.length=this.grid.getStore().getTotalCount();
$G.Actions.computeEditField(this);
this.insertInProgress=false;
this.insertEvent=null;
this.grid.addListener("beforeedit",$G.Actions.beforeEdit,this,true);
this.grid.addListener("afteredit",$G.Actions.afterEdit,this,true);
}
if(_2df){
this.grid.getStore().addListener("beforeload",$G.Actions.beforeLoad,this,true);
}
this.grid.getSelectionModel().addListener("rowselect",$G.rowSelect,this,true);
this.grid.getSelectionModel().addListener("beforerowselect",$G.beforeRowSelect,this,true);
if(_2e5&&!_2e6){
this.grid.getSelectionModel().selectFirstRow();
}
};
$G.Actions.beforeLoad=function(_2eb,_2ec){
var _2ed=_2eb.getSortState();
var _2ee=((typeof this.sortCol!="undefined"&&_2ed.field!=this.sortCol)||(typeof this.direction!="undefined"&&_2ed.direction!=this.sortDir));
if(_2ee&&!this.preservePageOnSort){
_2ec.params.start=0;
}
this.sortCol=_2ed.field;
this.sortDir=_2ed.direction;
};
$G.Actions.onLoad=function(){
this.editOldValue=null;
this.selectedRow=-1;
this.insertInProgress=false;
var _2ef=0;
if((this.bindOnLoad||!this.dynamic)&&this.selectOnLoad&&!this.grouping){
this.grid.getSelectionModel().selectRow(_2ef,false);
}
if(!this.gridRendered&&this.onLoadFunction&&typeof this.onLoadFunction=="function"){
this.gridRendered=true;
this.onLoadFunction.call(null,this.grid);
}
};
$G.Actions._cf_getAttribute=function(_2f0){
_2f0=_2f0.toUpperCase();
var _2f1=this.selectedRow;
var _2f2=null;
if(_2f1!=0&&(!_2f1||_2f1==-1)){
return _2f2;
}
var ds=this.grid.getStore();
var _2f4=(this.dynamic)?ds.getAt(_2f1):ds.getById(_2f1);
_2f2=_2f4.get(_2f0);
return _2f2;
};
$G.Actions._cf_register=function(_2f5,_2f6,_2f7){
this.selectionChangeEvent.subscribe(_2f6,_2f7);
};
$G.rowSelect=function(_2f8,row){
var _2fa="";
var _2fb=_2f8.getSelected();
var _2fc=_2fb.get("CFGRIDROWINDEX")||row;
if(this.selectedRow!=_2fc){
this.selectedRow=_2fc;
var _2fd=true;
for(col in _2fb.data){
if(col=="CFGRIDROWINDEX"){
continue;
}
if(typeof col=="undefined"||col=="undefined"){
continue;
}
if(!_2fd){
_2fa+="; ";
}
_2fa+="__CFGRID__COLUMN__="+col+"; ";
_2fa+="__CFGRID__DATA__="+_2fb.data[col];
_2fd=false;
}
this.fireSelectionChangeEvent();
this.insertInProgress=false;
}
};
$G.beforeRowSelect=function(_2fe,row){
var ds=this.grid.getStore();
var _301=ds.getAt(row);
return !$G.isNullRow(_301.data);
};
$G.isNullRow=function(data){
var _303=true;
for(col in data){
if(data[col]!=null){
_303=false;
break;
}
}
return _303;
};
$G.fireSelectionChangeEvent=function(){
$L.info("grid.fireselectionchangeevent.fire","widget",[this.id]);
this.selectionChangeEvent.fire();
};
$G.cellClick=function(grid,_305,_306){
var _307=this.cellClickInfo.colInfo[_306];
if(_307){
var _308=grid.getSelectionModel().getSelected();
var url=_308.get(_307.href.toUpperCase());
if(!url){
url=_307.href;
}
var _30a=_307.hrefKey;
var _30b=_307.target;
var _30c=this.appendKey;
if(this.cellClickInfo.appendKey){
var _30d;
if(_30a||_30a==0){
var _30e=grid.getStore().getAt(_305);
var _30f=grid.getColumnModel().config[_30a].dataIndex;
_30d=_30e.get(_30f);
}else{
var _310=this.grid.getColumnModel().config;
_30d=_308.get(_310[0].dataIndex);
for(var i=1;i<_310.length-1;i++){
_30d+=","+_308.get(_310[i].dataIndex);
}
}
if(url.indexOf("?")!=-1){
url+="&CFGRIDKEY="+_30d;
}else{
url+="?CFGRIDKEY="+_30d;
}
}
if(_30b){
_30b=_30b.toLowerCase();
if(_30b=="_top"){
_30b="top";
}else{
if(_30b=="_parent"){
_30b="parent";
}else{
if(_30b=="_self"){
_30b=window.name;
}else{
if(_30b=="_blank"){
window.open(encodeURI(url));
return;
}
}
}
}
if(!parent[_30b]){
ColdFusion.handleError(null,"grid.cellclick.targetnotfound","widget",[_30b]);
return;
}
parent[_30b].location=encodeURI(url);
}else{
window.location=encodeURI(url);
}
}
};
$G.insertRow=function(){
if(this.insertInProgress&&this.dynamic){
ColdFusion.handleError(null,"Multiple row insert is not supported","Grid",[this.gridId],null,null,true);
return;
}
var _312={action:"I",values:[]};
var _313=this.grid.getColumnModel();
var _314=this.grid.getStore();
var _315={};
for(var i=0;i<_313.getColumnCount()-1;i++){
var _317="";
var _318=_313.getCellEditor(i,0);
if(_318&&Ext.form.Checkbox.prototype.isPrototypeOf(_318.field)){
_317=false;
}
_312.values[i]=[_317,_317];
_315[_313.getDataIndex(i)]=_317;
}
_315["CFGRIDROWINDEX"]=_314.getCount()+1;
_314.add(new Ext.data.Record(_315));
if(this.dynamic==true){
this.selectedRow=_314.getCount();
}
this.editFieldState.push(_312);
this.grid.getSelectionModel().selectRow(_314.getCount()-1);
this.insertInProgress=true;
$G.Actions.computeEditField(this);
};
$G.saveNewRecord=function(){
if(!this.insertInProgress){
return;
}
var _319=this.selectedRow;
var _31a=this.insertEvent;
if(_319==-1){
return;
}
if(this.onChangeFunction){
this.onChangeHandler("I",_319-1,_31a,$G.insertRowCallback);
}else{
if(this.dynamic==false){
var _31b=this.grid.getStore();
var _31c=_31a.record;
var _31d=new Array(1);
_31d[0]=_31c;
var _31e=_31b.getAt(this.selectedRow-1);
_31b.remove(_31e);
_31b.add(_31d);
}
}
this.insertInProgress=false;
this.insertEvent=null;
};
$G.cancelNewRecord=function(){
if(!this.insertInProgress){
return;
}
this.editFieldState.pop();
var _31f=this.grid.getStore();
var _320=_31f.getAt(this.selectedRow-1);
_31f.remove(_320);
this.insertInProgress=false;
this.insertEvent=null;
this.selectedRow=this.selectedrow-1;
};
$G.deleteRow=function(){
var _321=null;
var _322;
if(this.multiRowSelection===true){
var _323=this.grid.getSelectionModel();
_321=_323.getSelections();
}
if(_321==null){
_322=this.selectedRow;
}
if(_322==-1&&_321==null){
return;
}
if(this.onChangeFunction){
if(_321!=null){
this.onChangeHandler_MultiRowsDelete("D",_321,null,$G.deleteRowCallback);
}else{
this.onChangeHandler("D",_322,null,$G.deleteRowCallback);
}
}else{
if(!this.dynamic){
var _324=this.grid.getStore();
if(_321!=null){
for(i=0;i<_321.length;i++){
var _325=_324.indexOf(_321[i]);
var _326=this.editFieldState[_325];
if(_326){
_326.action="D";
}else{
_326=$G.Actions.initEditState(this,"D",_321[i],_325+1);
}
}
for(i=0;i<_321.length;i++){
_324.remove(_321[i]);
}
}else{
var _326=this.editFieldState[_322-1];
if(_326){
_326.action="D";
}else{
var _327=this.grid.getStore().getById(_322);
_326=$G.Actions.initEditState(this,"D",_327,_322);
}
_324.remove(this.grid.getSelectionModel().getSelected());
}
$G.Actions.computeEditField(this);
this.grid.stopEditing();
this.selectedRow=-1;
}
}
};
$G.deleteRowCallback=function(_328,_329){
var _32a=_329._cf_grid.getStore();
var _32b=_329._cf_grid_properties;
var _329=_32a.lastOptions.params;
var key="start";
if(_32a.getCount()==1){
if(_329.start>=_329.limit){
_329.start=_329.start-_329.limit;
}
_32a.reload(_329);
}else{
_32a.reload();
}
if(_32b.multiRowSelection){
var _32d=_32b.grid.getView().getHeaderCell(0);
if(_32d!=null){
var _32e=Ext.Element.get(_32d).first();
if(_32e){
_32e.replaceClass("x-grid3-hd-checker-on");
}
}
}
};
$G.insertRowCallback=function(_32f,_330){
var _331=_330._cf_grid.getStore();
var _332=_330._cf_grid.actions;
_331.reload();
};
$G.Actions.beforeEdit=function(_333){
if($G.isNullRow(_333.record.data)){
return false;
}
this.editColumn=_333.column;
this.editOldValue=_333.value;
};
$G.Actions.afterEdit=function(_334){
var _335=_334.value;
if(this.insertInProgress==false&&this.onChangeFunction){
this.onChangeHandler("U",this.selectedRow,_334);
}else{
if(!this.dynamic){
var _336=$G.computeActualRow_editField(this.editFieldState,this.selectedRow);
var _337=this.editFieldState[_336-1];
if(_337){
var _338=_334.column;
if(this.multiRowSelection===true&&this.insertInProgress==true){
_338=_338-1;
}
_337.values[_338][1]=_335;
}else{
var _339=this.grid.getStore().getById(this.selectedRow);
_337=$G.Actions.initEditState(this,"U",_339,_336);
var _33a=this.editOldValue+"";
if(_335.getDayOfYear){
if(_33a&&typeof _33a=="string"){
_33a=new Date(_33a);
}
_337.values[_334.column][1]=_335.format("F, j Y H:i:s");
_337.values[_334.column][0]=_33a?_33a.format("F, j Y H:i:s"):_33a;
}else{
_337.values[_334.column][0]=_33a;
_337.values[_334.column][1]=_335;
}
}
$G.Actions.computeEditField(this);
}
}
this.editOldValue=null;
this.fireSelectionChangeEvent();
};
$G.computeActualRow_editField=function(_33b,_33c){
if(_33b.length==_33c){
return _33c;
}
var _33d=0;
var _33e=0;
for(;_33e<_33b.length&&_33d<_33c;_33e++){
var _33f=_33b[_33e];
if(!_33f||_33f.action!="D"){
_33d++;
}
}
return _33e;
};
$G.Actions.onChangeHandler=function(_340,_341,_342,_343){
var _344={};
var _345={};
var data=_342?_342.record.data:this.grid.getStore().getAt(_341).data;
for(col in data){
_344[col]=data[col];
}
if(_340=="U"){
if((_342.value==null||_342.value=="")&&(_342.originalValue==null||_342.originalValue=="")){
return;
}
if(_342.value&&_342.value.getDayOfYear){
if(typeof _342.originalValue=="string"){
var _347=new Date(_342.originalValue);
}
if(_347!=null&&_347.getElapsed(_342.value)==0){
return;
}else{
_344[_342.field]=_342.originalValue;
_345[_342.field]=_342.value.format("F, j Y H:i:s");
}
}else{
_344[_342.field]=_342.originalValue;
_345[_342.field]=_342.value;
}
}
this.onChangeFunction(_340,_344,_345,_343,this.grid,this.onErrorFunction,this);
};
$G.Actions.onChangeHandler_MultiRowsDelete=function(_348,_349,_34a,_34b){
var _34c=new Array();
var _34d={};
for(i=0;i<_349.length;i++){
_34c[i]=_349[i].data;
}
this.onChangeFunction(_348,_34c,_34d,_34b,this.grid,this.onErrorFunction,this);
};
$G.Actions.initEditState=function(_34e,_34f,_350,_351){
var _352={action:_34f,values:[]};
var _353=_34e.grid.getColumnModel();
var _354=_353.getColumnCount()-1;
_352.values.length=_354;
var i=0;
if(_34e.multiRowSelection===true&&_34e.dynamic===false){
i=i++;
}
for(i;i<_354;i++){
var _356=_350.get(_353.getDataIndex(i));
_352.values[i]=[_356,_356];
}
_34e.editFieldState[_351-1]=_352;
return _352;
};
$G.Actions.fieldSep=eval("'\\u0001'");
$G.Actions.valueSep=eval("'\\u0002'");
$G.Actions.nullValue=eval("'\\u0003'");
$G.Actions.computeEditField=function(_357){
if(_357.dynamic){
return;
}
var _358=_357.editFieldPrefix;
var _359=_357.editFieldState;
var _35a=_357.grid.getColumnModel().config;
var _35b=0;
var _35c="";
for(var i=0;i<_359.length;i++){
var _35e=_359[i];
if(_35e){
_35b++;
_35c+=$G.Actions.fieldSep;
_35c+=_35e.action+$G.Actions.valueSep;
var _35f=_35e.values;
if(_357.multiRowSelection===true&&_357.dynamic===false&&_35e.action!="I"){
_35f=_35f.slice(1,_35f.length);
}
for(var j=0;j<_35f.length;j++){
if(j>0){
_35c+=$G.Actions.valueSep;
}
var _361=($G.Actions.isNull(_35f[j][0]))?$G.Actions.nullValue:_35f[j][0];
var _362=($G.Actions.isNull(_35f[j][1]))?$G.Actions.nullValue:_35f[j][1];
var _363=j;
if(_357.multiRowSelection===true){
_363++;
}
if(_35e.action!="I"||(_35e.action=="I"&&_35a[_363].editor)){
if(_35a[_363].type=="date"){
if(_362!=null&&_362!=$G.Actions.nullValue){
if(typeof _362=="string"){
_362=new Date(_362);
}
_362=_362.format("F, j Y H:i:s");
}
if(_361!=null&&_361!=$G.Actions.nullValue){
if(typeof _361=="string"){
_361=new Date(_361);
}
_361=_361.format("F, j Y H:i:s");
}
}
_35c+=_362;
if(_35e.action=="U"&&_35a[_363].editor){
_35c+=$G.Actions.valueSep+_361;
}
}
}
}
}
_358+=_35b+_35c;
_357.editField.setAttribute("value",_358);
};
$G.Actions.isNull=function(val){
var ret=(val==null||typeof (val)=="undefined"||val.length==0);
return ret;
};
$G.loadData=function(data,_367){
_367._cf_gridDataProxy.loadResponse(data,_367);
var _368=ColdFusion.objectCache[_367._cf_gridname];
$G.applyStyles(_368);
$L.info("grid.loaddata.loaded","widget",[_367._cf_gridname]);
if($G.Actions.isNull(data.TOTALROWCOUNT)==false&&data.TOTALROWCOUNT==0){
_368.fireSelectionChangeEvent();
}
};
$G.printObject=function(obj){
var str="";
for(key in obj){
str=str+"  "+key+"=";
value=obj[key];
str+=value;
}
return str;
};
$G.formatBoolean=function(v,p,_36d){
return "<div class=\"x-grid3-check-col"+(v?"-on":"")+" x-grid3-cc-"+this.id+"\">&#160;</div>";
};
$G.formatDate=function(_36e,p,_370){
if(_36e&&!_36e.dateFormat){
_36e=new Date(_36e);
}
var _371=this.dateFormat?this.dateFormat:"m/d/y";
return _36e?_36e.dateFormat(_371):"";
};
$G.convertDate=function(_372,p,_374){
if(_372&&!_372.dateFormat){
_372=new Date(_372);
}
var _375=this.dateFormat?this.dateFormat:"m/d/y";
return _372;
};
$G.ExtProxy=function(_376,_377){
this.api={load:true,create:undefined,save:undefined,destroy:undefined};
$G.ExtProxy.superclass.constructor.call(this);
this.bindHandler=_376;
this.errorHandler=_377;
};
Ext.extend($G.ExtProxy,Ext.data.DataProxy,{_cf_firstLoad:true,load:function(_378,_379,_37a,_37b,arg){
if(!this._cf_actions.bindOnLoad){
var _37d={"_cf_reader":_379,"_cf_grid_errorhandler":this.errorHandler,"_cf_scope":_37b,"_cf_gridDataProxy":this,"_cf_gridname":this._cf_gridName,"_cf_arg":arg,"_cf_callback":_37a,"ignoreData":true};
var data=[];
for(i=0;i<_378.limit;i++){
data.push(new Ext.data.Record({}));
}
this.loadResponse(data,_37d);
this._cf_actions.bindOnLoad=true;
}else{
var _37f=(_378.start/_378.limit)+1;
if(!_378.sort){
_378.sort="";
}
if(!_378.dir){
_378.dir="";
}
this.bindHandler(this,_37f,_378.limit,_378.sort,_378.dir,this.errorHandler,_37a,_37b,arg,_379);
}
},loadResponse:function(data,_381){
var _382=null;
if(_381.ignoreData){
_382={success:true,records:data,totalRecords:data.length};
}else{
var _383;
if(!data){
_383="grid.extproxy.loadresponse.emptyresponse";
}else{
if(!data.TOTALROWCOUNT&&data.TOTALROWCOUNT!=0){
_383="grid.extproxy.loadresponse.totalrowcountmissing";
}else{
if(!ColdFusion.Util.isInteger(data.TOTALROWCOUNT)){
_383="grid.extproxy.loadresponse.totalrowcountinvalid";
}else{
if(!data.QUERY){
_383="grid.extproxy.loadresponse.querymissing";
}else{
if(!data.QUERY.COLUMNS||!ColdFusion.Util.isArray(data.QUERY.COLUMNS)||!data.QUERY.DATA||!ColdFusion.Util.isArray(data.QUERY.DATA)||(data.QUERY.DATA.length>0&&!ColdFusion.Util.isArray(data.QUERY.DATA[0]))){
_383="grid.extproxy.loadresponse.queryinvalid";
}
}
}
}
}
if(_383){
ColdFusion.handleError(_381._cf_grid_errorHandler,_383,"widget");
this.fireEvent("loadexception",this,_381,data,e);
return;
}
_382=_381._cf_reader.readRecords(data);
}
this.fireEvent("load",this,_381,_381._cf_arg);
_381._cf_callback.call(_381._cf_scope,_382,_381._cf_arg,true);
},update:function(_384){
},updateResponse:function(_385){
}});
$G.ExtReader=function(_386){
this.recordType=Ext.data.Record.create(_386);
};
Ext.extend($G.ExtReader,Ext.data.DataReader,{readRecords:function(_387){
var _388=[];
var cols=_387.QUERY.COLUMNS;
var data=_387.QUERY.DATA;
for(var i=0;i<data.length;i++){
var _38c={};
for(var j=0;j<cols.length;j++){
_38c[cols[j]]=data[i][j];
}
_388.push(new Ext.data.Record(_38c));
}
return {success:true,records:_388,totalRecords:_387.TOTALROWCOUNT};
}});
$G.CheckColumn=function(_38e){
Ext.apply(this,_38e);
if(!this.id){
this.id=Ext.id();
}
this.renderer=this.renderer.createDelegate(this);
};
$G.CheckColumn.prototype={init:function(grid){
this.grid=grid;
this.count=0;
this.columnIndex=this.grid.getColumnModel().findColumnIndex(this.dataIndex);
this.grid.on("render",function(){
var view=this.grid.getView();
if(this.editable==true){
view.mainBody.on("mousedown",this.onMouseDown,this);
}
},this);
},onMouseDown:function(e,t){
if(t.className&&t.className.indexOf("x-grid3-cc-"+this.id)!=-1){
e.stopEvent();
var _393=this.grid.getView().findRowIndex(t);
var _394=this.grid.store.getAt(_393);
var _395=ColdFusion.clone(_394);
_395.data=ColdFusion.clone(_394.data);
this.grid.getSelectionModel().selectRow(_393);
this.grid.getSelectionModel().fireEvent("rowselect",this.grid.getSelectionModel(),_393);
this.grid.fireEvent("beforeedit",{grid:this.grid,row:_393,record:_394,column:this.columnIndex,field:this.dataIndex,value:_394.data[this.dataIndex]});
_394.set(this.dataIndex,this.toggleBooleanValue(_394.data[this.dataIndex]));
this.grid.fireEvent("afteredit",{grid:this.grid,row:_393,record:_395,column:this.columnIndex,field:this.dataIndex,value:_394.data[this.dataIndex],originalValue:_395.data[this.dataIndex]});
}
},toggleBooleanValue:function(v){
v=typeof v=="undefined"?"N":(typeof v=="string"?v.toUpperCase():v);
if(v==="Y"){
return "N";
}
if(v==="N"){
return "Y";
}
if(v===true){
return false;
}
if(v===false){
return true;
}
if(v===0){
return 1;
}
if(v===1){
return 0;
}
if(v==="YES"){
return "NO";
}
if(v==="NO"){
return "YES";
}
if(v==="T"){
return "F";
}
if(v==="F"){
return "T";
}
return "Y";
},renderer:function(v,p,_399){
p.css+=" x-grid3-check-col-td";
var _39a=false;
v=(typeof v=="string")?v.toUpperCase():v;
if(typeof v!="undefined"&&(v==1||v=="1"||v=="Y"||v=="YES"||v===true||v==="T")){
_39a=true;
}
return "<div class=\"x-grid3-check-col"+(_39a==true?"-on":"")+" x-grid3-cc-"+this.id+"\">&#160;</div>";
}};
};
cfinitgrid();
