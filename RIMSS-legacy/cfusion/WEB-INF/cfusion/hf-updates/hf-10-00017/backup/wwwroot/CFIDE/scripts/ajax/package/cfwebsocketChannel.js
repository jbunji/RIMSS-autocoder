/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
ColdFusion.WebSocket={NS:"coldfusion.websocket.channels",WELCOME:"welcome",AUTHENTICATE:"authenticate",SUBSCRIBE:"subscribe",UNSUBSCRIBE:"unsubscribe",PUBLISH:"publish",INVOKE_AND_PUBLISH:"invokeAndPublish",GET_CHANNELS:"getChannels",GET_SUBSCRIBER_COUNT:"getSubscriberCount",GET_SUBSCRIPTIONS:"getSubscriptions",SEND_MESSAGE:"sendMessage",INVOKE_AND_MESSAGE:"invokeAndSend",INVOKE:"invoke",STOP:"stop",init:function(id,_7d8,_7d9,_7da,_7db,_7dc,_7dd,_7de,_7df){
if(cf_ws.isWebSocketSupported()){
lWSC=new cf_ws.CFWebSocketWrapper();
ColdFusion.WebSocket[id]=lWSC;
lWSC.options={OnWelcome:this.cfonOpencallBk,OnMessage:this.cfMessageHandlerCallBk,OnClose:_7dd,onError:_7de,appName:_7d8,cfauth:_7d9,subscribeTo:_7da,referrer:_7df};
var _7e0=self.location.hostname;
if(_7e0&&_7e0=="localhost"){
_7e0="127.0.0.1";
}
var lURL="ws://"+(_7e0)+":"+_cf_websocket_port+"/cfusion"+"/cfusion";
var lRes=lWSC.open(lURL,lWSC.options);
lWSC.isOpen=true;
lWSC.processConnected=function(_7e3){
};
lWSC.processDisconnected=function(_7e4){
};
lWSC.defaultMessageHandler=_7db;
if(_7dc){
lWSC.appOnOpenHandler=_7dc;
}
lWSC.channelSpecificResHandlers={};
lWSC.subscribercount_callbackHanlders={};
return lWSC;
}else{
var _7e5={ns:ColdFusion.WebSocket.NS,reqType:ColdFusion.WebSocket.WELCOME,code:-1,msg:"Browser neither have native WebSocket support nor a flash player for the fallback."};
var _7e6=_7de!=null?_7de:_7db;
_7e6(_7e5);
}
},welcome:function(_7e7,_7e8,_7e9){
var lRes=this.isConnected();
if(lRes==true){
this.sendToken({ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.WELCOME,authKey:_7e7,subscribeTo:_7e8,appName:_7e9});
}
return lRes;
},authenticate:function(_7eb,_7ec){
var lRes=this.isConnected();
if(lRes==true){
this.sendToken({ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.AUTHENTICATE,username:_7eb,password:_7ec,appName:this.options.appName});
}
return lRes;
},subscribe:function(_7ee,_7ef,_7f0){
var lRes=this.isConnected();
if(lRes==true){
var _7f2={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.SUBSCRIBE,channel:_7ee,appName:this.options.appName};
if(_7ef!=null&&(typeof _7ef=="object")){
_7f2.customOptions=_7ef;
}
this.sendToken(_7f2);
if(_7f0){
this.channelSpecificResHandlers[_7ee]=_7f0;
this.channelName_subscriptionInProcess=_7ee;
}
}
return lRes;
},unsubscribe:function(_7f3){
var lRes=this.isConnected();
if(lRes==true){
var _7f5={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.UNSUBSCRIBE,channel:_7f3,appName:this.options.appName};
this.sendToken(_7f5);
delete this.channelSpecificResHandlers[_7f3];
}
return lRes;
},publish:function(_7f6,_7f7,_7f8){
var lRes=this.isConnected();
if(lRes==true){
var _7fa={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.PUBLISH,channel:_7f6,data:_7f7,appName:this.options.appName};
if(_7f8!=null&&(typeof _7f8=="object")){
_7fa.customOptions=_7f8;
}
this.sendToken(_7fa);
}
return lRes;
},invokeAndPublish:function(_7fb,_7fc,_7fd,_7fe,_7ff){
var lRes=this.isConnected();
if(lRes==true){
var _801={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.INVOKE_AND_PUBLISH,channel:_7fb,cfcName:_7fc,cfcMethod:_7fd,methodArguments:_7fe,appName:this.options.appName,referrer:this.options.referrer};
if(_7ff!=null&&(typeof _7ff=="object")){
_801.customOptions=_7ff;
}
this.sendToken(_801);
}
return lRes;
},getSubscriberCount:function(_802,_803){
var lRes=this.isConnected();
if(lRes==true){
var _805={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.GET_SUBSCRIBER_COUNT,channel:_802,appName:this.options.appName};
this.sendToken(_805);
}
if(_803){
if(!this.subscribercount_callbackHanlders){
this.subscribercount_callbackHanlders={};
}
this.subscribercount_callbackHanlders[_802]=_803;
}
return lRes;
},getSubscriptions:function(_806){
var lRes=this.isConnected();
if(lRes==true){
var _808={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.GET_SUBSCRIPTIONS,appName:this.options.appName};
this.sendToken(_808);
}
if(_806){
this.subscriptions_callbackHanlder=_806;
}
return lRes;
},sendMessage:function(_809,_80a,_80b){
var lRes=this.isConnected();
if(lRes==true){
var _80d={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.SEND_MESSAGE,targetId:_809,data:_80a,appName:this.options.appName};
if(_80b!=null&&(typeof _80b=="object")){
_80d.customOptions=_80b;
}
this.sendToken(_80d);
}
return lRes;
},invokeAndSend:function(_80e,_80f,_810,_811,_812){
var lRes=this.isConnected();
if(lRes==true){
var _814={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.INVOKE_AND_MESSAGE,target:_80e,cfcName:_80f,cfcMethod:_810,methodArguments:_811,appName:this.options.appName};
if(_812!=null&&(typeof _812=="object")){
_814.customOptions=_812;
}
this.sendToken(_814);
}
return lRes;
},invoke:function(_815,_816,_817,_818){
var lRes=this.isConnected();
if(lRes==true){
var _81a={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.INVOKE,cfcName:_815,cfcMethod:_816,methodArguments:_817,appName:this.options.appName,referrer:this.options.referrer};
if(_818!=null&&(typeof _818=="object")){
_81a.customOptions=_818;
}
this.sendToken(_81a);
}
return lRes;
},openConnection:function(){
var lURL=cf_ws.URL_SERVER;
this.open(lURL,this.options);
},isConnectionOpen:function(){
var _81c=this.isConnected();
return _81c;
},closeConnection:function(){
this.close({fireClose:true});
},cfonOpencallBk:function(_81d){
if(this.cfauth!=null||this.susbcribeTo!=null){
_81d.welcome(this.cfauth,this.subscribeTo,this.appName);
}
if(_81d.appOnOpenHandler){
_81d.appOnOpenHandler.call(_81d);
}
},cfMessageHandlerCallBk:function(_81e,_81f){
var _820=_81f.defaultMessageHandler;
if((_81e.type=="event")&&(_81e.name=="connect"||_81e.name=="disconnect")){
return;
}
if((_81e.reqType=="subscribe")&&_81f.channelName_subscriptionInProcess!=null){
if(_81e.code==-1){
delete _81f.channelSpecificResHandlers[_81f.channelName_subscriptionInProcess];
}
delete _81f.channelName_subscriptionInProcess;
}
if((_81e.reqType=="getSubscriberCount")&&_81f.subscribercount_callbackHanlders[_81e.channel]!=null){
_81f.subscribercount_callbackHanlders[_81e.channel].call(this,_81e);
delete _81f.subscribercount_callbackHanlders[_81e.channelname];
return;
}
if((_81e.reqType=="getSubscriptions")&&_81f.subscriptions_callbackHanlder!=null){
_81f.subscriptions_callbackHanlder(_81e);
delete _81f.subscriptions_callbackHanlder;
return;
}
if(_81e.type=="data"&&_81e.channelname){
var _821=_81e.channelname;
var _822=_81f.channelSpecificResHandlers[_821];
while(_822==null){
var lPos=_821.lastIndexOf(".");
if(lPos>0){
_821=_821.substr(0,lPos);
_822=_81f.channelSpecificResHandlers[_821];
}else{
break;
}
}
if(_822){
_820=_822;
}
}
_820.call(this,_81e);
}};
function cfwebsocketinit(){
var _824=ColdFusion.WebSocket;
ns=cf_ws;
for(var _825 in _824){
ns["CFWebSocketWrapper"].prototype[_825]=_824[_825];
}
}
cfwebsocketinit();
