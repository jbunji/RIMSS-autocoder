/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.RichText){
ColdFusion.RichText={};
}
ColdFusion.RichText.editorState={};
ColdFusion.RichText.buffer=null;
ColdFusion.RichText.initialize=function(id,name,_4d8,_4d9,_4da,_4db,_4dc,_4dd,_4de,skin,_4e0,_4e1,_4e2,_4e3,_4e4){
var _4e5=new FCKeditor(id);
ColdFusion.RichText.editorState[id]=false;
_4e5.Value=_4d8;
_4e5.richtextid=id;
if(_4d9!=null){
_4e5.BasePath=_4d9;
}
if(_4da!=null){
_4e5.Width=_4da;
}
if(_4db!=null){
_4e5.Height=_4db;
}
if(_4dc!=null){
_4e5.Config.FontNames=_4dc;
}
if(_4dd!=null){
_4e5.Config.FontSizes=_4dd;
}
if(_4de!=null){
_4e5.Config.FontFormats=_4de;
}
_4e5.Config.LinkBrowserURL=_4e5.BasePath+"editor/filemanager/browser/default/browser.html?Connector=../../connectors/cfm/connector.cfm";
_4e5.Config.LinkUploadURL=_4e5.BasePath+"editor/filemanager/connectors/cfm/upload.cfm";
_4e5.Config.ImageBrowserURL=_4e5.BasePath+"editor/filemanager/browser/default/browser.html?Type=Image&Connector=../../connectors/cfm/connector.cfm";
_4e5.Config.ImageUploadURL=_4e5.BasePath+"editor/filemanager/connectors/cfm/upload.cfm?Type=Image";
_4e5.Config.FlashBrowserURL=_4e5.BasePath+"editor/filemanager/browser/default/browser.html?Type=Flash&Connector=../../connectors/cfm/connector.cfm";
_4e5.Config.FlashUploadURL=_4e5.BasePath+"editor/filemanager/connectors/cfm/upload.cfm?Type=Flash";
if(window._cf_clientid){
_4e5.Config.LinkBrowserURL=_4e5.Config.LinkBrowserURL+"&_cf_clientid="+_cf_clientid;
_4e5.Config.LinkUploadURL=_4e5.Config.LinkUploadURL+"?_cf_clientid="+_cf_clientid;
_4e5.Config.ImageBrowserURL=_4e5.Config.ImageBrowserURL+"&_cf_clientid="+_cf_clientid;
_4e5.Config.ImageUploadURL=_4e5.Config.ImageUploadURL+"&_cf_clientid="+_cf_clientid;
_4e5.Config.FlashBrowserURL=_4e5.Config.FlashBrowserURL+"&_cf_clientid="+_cf_clientid;
_4e5.Config.FlashUploadURL=_4e5.Config.FlashUploadURL+"&_cf_clientid="+_cf_clientid;
}
if(skin!=null){
var _4e6=_4e5.BasePath+"editor/skins/"+skin+"/";
_4e5.Config.SkinPath=_4e6;
}
if(_4e0==true){
_4e5.Config.ToolbarStartExpanded=false;
_4e5.Config.Toolbaronfocus=true;
}
if(_4e1!=null){
_4e5.ToolbarSet=_4e1;
}
if(_4e2!=null){
_4e5.Config.StylesXmlPath=_4e2;
}
if(_4e3!=null){
_4e5.Config.TemplatesXmlPath=_4e3;
}
_4e5.Config.AutoDetectLanguage=false;
if(_4e4!=null){
_4e5.Config.DefaultLanguage=_4e4;
}
_4e5.ReplaceTextarea();
var _4e7=function(_4e8){
ColdFusion.RichText.setValue(id,_4e8);
};
_4e5._cf_setValue=_4e7;
var _4e9=function(){
if(ColdFusion.RichText.editorState[id]){
var _4ea=FCKeditorAPI.GetInstance(id);
return _4ea.GetXHTML();
}else{
ColdFusion.Log.error("richtext.initialize.getvalue.notready","widget",[id]);
return null;
}
};
_4e5._cf_getAttribute=_4e9;
var _4eb=function(_4ec,_4ed,_4ee){
var _4ef=document.getElementById(id);
if(_4ef){
ColdFusion.Event.addListener(_4ef,_4ec,_4ed,_4ee);
}
};
_4e5._cf_register=_4eb;
_4e5._cf_name=name;
ColdFusion.objectCache[name]=_4e5;
ColdFusion.objectCache[id]=_4e5;
ColdFusion.RichText.registerAfterSet(id);
ColdFusion.Log.info("richtext.initialize.success","widget",[name]);
};
ColdFusion.RichText.editor_onfocus=function(_4f0){
_4f0.ToolbarSet.Expand();
};
ColdFusion.RichText.editor_onblur=function(_4f1){
_4f1.ToolbarSet.Collapse();
};
ColdFusion.RichText.setChangeBuffer=function(_4f2){
ColdFusion.RichText.buffer=FCKeditorAPI.GetInstance(_4f2.Name).GetXHTML();
};
ColdFusion.RichText.resetChangeBuffer=function(_4f3){
if(ColdFusion.RichText.buffer!=FCKeditorAPI.GetInstance(_4f3.Name).GetXHTML()){
ColdFusion.RichText.fireChangeEvent(_4f3.Name);
}
ColdFusion.RichText.buffer=null;
};
ColdFusion.RichText.registerAfterSet=function(_4f4){
if(ColdFusion.RichText.editorState[_4f4]){
var _4f5=function(){
ColdFusion.RichText.fireChangeEvent(_4f4);
};
var _4f6=FCKeditorAPI.GetInstance(_4f4);
_4f6.Events.AttachEvent("OnAfterSetHTML",_4f5);
}else{
setTimeout("ColdFusion.RichText.registerAfterSet('"+_4f4+"')",1000);
}
};
ColdFusion.RichText.getEditorObject=function(_4f7){
if(!_4f7){
ColdFusion.handleError(null,"richtext.geteditorobject.missingtextareaname","widget",null,null,null,true);
return;
}
var _4f8=ColdFusion.objectCache[_4f7];
if(_4f8==null||FCKeditor.prototype.isPrototypeOf(_4f8)==false){
ColdFusion.handleError(null,"richtext.geteditorobject.notfound","widget",[_4f7],null,null,true);
return;
}
return FCKeditorAPI.GetInstance(_4f8.richtextid);
};
ColdFusion.RichText.setValue=function(_4f9,_4fa){
if(ColdFusion.RichText.editorState[_4f9]){
var _4fb=FCKeditorAPI.GetInstance(_4f9);
_4fb.SetHTML(_4fa);
}else{
setTimeout("ColdFusion.RichText.setValue(\""+_4f9+"\",\""+_4fa+"\")",1000);
}
};
ColdFusion.RichText.fireChangeEvent=function(_4fc){
var _4fd=ColdFusion.objectCache[_4fc];
ColdFusion.Log.info("richtext.firechangeevent.firechange","widget",[_4fd._cf_name]);
var _4fe=document.getElementById(_4fc);
if(_4fe){
if(_4fe.fireEvent){
_4fe.fireEvent("onchange");
}
if(document.createEvent){
var evt=document.createEvent("HTMLEvents");
if(evt.initEvent){
evt.initEvent("change",true,true);
}
if(_4fe.dispatchEvent){
_4fe.dispatchEvent(evt);
}
}
}
ColdFusion.Event.callBindHandlers(_4fc,null,"change");
};
function FCKeditor_OnComplete(_500){
if(_500.Config.Toolbaronfocus){
_500.Events.AttachEvent("OnBlur",ColdFusion.RichText.editor_onblur);
_500.Events.AttachEvent("OnFocus",ColdFusion.RichText.editor_onfocus);
}
_500.Events.AttachEvent("OnFocus",ColdFusion.RichText.setChangeBuffer);
_500.Events.AttachEvent("OnBlur",ColdFusion.RichText.resetChangeBuffer);
ColdFusion.RichText.editorState[_500.Name]=true;
if(ColdFusion.RichText.OnComplete){
ColdFusion.RichText.OnComplete(_500);
}
}
