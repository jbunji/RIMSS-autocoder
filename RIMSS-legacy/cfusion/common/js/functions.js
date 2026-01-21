var instance = {};

    instance.rootPath = ""; 
    instance.user = "";
	instance.action = ""; 
	instance.method = ""; 
	
function getRootPath()
{
    return instance.rootPath;
}

function setRootPath(r)
{
    instance.rootPath = r;
    return this;
}

function getUser()
{
    return instance.user;
}

function setUser(user)
{
    instance.user = user;
    return this;
}

function getAction()
{
    return instance.action;
}

function setAction(action,event)
{
    instance.action = $.trim(action);
	
	var element = getActionForm(event);
	
    return true;
}

function getMethod()
{
    return instance.method;
}

function setMethod(method,event)
{

    instance.method = $.trim(method);
    
    var event = getMethodForm(event,method);
    
    return false;
}

function getActionForm(ev){
	

	if(ev){
        
		try {
			var tag = $(ev).prop("tagName").toLowerCase();
		}catch(err){
			var tag = $(ev).prop("tagName");
		}
        var findForm = $(ev);
		
		if(tag=='input'){
			findForm = $(ev).closest("form");    
		}
		
		
        var findAction = $(findForm).find("input[name=action]");
		
        if ($(findAction).length <= 0) {
			$(document.createElement('input')).attr({
				'name': 'action',
				'readonly': 'readonly',
				'type': 'hidden'
			}).val(getAction()).hide().appendTo($(findForm));

		}
   
    }

	
	return true;
}

function getMethodForm(ev,method){

    if(ev){
       
		var tag = $(ev).prop("tagName");
        var findForm = $(ev);
        
        if(tag=='input'){
            findForm = $(ev).closest("form");    
        }
		
        //var findForm = $(ev).parents("form"); 

        var findMethod = $(findForm).find("input[name=method]");
        
        if ($(findMethod).length <= 0) {
            $(document.createElement('input')).attr({
                'name': 'method',
                'readonly': 'readonly',
                'type': 'hidden'
            }).val(method).hide().appendTo($(findForm));
        }

        $(findForm).find("input[name=method]").val(method);
    
    }

    
    return false;
}

function changeSettings(loc) {
	var dWidth;
	var dHeight;
     
	if($('#settings_dialog').length <=0){
	    $(document.createElement('div')).addClass('dialog').attr({'id':'settings_dialog'}).hide().appendTo("body");
	}
	//dWidth="auto";
	//dHeight="auto";
    /*
if (navigator.appVersion.indexOf("MSIE") != -1) {
        dWidth = 400;
    } else {
        dWidth = "auto";
    }
    
    if (navigator.appVersion.indexOf("MSIE") != -1) {
        dHeight = 300;
    } else {
        dHeight = "auto";
    }
*/
    
	var s = getRootPath();
	var url = s + "/cfc/service/UserSettingService.cfc";
	
   $("#settings_dialog").dialog({
      modal:true,
      title:'Settings',
      width: 500,
      height: 'auto',
	  position:['center', 'top'],
	  buttons :  { 
	     "Cancel" : {
	         text: "Cancel",
	         id: "cancel",
	         click: function(){
	            $(this).dialog("close");
	            $('#settings_dialog').dialog("destroy");
	         }   
	      },
	     "OK" : {
	         text: "OK",
	         id: "ok",
	         click: function(){
	            var thisProgramId = $('#program option:selected').val();
	            var thisProgram = $('#program option:selected').text();
	            var thisLocId = $('#unit option:selected').val();
	            //var thisUnit = $('#unit option:selected').text();
	            var thisUnit = $('#unit option:selected').data("unit");
	            var thisSourceCat = $('#maintLevel option:selected').val();
	            var thisMaintLevel = $('#maintLevel option:selected').text();
				
				if(!thisProgramId.length || !thisLocId.length || !thisSourceCat.length){
					return;
				}
				
	
	
				
	            $.post(
	               url,
	               {
	                method:"setUserSettings",
	                programId:thisProgramId,
	                program:thisProgram,
	                locId:thisLocId,
	                unit:thisUnit,
	                sourceCat:thisSourceCat,
	                maintLevel:thisMaintLevel,
	                returnFormat: "json"
	
	               },
	               function(data) {
	                  var obj = $.parseJSON(data)
					  var maintLevel = obj.maintLevel;
					  var unit = obj.unit;
					  var unitMaintLevel = unit;
					  if($.trim(maintLevel).length > 0){
					   unitMaintLevel += " " + maintLevel;     	
					
					  } 
	                  $("#skin_sub_title").html(obj.program+" ("+unitMaintLevel+")");
	                  
					  window.location.replace(getRootPath() + "/index.cfm");
					  
	                  /*
						if (loc != "") {
		                     window.location.replace(loc);
		                  }
						*/
	               }
	            );
	            
				 $.post(
	               getRootPath() + "/" + thisProgram.toLowerCase() + "/controller/notificationsController.cfc",
	               {
	                method:"setAckFlag",
					flag:false
	               }
	            );
				
	            $(this).dialog("close");
	            $('#settings_dialog').dialog("destroy");
	         }  
	      }	       
	   } 
   });
   
   $('#settings_dialog').dialog("option", "position", ['center', 'center']);
   $('#settings_dialog').html("<div class='dialogLoading'><div>Retrieving User Settings...</div></div>");
   $('#settings_dialog').load(s+"/dialogs/userSettings.cfm");
   $('#settings_dialog').dialog("open");
   $('#settings_dialog').dialog('option', 'position', 'center');
}


