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
$G.init=function(id,name,_505,_506,edit,_508,_509,_50a,_50b,_50c,_50d,_50e,_50f,_510,_511,_512,_513,_514,_515,_516,_517,_518,_519,_51a,_51b,_51c,_51d,_51e,_51f){
var grid;
var _521;
var _522=false;
if(_514&&typeof (_514)!="undefined"){
_521=_514;
_522=true;
}else{
_521=new Ext.grid.RowSelectionModel({singleSelect:true});
}
var _523=new Ext.grid.ColumnModel(_50b);
var _524={ds:_50c,cm:_523,sm:_521,autoSizeColumns:_509,autoSizeHeaders:_509,stripeRows:_50f,autoExpandColumnId:_50a};
if(_51e!=null&&typeof _51e!="undefined"){
_524.plugins=_51e;
}
if(!_50d||typeof (_50d)=="undefined"){
_50d=100*(_50b.length-1);
}
var _525=ColdFusion.objectCache[id];
var _526=document.getElementById(_525.gridId);
if(_526!=null){
var _527=_526.style.cssText;
if(typeof _527=="undefined"){
_527="";
}
_527="width:"+_50d+"px;"+_527;
_526.style.cssText=_527;
}
_524.width=_50d;
if(_509===true){
_524.viewConfig={forceFit:true};
}else{
if(_514&&typeof (_514)!="undefined"){
_524.autoExpandColumn=_50a;
}else{
_524.autoExpandColumn=_50a;
}
}
if(_50e){
_524.height=_50e;
}else{
_524.autoHeight=true;
var _528=".x-grid3-header {position: relative;}";
Ext.util.CSS.createStyleSheet(_528,"_cf_grid"+id);
}
if(_516&&typeof (_516)!="undefined"){
_524.view=new Ext.grid.GroupingView({forceFit:false,groupTextTpl:"{[values.text.indexOf(\"x-grid3-check-col\") > 0 ? (values.text.indexOf(\"x-grid3-check-col-on\") > 0 ? \"Yes\" : \"No\") : values.text]} ({[values.rs.length]} {[values.rs.length > 1 ? \"Items\" : \"Item\"]})"});
}
_524.title=_517;
_524.collapsible=_515;
if(_515&&_517==null){
_524.title="  ";
}
var _529=ColdFusion.objectCache[id];
_529.bindOnLoad=_508;
_529.dynamic=_506;
_529.styles=_510;
_529.grouping=_516;
_529.onLoadFunction=_51d;
_529.multiRowSelection=_522;
_524.renderTo=_529.gridId;
_524.tbar=new Ext.Toolbar({hidden:true});
if(_506){
_524.bbar=new Ext.PagingToolbar({pageSize:_511,store:_50c,emptyMsg:"No topics to display"});
if(_51b&&(_518||_519)){
var _52a=_524.bbar;
if(_518){
_52a.addButton({text:_518,handler:$G.insertRow,scope:_529});
_52a.addButton({text:" save ",handler:$G.saveNewRecord,scope:_529});
_52a.addButton({text:" cancel ",handler:$G.cancelNewRecord,scope:_529});
}
if(_519){
_52a.addButton({text:_519,handler:$G.deleteRow,scope:_529});
}
}
}
if(edit&&!_506){
if(_518||_519){
var bbar=new Ext.Toolbar();
if(_518){
bbar.addButton({text:_518,xtype:"button",handler:$G.insertRow,scope:_529});
}
if(_519){
bbar.addButton({text:_519,handler:$G.deleteRow,scope:_529});
}
}else{
var bbar=new Ext.Toolbar({hidden:true});
}
_524.bbar=bbar;
}
if(edit){
_524.clicksToEdit=1;
grid=new Ext.grid.EditorGridPanel(_524);
}else{
grid=new Ext.grid.GridPanel(_524);
}
$G.Ext_caseInsensitive_sorting();
_50c.addListener("load",$G.Actions.onLoad,_529,{delay:50});
grid.view.colMenu.addListener("beforeshow",function(menu){
var _52d=_523.getColumnCount();
for(var i=0;i<_52d;i++){
if("CFGRIDROWINDEX"==_523.getDataIndex(i)){
menu.remove(menu.items["items"][i]);
break;
}
}
},this);
_529.grid=grid;
grid.render();
if(!_506){
_50c.addListener("load",$G.Actions.onLoad,_529,{delay:50});
_50c.load();
}
if(_506){
_50c.addListener("load",$G.Actions.onLoad,_529,{delay:50});
_50c._cf_errorHandler=_51c;
_50c.proxy._cf_actions=_529;
_50c.load({params:{start:0,limit:_511}});
}else{
$G.applyStyles(_529);
}
if(_51f){
ColdFusion.Bind.register(_51f,{actions:_529},$G.bindHandler,false);
}
$L.info("grid.init.created","widget",[id]);
_529.init(id,name,_505,_51a,_506,edit,_51b,_51c,_513,_511,_512,_516);
};
$G.applyStyles=function(_52f){
if(_52f.stylesApplied){
return;
}
Ext.util.CSS.createStyleSheet(_52f.styles);
_52f.stylesApplied=true;
};
$G.bindHandler=function(e,_531){
$G.refresh(_531.actions.id);
};
$G.bindHandler._cf_bindhandler=true;
$G.refresh=function(_532,_533){
var _534=ColdFusion.objectCache[_532];
if(_534&&$G.Actions.prototype.isPrototypeOf(_534)==true){
var _535=_534.grid.getStore();
if(_534.dynamic){
_534.editOldValue=null;
_534.selectedRow=-1;
if(_533){
_535.reload();
}else{
_535.reload({params:{start:0,limit:_534.pageSize}});
}
}
}else{
ColdFusion.handleError(null,"grid.refresh.notfound","widget",[_532],null,null,true);
return;
}
if(_534.multiRowSelection){
var _536=_534.grid.getView().getHeaderCell(0);
if(_536!=null){
var _537=Ext.Element.get(_536).first();
if(_537){
_537.replaceClass("x-grid3-hd-checker-on");
}
}
}
$L.info("grid.refresh.success","widget",[_532]);
};
$G.Ext_caseInsensitive_sorting=function(){
Ext.data.Store.prototype.sortData=function(f,_539){
_539=_539||"ASC";
var st=this.fields.get(f).sortType;
var fn=function(r1,r2){
var v1=st(r1.data[f]),v2=st(r2.data[f]);
if(v1.toLowerCase){
v1=v1.toLowerCase();
v2=v2.toLowerCase();
}
return v1>v2?1:(v1<v2?-1:0);
};
this.data.sort(_539,fn);
if(this.snapshot&&this.snapshot!=this.data){
this.snapshot.sort(_539,fn);
}
};
};
$G.getTopToolbar=function(_53f){
var _540=ColdFusion.objectCache[_53f];
if(!_540){
ColdFusion.handleError(null,"grid.getTopToolbar.notfound","widget",[_53f],null,null,true);
return;
}
return _540.grid.getTopToolbar();
};
$G.showTopToolbar=function(_541){
var _542=ColdFusion.objectCache[_541];
if(!_542){
ColdFusion.handleError(null,"grid.showTopToolbar.notfound","widget",[_541],null,null,true);
return;
}
var tbar=_542.grid.getTopToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.showTopToolbar.toolbarNotDefined","widget",[_541],null,null,true);
return;
}
tbar.show();
};
$G.hideTopToolbar=function(_544){
var _545=ColdFusion.objectCache[_544];
if(!_545){
ColdFusion.handleError(null,"grid.hideTopToolbar.notfound","widget",[_544],null,null,true);
return;
}
var tbar=_545.grid.getTopToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.hideTopToolbar.toolbarNotDefined","widget",[_544],null,null,true);
return;
}
tbar.hide();
};
$G.refreshTopToolbar=function(_547){
var _548=ColdFusion.objectCache[_547];
if(!_548){
ColdFusion.handleError(null,"grid.refreshTopToolbar.notfound","widget",[_547],null,null,true);
return;
}
var tbar=_548.grid.getTopToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.refreshTopToolbar.toolbarNotDefined","widget",[_547],null,null,true);
return;
}
tbar.doLayout();
if(tbar.isVisible()==false){
tbar.show();
}
};
$G.getBottomToolbar=function(_54a){
var _54b=ColdFusion.objectCache[_54a];
if(!_54b){
ColdFusion.handleError(null,"grid.getBottomToolbar.notfound","widget",[_54a],null,null,true);
return;
}
return _54b.grid.getBottomToolbar();
};
$G.showBottomToolbar=function(_54c){
var _54d=ColdFusion.objectCache[_54c];
if(!_54d){
ColdFusion.handleError(null,"grid.showBottomToolbar.notfound","widget",[_54c],null,null,true);
return;
}
var tbar=_54d.grid.getBottomToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.showBottomToolbar.toolbarNotDefined","widget",[_54c],null,null,true);
return;
}
tbar.show();
};
$G.hideBottomToolbar=function(_54f){
var _550=ColdFusion.objectCache[_54f];
if(!_550){
ColdFusion.handleError(null,"grid.hideBottomToolbar.notfound","widget",[_54f],null,null,true);
return;
}
var tbar=_550.grid.getBottomToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.hideBottomToolbar.toolbarNotDefined","widget",[_54f],null,null,true);
return;
}
tbar.hide();
};
$G.refreshBottomToolbar=function(_552){
var _553=ColdFusion.objectCache[_552];
if(!_553){
ColdFusion.handleError(null,"grid.refreshBottomToolbar.notfound","widget",[_552],null,null,true);
return;
}
var tbar=_553.grid.getBottomToolbar();
if(!tbar){
ColdFusion.handleError(null,"grid.refreshBottomToolbar.toolbarNotDefined","widget",[_552],null,null,true);
return;
}
tbar.doLayout();
if(tbar.isVisible()==false){
tbar.show();
}
};
$G.sort=function(_555,_556,_557){
var _558=ColdFusion.objectCache[_555];
if(!_558){
ColdFusion.handleError(null,"grid.sort.notfound","widget",[_555],null,null,true);
return;
}
_556=_556.toUpperCase();
var _559=-1;
var _55a=_558.grid.getColumnModel().config;
for(var i=0;i<_55a.length-1;i++){
if(_556==_55a[i].colName){
_559=i;
break;
}
}
if(_559==-1){
ColdFusion.handleError(null,"grid.sort.colnotfound","widget",[_556,_555],null,null,true);
return;
}
if(!_557){
_557="ASC";
}
_557=_557.toUpperCase();
if(_557!="ASC"&&_557!="DESC"){
ColdFusion.handleError(null,"grid.sort.invalidsortdir","widget",[_557,_555],null,null,true);
return;
}
var _55c=_558.grid.getStore();
_55c.sort(_556,_557);
};
$G.getGridObject=function(_55d){
if(!_55d){
ColdFusion.handleError(null,"grid.getgridobject.missinggridname","widget",null,null,null,true);
return;
}
var _55e=ColdFusion.objectCache[_55d];
if(_55e==null||$G.Actions.prototype.isPrototypeOf(_55e)==false){
ColdFusion.handleError(null,"grid.getgridobject.notfound","widget",[_55d],null,null,true);
return;
}
return _55e.grid;
};
$G.getSelectedRows=function(_55f){
if(!_55f){
ColdFusion.handleError(null,"grid.getSelectedRowData.missinggridname","widget",null,null,null,true);
return;
}
var _560=ColdFusion.objectCache[_55f];
var _561=new Array();
var _562=_560.grid.getSelectionModel();
var _563=_562.getSelections();
var _564=_560.grid.getColumnModel();
var _565=0;
if(_560.multiRowSelection===true&&_560.dynamic===false){
_565++;
}
for(i=0;i<_563.length;i++){
var _566=_563[i].data;
var _567={};
for(var _568=_565;_568<_564.getColumnCount()-1;_568++){
var key=_564.getDataIndex(_568);
_567[key]=_566[key];
}
_561[i]=_567;
}
return _561;
};
$G.clearSelectedRows=function(_56a){
if(!_56a){
ColdFusion.handleError(null,"grid.getSelectedRowData.missinggridname","widget",null,null,null,true);
return;
}
var _56b=ColdFusion.objectCache[_56a];
var _56c=_56b.grid.getSelectionModel();
_56c.clearSelections();
if(_56b.multiRowSelection){
var _56d=_56b.grid.getView().getHeaderCell(0);
if(_56d!=null){
var _56e=Ext.Element.get(_56d).first();
if(_56e){
_56e.replaceClass("x-grid3-hd-checker-on");
}
}
}
};
$G.Actions=function(_56f){
this.gridId=_56f;
this.init=$G.Actions.init;
this.onChangeHandler=$G.Actions.onChangeHandler;
this.onChangeHandler_MultiRowsDelete=$G.Actions.onChangeHandler_MultiRowsDelete;
this.selectionChangeEvent=new ColdFusion.Event.CustomEvent("cfGridSelectionChange",_56f);
this.fireSelectionChangeEvent=$G.fireSelectionChangeEvent;
this._cf_getAttribute=$G.Actions._cf_getAttribute;
this._cf_register=$G.Actions._cf_register;
};
$G.Actions.init=function(id,_571,_572,_573,_574,edit,_576,_577,_578,_579,_57a,_57b){
this.id=id;
this.gridName=_571;
this.formId=_572;
this.form=document.getElementById(_572);
this.cellClickInfo=_573;
this.edit=edit;
this.onChangeFunction=_576;
this.onErrorFunction=_577;
this.preservePageOnSort=_578;
this.pageSize=_579;
this.selectedRow=-1;
this.selectOnLoad=_57a;
this.grouping=_57b;
this.grid.addListener("cellclick",$G.cellClick,this,true);
this.editField=document.createElement("input");
this.editField.setAttribute("name",_571);
this.editField.setAttribute("type","hidden");
this.form.appendChild(this.editField);
if(edit){
if(!_574){
var _57c=this.grid.getColumnModel().config;
this.editFieldPrefix="__CFGRID__EDIT__=";
var i=0;
var _57e=_57c.length-1;
if(this.multiRowSelection===true&&this.dynamic===false){
i++;
_57e--;
}
this.editFieldPrefix+=_57e+$G.Actions.fieldSep;
var _57f=true;
for(i;i<_57c.length-1;i++){
if(!_57f){
this.editFieldPrefix+=$G.Actions.fieldSep;
}
this.editFieldPrefix+=_57c[i].colName;
this.editFieldPrefix+=$G.Actions.valueSep;
if(_57c[i].editor){
this.editFieldPrefix+="Y";
}else{
this.editFieldPrefix+="N";
}
_57f=false;
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
if(_574){
this.grid.getStore().addListener("beforeload",$G.Actions.beforeLoad,this,true);
}
this.grid.getSelectionModel().addListener("rowselect",$G.rowSelect,this,true);
this.grid.getSelectionModel().addListener("beforerowselect",$G.beforeRowSelect,this,true);
if(_57a&&!_57b){
this.grid.getSelectionModel().selectFirstRow();
}
};
$G.Actions.beforeLoad=function(_580,_581){
var _582=_580.getSortState();
var _583=((typeof this.sortCol!="undefined"&&_582.field!=this.sortCol)||(typeof this.direction!="undefined"&&_582.direction!=this.sortDir));
if(_583&&!this.preservePageOnSort){
_581.params.start=0;
}
this.sortCol=_582.field;
this.sortDir=_582.direction;
};
$G.Actions.onLoad=function(){
this.editOldValue=null;
this.selectedRow=-1;
this.insertInProgress=false;
var _584=0;
if((this.bindOnLoad||!this.dynamic)&&this.selectOnLoad&&!this.grouping){
this.grid.getSelectionModel().selectRow(_584,false);
}
if(!this.gridRendered&&this.onLoadFunction&&typeof this.onLoadFunction=="function"){
this.gridRendered=true;
this.onLoadFunction.call(null,this.grid);
}
};
$G.Actions._cf_getAttribute=function(_585){
_585=_585.toUpperCase();
var _586=this.selectedRow;
var _587=null;
if(_586!=0&&(!_586||_586==-1)){
return _587;
}
var ds=this.grid.getStore();
var _589=(this.dynamic)?ds.getAt(_586):ds.getById(_586);
_587=_589.get(_585);
return _587;
};
$G.Actions._cf_register=function(_58a,_58b,_58c){
this.selectionChangeEvent.subscribe(_58b,_58c);
};
$G.rowSelect=function(_58d,row){
var _58f="";
var _590=_58d.getSelected();
var _591=_590.get("CFGRIDROWINDEX")||row;
if(this.selectedRow!=_591){
this.selectedRow=_591;
var _592=true;
for(col in _590.data){
if(col=="CFGRIDROWINDEX"){
continue;
}
if(typeof col=="undefined"||col=="undefined"){
continue;
}
if(!_592){
_58f+="; ";
}
_58f+="__CFGRID__COLUMN__="+col+"; ";
_58f+="__CFGRID__DATA__="+_590.data[col];
_592=false;
}
this.fireSelectionChangeEvent();
this.insertInProgress=false;
}
};
$G.beforeRowSelect=function(_593,row){
var ds=this.grid.getStore();
var _596=ds.getAt(row);
return !$G.isNullRow(_596.data);
};
$G.isNullRow=function(data){
var _598=true;
for(col in data){
if(data[col]!=null){
_598=false;
break;
}
}
return _598;
};
$G.fireSelectionChangeEvent=function(){
$L.info("grid.fireselectionchangeevent.fire","widget",[this.id]);
this.selectionChangeEvent.fire();
};
$G.cellClick=function(grid,_59a,_59b){
var _59c=this.cellClickInfo.colInfo[_59b];
if(_59c){
var _59d=grid.getSelectionModel().getSelected();
var url=_59d.get(_59c.href.toUpperCase());
if(!url){
url=_59c.href;
}
var _59f=_59c.hrefKey;
var _5a0=_59c.target;
var _5a1=this.appendKey;
if(this.cellClickInfo.appendKey){
var _5a2;
if(_59f||_59f==0){
var _5a3=grid.getStore().getAt(_59a);
var _5a4=grid.getColumnModel().config[_59f].dataIndex;
_5a2=_5a3.get(_5a4);
}else{
var _5a5=this.grid.getColumnModel().config;
_5a2=_59d.get(_5a5[0].dataIndex);
for(var i=1;i<_5a5.length-1;i++){
_5a2+=","+_59d.get(_5a5[i].dataIndex);
}
}
if(url.indexOf("?")!=-1){
url+="&CFGRIDKEY="+_5a2;
}else{
url+="?CFGRIDKEY="+_5a2;
}
}
if(_5a0){
_5a0=_5a0.toLowerCase();
if(_5a0=="_top"){
_5a0="top";
}else{
if(_5a0=="_parent"){
_5a0="parent";
}else{
if(_5a0=="_self"){
_5a0=window.name;
}else{
if(_5a0=="_blank"){
window.open(encodeURI(url));
return;
}
}
}
}
if(!parent[_5a0]){
ColdFusion.handleError(null,"grid.cellclick.targetnotfound","widget",[_5a0]);
return;
}
parent[_5a0].location=encodeURI(url);
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
var _5a7={action:"I",values:[]};
var _5a8=this.grid.getColumnModel();
var _5a9=this.grid.getStore();
var _5aa={};
for(var i=0;i<_5a8.getColumnCount()-1;i++){
var _5ac="";
var _5ad=_5a8.getCellEditor(i,0);
if(_5ad&&Ext.form.Checkbox.prototype.isPrototypeOf(_5ad.field)){
_5ac=false;
}
_5a7.values[i]=[_5ac,_5ac];
_5aa[_5a8.getDataIndex(i)]=_5ac;
}
_5aa["CFGRIDROWINDEX"]=_5a9.getCount()+1;
_5a9.add(new Ext.data.Record(_5aa));
if(this.dynamic==true){
this.selectedRow=_5a9.getCount();
}
this.editFieldState.push(_5a7);
this.grid.getSelectionModel().selectRow(_5a9.getCount()-1);
this.insertInProgress=true;
$G.Actions.computeEditField(this);
};
$G.saveNewRecord=function(){
if(!this.insertInProgress){
return;
}
var _5ae=this.selectedRow;
var _5af=this.insertEvent;
if(_5ae==-1){
return;
}
if(this.onChangeFunction){
this.onChangeHandler("I",_5ae-1,_5af,$G.insertRowCallback);
}else{
if(this.dynamic==false){
var _5b0=this.grid.getStore();
var _5b1=_5af.record;
var _5b2=new Array(1);
_5b2[0]=_5b1;
var _5b3=_5b0.getAt(this.selectedRow-1);
_5b0.remove(_5b3);
_5b0.add(_5b2);
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
var _5b4=this.grid.getStore();
var _5b5=_5b4.getAt(this.selectedRow-1);
_5b4.remove(_5b5);
this.insertInProgress=false;
this.insertEvent=null;
this.selectedRow=this.selectedrow-1;
};
$G.deleteRow=function(){
var _5b6=null;
var _5b7;
if(this.multiRowSelection===true){
var _5b8=this.grid.getSelectionModel();
_5b6=_5b8.getSelections();
}
if(_5b6==null){
_5b7=this.selectedRow;
}
if(_5b7==-1&&_5b6==null){
return;
}
if(this.onChangeFunction){
if(_5b6!=null){
this.onChangeHandler_MultiRowsDelete("D",_5b6,null,$G.deleteRowCallback);
}else{
this.onChangeHandler("D",_5b7,null,$G.deleteRowCallback);
}
}else{
if(!this.dynamic){
var _5b9=this.grid.getStore();
if(_5b6!=null){
for(i=0;i<_5b6.length;i++){
var _5ba=_5b9.indexOf(_5b6[i]);
var _5bb=this.editFieldState[_5ba];
if(_5bb){
_5bb.action="D";
}else{
_5bb=$G.Actions.initEditState(this,"D",_5b6[i],_5ba+1);
}
}
for(i=0;i<_5b6.length;i++){
_5b9.remove(_5b6[i]);
}
}else{
var _5bb=this.editFieldState[_5b7-1];
if(_5bb){
_5bb.action="D";
}else{
var _5bc=this.grid.getStore().getById(_5b7);
_5bb=$G.Actions.initEditState(this,"D",_5bc,_5b7);
}
_5b9.remove(this.grid.getSelectionModel().getSelected());
}
$G.Actions.computeEditField(this);
this.grid.stopEditing();
this.selectedRow=-1;
}
}
};
$G.deleteRowCallback=function(_5bd,_5be){
var _5bf=_5be._cf_grid.getStore();
var _5c0=_5be._cf_grid_properties;
var _5be=_5bf.lastOptions.params;
var key="start";
if(_5bf.getCount()==1){
if(_5be.start>=_5be.limit){
_5be.start=_5be.start-_5be.limit;
}
_5bf.reload(_5be);
}else{
_5bf.reload();
}
if(_5c0.multiRowSelection){
var _5c2=_5c0.grid.getView().getHeaderCell(0);
if(_5c2!=null){
var _5c3=Ext.Element.get(_5c2).first();
if(_5c3){
_5c3.replaceClass("x-grid3-hd-checker-on");
}
}
}
};
$G.insertRowCallback=function(_5c4,_5c5){
var _5c6=_5c5._cf_grid.getStore();
var _5c7=_5c5._cf_grid.actions;
_5c6.reload();
};
$G.Actions.beforeEdit=function(_5c8){
if($G.isNullRow(_5c8.record.data)){
return false;
}
this.editColumn=_5c8.column;
this.editOldValue=_5c8.value;
};
$G.Actions.afterEdit=function(_5c9){
var _5ca=_5c9.value;
if(this.insertInProgress==false&&this.onChangeFunction){
this.onChangeHandler("U",this.selectedRow,_5c9);
}else{
if(!this.dynamic){
var _5cb=$G.computeActualRow_editField(this.editFieldState,this.selectedRow);
var _5cc=this.editFieldState[_5cb-1];
if(_5cc){
var _5cd=_5c9.column;
if(this.multiRowSelection===true&&this.insertInProgress==true){
_5cd=_5cd-1;
}
_5cc.values[_5cd][1]=_5ca;
}else{
var _5ce=this.grid.getStore().getById(this.selectedRow);
_5cc=$G.Actions.initEditState(this,"U",_5ce,_5cb);
var _5cf=this.editOldValue+"";
if(_5ca.getDayOfYear){
if(_5cf&&typeof _5cf=="string"){
_5cf=new Date(_5cf);
}
_5cc.values[_5c9.column][1]=_5ca.format("F, j Y H:i:s");
_5cc.values[_5c9.column][0]=_5cf?_5cf.format("F, j Y H:i:s"):_5cf;
}else{
_5cc.values[_5c9.column][0]=_5cf;
_5cc.values[_5c9.column][1]=_5ca;
}
}
$G.Actions.computeEditField(this);
}
}
this.editOldValue=null;
this.fireSelectionChangeEvent();
};
$G.computeActualRow_editField=function(_5d0,_5d1){
if(_5d0.length==_5d1){
return _5d1;
}
var _5d2=0;
var _5d3=0;
for(;_5d3<_5d0.length&&_5d2<_5d1;_5d3++){
var _5d4=_5d0[_5d3];
if(!_5d4||_5d4.action!="D"){
_5d2++;
}
}
return _5d3;
};
$G.Actions.onChangeHandler=function(_5d5,_5d6,_5d7,_5d8){
var _5d9={};
var _5da={};
var data=_5d7?_5d7.record.data:this.grid.getStore().getAt(_5d6).data;
for(col in data){
_5d9[col]=data[col];
}
if(_5d5=="U"){
if((_5d7.value==null||_5d7.value=="")&&(_5d7.originalValue==null||_5d7.originalValue=="")){
return;
}
if(_5d7.value&&_5d7.value.getDayOfYear){
if(typeof _5d7.originalValue=="string"){
var _5dc=new Date(_5d7.originalValue);
}
if(_5dc!=null&&_5dc.getElapsed(_5d7.value)==0){
return;
}else{
_5d9[_5d7.field]=_5d7.originalValue;
_5da[_5d7.field]=_5d7.value.format("F, j Y H:i:s");
}
}else{
_5d9[_5d7.field]=_5d7.originalValue;
_5da[_5d7.field]=_5d7.value;
}
}
this.onChangeFunction(_5d5,_5d9,_5da,_5d8,this.grid,this.onErrorFunction,this);
};
$G.Actions.onChangeHandler_MultiRowsDelete=function(_5dd,_5de,_5df,_5e0){
var _5e1=new Array();
var _5e2={};
for(i=0;i<_5de.length;i++){
_5e1[i]=_5de[i].data;
}
this.onChangeFunction(_5dd,_5e1,_5e2,_5e0,this.grid,this.onErrorFunction,this);
};
$G.Actions.initEditState=function(_5e3,_5e4,_5e5,_5e6){
var _5e7={action:_5e4,values:[]};
var _5e8=_5e3.grid.getColumnModel();
var _5e9=_5e8.getColumnCount()-1;
_5e7.values.length=_5e9;
var i=0;
if(_5e3.multiRowSelection===true&&_5e3.dynamic===false){
i=i++;
}
for(i;i<_5e9;i++){
var _5eb=_5e5.get(_5e8.getDataIndex(i));
_5e7.values[i]=[_5eb,_5eb];
}
_5e3.editFieldState[_5e6-1]=_5e7;
return _5e7;
};
$G.Actions.fieldSep=eval("'\\u0001'");
$G.Actions.valueSep=eval("'\\u0002'");
$G.Actions.nullValue=eval("'\\u0003'");
$G.Actions.computeEditField=function(_5ec){
if(_5ec.dynamic){
return;
}
var _5ed=_5ec.editFieldPrefix;
var _5ee=_5ec.editFieldState;
var _5ef=_5ec.grid.getColumnModel().config;
var _5f0=0;
var _5f1="";
for(var i=0;i<_5ee.length;i++){
var _5f3=_5ee[i];
if(_5f3){
_5f0++;
_5f1+=$G.Actions.fieldSep;
_5f1+=_5f3.action+$G.Actions.valueSep;
var _5f4=_5f3.values;
if(_5ec.multiRowSelection===true&&_5ec.dynamic===false&&_5f3.action!="I"){
_5f4=_5f4.slice(1,_5f4.length);
}
for(var j=0;j<_5f4.length;j++){
if(j>0){
_5f1+=$G.Actions.valueSep;
}
var _5f6=($G.Actions.isNull(_5f4[j][0]))?$G.Actions.nullValue:_5f4[j][0];
var _5f7=($G.Actions.isNull(_5f4[j][1]))?$G.Actions.nullValue:_5f4[j][1];
var _5f8=j;
if(_5ec.multiRowSelection===true){
_5f8++;
}
if(_5f3.action!="I"||(_5f3.action=="I"&&_5ef[_5f8].editor)){
if(_5ef[_5f8].type=="date"){
if(_5f7!=null&&_5f7!=$G.Actions.nullValue){
if(typeof _5f7=="string"){
_5f7=new Date(_5f7);
}
_5f7=_5f7.format("F, j Y H:i:s");
}
if(_5f6!=null&&_5f6!=$G.Actions.nullValue){
if(typeof _5f6=="string"){
_5f6=new Date(_5f6);
}
_5f6=_5f6.format("F, j Y H:i:s");
}
}
_5f1+=_5f7;
if(_5f3.action=="U"&&_5ef[_5f8].editor){
_5f1+=$G.Actions.valueSep+_5f6;
}
}
}
}
}
_5ed+=_5f0+_5f1;
_5ec.editField.setAttribute("value",_5ed);
};
$G.Actions.isNull=function(val){
var ret=(val==null||typeof (val)=="undefined"||val.length==0);
return ret;
};
$G.loadData=function(data,_5fc){
_5fc._cf_gridDataProxy.loadResponse(data,_5fc);
var _5fd=ColdFusion.objectCache[_5fc._cf_gridname];
$G.applyStyles(_5fd);
$L.info("grid.loaddata.loaded","widget",[_5fc._cf_gridname]);
if($G.Actions.isNull(data.TOTALROWCOUNT)==false&&data.TOTALROWCOUNT==0){
_5fd.fireSelectionChangeEvent();
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
$G.formatBoolean=function(v,p,_602){
return "<div class=\"x-grid3-check-col"+(v?"-on":"")+" x-grid3-cc-"+this.id+"\">&#160;</div>";
};
$G.formatDate=function(_603,p,_605){
if(_603&&!_603.dateFormat){
_603=new Date(_603);
}
var _606=this.dateFormat?this.dateFormat:"m/d/y";
return _603?_603.dateFormat(_606):"";
};
$G.convertDate=function(_607,p,_609){
if(_607&&!_607.dateFormat){
_607=new Date(_607);
}
var _60a=this.dateFormat?this.dateFormat:"m/d/y";
return _607;
};
$G.ExtProxy=function(_60b,_60c){
this.api={load:true,create:undefined,save:undefined,destroy:undefined};
$G.ExtProxy.superclass.constructor.call(this);
this.bindHandler=_60b;
this.errorHandler=_60c;
};
Ext.extend($G.ExtProxy,Ext.data.DataProxy,{_cf_firstLoad:true,load:function(_60d,_60e,_60f,_610,arg){
if(!this._cf_actions.bindOnLoad){
var _612={"_cf_reader":_60e,"_cf_grid_errorhandler":this.errorHandler,"_cf_scope":_610,"_cf_gridDataProxy":this,"_cf_gridname":this._cf_gridName,"_cf_arg":arg,"_cf_callback":_60f,"ignoreData":true};
var data=[];
for(i=0;i<_60d.limit;i++){
data.push(new Ext.data.Record({}));
}
this.loadResponse(data,_612);
this._cf_actions.bindOnLoad=true;
}else{
var _614=(_60d.start/_60d.limit)+1;
if(!_60d.sort){
_60d.sort="";
}
if(!_60d.dir){
_60d.dir="";
}
this.bindHandler(this,_614,_60d.limit,_60d.sort,_60d.dir,this.errorHandler,_60f,_610,arg,_60e);
}
},loadResponse:function(data,_616){
var _617=null;
if(_616.ignoreData){
_617={success:true,records:data,totalRecords:data.length};
}else{
var _618;
if(!data){
_618="grid.extproxy.loadresponse.emptyresponse";
}else{
if(!data.TOTALROWCOUNT&&data.TOTALROWCOUNT!=0){
_618="grid.extproxy.loadresponse.totalrowcountmissing";
}else{
if(!ColdFusion.Util.isInteger(data.TOTALROWCOUNT)){
_618="grid.extproxy.loadresponse.totalrowcountinvalid";
}else{
if(!data.QUERY){
_618="grid.extproxy.loadresponse.querymissing";
}else{
if(!data.QUERY.COLUMNS||!ColdFusion.Util.isArray(data.QUERY.COLUMNS)||!data.QUERY.DATA||!ColdFusion.Util.isArray(data.QUERY.DATA)||(data.QUERY.DATA.length>0&&!ColdFusion.Util.isArray(data.QUERY.DATA[0]))){
_618="grid.extproxy.loadresponse.queryinvalid";
}
}
}
}
}
if(_618){
ColdFusion.handleError(_616._cf_grid_errorHandler,_618,"widget");
this.fireEvent("loadexception",this,_616,data,e);
return;
}
_617=_616._cf_reader.readRecords(data);
}
this.fireEvent("load",this,_616,_616._cf_arg);
_616._cf_callback.call(_616._cf_scope,_617,_616._cf_arg,true);
},update:function(_619){
},updateResponse:function(_61a){
}});
$G.ExtReader=function(_61b){
this.recordType=Ext.data.Record.create(_61b);
};
Ext.extend($G.ExtReader,Ext.data.DataReader,{readRecords:function(_61c){
var _61d=[];
var cols=_61c.QUERY.COLUMNS;
var data=_61c.QUERY.DATA;
for(var i=0;i<data.length;i++){
var _621={};
for(var j=0;j<cols.length;j++){
_621[cols[j]]=data[i][j];
}
_61d.push(new Ext.data.Record(_621));
}
return {success:true,records:_61d,totalRecords:_61c.TOTALROWCOUNT};
}});
$G.CheckColumn=function(_623){
Ext.apply(this,_623);
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
var _628=this.grid.getView().findRowIndex(t);
var _629=this.grid.store.getAt(_628);
var _62a=ColdFusion.clone(_629);
_62a.data=ColdFusion.clone(_629.data);
this.grid.getSelectionModel().selectRow(_628);
this.grid.getSelectionModel().fireEvent("rowselect",this.grid.getSelectionModel(),_628);
this.grid.fireEvent("beforeedit",{grid:this.grid,row:_628,record:_629,column:this.columnIndex,field:this.dataIndex,value:_629.data[this.dataIndex]});
_629.set(this.dataIndex,this.toggleBooleanValue(_629.data[this.dataIndex]));
this.grid.fireEvent("afteredit",{grid:this.grid,row:_628,record:_62a,column:this.columnIndex,field:this.dataIndex,value:_629.data[this.dataIndex],originalValue:_62a.data[this.dataIndex]});
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
},renderer:function(v,p,_62e){
p.css+=" x-grid3-check-col-td";
var _62f=false;
v=(typeof v=="string")?v.toUpperCase():v;
if(typeof v!="undefined"&&(v==1||v=="1"||v=="Y"||v=="YES"||v===true||v==="T")){
_62f=true;
}
return "<div class=\"x-grid3-check-col"+(_62f==true?"-on":"")+" x-grid3-cc-"+this.id+"\">&#160;</div>";
}};
};
cfinitgrid();
