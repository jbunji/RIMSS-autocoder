/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
ColdFusion.WebSocket={NS:"coldfusion.websocket.channels",WELCOME:"welcome",AUTHENTICATE:"authenticate",SUBSCRIBE:"subscribe",UNSUBSCRIBE:"unsubscribe",PUBLISH:"publish",INVOKE_AND_PUBLISH:"invokeAndPublish",GET_CHANNELS:"getChannels",GET_SUBSCRIBER_COUNT:"getSubscriberCount",GET_SUBSCRIPTIONS:"getSubscriptions",SEND_MESSAGE:"sendMessage",INVOKE_AND_MESSAGE:"invokeAndSend",INVOKE:"invoke",STOP:"stop",init:function(id,_848,_849,_84a,_84b,_84c,_84d,_84e,_84f){
if(cf_ws.isWebSocketSupported()){
lWSC=new cf_ws.CFWebSocketWrapper();
ColdFusion.WebSocket[id]=lWSC;
lWSC.options={OnWelcome:this.cfonOpencallBk,OnMessage:this.cfMessageHandlerCallBk,OnClose:_84d,onError:_84e,appName:_848,cfauth:_849,subscribeTo:_84a,referrer:_84f};
var _850=self.location.hostname;
if(_850&&_850=="localhost"){
_850="127.0.0.1";
}
var lURL="ws://"+(_850)+":"+_cf_websocket_port+"/cfusion"+"/cfusion";
var lRes=lWSC.open(lURL,lWSC.options);
lWSC.isOpen=true;
lWSC.processConnected=function(_853){
};
lWSC.processDisconnected=function(_854){
};
lWSC.defaultMessageHandler=_84b;
if(_84c){
lWSC.appOnOpenHandler=_84c;
}
lWSC.channelSpecificResHandlers={};
lWSC.subscribercount_callbackHandlers={};
return lWSC;
}else{
var _855={ns:ColdFusion.WebSocket.NS,reqType:ColdFusion.WebSocket.WELCOME,code:-1,msg:"Browser neither have native WebSocket support nor a flash player for the fallback."};
var _856=_84e!=null?_84e:_84b;
_856(_855);
}
},welcome:function(_857,_858,_859){
var lRes=this.isConnected();
if(lRes==true){
this.sendToken({ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.WELCOME,authKey:_857,subscribeTo:_858,appName:_859});
}
return lRes;
},authenticate:function(_85b,_85c){
var lRes=this.isConnected();
if(lRes==true){
this.sendToken({ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.AUTHENTICATE,username:_85b,password:_85c,appName:this.options.appName});
}
return lRes;
},subscribe:function(_85e,_85f,_860){
var lRes=this.isConnected();
if(lRes==true){
var _862={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.SUBSCRIBE,channel:_85e,appName:this.options.appName};
if(_85f!=null&&(typeof _85f=="object")){
_862.customOptions=_85f;
}
this.sendToken(_862);
if(_860){
this.channelSpecificResHandlers[_85e]=_860;
this.channelName_subscriptionInProcess=_85e;
}
}
return lRes;
},unsubscribe:function(_863){
var lRes=this.isConnected();
if(lRes==true){
var _865={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.UNSUBSCRIBE,channel:_863,appName:this.options.appName};
this.sendToken(_865);
delete this.channelSpecificResHandlers[_863];
}
return lRes;
},publish:function(_866,_867,_868){
var lRes=this.isConnected();
if(lRes==true){
var _86a={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.PUBLISH,channel:_866,data:_867,appName:this.options.appName};
if(_868!=null&&(typeof _868=="object")){
_86a.customOptions=_868;
}
this.sendToken(_86a);
}
return lRes;
},invokeAndPublish:function(_86b,_86c,_86d,_86e,_86f){
var lRes=this.isConnected();
if(lRes==true){
var _871={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.INVOKE_AND_PUBLISH,channel:_86b,cfcName:_86c,cfcMethod:_86d,methodArguments:_86e,appName:this.options.appName,referrer:this.options.referrer};
if(_86f!=null&&(typeof _86f=="object")){
_871.customOptions=_86f;
}
this.sendToken(_871);
}
return lRes;
},getSubscriberCount:function(_872,_873){
var lRes=this.isConnected();
if(lRes==true){
var _875={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.GET_SUBSCRIBER_COUNT,channel:_872,appName:this.options.appName};
this.sendToken(_875);
}
if(_873){
if(!this.subscribercount_callbackHandlers){
this.subscribercount_callbackHandlers={};
}
this.subscribercount_callbackHandlers[_872]=_873;
}
return lRes;
},getSubscriptions:function(_876){
var lRes=this.isConnected();
if(lRes==true){
var _878={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.GET_SUBSCRIPTIONS,appName:this.options.appName};
this.sendToken(_878);
}
if(_876){
this.subscriptions_callbackHandler=_876;
}
return lRes;
},sendMessage:function(_879,_87a,_87b){
var lRes=this.isConnected();
if(lRes==true){
var _87d={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.SEND_MESSAGE,targetId:_879,data:_87a,appName:this.options.appName};
if(_87b!=null&&(typeof _87b=="object")){
_87d.customOptions=_87b;
}
this.sendToken(_87d);
}
return lRes;
},invokeAndSend:function(_87e,_87f,_880,_881,_882){
var lRes=this.isConnected();
if(lRes==true){
var _884={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.INVOKE_AND_MESSAGE,target:_87e,cfcName:_87f,cfcMethod:_880,methodArguments:_881,appName:this.options.appName};
if(_882!=null&&(typeof _882=="object")){
_884.customOptions=_882;
}
this.sendToken(_884);
}
return lRes;
},invoke:function(_885,_886,_887,_888){
var lRes=this.isConnected();
if(lRes==true){
var _88a={ns:ColdFusion.WebSocket.NS,type:ColdFusion.WebSocket.INVOKE,cfcName:_885,cfcMethod:_886,methodArguments:_887,appName:this.options.appName,referrer:this.options.referrer};
if(_888!=null&&(typeof _888=="object")){
_88a.customOptions=_888;
}
this.sendToken(_88a);
}
return lRes;
},openConnection:function(){
var lURL=cf_ws.URL_SERVER;
this.open(lURL,this.options);
},isConnectionOpen:function(){
var _88c=this.isConnected();
return _88c;
},closeConnection:function(){
this.close({fireClose:true});
},cfonOpencallBk:function(_88d){
if(this.cfauth!=null||this.susbcribeTo!=null){
_88d.welcome(this.cfauth,this.subscribeTo,this.appName);
}
if(_88d.appOnOpenHandler){
_88d.appOnOpenHandler.call(_88d);
}
},cfMessageHandlerCallBk:function(_88e,_88f){
var _890=_88f.defaultMessageHandler;
if((_88e.type=="event")&&(_88e.name=="connect"||_88e.name=="disconnect")){
return;
}
if((_88e.reqType=="subscribe")&&_88f.channelName_subscriptionInProcess!=null){
if(_88e.code==-1){
delete _88f.channelSpecificResHandlers[_88f.channelName_subscriptionInProcess];
}
delete _88f.channelName_subscriptionInProcess;
}
if((_88e.reqType=="getSubscriberCount")&&_88f.subscribercount_callbackHandlers[_88e.channel]!=null){
_88f.subscribercount_callbackHandlers[_88e.channel].call(this,_88e);
delete _88f.subscribercount_callbackHandlers[_88e.channelname];
return;
}
if((_88e.reqType=="getSubscriptions")&&_88f.subscriptions_callbackHandler!=null){
_88f.subscriptions_callbackHandler(_88e);
delete _88f.subscriptions_callbackHandler;
return;
}
if(_88e.type=="data"&&_88e.channelname){
var _891=_88e.channelname;
var _892=_88f.channelSpecificResHandlers[_891];
while(_892==null){
var lPos=_891.lastIndexOf(".");
if(lPos>0){
_891=_891.substr(0,lPos);
_892=_88f.channelSpecificResHandlers[_891];
}else{
break;
}
}
if(_892){
_890=_892;
}
}
_890.call(this,_88e);
}};
function cfwebsocketinit(){
var _894=ColdFusion.WebSocket;
ns=cf_ws;
for(var _895 in _894){
ns["CFWebSocketWrapper"].prototype[_895]=_894[_895];
}
}
cfwebsocketinit();