function viewInTransit(dir) {
	var dWidth;
	var dHeight;
	
	$.ajaxSetup ({
	      cache: false
	});

     
	if($('#inTransit_dialog').length <=0){
	    $(document.createElement('div')).addClass('dialog').attr({'id':'inTransit_dialog'}).hide().appendTo("body");
	}
	
    
	var s = getRootPath();
	var url = s + "/cfc/service/UserSettingService.cfc";
	
   $("#inTransit_dialog").dialog({
      modal:true,
      title:'In Transit',
      width: 500,
      height: 'auto',
	  position:['center', 'top'],
	  buttons :  { 
	     "Cancel" : {
	         text: "Cancel",
	         id: "cancel",
	         click: function(){
	            $(this).dialog("close");
	            $('#inTransit_dialog').dialog("destroy");
	         }   
	      }	  
      }
	  
	  
	  
   });
   
   $('#inTransit_dialog').dialog("option", "position", ['center', 'center']);
   $('#inTransit_dialog').html("<div class='dialogLoading'><div>Retrieving Assets...</div></div>");
   $('#inTransit_dialog').load(s+"/dialogs/inTransitAssets.cfm?dir="+dir);
   $('#inTransit_dialog').dialog("open");
   $('#inTransit_dialog').dialog('option', 'position', 'center');
}

// jQuery plugin definition
jQuery.fn.clearMsg = function(params) {
    
    // merge default and user parameters
    params = jQuery.extend( {msg: '', className: 'message'}, params);
    // traverse all nodes
    this.each(function() {
        // express a single node as a jQuery object
        var $$t = jQuery(this);
        $$t.removeClass('global_error_msg global_success_msg global_info_msg global_notice_msg processing').addClass(params.className);
        $$t.text(params.msg);

    });

    // allow jQuery chaining
    return this;
};

/* Clears message and sets it to a processing message */
function clearMsg(obj)
{
    
    if(typeof obj!="undefined")
    {   
        if($(obj).length)
        {
            $(obj).find('.message').removeClass('global_error_msg global_success_msg global_info_msg global_notice_msg processing global_loading_msg').addClass('message');
            $(obj).find('.message').text("");
        }else{
            $('.message').removeClass('global_error_msg global_success_msg global_info_msg global_notice_msg processing global_loading_msg').addClass('message');
            $('.message').text(""); 
        }
    }else{
        $('.message').removeClass('global_error_msg global_success_msg global_info_msg global_notice_msg processing global_loading_msg').addClass('message');
        $('.message').text("");
    }
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

function setupTab(){
	$.ajax({
			url: "/RIMSS/cfc/facade/SessionFacade.cfc?method=getTab&returnFormat=plain",
			type: "POST"
		}).success(function(d){
			console.log("setupTab(): "+d);
			
			$(".parent").removeClass("active");
			$("#application_menu").find("#"+d).addClass("active");
		});
					
					
}

function setTab(tab){
	$.ajax({
		url: "/RIMSS/cfc/facade/SessionFacade.cfc?method=setTab&returnFormat=plain&tab="+tab,
		type: "POST",
		tab: tab
	});
}

function getTab(){
	console.log("Begin getTab()");
	$.ajax({
			url: "/RIMSS/cfc/facade/SessionFacade.cfc?method=getTab&returnFormat=plain",
			type: "POST"
		}).success(function(d){
			console.log("getTab:"+d);
		});
}

function setupSubSystem(currentProgram){
	var subSystem = '';
	$('#system_category li a').click(function(event){
           event.preventDefault();
		   var system = $(this).text();

           var subSystemArray = system.split(" ");
           
           var subSystem = $.trim(subSystemArray[0]).toLowerCase();
		   
		   //var url = getRootPath() + "/" +currentProgram + "/controller/mainController.cfc";
		   
		   var url = getRootPath() + "/" +currentProgram + "/controller/mainController.cfm";
            
		   $(this).parents('.subSection').attr('id',subSystem);
		   
		     d = {};
           
           d.method="doAction";
           d.action="save.subsystem";
		   d.subSystem=subSystem;
           var saveSubSection = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json'
   
            }).always(function(){
				location.reload();
				
			});
  
       });
  
		return false; 
}

function showAssetLookupDialog(obj) {
    //show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
	
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$('#assetlookup').html('Loading Assets...')
    $('#assetlookup').load(ref,d);
    $('#assetlookup').dialog('open');
}

function showManageConfigDialog(obj) {
    //show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
	
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
    d.action = $(obj).data("action");
    d.id = $(obj).closest(".data").data("id");
    
    //d.action = $(obj).data("action");
	$('#manageConfig').html('Loading...')
    $('#manageConfig').load(ref,d);
    $('#manageConfig').dialog('open');
}

function setupAssetLookupDialog() {
    //defined dialog div
    if($('#assetlookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'assetlookup'}).hide().appendTo('body');
    }

    $('#assetlookup').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Select Asset',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('#lookup_ref').click(function(event) {
        event.preventDefault();
        showAssetLookupDialog($(this));
        return false;
    });
	
}

function setupManageConfigDialog() {
    //defined dialog div
    if($('#manageConfig').length <= 0) {
        $(document.createElement('div')).attr({'id':'manageConfig'}).hide().appendTo('body');
    }

    $('#manageConfig').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Manage Config',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.lookup_ref').click(function(event) {
        event.preventDefault();
        showManageConfigDialog($(this));
        return false;
    });
	
}

