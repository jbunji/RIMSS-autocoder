/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Menu){
ColdFusion.Menu={};
}
ColdFusion.Menu.menuItemMouseOver=function(id,_7cf){
var _7d0=document.getElementById(id);
_7d0.tempfontcolor=_7d0.firstChild.style.color;
if(_7cf){
_7d0.firstChild.style.color=_7cf;
}
};
ColdFusion.Menu.menuItemMouseOut=function(id){
var _7d2=document.getElementById(id);
if(_7d2.tempfontcolor){
_7d2.firstChild.style.color=_7d2.tempfontcolor;
}else{
_7d2.firstChild.style.color="black";
}
};
ColdFusion.Menu.initMenu=function(_7d3,_7d4){
return new YAHOO.widget.Menu(_7d3,_7d4);
};
ColdFusion.Menu.initMenuBar=function(_7d5,_7d6){
return new YAHOO.widget.MenuBar(_7d5,_7d6);
};