function setupAddPartListDialog() {
    //defined dialog div
    if($('#addPartList').length <= 0) {
        $(document.createElement('div')).attr({'id':'addPartList'}).hide().appendTo('body');
    }

    $('#addPartList').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Add a Part',
        model: true,
        width: 500,
        height: 500,
        buttons: {
        	"Submit":function(){
        		var newNoun = $('#newNoun').val();
        		var newPartNo = $('#newPartNo').val()
        		var newNsn = $('#newNsn').val();
        		var newMsl = $('#newMsl').val();
        		
        		if(newNoun.trim()!="" && newPartNo.trim()!="" && newNsn.trim()!="" && newMsl.trim()!=""){
        		
        			$.ajax({
						url: 'BomController.cfc?method=insertPartList&noun='+newNoun+'&partno='+newPartNo+'&nsn='+newNsn+'&msl='+newMsl+'&returnFormat=json',
						success : function (data) {
							var obj = $.parseJSON(data);
							
							if(obj.SUCCESS==false){								
							    $(".dialogDiv").addClass("global_error_msg").html(obj.MESSAGE);
							}else if(obj.SUCCESS==true){
								
								$("#"+action+"Noun_"+id).val(newNoun);
								$("#"+action+"PartnoId_"+id).val($.trim(obj.ID));
					
								$(".message").addClass("global_success_msg").html(obj.MESSAGE);
								$('#addPartList').dialog("close");
							}
						}
					});
					
        		}else{
        			/*if($('.dialogDiv').length <= 0) {
				        $(document.createElement('div')).attr({'class':'dialogDiv'}).appendTo('#parts');
				    }*/
				    $('.dialogDiv').addClass("global_error_msg").html('All fields are required');
        		}
        	},
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.btnAddPart').click(function(event) {
        event.preventDefault();
        showAddPartListDialog($(this));
        return false;
    });
	
}

function showAddPartListDialog(obj) {
    //show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
	
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
    d.id = $(obj).closest(".data").data("id");
    d.action = $(obj).closest(".action").data("action");
    
    //d.action = $(obj).data("action");
	$('#addPartList').html('Loading...')
    $('#addPartList').load(ref,d);
    $('#addPartList').dialog('open');
}

//SRA Noun Lookups
function showSRANounLookupDialog(obj) {
    //show dialog
    var d = {};
	
	if ($('#lookup_sra_noun_ref').attr('name')) {
		d.insSras = 'maintDetail';
	}
	
    d.typeCode = $.trim($(obj).attr("id"));
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
    if($('#partno').length){
		d.partno = $('#partno').val();
		d.partnoId = $('#partnoId').val();
	}
	var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	//alert('Partno - '+d.partno);
	$('#sraNounlookup').html('Loading Nouns...');
    $('#sraNounlookup').load(ref,d);
    $('#sraNounlookup').dialog('open');
}


function setupSRANounLookupDialog() {
    //defined dialog div
    if($('#sraNounlookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'sraNounlookup'}).hide().appendTo('body');
    }

    $('#sraNounlookup').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Select Noun',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('#lookup_sra_noun_ref').click(function(event) {
        event.preventDefault();
        showSRANounLookupDialog($(this));
        return false;
    });
}

function showLookupDialog(obj) {
	var dialogLookup = $('#dialogLookup'); 
	//show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
	
	d.asset = $.trim($("#assetId").val());
    d.partno = $.trim($("#partno").val());
    d.typeCode = $.trim($(obj).attr("id"));
	
	if ($("#typeMaint").val()) {
		d.typeMaint = $.trim($("#typeMaint").val());	
	} 
	
	if ($("#typeMaint").val() == "P - PERIODIC INSPECTION") {
		d.howmal = $.trim($("#howMalCodeId").val());
	}
		
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
}


function setupLookupDialog() {
	var dialogLookup = $('#dialogLookup'); 
	
    //defined dialog div
    if($('#dialogLookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'dialogLookup'}).hide().appendTo('body');
    	dialogLookup = $('#dialogLookup'); 
    }

    $(dialogLookup).dialog({
        autoOpen: false,
        draggable: true,
        title: 'Select',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.lookup_ref').click(function(event) {
    	var title = $(this).attr('title');
    	if (typeof title !== 'undefined' && title !== false && title !== '') {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select ' + title
    	    });
    	} else {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select'
    	    });
    	}		
		//console.log("DIALOG SET UP: ");
        event.preventDefault();
        showLookupDialog($(this));
        return false;
    });
}

function showLookupSRAAssetsDialog(obj) {
	var dialogLookup = $('#sraLookup'); 

	//show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }

    d.nhaAssetId = $.trim($("#assetId").val());
    d.nhaSerno = $.trim($("#nhaSerno").text());
    d.typeCode = $.trim($(obj).attr("id"));

    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
}

function setupLookupSRAAssetsDialog() {
	var dialogLookup = $('#sraLookup'); 
	
    //defined dialog div
    if($('#sraLookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'sraLookup'}).hide().appendTo('body');
    	dialogLookup = $('#sraLookup'); 
    }

    $(dialogLookup).dialog({
        autoOpen: false,
        draggable: true,
        title: 'Select',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.luSRA').click(function(event) {
    	var title = $(this).attr('title');
    	if (typeof title !== 'undefined' && title !== false && title !== '') {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select ' + title
    	    });
    	} else {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select'
    	    });
    	}
        event.preventDefault();
        showLookupSRAAssetsDialog($(this));
        return false;
    });
}

function showLookupSRAByNhaPartno(obj) {
	var startTime = new Date().getTime();
	var dialogLookup = $('#sraByNhaPartno'); 

	//show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
	
    d.nhaPartno = $.trim($("#nhaPartno").val());
    d.typeCode = $.trim($(obj).attr("id"));

    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
}

function setupLookupSRAByNhaPartno() {
	var dialogLookup = $('#sraByNhaPartno'); 
	
    //defined dialog div
    if($('#sraByNhaPartno').length <= 0) {
        $(document.createElement('div')).attr({'id':'sraByNhaPartno'}).hide().appendTo('body');
    	dialogLookup = $('#sraByNhaPartno'); 
    }

    $(dialogLookup).dialog({
        autoOpen: false,
        draggable: true,
        title: 'Select',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.luInsSRA').click(function(event) {
    	var title = $(this).attr('title');
    	if (typeof title !== 'undefined' && title !== false && title !== '') {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select ' + title
    	    });
    	} else {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select'
    	    });
    	}
        event.preventDefault();
        showLookupSRAByNhaPartno($(this));
        return false;
    });
}

// Part Number Lookup
function showPartNoDialog(obj) {
	var dialogLookup = $('#dialogPartNoLookup');
	
	//show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }

	d.sraNoun = $.trim($("#sraNoun").val());
    
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$(dialogPartNoLookup).html('Loading...');
    $(dialogPartNoLookup).load(ref,d);
    $(dialogPartNoLookup).dialog('open',function(e){alert('here');});
}


function setupPartNoDialog() {
	var dialogLookup = $('#dialogPartNoLookup'); 
	
    //defined dialog div
    if($('#dialogPartNoLookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'dialogPartNoLookup'}).hide().appendTo('body');
    	dialogLookup = $('#dialogPartNoLookup'); 
    }

    $(dialogPartNoLookup).dialog({
        autoOpen: false,
        draggable: true,
        title: 'Select',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.lookupPartNo').click(function(event) {
    	var title = $(this).attr('title');
    	if (typeof title !== 'undefined' && title !== false && title !== '') {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select ' + title
    	    });
    	} else {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select'
    	    });
    	}
		console.log("DIALOG SET UP: ");
        event.preventDefault();
        showPartNoDialog($(this));
        return false;
    });
}
//End Part Number Lookup


//SRA Part Order Lookups
function showLookupPartOrderSRAByNhaPartno(obj) {
	var startTime = new Date().getTime();
	var dialogLookup = $('#sraPartOrderByNhaPartno');

	//show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }

    d.nhaPartno = $.trim($("#partno_"+$(obj).parent().parent().attr("id")).val());
    d.typeCode = $.trim($(obj).attr("id"));
    d.id = $(obj).parent().parent().attr("id");
	
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
}

function setupLookupPartOrderSRAByNhaPartno() {
	var dialogLookup = $('#sraPartOrderByNhaPartno'); 
	
    //defined dialog div
    if($('#sraPartOrderByNhaPartno').length <= 0) {
        $(document.createElement('div')).attr({'id':'sraPartOrderByNhaPartno'}).hide().appendTo('body');
    	dialogLookup = $('#sraPartOrderByNhaPartno'); 
    }

    $(dialogLookup).dialog({
        autoOpen: false,
        draggable: true,
        title: 'Select',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.luPartOrderSRA').click(function(event) {
    	var title = $(this).attr('title');
    	if (typeof title !== 'undefined' && title !== false && title !== '') {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select ' + title
    	    });
    	} else {
    	    $(dialogLookup).dialog({
    	    	width: 500,
    	        title: 'Select'
    	    });
    	}
        event.preventDefault();
        showLookupPartOrderSRAByNhaPartno($(this));
        return false;
    });
}
// End SRA Part Order Lookups

//SRA Asset Lookups
function showSRAAssetLookupDialog(obj) {
    //show dialog

    var d = {};
    d.typeCode = $.trim($(obj).attr("id"));
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
    if($('#sranoun').length){
    	d.sranoun = $("#sranoun").val();
	} else if ($('#insSraNoun').length) {
    	d.sranoun = $("#insSraNoun").val();
	}
	if($('#partnoId').length > 0){
        d.partnoid = $.trim($('#partnoId').val());
		d.srapartnoid = $.trim($('#srapartnoid').val());
		//d.sranoun = $.trim($('#sranoun').val());
    }
	var ref = $(obj).attr('href') + "?d=" + new Date().getTime();

	$('#sraAssetlookup').html('Loading Nouns...');
    $('#sraAssetlookup').load(ref,d);
    $('#sraAssetlookup').dialog('open');
}


function setupSRAAssetLookupDialog() {
    //defined dialog div
    if($('#sraAssetlookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'sraAssetlookup'}).hide().appendTo('body');
    }

    $('#sraAssetlookup').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Select SRA Asset',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('#lookup_sra_asset_ref').click(function(event) {
        event.preventDefault();
        showSRAAssetLookupDialog($(this));
        return false;
    });
}


//SRA Part Order Asset Lookups
function showSRAPartOrderAssetLookupDialog(obj) {
    //show dialog
    var d = {};

	d.typeCode = $.trim($(obj).attr("id"));
	d.sranoun = $('#insPartOrderSraNoun_'+$(obj).parent().parent().attr("id")).val();
	d.id = $(obj).parent().parent().attr("id");
	
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
   
	var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	
	$('#sraPartOrderAssetlookup').html('Loading Assets...');
    $('#sraPartOrderAssetlookup').load(ref,d);
    $('#sraPartOrderAssetlookup').dialog('open');
}

function setupSRAPartOrderAssetLookupDialog() {
    //defined dialog div
    if($('#sraPartOrderAssetlookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'sraPartOrderAssetlookup'}).hide().appendTo('body');
    }

    $('#sraPartOrderAssetlookup').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Select Asset',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('.luSernoPartOrder').click(function(event) {
        event.preventDefault();
        showSRAPartOrderAssetLookupDialog($(this));
        return false;
    });
}
// End SRA Part Order Asset Lookups

function setupNotificationsLookupDialog() {
    //defined dialog div
    if($('#notificationsLookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'notificationsLookup'}).hide().appendTo('body');
    }

    $('#notificationsLookup').dialog({
        autoOpen: false,
        draggable: false,
        title: 'View Notifications',
        model: true,
        width: 700,
        height: 500,
        buttons: {
           "Close": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('a.viewNotifications').click(function(event) {
        event.preventDefault();
        showNotificationsLookupDialog($(this));
        return false;
    });
}

function showNotificationsLookupDialog(obj) {
    //show dialog

	var d = {};

	d.currentDate = new Date().getTime();

    var ref = $(obj).attr('href') + "?d=" + d.currentDate;
    
    $('#notificationsLookup').html('Loading Notifications...');
    $('#notificationsLookup').load(ref,d);
    $('#notificationsLookup').dialog('open');
}

function setMaintStatus(){
	var s = getRootPath();
			 var program = $("#prog").val();
			 var url = s + "/"+program+"/controller/maintenanceController.cfc";

 			$.post(
               url,
               {
                method:"setMaintStatus",
				maintStatus:$("#maintStatus").val()
               }
            );
}

function setDueDateInterval(){
	var s = getRootPath();
			 var program = $("#prog").val();
			 var url = s + "/"+program+"/controller/maintenanceController.cfc";
			 //console.log($("#dueDateInterval").val())
 			$.post(
               url,
               {
                method:"setDueDateInterval",
				dueDateInterval:$("#dueDateInterval").val()
               }
            );
}
function setupAckNotificationsDialog(program) {
    //defined dialog div
    if($('#ackNotifications').length <= 0) {
        $(document.createElement('div')).attr({'id':'ackNotifications'}).hide().appendTo('body');
    }

	
    $('#ackNotifications').dialog({
		dialogClass: 'noTitle',
		open: function(event, ui) { $(".ui-icon .ui-icon-closethick", ui.dialog || ui).hide(); },
        autoOpen: false,
        draggable: false,
        title: 'RIMSS MESSAGING ALERT SYSTEM ',
        model: true,
        width: 700,
        height: 500,
        buttons: {
           "ACKNOWLEDGE": function() {
			 
			 var s = getRootPath();
			 var program = $("#prog").val();
			 var url = s + "/"+program+"/controller/notificationsController.cfc";

			 $.post(
               url,
               {
                method:"setAckFlag",
				flag:true
               }
            );

			
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('a.viewAckNotifications').click(function(event) {
        event.preventDefault();
        showAckNotificationsDialog($(this));
        return false;
    });
}

function showAckNotificationsDialog(obj) {
    //show dialog

	var d = {};
    
	d.currentDate = new Date().getTime();

    var ref = obj + "?d=" + d.currentDate;
    
    $('#ackNotifications').html('Loading Notifications...');
    $('#ackNotifications').load(ref,d);
    $('#ackNotifications').dialog('open');
}




//SRA Part Order Tracking Lookups

function showTrackingDialog(obj) {
    //show dialog
    var d = {};
    //Pass in the removed asset and replaced Asset ID to the form scope
    //of the dialog box
	d.insSraAsset = $('#insSraAssetId_'+$(obj).parent().parent().attr("id")).val();
	d.remAsset = $('#remAssetId_'+$(obj).parent().parent().attr("id")).val();
	d.id = $(obj).parent().parent().attr("id");
	
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }
   
	var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$('#trackingDialog').html('Loading Assets...');
    $('#trackingDialog').load(ref,d);
    $('#trackingDialog').dialog('open');
}

function setupTrackingDialog() {
    //defined dialog div
    if($('#trackingDialog').length <= 0) {
        $(document.createElement('div')).attr({'id':'trackingDialog'}).hide().appendTo('body');
    }    

    $('#trackingDialog').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Shipping Information',
        model: true,
        width: 500,
        height: 500,
        buttons: {
		   "Save": {
		   		text: "Save",
		   		id: "save",
		   		click: function() {
		   			var today = new Date();
					var day = ("0" + today.getDate()).slice(-2);
					var month = new Date(today).format("mmm");
					var year = today.getFullYear();
					
					if (day.length == 1) {
						day = '0' + day;
					}
					var now = day + '-' + month + '-' + year;
					
				    var s = getRootPath().toUpperCase();
					var program = $("#prog").val();
					var url = s + "/"+program+"/controller/maintenanceController.cfc";
					var action = $("#action").val();
					
					if(action == 'F'){
					$.post(
              			url,
              			{
               				method:"partOrderedShipped",
							sruOrderId: $('#lookUpId').val(),
							assetId: $('#assetId').val(),
							shipper: $('#shipper').val(),
							tcn: $('#tcNumber').val(),
							shipDate: $('#shipDate').val()
              			}, function(){
              						$(".message").addClass("global_info_msg").html("Reloading page...");
									$('#tcn_'+$('#lookUpId').val()).val($('#tcNumber').val());
									alert('Part Order shipping information has been accepted');
									location.reload();
							});
						}
						else{
					$.post(
              			url,
              			{
               				method:"partOrderedREQ",
							sruOrderId: $('#lookUpId').val(),
							assetId: $('#remAssetId').val(),
							shipper: $('#shipper').val(),
							tcn: $('#tcNumber').val(),
							shipDate: $('#shipDate').val()
              			}, function(){
              						$(".message").addClass("global_info_msg").html("Reloading page...");
									$('#reqtcn_'+$('#lookUpId').val()).val($('#tcNumber').val());
									alert('Part Order Replacement shipping information has been accepted');
									location.reload();
							});							
						}
				
				
				$(this).dialog("close");
				}
		   },		   
           "Cancel": {
           text: "Cancel",
           id: "cancel",
	           click: function() {
	              $(this).dialog("close");
	           }
           }
        }
    });

    //show dialog
    $('.shippingDialog').click(function(event) {
        event.preventDefault();
        showTrackingDialog($(this));
        return false;
    });
}


// End Part Order Tracking Lookups




function addAjaxSessionCheck(){
    $.ajaxSetup({
        complete: function (req, settings) {
			if(req.getResponseHeader('Session-Expired') != null) {
				window.location = getRootPath() + "/";
			  return false;   
             }
        }
    });

}


function setupAjaxErrorCheck(){
	$(document).ajaxError(function(event,response,settings,exception) {
		//var sessionTimeout = response.getResponseHeader("SessionTimeout");
        if (response.status == 403) {
		  resetMessageClass();
		  location.href = getRootPath();
		}else{
		  checkForAjaxError(response.responseText);	
		}
    });
}

function checkForAjaxError(response){
    //RWR remove before delopy
    //alert('Here checkForAjaxError');
    
    try {
        var msgObj = $(response).find("div.errorInfo div.errorMsg");
        var globalClass="global_error_msg";
        if ($(msgObj).length > 0) {
            if($(msgObj).hasClass("global_notice_msg")){
                globalClass="global_notice_msg";
            }
            
            if($(msgObj).hasClass("global_info_msg")){
                globalClass="global_info_msg";
            }
            
            if($(msgObj).hasClass("global_success_msg")){
                globalClass="global_success_msg";
            }
            
            if($(msgObj).hasClass("global_error_msg")){
                globalClass="global_error_msg";
            }
            
			var currentMessageDiv = $('.message');
			
			//Look for .message in an open dialog window
			if ($('.ui-dialog-content:visible') && $('.ui-dialog-content').find('.message').length > 0) {
				currentMessageDiv = $('.ui-dialog-content').find('.message');
			}else if ($('.ui-dialog-content:visible') && $('.ajaxError').find('.errorMsg').length > 0) {
					currentMessageDiv = $('.ajaxError').find('.errorMsg');
			}			
            $(currentMessageDiv).addClass(globalClass).text($(msgObj).text());
            return;
        }
    }catch(err){
        
    }
}

function setupEditHighlight(){
	try {
		$('table.globalTable tbody tr td.edit').bind("mouseover", function(e){
			$(this).parents('tr').addClass('highlight');
		});
		$('table.globalTable tbody tr td.edit').bind("mouseout", function(e){
			$(this).parents('tr').removeClass('highlight');
		});
	}catch(err){
		
	}
}

function setupHighlight(){
    try {
        $('table.globalTable tbody').on("mouseover", "tr", function(e){
            $(this).addClass('highlight');
        });
        $('table.globalTable tbody').on("mouseout", "tr", function(e){
            $(this).removeClass('highlight');
        });
    }catch(err){
        
    }
}


function resetForm(frm) {
    frm.find('input[type=text], input[type=hidden], textarea').not('.noreset').val('');
    frm.find('select').not('.noreset').removeAttr('selected').find('option:first').attr('selected','selected');
    frm.find('input:radio, input:checkbox').not('.noreset').removeAttr('checked');
	resetMessageClass();
}

function resetMessageClass(){
	$(".message").removeClass (function (index, css) {
    return (css.match (/global_(.+)_msg/g) || []).join(' ');
	}).empty();

}

function addTextAreaMaxLength()
{

    $('textarea[maxlength]').each(function(){
        $(this).maxLength(parseInt($(this).attr('maxlength'),10));

    });
    
}


function addNumericPasteCheck(){
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;    
    var ctrlv = false;

    $(document).keydown(function(e){
        if (e.keyCode == ctrlKey) ctrlDown = true;     
        }).keyup(function(e){
            if (e.keyCode == ctrlKey) ctrlDown = false;
        });
    
      
    $("input[type=text].numeric,textarea.numeric").keydown(function(e)
    {

        if (ctrlDown && (e.keyCode == vKey)){
            ctrlv = true;
                
        }     
    }); 
    
    $("input[type=text].numeric,textarea.numeric").keyup(function(e)
    {

        if (ctrlv){

            $(this).val(stripAlphaChars($(this).val()));
                
        }     
    }); 

}

/* Add Numeric Restriction using class="numeric" */
function addNumeric()
    {
    
    try{
        /* Add numeric filter to input fields with class of 'numeric' */
        $('.numeric').numeric();
        addNumericPasteCheck();
        }catch(err){}
    }

function addAlphaNumeric()
    {
    
    try{
        /* Add alphanumeric filter to input fields with class of 'alphanumeric' */
        $('.alphanumeric').alphanumeric();
        addAlphaNumericPasteCheck();
        }catch(err){}
    }

function addAlphaNumericPasteCheck(){
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;    
    var ctrlv = false;

    $(document).keydown(function(e){
        if (e.keyCode == ctrlKey) ctrlDown = true;     
        }).keyup(function(e){
            if (e.keyCode == ctrlKey) ctrlDown = false;
        });
    
      
    $("input[type=text].alphanumeric,textarea.alphanumeric").keydown(function(e)
    {

        if (ctrlDown && (e.keyCode == vKey)){
            ctrlv = true;
                
        }     
    }); 
    
    $("input[type=text].alphanumeric,textarea.alphanumeric").keyup(function(e)
    {

        if (ctrlv){

            $(this).val(stripNonAlphaNumericChars($(this).val()));
                
        }     
    }); 

}

function stripAlphaChars(str) 
{ 
var m_strOut = str + ''; 
    m_strOut = m_strOut.replace(/[^0-9\.]/g, ''); 

    return m_strOut; 
}

function stripNonAlphaNumericChars(str) 
{ 
var m_strOut = str + ''; 
    m_strOut = m_strOut.replace(/[^a-zA-Z0-9\.]/g, ''); 

    return m_strOut; 
}


/*Adds a class 'requiredField' to all the fields with a label with class = 'required'*/
function addRequiredtoLabels(){
    var sp = "<span class='font10 required_field'>*</span>";
	$("label.required:not(:button)").find(".required_field").remove();   
    $('label.required:not(:button)').prepend(sp);

    /*
var sp = "<span class='font10'>&nbsp;</span>";
	$("label:not(.required):not(:button)").find("span.font10:not(.required_field)").remove(); 
    $('label:not(.required):not(:button)').prepend(sp);
*/


	

}

function empty( mixed_var ) {
            return ( typeof(mixed_var) === 'undefined' || mixed_var === null  || mixed_var === false );
        }

function stripe(table){

    $(table).find("tbody").children("tr").removeClass("odd even");
	 $(table).find("tbody tr:nth-child(even)").addClass('even');
	 $(table).find("tbody tr:nth-child(odd)").addClass('odd');
}

function modifyDTColumns(){
    try {
        if ($('table.globalTable ').length) {
            $('table.globalTable ').each(function(){
				var dateCols = $(this).find("th.date");
                var noSortCols = $(this).find("th.noSort");
					
					/*
aoColumns = [
					 {"bVisible":false},
					 {"bSortable":false},
					 null,
					 null,
					 null,
					 null,
					 null,
					 null,
					 null,
					 null,
					 null,
					 null,
					 null,
					 {"bSortable":false}
					];


	                var dTable = $(this).dataTable({
						"fnDrawCallback": null, //addColSpan,
						"aaSortingFixed": [[ 0, 'asc' ]],
						"aoColumns": aoColumns,
						"bStateSave":true,
						"bAutoWidth": false,
						"bFilter":true,
						"bSortClasses": false,
						"bPaginate": false,
						"sDom": 'lr<"giveHeight"t>',
						"iCookieDuration":1*60
					});
*/
	              
  $(noSortCols).each(function(){
	                    
	                    dTable.fnSettings().aoColumns[$(this).index()].bSortable = false;
	                });
	                
	                $(dateCols).each(function(){
	                    dTable.fnSettings().aoColumns[$(this).index()].sType = "date";
	                });

            });
			
			
        }
		
		
		 function addColSpan(oSettings){
		 	//alert(getStationCount(oSettings.sTableId));
						
						
						
						if ( oSettings.aiDisplay.length == 0 )
						{
							//remove delete buttons
							//$('.delbtn:visible').hide();
							return;
						}

						//var countArray = [];
						
						
						var station = "";

						var nTrs = $('tbody tr', oSettings.nTable);
						var iColspan = nTrs[0].getElementsByTagName('td').length;
						var sLastGroup = "";
						var i=0;

						for ( var i=0 ; i<nTrs.length ; i++ )
						{
							var iDisplayIndex = oSettings._iDisplayStart + i;
							var sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData[0];
							if ( sGroup != sLastGroup )
							{
								var nGroup = document.createElement( 'tr' );
								var nCell = document.createElement( 'td' );
								var re = new RegExp('^[A-Z0-9A-z]{1,}',"g");
								console.log("re is : " + re);
								var m = re.exec(sGroup.toUpperCase());
								
								nCell.colSpan = iColspan;
								console.log("iColspan: " + iColspan);
								nCell.className = "group";
								nCell.innerHTML = sGroup.toUpperCase();
								nGroup.appendChild( nCell );
								
								nTrs[i].parentNode.insertBefore( nGroup, nTrs[i] );
								sLastGroup = sGroup;

							}
						}
		 }
    }catch(err){
        
    }
        
}

function getCodeValue(e){
  //Clear up textarea reader if first come to the page or initial start of the reading of data.
  if(!hasBeenRefreshed){
    $(this).val('');
    hasBeenRefreshed = true;
  }
  
  if (hasKeyPress && !itemsFound) {
      resetMessageClass();
      $(".message").addClass("global_loading_msg").text("Reading Data..."); 
  }
  hasKeyPress = true;
  
  if(e.which==10){
        var lineFeed = $(this).val() + "\n";
        lineFeed = lineFeed.replace("\n\n","\n","g");
        $(this).val(lineFeed);
        var self = this;
        
        currentValue = lineFeed;
        var uidArray = $.trim($(this).val()).split("\n");
        var uids = $.trim($(this).val()).split("\n").length;
		var currentUid = uidArray[uids-1];
		var currentUid = currentUid.replace(/[|&;$%@"<>()+,]/g, "");
        $(".message").addClass("global_loading_msg").text("Reading Data...UID Item(s)..."+ uids + " : "+ currentUid +" ");
        itemsFound = true;
        
        $("textarea.reader").watchForEndOfInput(function(e){
            //$('.message').addClass("global_loading_msg").text("Processing Data..."+uids+" UID Item(s)");  
            
            $('#inputFromUID').setActionMethod("read.uid","doAction");
            clearInterval($(self).data('watch_timer_end'));
            $(self).removeData('watch_timer_end');
            //setAction("read.uid",$(self));
            //setMethod("doAction",$(self));
            $(self).closest("form").submit();
        });

    } 

}
        
function checkReaderFocus(){
    resetMessageClass();

    if ($("textarea.reader").is(":focus")) {
         $('.message').addClass("global_info_msg").text("Input is ready to accept reader data.");
    }else {
         $('.message').addClass("global_notice_msg").text("Input not ready.  Please click Reset button.");
    }       

}
     
function setupUIDReader(){	
    if(!$('.message').hasClass("global_error_msg")){
        checkReaderFocus(); 
    }
    
    $(window).blur(function(e){
      checkReaderFocus();
    });
    
    $(document).on("click keypress",null,null,function(e){
        if (!hasKeyPress) {
            checkReaderFocus();
        }
    })
    
    $('.mainContent').on("click",null,null,function(e){ $('textarea.reader').focus();})
    $("textarea.reader").on("keypress", null, null,getCodeValue);
}
        
		
//Used with UID Reader
var hasKeyPress = false;
var itemsFound = false;
var hasBeenRefreshed = false;

/* jQuery Plugins  */
jQuery.fn.watch = function( id, fn ) {

    return this.each(function(){

        var self = this;

        var oldVal = self[id];
        $(self).data(
            'watch_timer',
            setInterval(function(){
                if (self[id] !== oldVal) {
                    fn.call(self, id, oldVal, self[id]);
                    oldVal = self[id];
                }
            }, 100)
        );

    });

    return self;
};

jQuery.fn.watchForEndOfInput = function(fn) {

    return this.each(function(){

        var self = this;
        
        var oldVal = $(this).val();
        
        var interval =  setInterval(function(){
                if ($(self).val() === oldVal) {
                    $(self).removeData('watch_timer_end');
                    fn.call();
                    oldVal = $(self).val();
                }else{

                }

            }, 1000);
        
        $(self).data(
            'watch_timer_end',interval);

    });

    return self;
};
		



/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ( $ ) {
    
$.fn.alterClass = function ( removals, additions ) {
    
    var self = this;
    
    if ( removals.indexOf( '*' ) === -1 ) {
        // Use native jQuery methods if there is no wildcard matching
        self.removeClass( removals );
        return !additions ? self : self.addClass( additions );
    }
 
    var patt = new RegExp( '\\s' + 
            removals.
                replace( /\*/g, '[A-Za-z0-9-_]+' ).
                split( ' ' ).
                join( '\\s|\\s' ) + 
            '\\s', 'g' );
 
    self.each( function ( i, it ) {
        var cn = ' ' + it.className + ' ';
        while ( patt.test( cn ) ) {
            cn = cn.replace( patt, ' ' );
        }
        it.className = $.trim( cn );
    });
 
    return !additions ? self : self.addClass( additions );
};
 
})( jQuery );



if (jQuery) {
    /**
     * YOU ARE FREE TO USE THIS CODE IF YOU HOLD THE REFERENCE TO THE AUTHOR
     * Plugin for jQuery that delimites the maximum of characteres in inputs and textareas
     * @author: Iván Guardado Castro
     * @email: dev.ivangc@gmail.com
     * @website: http://yensdesign.com/
     */
    jQuery.fn.maxLength = function(max){
        this.each(function(){
            //Get the type of the matched element
            var type = this.tagName.toLowerCase();
            //If the type property exists, save it in lower case
            var inputType = this.type ? this.type.toLowerCase() : null;
            //Check if is a input type=text OR type=pwd
            if (type == "input" && inputType == "text" || inputType == "password") {
                //Apply the standard maxLength
                this.maxLength = max;
            }
            //Check if the element is a textarea
            else 
                if (type == "textarea") {
                    //Add the key press event
                    this.onkeypress = function(e){
                        //Get the event object (for IE)
                        var ob = e || event;
                        //Get the code of key pressed
                        var keyCode = ob.keyCode;
                        //Check if it has a selected text
                        var hasSelection = document.selection ? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
                        //return false if can't write more
                        return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
                    };
                    //Add the key up event
                    this.onkeyup = function(){
                        //If the keypress fail and allow write more text that required, this event will remove it 
                        if (this.value.length > max) {
                            this.value = this.value.substring(0, max);
                        }
                    };
                }
        });
    };

}

$.fn.alphanumeric = function(p) { 

        p = $.extend({
            ichars: "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`-_",
            nchars: "",
            allow: ""
          }, p);    

        return this.each
            (
                function() 
                {

                    if (p.nocaps) p.nchars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    if (p.allcaps) p.nchars += "abcdefghijklmnopqrstuvwxyz";
                    
                    s = p.allow.split('');
                    for ( i=0;i<s.length;i++) if (p.ichars.indexOf(s[i]) != -1) s[i] = "\\" + s[i];
                    p.allow = s.join('|');
                    
                    var reg = new RegExp(p.allow,'gi');
                    var ch = p.ichars + p.nchars;
                    ch = ch.replace(reg,'');

                    $(this).keypress
                        (
                            function (e)
                                {
                                
                                    if (!e.charCode) k = String.fromCharCode(e.which);
                                        else k = String.fromCharCode(e.charCode);
                                        
                                    if (ch.indexOf(k) != -1) e.preventDefault();
                                    if (e.ctrlKey&&k=='v') e.preventDefault();
                                    
                                }
                                
                        );
                        
                    //$(this).bind('contextmenu',function () {return false});
                                    
                }
            );

    };

    $.fn.numeric = function(p) {
    
        var az = "abcdefghijklmnopqrstuvwxyz";
        az += az.toUpperCase();
        p = $.extend({
            nchars: az,
			ichars: "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`-_"
          }, p);    
            
        return this.each (function()
            {
                $(this).alphanumeric(p);
            }
        );
            
    };
    
    $.fn.alpha = function(p) {

        var nm = "1234567890";

        p = $.extend({
            nchars: nm
          }, p);    

        return this.each (function()
            {
                $(this).alphanumeric(p);
            }
        );
            
    };  
    
    (function($){
		$.fn.stripe = function(options) {
		var defaults = {
		odd : 'odd',
		even : 'even'
		};
		var options = $.extend(defaults, options);
		return this.each(function() {
		$(this).find("tbody").children("tr").removeClass(options.even).removeClass(options.odd);
	     $(this).find("tbody tr:nth-child(even)").addClass(options.even);
	     $(this).find("tbody tr:nth-child(odd)").addClass(options.odd);	
	
		});
		}
	})(jQuery);
	
	(function( $ ) {
      $.fn.setAction = function(action,obj) {
	  	    
            var tag = $.trim(this.prop("tagName").toLowerCase());
 
            if(!empty(obj)){
              var cobj = $(obj); 

            }else if(tag === 'form'){
              var cobj = $(this);

            }else if(tag === 'input'){
               var cobj = $(this).closest('form');

            }


            
                var input = $(document.createElement('input')).attr({
                        'name': 'action',
						'type': 'hidden',
						'readonly': 'readonly'
                    }).val(action);
                 return this.each(function() {
                        var count = $(cobj).find("input[name=action]").length;
                        if(!count){
							count = $(cobj).find("input[name=action]").length;
                            $(input).hide().appendTo(cobj);
                        }else{
                            $(cobj).find("input[name=action]").hide().val(action);
                        }

                        
                    
                    
                });
            
            
      };
    })( jQuery );
    
    (function( $ ) {
      $.fn.setMethod = function(method,obj) {
            var tag = this.prop("tagName").toLowerCase();  
            if(!empty(obj)) {
              var cobj = $(obj);    
            }else if(tag == 'form'){
              var cobj = $(this);
            }else if(tag == 'input'){
               var cobj = $(this).closest('form');
            
            }


            
                var input = $(document.createElement('input')).attr({
                        'name': 'method',
						'type': 'hidden',
                        'readonly': 'readonly'
                    }).val(method);
                 return this.each(function() {
                    
                        var count = $(cobj).find("input[name=method]").length;
                        if(!count){
                            $(input).appendTo(cobj);
                        }else{
                            $(cobj).find("input[name=method]").val(method);
                        }

                        
                    
                    
                });
            
            
      };
    })( jQuery );
    
    
    (function( $ ) {
      $.fn.setActionMethod = function(action,method,obj) {
             $(this).setAction(action,obj).setMethod(method,obj);
            
            
      };
    })( jQuery );

    function removeConfirmation()
            {
               msg = "You are about to REMOVE a record, are you sure you want to proceed with this action?";
               return confirm(msg);
            }
			
