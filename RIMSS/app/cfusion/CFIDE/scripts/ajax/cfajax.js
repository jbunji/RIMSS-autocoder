// ADOBE SYSTEMS INCORPORATED Copyright 2007 Adobe Systems Incorporated All Rights Reserved. 
// NOTICE: Adobe permits you to use, modify, and distribute this file in accordance with the
// terms of the Adobe license agreement accompanying it. If you have received this file from 
// a source other than Adobe, then your use, modification, or distribution of it requires the 
// prior written permission of Adobe.

function cfinit() { // Wrap in a function so the var scoped variables stay local
if (!window.ColdFusion) {
ColdFusion = {}; var $C = ColdFusion; // Create ColdFusion namespace
if (!$C.Ajax) $C.Ajax = {}; var $A = $C.Ajax;
if (!$C.AjaxProxy) $C.AjaxProxy = {}; var $X = $C.AjaxProxy;
if (!$C.Bind) $C.Bind = {}; var $B = $C.Bind;
if (!$C.Event) $C.Event = {}; var $E = $C.Event;
if (!$C.Log) $C.Log = {}; var $L = $C.Log;
if (!$C.Util) $C.Util = {}; var $U = $C.Util;
if (!$C.DOM) $C.DOM = {}; var $D = $C.DOM;
if (!$C.Spry) $C.Spry = {};var $S = $C.Spry;
if (!$C.Pod) $C.Pod = {}; var $P = $C.Pod;

if (!$C.objectCache) $C.objectCache = {};
if (!$C.required) $C.required = {};
if (!$C.importedTags) $C.importedTags = [];

// Counter to append to GET requests to suppress caching
// on IE.
if (!$C.requestCounter) $C.requestCounter = 0;

// Cache of functions wrapping bind handlers and params,
// used to force invocation of a bind when required.
if (!$C.bindHandlerCache) $C.bindHandlerCache = {};

// Setup localized loading text
window._cf_loadingtexthtml = '<div style="text-align: center;">' + window._cf_loadingtexthtml + '&nbsp;' + CFMessage['loading'] + '</div>';

// The global error handler.
// Implements the default error handler behaviour, to pop up an alert box.
$C.globalErrorHandler = function(message, component)
{
	if ($L.isAvailable)
	{
		$L.error(message, component);
	}
	
	if ($C.userGlobalErrorHandler)
	{
		$C.userGlobalErrorHandler(message);
	}
	
	// If neither the logger nor the user global error handler
	// are available, pop up an error message
	if (!$L.isAvailable && !$C.userGlobalErrorHandler)
	{
		alert(message + CFMessage['globalErrorHandler.alert']);
	}
};

$C.handleError = function(errorHandler, message, component, params, 
								   status, statusText, throwOnError, callbackParams)
{
	var msg = $L.format(message, params);
	if (errorHandler)
	{
		$L.error(msg, "http");
		if (!status) status = -1;
		if (!statusText) statusText = msg;
		errorHandler(status, statusText, callbackParams);
	}
	else
	{
		if (throwOnError)
		{
			$L.error(msg, "http");
			throw msg;
		}
		else
		{
			$C.globalErrorHandler(msg, component);
		}
	}
};

// Public function to allow users to 
// set their own custom global error handler
$C.setGlobalErrorHandler = function(errorHandler)
{
	$C.userGlobalErrorHandler = errorHandler;
};

// Returns a XMLHttpRequest object
$A.createXMLHttpRequest = function() 
{

  try 
  {
    return new XMLHttpRequest();
  } 
  catch(e) {}

  var types = [
    'Microsoft.XMLHTTP',
    'MSXML2.XMLHTTP.5.0',
    'MSXML2.XMLHTTP.4.0',
    'MSXML2.XMLHTTP.3.0',
    'MSXML2.XMLHTTP'
   ];

  for (var i = 0; i < types.length; i++) 
  {
    try 
    {
      return new ActiveXObject(types[i]);
    } 
    catch(e) {}
  }

  return false; // XMLHttpRequest not supported
};

$A.isRequestError = function(req)
{
	// We also have to check for the server-error header, since WebSphere, in its infinite wisdom,
	// seems to dislike returning HTTP response codes that we set.
	return ((req.status != 0 && req.status != 200) || req.getResponseHeader('server-error'));
};

// Sends a message.
$A.sendMessage = function(url, httpMethod, query, async, callbackHandler, callbackParams, throwOnError)
{
	var req = $A.createXMLHttpRequest();
	
	if (!httpMethod) httpMethod = 'GET';
	
	if (async && callbackHandler)
	{
		req.onreadystatechange = function() { $A.callback(req, callbackHandler, callbackParams); };
	}
	
	// Ensure that debugging is always disabled for AJAX calls
	// If debugging is enabled, we get JSON parse errors
	if (query)
	{
		query += "&_cf_nodebug=true&_cf_nocache=true";
	}
	else
	{
		query = "_cf_nodebug=true&_cf_nocache=true";
	}
	
	if (window._cf_clientid)
	{
		query += '&_cf_clientid=' + _cf_clientid;
	}
	
	if (httpMethod == 'GET')
	{
		if (query)
		{
			// Even with the headers we send back for _cf_nocache,
			// IE still fetches data from the cache intermittently.
			// Setting this counter on every request will form unique URLs,
			// forcing a GET. _cf_nocache is still required, since the
			// counter will start from 0 again when the page is reloaded.
			// We could have done this using Date.getTime(), but that is
			// expensive in comparison to this approach.
			query += "&_cf_rc=" + ($C.requestCounter++);
			
			if (url.indexOf('?') == -1)
			{
				url += '?' + query;
			}
			else
			{
				url += '&' + query;
			}
		}
		
		$L.info("ajax.sendmessage.get", "http", [url]);
		
		req.open(httpMethod, url, async);
		req.send(null);
	}
	else // POST
	{
		$L.info("ajax.sendmessage.post", "http", [url, query]);

		req.open(httpMethod, url, async);
		// Have to set content type properly, or CF form scope will not
		// get filled up
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if (query)
		{
			req.send(query);
		}
		else
		{
			req.send(null);
		}
	}
	
	if (!async)
	{
		while (req.readyState != 4);
		if ($A.isRequestError(req))
		{
			$C.handleError(null, "ajax.sendmessage.error", "http", [req.status, req.statusText], 
									req.status, req.statusText, throwOnError);
		}
		else
		{
			return req;
		}
	}
};

$A.callback = function(req, callbackHandler, callbackParams)
{
	if (req.readyState != 4)
	{
		return;
	}
	//82529:IE6 memory leak issue. XMLHttpRequestObject does not release onredaystatechange function, which internally
	// keep hold of req object.
	req.onreadystatechange = new Function;
	callbackHandler(req, callbackParams);
};

// Submits a form.
// If the async flag is true, after submission, it calls the callbackHandler with the
// response text as an argument. In case of an error, the error handler is invoked
// with the HTTP status code and message as arguments.
// If the async flag is false, it ignores the callbackHandler, and returns
// the response text directly. In case of any errors, error handler, if available, is invoked.
$A.submitForm = function(formId, url, callbackHandler, errorHandler, httpMethod, async)
{
	var query = $C.getFormQueryString(formId);
	if (query == -1)
	{
		$C.handleError(errorHandler, "ajax.submitform.formnotfound", "http", [formId], -1, null, true)
		return;
	}
	
	if (!httpMethod) httpMethod = "POST";
	
	// Set async to false only if it really is false, else make it true
	async = !(async === false);
	
	var callback = function(req) {$A.submitForm.callback(req, formId, callbackHandler, errorHandler)};
	
	$L.info("ajax.submitform.submitting", "http", [formId]);
	
	var response = $A.sendMessage(url, httpMethod, query, async, callback);
	
	if (!async)
	{
		$L.info("ajax.submitform.success", "http", [formId]);
		return response.responseText;
	}
};

$A.submitForm.callback = function(req, formId, callbackHandler, errorHandler)
{
	if ($A.isRequestError(req))
	{
		$C.handleError(errorHandler, "ajax.submitform.error", "http", 
								[req.status, formId, req.statusText], req.status, req.statusText);
	}
	else
	{
		$L.info("ajax.submitform.success", "http", [formId]);
		if (callbackHandler)
		{
			callbackHandler(req.responseText);
		}
	}
};

//A function which acts as placeholder for hrefs that do not have any actions to be done once they are clicked
$C.empty = function()
{
};

//A function that is called on load to set the onclick handler for submit button when CFFORM is present within a 
//container
$C.setSubmitClicked = function(formId, submitBtnId)
{
	var el = $D.getElement(submitBtnId, formId);
	//Also set a property in the element to indicate that the submit button is the one generated by CFINPUT tag
	//and not the input html tag
	el.cfinputbutton = true;
	//The onlick handler used to set a property onclick to identify which submit button is clicked
	//when the form query string is formed during ajax form submit
	$C.setClickedProperty = function()
	{
		el.clicked = true;
	}
	$E.addListener(el, "click", $C.setClickedProperty);
};

// Forms the query string by iterating through all the form elements. This is used
// while submitting the form asynchornously
// If the returnObject flag is true, the form contents will be return as an object
// rather than a string
$C.getFormQueryString = function(formId, returnObject)
{
	var formInstance;
	if(typeof formId == 'string')
	{
		// Determine if the argument is a form id or a form name.
		// Note form name usage is deprecated by supported
		// here for legacy reasons.
		formInstance = (document.getElementById(formId) || document.forms[formId]);
	}
	else if(typeof formId == 'object')
	{
		// Treat argument as an HTML form object.
		formInstance = formId;
	}
	
	if (!formInstance || null == formInstance.elements)
	{
		return -1;
	}

	var element, elementName, elementValue, elementDisabled;
	var hasSubmit = false;
	var formData = (returnObject) ? {} : "";
	// Iterate over the form elements collection to construct the
	// label-value pairs.
	for (var i=0; i<formInstance.elements.length; i++)
	{
		element = formInstance.elements[i];
		elementDisabled = element.disabled;
		elementName = element.name;
		elementValue = element.value;

		// Do not submit fields that are disabled or
		// do not have a name attribute value.
		if(!elementDisabled && elementName)
		{
			switch (element.type)
			{
				case 'select-one':
				case 'select-multiple':
					for(var j=0; j<element.options.length; j++)
					{
						if(element.options[j].selected)
						{
							if(window.ActiveXObject)
							{
								formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, element.options[j].attributes['value'].specified?element.options[j].value:element.options[j].text);
							}
							else
							{
								formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, element.options[j].hasAttribute('value')?element.options[j].value:element.options[j].text);
							}
						}
					}
					break;
				case 'radio':
				case 'checkbox':
					if(element.checked)
					{
						formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, elementValue);
					}
					break;
				case 'file':
					// stub case as XMLHttpRequest will only send the file path as a string.
				case undefined:
					// stub case for fieldset element which returns undefined.
				case 'reset':
					// stub case for input type reset button.
					break;
				case 'button':
					formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, elementValue);
					break;
				case 'submit':
					//If the submit button is defined using CFINPUT, then make sure that only the submit
					//button clicked goes into the form scope
					//If the button is defined using INPUT html tag, then all the submit buttons get into the form
					//scope. This is being done becuase there is no way to know which button is clicked in case of buttons
					//defined using input html tag
					if(element.cfinputbutton)
					{
						if(hasSubmit == false && element.clicked)
						{
							formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, elementValue);
							hasSubmit = true;
						}
					}
					else
					{
						formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, elementValue);
					}
					break;
				case 'textarea':
					var editorinstance;
					if(window.FCKeditorAPI && (editorinstance = $C.objectCache[elementName]) && editorinstance.richtextid)
					{
							var fckinstance = FCKeditorAPI.GetInstance(editorinstance.richtextid);
							if(fckinstance)
							{
								elementValue = fckinstance.GetXHTML();
							}					
					}
					formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, elementValue);
					break;
				default:
					formData = $C.getFormQueryString.processFormData(formData, returnObject, elementName, elementValue);
					break;
			}
		}
	}

	if (!returnObject) formData = formData.substr(0, formData.length - 1);

	return formData;
};

$C.getFormQueryString.processFormData = function(formData, returnObject, elementName, elementValue)
{
	if (returnObject)
	{
		if (formData[elementName])
		{
			// Make sure multi-valued elements are passed through properly
			formData[elementName] += ',' + elementValue;
		}
		else
		{
			formData[elementName] = elementValue;
		}
	}
	else
	{
		formData += encodeURIComponent(elementName) + '=' + encodeURIComponent(elementValue) + '&';
	}
	return formData;
};

// Marks a tag as imported. Used by theCFAJAXIMPORTTAG.
$A.importTag = function(tagName)
{
	$C.importedTags.push(tagName);
};

// Checks if a tag is imported. Used prior to calling any of the JS for a tag.
$A.checkImportedTag = function(tagName)
{
	var foundTag = false;
	for (var i=0; i<$C.importedTags.length; i++)
	{
		if ($C.importedTags[i] == tagName)
		{
			foundTag = true;
			break;
		}
	}
	
	if (!foundTag)
	{
		// The tag has not been imported, call global the error handler
		$C.handleError(null, "ajax.checkimportedtag.error", "widget", [tagName]);
	}
};

//Utility function to get the value of the element
$C.getElementValue = function(elementname, formname, attribute)
{
	if(!elementname)
	{
		$C.handleError(null, "getelementvalue.noelementname", "bind", null, null, null, true);
		return;
	}
	//if attribute is not passed, then set it to the default attribute of 'value'
	if(!attribute)
	{
		attribute = "value";
	}
	var eleVal = $B.getBindElementValue(elementname, formname, attribute);
	
	//if the type returned is "undefined", then set eleVal explicitly to null to make sure that
	//the users always get a null if the value is not found
	if(typeof(eleVal) == "undefined")
	{
		eleVal = null;
	}
	
	if(eleVal == null)
	{
		$C.handleError(null, "getelementvalue.elnotfound", "bind", [elementname, attribute], null, null, true);
		return;
	}
	
	return eleVal;	
};

// Utility function to get the value of a bind element, using the
// same array structure as provided by tokenized bind expressions
$B.getBindElementValue = function(element, container, attribute, processRequired, ignoreNotFound)
{
	var elValue = "";
	
	// Controls which need to extract the attribute value
	// from an internal data structure can provide a _cf_getAttribute
	// function to wrap that logic

	// First check whether element itself represents a variable
	// This is especially true for Spry datasets
	if (window[element])
	{
		var elVar = eval(element);
		if (elVar && elVar._cf_getAttribute)
		{
			elValue = elVar._cf_getAttribute(attribute);
			return elValue;
		}
	}
	
	// Now check whether we have a cached object for element
	var elObj = $C.objectCache[element];
	if (elObj && elObj._cf_getAttribute)
	{
		elValue = elObj._cf_getAttribute(attribute);
		return elValue;
	}

	// No variable or cached object, look in the HTML DOM tree
	var el = $D.getElement(element, container);
	
	// el is said to be found if it is non-null, and either does not have 
	// a length attribute (not an array) or has a length > 0 or is a
	// select box, which may have zero length.
	var elFound = (el && ((!el.length && el.length != 0) 
							|| (el.length && el.length > 0) 
							|| el.tagName == "SELECT"));

	if (!elFound && !ignoreNotFound)
	{
		$C.handleError(null, "bind.getbindelementvalue.elnotfound", "bind", [element]);
		return null;
	}
	
	if (el.tagName != "SELECT")
	{
		if (el.length > 1)
		{
			// Processing an element array, which is not a select box
			var firstEl = true;
			for (var i=0; i<el.length; i++)
			{
				var isCheckable = (el[i].getAttribute("type") == "radio" || el[i].getAttribute("type") == "checkbox"); 
				if (!isCheckable || (isCheckable && el[i].checked))
				{
					if (!firstEl) elValue += ',';
					elValue += $B.getBindElementValue.extract(el[i], attribute);
					firstEl = false;
				}
			}
		}
		else // Single element reference
		{
			elValue = $B.getBindElementValue.extract(el, attribute);
		}
	}
	else // el.tagName == "SELECT"
	{
		// Special handling for select boxes, in case of multiple selects,
		// concatentate all values with commas
		var firstEl = true;
		for (var i=0; i<el.options.length; i++)
		{
			if (el.options[i].selected)
			{
				if (!firstEl) elValue += ',';
				elValue += $B.getBindElementValue.extract(el.options[i], attribute);
				firstEl = false;
			}
		}
	}
		
	if (typeof(elValue) == 'object')
	{
		$C.handleError(null, "bind.getbindelementvalue.simplevalrequired", "bind", [element, attribute]);
		return null;
	}
	
	if (processRequired && $C.required[element] && elValue.length == 0)
	{
		// If the bind element is required, and has no value,
		// then abort bind processing
		return null;
	}
	
	return elValue;
};

$B.getBindElementValue.extract = function(el, attribute)
{
	var elValue = el[attribute];
	if ((elValue == null || typeof(elValue) == "undefined") && el.getAttribute)
	{
		elValue = el.getAttribute(attribute);
	}
	
	return elValue;
};

// Setup the logger, if it's available
$L.init = function()
{
	if (window.YAHOO && YAHOO.widget && YAHOO.widget.Logger)
	{
		YAHOO.widget.Logger.categories = [CFMessage['debug'],CFMessage['info'],CFMessage['error'],CFMessage['window']];
		YAHOO.widget.LogReader.prototype.formatMsg = function(oLogMsg)
		{
			var category = oLogMsg.category;
			return "<p>" + "<span class='"+category+"'>"+category+"</span>:<i>" + oLogMsg.source + "</i>: " + oLogMsg.msg+"</p>"; 
		};
		var cflogreader = new YAHOO.widget.LogReader(null, {width:'30em', fontSize:'100%'});
		cflogreader.setTitle(CFMessage['log.title'] || 'ColdFusion AJAX Logger');
		cflogreader._btnCollapse.value = CFMessage['log.collapse'] || 'Collapse';
		cflogreader._btnPause.value = CFMessage['log.pause'] || 'Pause';
		cflogreader._btnClear.value = CFMessage['log.clear'] || 'Clear';
		
		$L.isAvailable = true;
	}
};

// Base logging function to be called by all the others
$L.log = function(message, level, component, params)
{
	// Short-circuit in case the logger is not setup
	if (!$L.isAvailable) return;
	
	if (!component) component = 'global';
	component = CFMessage[component] || component;

	level = CFMessage[level] || level;

	message = $L.format(message, params);
	
	YAHOO.log(message, level, component);
};

$L.format = function(code, params)
{
	var msg = CFMessage[code] || code;
	if (params)
	{
		for (i=0; i<params.length; i++)
		{
			// This is a hack for IE, which fails under some conditions
			// with empty response strings from XmlHttpRequest, since it
			// simply fails to define a length attribute. It would seem
			// that the underlying object in this case is not a string
			// at all, but something else altogether, perhaps native code.
			if (!params[i].length) params[i] = "";
			var token = '\{' + i + '\}';
			msg = msg.replace(token, params[i]);
		}
	}
	
	return msg;
};

$L.debug = function(message, component, params)
{
	$L.log(message, 'debug', component, params);
};

$L.info = function(message, component, params)
{
	$L.log(message, 'info', component, params);
};

$L.error = function(message, component, params)
{
	$L.log(message, 'error', component, params);
};

$L.dump = function(object, component)
{
	if ($L.isAvailable)
	{
		var dump = (/string|number|undefined|boolean/.test(typeof(object)) || object == null) ? object : recurse(object, typeof object, true);
		$L.debug(dump, component);
	}
};

// Code for CFAJAXPROXY
// Makes the specified remote call
$X.invoke = function(proxy, method, encryptedAppName, methodargs,callbackParams)
{							
	var query = 'method=' + method + '&_cf_ajaxproxytoken=' + encryptedAppName;
	
	var returnFormat = proxy.returnFormat || 'json';
	query += '&returnFormat=' + returnFormat;
	
	if (proxy.queryFormat)
	{
		query += '&queryFormat=' + proxy.queryFormat;
	}
	
	if (proxy.formId)
	{
		var formData = $C.getFormQueryString(proxy.formId, true);
		if (methodargs != null)
		{
			for (prop in formData) methodargs[prop] = formData[prop];
		}
		else
		{
			methodargs = formData;
		}
		proxy.formId = null;
	}
	
	var encodedMethodArgs = "";
	if (methodargs != null)
	{
		encodedMethodArgs = $X.JSON.encode(methodargs);
		query += '&argumentCollection=' + encodeURIComponent(encodedMethodArgs);
	}

	$L.info("ajaxproxy.invoke.invoking", "http", [proxy.cfcPath, method, encodedMethodArgs]);

	// Short circuit here if a call handler is specified
	// Specifically introduced for Spry, may also be reused
	// for other frameworks which make their own HTTP calls.
	if (proxy.callHandler)
	{
		proxy.callHandler.call(null, proxy.callHandlerParams, proxy.cfcPath, query);
		return;
	}

	var callbackHandler;	
	if (proxy.async)
	{
		callbackHandler = function(req) { $X.callback(req, proxy, callbackParams); };
	}
	
	var req = $A.sendMessage(proxy.cfcPath, proxy.httpMethod, query, 
											proxy.async, callbackHandler, null, true);
	if (!proxy.async)
	{
		return $X.processResponse(req, proxy);
	}
};

$X.callback = function(req, proxy, callbackParams)
{
	if ($A.isRequestError(req))
	{
		$C.handleError(proxy.errorHandler, "ajaxproxy.invoke.error", "http",
								[req.status, proxy.cfcPath, req.statusText], req.status, req.statusText, false, callbackParams);
	}
	else
	{
		if (proxy.callbackHandler)
		{
			var responseObj = $X.processResponse(req, proxy);
			proxy.callbackHandler(responseObj, callbackParams);
		}
	}
};

$X.processResponse = function(req, proxy)
{
	// If the return is only whitespace, pass the
	// return value back as null
	var isWhitespace = true;
	for (var i=0; i<req.responseText.length; i++)
	{
		var c = req.responseText.charAt(i);
		isWhitespace = (c == ' ' || c == '\n' || c == '\t' || c == '\r');
		if (!isWhitespace) break; 
	}

	// This check for xmlChildren length needs to be done since IE always
	// allocates a new DOM object to the XMLHttpRequest, regardless of
	// whether or not the response is XML			
	var isResponseXML = (req.responseXML && req.responseXML.childNodes.length > 0); 

	var responseLogText = isResponseXML ? '[XML Document]' : req.responseText;
	$L.info("ajaxproxy.invoke.response", "http", [responseLogText]);
		
	var responseObj;
	var returnFormat = proxy.returnFormat || 'json';
	if (returnFormat == 'json')
	{
		// Decode to JS, or return null if only whitespace
		responseObj = isWhitespace ? null : $X.JSON.decode(req.responseText);
	}
	else
	{
		// If XML, return XML object as-is, else return text, or null if only whitespace 
		responseObj = isResponseXML ? req.responseXML : (isWhitespace ? null : req.responseText);
	}
	
	return responseObj;	
};

// Creates namespaces for the CFC jsClassname, if required, and
// defines the CFC proxy object. cfcPath must be the path to invoke
// the CFC including the servlet context, if applicable
$X.init = function(cfcPath, jsClassname)
{
	// Generate namespaces as required
	var levels = jsClassname.split('.');
	var ns = self;
	for (i=0;i<levels.length-1;i++)
	{
		// Ignore empty levels
		if (levels[i].length)
		{
			ns[levels[i]] = ns[levels[i]] || {};
       		ns = ns[levels[i]];
		}
	}
	
	// Get the tail of the jsClassname for assigning
	// the new constructor function
	var jsClassnameTail = levels[levels.length-1];

	// If the jsClassname is already defined,
	// do not override, just return
	if (ns[jsClassnameTail])
	{
		return ns[jsClassnameTail];
	}

	// Define the CFC proxy object
	ns[jsClassnameTail] = function()
	{
		this.httpMethod = "GET";
		this.async = false;
		this.callbackHandler = null;
		this.errorHandler = null;
		this.formId = null;
	};
	
	ns[jsClassnameTail].prototype.cfcPath = cfcPath;
	
	ns[jsClassnameTail].prototype.setHTTPMethod = function(method)
	{
		if (method) method = method.toUpperCase();
		if (method != 'GET' && method != 'POST')
		{
			// Invalid setting
			$C.handleError(null, "ajaxproxy.sethttpmethod.invalidmethod", "http", [method], null, null, true);
		}
		this.httpMethod = method;
	};
	
	ns[jsClassnameTail].prototype.setSyncMode = function()
	{
		this.async = false;
	};
	
	ns[jsClassnameTail].prototype.setAsyncMode = function()
	{
		this.async = true;
	};
	
	ns[jsClassnameTail].prototype.setCallbackHandler = function(fn)
	{
		this.callbackHandler = fn;
		this.setAsyncMode();
	};
	
	ns[jsClassnameTail].prototype.setErrorHandler = function(fn)
	{
		this.errorHandler = fn;
		this.setAsyncMode();
	};
	
	ns[jsClassnameTail].prototype.setForm = function(fn)
	{
		this.formId = fn;
	};
	
	ns[jsClassnameTail].prototype.setQueryFormat = function(format)
	{
		if (format) format = format.toLowerCase();
		if (!format || (format != 'column' && format != 'row'))
		{
			$C.handleError(null, 'ajaxproxy.setqueryformat.invalidformat', 'http', [format], null, null, true);
		}
		
		this.queryFormat = format;
	};
	
	ns[jsClassnameTail].prototype.setReturnFormat = function(format)
	{
		if (format) format = format.toLowerCase();
		if (!format || (format != 'plain' && format != 'json' && format != 'wddx'))
		{
			$C.handleError(null, 'ajaxproxy.setreturnformat.invalidformat', 'http', [format], null, null, true);
		}
		
		this.returnFormat = format;
	};

	$L.info("ajaxproxy.init.created", "http", [cfcPath]);
	
	return ns[jsClassnameTail];
};

// Utility function to check if a string is whitespace
$U.isWhitespace = function(s)
{
	var isWhitespace = true;
	for (var i=0; i<s.length; i++)
	{
		var c = s.charAt(i);
		isWhitespace = (c == ' ' || c == '\n' || c == '\t' || c == '\r');
		if (!isWhitespace) break; 
	}
	
	return isWhitespace;
};

// Gets the index of the first non-whitespace character
$U.getFirstNonWhitespaceIndex = function(s)
{
	var isWhitespace = true;
	for (var i=0; i<s.length; i++)
	{
		var c = s.charAt(i);
		isWhitespace = (c == ' ' || c == '\n' || c == '\t' || c == '\r');
		if (!isWhitespace) break; 
	}
	
	return i;
};

//Utility function to trim the string passed
$C.trim = function (stringToTrim) 
{
	return stringToTrim.replace(/^\s+|\s+$/g,"");
};

// Checks whether the argument is a positive integer or not
$U.isInteger = function(n)
{
	var isInteger = true;
	if (typeof(n) == "number")
	{
		isInteger = (n >= 0);
	}
	else
	{
		for (i = 0; i < n.length; i++) 
		{
			if ($U.isInteger.numberChars.indexOf(n.charAt(i)) == -1)
			{
				isInteger = false;
				break;
			}
		}
	}
	return isInteger;
};
$U.isInteger.numberChars = "0123456789";

// Checks whether the argument is an array or not.
// This is currently a simplistic check that just looks to see if
// the argument is not a string, and is therefore probably an array.
// Suffices for our needs at the moment.
$U.isArray = function(a)
{
	return (typeof(a.length) == 'number' && !a.toUpperCase);
};

// Simple isBoolean test
$U.isBoolean = function(b)
{
	if (b === true || b === false)
	{
		return true;
	}
	else if (b.toLowerCase)
	{
		b = b.toLowerCase();
		return (b == $U.isBoolean.trueChars
				|| b == $U.isBoolean.falseChars);
	}
	else
	{
		return false;
	}
};
$U.isBoolean.trueChars = "true";
$U.isBoolean.falseChars = "false";

// A boolean cast function
$U.castBoolean = function(b)
{
	if (b === true)
	{
		return true;
	}
	else if(b === false)
	{
		return false;
	}
	else if (b.toLowerCase)
	{
		b = b.toLowerCase();
		if(b == $U.isBoolean.trueChars)
		{
			return true;
		}
		else if(b == $U.isBoolean.falseChars)
		{
			return false;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
};

// Utility function to check if a variable is a serialized CF query.
// Returns null if not a query, else returns the query format, 'row' or 'col'.
$U.checkQuery = function(o)
{
	var queryType = null;
	
	if (o && o.COLUMNS && $U.isArray(o.COLUMNS)
		&& o.DATA && $U.isArray(o.DATA)
		&& (o.DATA.length == 0 || (o.DATA.length > 0 && $U.isArray(o.DATA[0]))))
	{
		queryType = 'row';
	}
	else if (o && o.COLUMNS && $U.isArray(o.COLUMNS)
			&& o.ROWCOUNT && $U.isInteger(o.ROWCOUNT)
			&& o.DATA)
	{
		// Now we have to verify that o.DATA contains all the columns in o.COLUMNS
		// and that the values they reference are 1D arrays
		queryType = 'col';
		for (var i=0; i<o.COLUMNS.length; i++)
		{
			var colData = o.DATA[o.COLUMNS[i]];
			if (!colData || !$U.isArray(colData))
			{
				queryType = null;
				break;
			}
		}
	}
	
	return queryType;
};

/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Modified version of Douglas Crockford's json.js that doesn't
 * mess with the Object prototype 
 * http://www.json.org/js.html
 */
$X.JSON = new function(){
    var useHasOwn = {}.hasOwnProperty ? true : false;
    var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
    
    var pad = function(n) {
        return n < 10 ? '0' + n : n;
    };
    
    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };

    var encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
                return '\\u00' +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };
    
    var encodeArray = function(o){
        var a = ['['], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case 'undefined':
                    case 'function':
                    case 'unknown':
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : $X.JSON.encode(v));
                        b = true;
                }
            }
            a.push(']');
            return a.join('');
    };
    
    var encodeDate = function(o){
        return '"' + o.getFullYear() + '-' +
                pad(o.getMonth() + 1) + '-' +
                pad(o.getDate()) + 'T' +
                pad(o.getHours()) + ':' +
                pad(o.getMinutes()) + ':' +
                pad(o.getSeconds()) + '"';
    };
    
    this.encode = function(o){
        if(typeof o == 'undefined' || o === null){
            return 'null';
        }else if(o instanceof Array){
            return encodeArray(o);
        }else if(o instanceof Date){
            return encodeDate(o);
        }else if(typeof o == 'string'){
            return encodeString(o);
        }else if(typeof o == 'number'){
            return isFinite(o) ? String(o) : "null";
        }else if(typeof o == 'boolean'){
            return String(o);
        }else {
            var a = ['{'], b, i, v;
            for (var i in o) {
                if(!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case 'undefined':
                    case 'function':
                    case 'unknown':
                        break;
                    default:
                        if(b){
                            a.push(',');
                        }
                        a.push(this.encode(i), ':',
                                v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push('}');
            return a.join('');
        }
    };
    
    this.decode = function(json)
    {
    	// We need to decode a string representation of json obj. 
		// If it is already a json object, just return as it is.
		if(typeof json == 'object')
			return json;
		// If the return is only whitespace, pass the
		// return value back as null
    	if ($U.isWhitespace(json))
    	{
    		return null;
    	}
		
		var firstNonWhitespaceIdx = $U.getFirstNonWhitespaceIndex(json);
		if (firstNonWhitespaceIdx > 0)
		{
			json = json.slice(firstNonWhitespaceIdx);
		}
		
		// Strip off the secure JSON prefix, if present
		if (window._cf_jsonprefix && json.indexOf(_cf_jsonprefix) == 0)
		{
			json = json.slice(_cf_jsonprefix.length);
		}
    	
        try
        {
            if(validRE.test(json)) 
            {
                return eval('(' + json + ')');
            }
        }
        catch(e)
        {
        }
        throw new SyntaxError("parseJSON");
    };
}();

if (!$C.JSON) $C.JSON = {};
$C.JSON.encode = $X.JSON.encode;
$C.JSON.decode = $X.JSON.decode;

// A function that takes the url and the containername(name of a window, or a pod or a layoutarea) to fill
// the container with the contents of the url. If a formId is specified, the contents of the form
// are also sent in the request.
$C.navigate = function(url, containername, callback, errorHandler, httpMethod, formId)
{
	if(url == null)
	{
		$C.handleError(errorHandler, "navigate.urlrequired", "widget");
		return;
	}
	
	if (httpMethod)
	{
		httpMethod = httpMethod.toUpperCase();
		if (httpMethod != 'GET' && httpMethod != 'POST')
		{
			// Invalid setting
			$C.handleError(null, "navigate.invalidhttpmethod", "http", [httpMethod], null, null, true);
		}
	}
	else
	{
		httpMethod = 'GET';
	}
	
	var query;
	if (formId)
	{
		query = $C.getFormQueryString(formId);
		if (query == -1)
		{
			$C.handleError(null, "navigate.formnotfound", "http", [formId], null, null, true);
		}
	}
	
	if(containername == null)
	{
		if (query)
		{
			if (url.indexOf('?') == -1)
			{
				url += '?' + query;
			}
			else
			{
				url += '&' + query;
			}
		}
		$L.info("navigate.towindow", "widget", [url]);
		window.location.replace(url);
		return;
	}
	
	$L.info("navigate.tocontainer", "widget", [url, containername]);
	
	var obj = $C.objectCache[containername];
	if(obj != null)
	{
		if(typeof(obj._cf_body) != "undefined" && obj._cf_body != null)
		{
			containername = obj._cf_body		
		}
	}
	$A.replaceHTML(containername, url, httpMethod, query, callback, errorHandler);	
};

$A.checkForm = function(formInstance, checkformFunction, containerid, callBack, errorHandler)
{
	var check = checkformFunction.call(null, formInstance);

	if(check == false)
	{
		return false;	
	}
	
	var query = $C.getFormQueryString(formInstance);
	
	$L.info("ajax.submitform.submitting", "http", [formInstance.name]);
	
	//Replace the container body
	$A.replaceHTML(containerid, formInstance.action, formInstance.method, query, callBack, errorHandler);
	return false;
};

// Fetches the content from the specified url
// and replaces the element's innerHTML with it
// Any JS returned is eval'd
$A.replaceHTML = function(elementId, url, httpMethod, query, callBack, errorHandler)
{
	var domNode = document.getElementById(elementId);
	if(!domNode)
	{
		$C.handleError(errorHandler, "ajax.replacehtml.elnotfound", "http",	[elementId]);
		return;
	}

	var cfcontainer = "_cf_containerId=" + encodeURIComponent(elementId);
	query = (query) ? query + "&" + cfcontainer : cfcontainer;
	
	$L.info("ajax.replacehtml.replacing", "http", [elementId, url, query]);
	
	if(_cf_loadingtexthtml)
	{
		// The try/catch is a hack to workaround an IE bug
		// IE can unpredictable throw the very descriptive
		// error "Unknown runtime error" when setting innerHTML.
		// Putting the try/catch around here takes care of things.
		// The innerHTML setting works fine, regardless of the error.
		try
		{
			domNode.innerHTML = _cf_loadingtexthtml;
		}
		catch (e) {}
	}
	
	var replaceCallback = function(req, _domNode)
	{
		// Check that no errors occurred
		var isError = false;
		if ($A.isRequestError(req))
		{
			$C.handleError(errorHandler, "ajax.replacehtml.error", "http", 
					[req.status, _domNode.id, req.statusText], req.status, req.statusText);
			isError = true;
		}
		
		var replaceHTMLEvent = new $E.CustomEvent("onReplaceHTML", _domNode);
		var replaceHTMLUserEvent = new $E.CustomEvent("onReplaceHTMLUser", _domNode);
		$E.loadEvents[_domNode.id] = {system:replaceHTMLEvent, user:replaceHTMLUserEvent};

		// If there are script tags with "document.write" calls, or
		// if the browser is IE, manually parse out the script elements.
		// Have to do this, since IE drops all script tags preceding markup,
		// and document.write calls, if present, need to be called at the
		// same point in the markup as the script tags containing them are placed.
		// Bug fix: Also switched FF and other browsers to follow this behaviour,
		// so that scripts that need to run before the body is in place will run
		// at the appropriate time.
		if (req.responseText.search(/<script/i) != -1)
		{
			try
			{
				_domNode.innerHTML = "";
			}
			catch (e) {}
			$A.replaceHTML.processResponseText(req.responseText, _domNode, errorHandler);
		}
		else
		{
			// No JavaScript, just replace the markup
			try
			{
				_domNode.innerHTML = req.responseText;
			}
			catch (e) {}
		}
		
		// It is important to null the event objects early
		// There is a boundary case where a function gets registered onLoad
		// from within a function which is called with the onLoad event.
		// As a result, the contained function is never called, since the event
		// has already been fired. If the event is nulled early, then the
		// contained function is executed immediately.
		$E.loadEvents[_domNode.id] = null; // Toss the event objects
		
		// Fire the events, and unsubscribe all listeners to ensure they
		// don't get called again
		replaceHTMLEvent.fire();
		replaceHTMLEvent.unsubscribe();
		replaceHTMLUserEvent.fire();
		replaceHTMLUserEvent.unsubscribe();
		
		$L.info("ajax.replacehtml.success", "http", [_domNode.id]);
		
		// call the callback function if passed once all the replacing and the parsing of js is done
		// and if no errors have occurred
		if(callBack && !isError)
		{
			callBack();
		}
	};

	try
	{
		$A.sendMessage(url, httpMethod, query, true, replaceCallback, domNode);
	}
	catch (e)
	{
		try
		{
			domNode.innerHTML = $L.format(CFMessage['ajax.replacehtml.connectionerrordisplay'], [url, e]);
		}
		catch (e) {}
		$C.handleError(errorHandler, "ajax.replacehtml.connectionerror", "http", [elementId, url, e]);
	}	
};

// Processes response text, parses out script tags and replaces innerHTML on cfDomNode
// Buffers document.write calls properly and writes them to innerHTML on cfDomNode
// rather than document.
$A.replaceHTML.processResponseText = function(text, cfDomNode, errorHandler)
{
	// First look for script tags
	// Have to manually parse the string, since IE
	// throws away script tags that are not at the end
	// of the inserted fragment. Also, we need to honour
	// any document.write() calls in the correct order in
	// which they appear in the responseText.
	var pos = 0;
	var oldPos = 0;
	var lastScriptEnd = 0;
	cfDomNode._cf_innerHTML = "";

	while (pos < text.length)
	{
		var newpos = text.indexOf("\<s", pos);
		if (newpos == -1)
		{
			newpos = text.indexOf("\<S", pos);
		}
		
		if (newpos == -1) break; // No more script tags
		pos = newpos;

		var scriptFound = true;

		// Shorthand variable name
		var scriptTagChars = $A.replaceHTML.processResponseText.scriptTagChars; 

		// pos != -1
		for (var i=1; i<scriptTagChars.length; i++)
		{
			var charPos = pos + i + 1;
			if (charPos > text.length) break;
			var matchChar = text.charAt(charPos);
			if (scriptTagChars[i][0] != matchChar && scriptTagChars[i][1] != matchChar)
			{
				// No match, push pos up and continue
				pos += i+1;
				scriptFound = false;
				break;
			}
		}
		
		if (!scriptFound) continue;

		// Script tag matched, extract markup preceding script tag
		// and push into buffer
		var markup = text.substring(oldPos, pos);
		if (markup)
		{
			cfDomNode._cf_innerHTML += markup;
		}
		
		var scriptStart = text.indexOf(">", pos) + 1;
		if (scriptStart == 0)
		{
			// Treat it as plain text, push pos up and continue
			pos++;
			continue;
		}
		else
		{
			// Push pos to after "<script"
			pos += 7;
		}
		
		// Find the close script tag, assume it starts with "</s" or "</S"
		// and ends with ">", we don't care what happens in between
		var scriptEnd = scriptStart;
		while (scriptEnd < text.length && scriptEnd != -1)
		{
			scriptEnd = text.indexOf("</s", scriptEnd);
			if (scriptEnd == -1)
			{
				scriptEnd = text.indexOf("</S", scriptEnd);
			}
			
			if (scriptEnd != -1)
			{
				// Verify that we're actually looking at a script tag
				// and not, possibly, other HTML tags embedded within
				// a script tag. This fix became necessary to address
				// situations where users embed HTML markup in tab
				// and window title bars.
				scriptFound = true;
				
				for (var i=1; i<scriptTagChars.length; i++)
				{
					var charPos = scriptEnd + 2 + i;
					if (charPos > text.length) break;
					var matchChar = text.charAt(charPos);
					if (scriptTagChars[i][0] != matchChar && scriptTagChars[i][1] != matchChar)
					{
						// No match, push scriptEnd up and continue, not found and break
						scriptEnd = charPos;
						scriptFound = false;
						break;
					}
				}
				
				if (scriptFound) break;
			}
		}
		
		// Extract the script body
		if (scriptEnd != -1)
		{
			var scriptbody = text.substring(scriptStart, scriptEnd);
			
			// Remove HTML comments around JS, IE barfs on them
			var openComment = scriptbody.indexOf("\<!--");
			if (openComment != -1)
			{
				scriptbody = scriptbody.substring(openComment+4);
			}
			var closeComment = scriptbody.lastIndexOf("//-->");
			if (closeComment != -1)
			{
				scriptbody = scriptbody.substring(0, closeComment-1);
			}
			
			// Bug 78585: Markup generated by CF for IE client which has swf related Object, contains a JS function
			//  "CF_RUNContent" which internally does nothing but document.write. So replacing CF_RunContent with document.write
			//  so that it will use same approach  
			if (scriptbody.indexOf("document.write") != -1 || scriptbody.indexOf("CF_RunContent") != -1)
			{
				// Override document.write() to write to _cfDomNode.innerHTML if cfDomNode is defined
				// Maintain a buffer, and write document.write() calls to _cfDomNode.innerHTML only
				// once a script tag closes.
				//
				if(scriptbody.indexOf("CF_RunContent") != -1)
					scriptbody = scriptbody.replace('CF_RunContent', 'document.write');
				
				scriptbody = "var _cfDomNode = document.getElementById('" + cfDomNode.id + "'); var _cfBuffer='';" 
					+ "if (!document._cf_write)"
					+ "{document._cf_write = document.write;" 
					+ "document.write = function(str){if (_cfBuffer!=null){_cfBuffer+=str;}else{document._cf_write(str);}};};"
					+ scriptbody
					+ ";_cfDomNode._cf_innerHTML += _cfBuffer; _cfBuffer=null;"; 
			}

			try
			{
				eval(scriptbody);
			}
			catch(ex)
			{
				$C.handleError(errorHandler, "ajax.replacehtml.jserror", "http", [cfDomNode.id, ex]);
			}
		}
				
		// Push pos up past the closing script tag
		newpos = text.indexOf(">", scriptEnd)+1;
		if (newpos == 0)
		{
			lastScriptEnd = scriptEnd+1;
			break;
		}
		lastScriptEnd = newpos;
		pos = newpos;
		oldPos = newpos;
	}

	if (lastScriptEnd < text.length-1)
	{
		// Trailing constant string remains, append it
		var markup = text.substring(lastScriptEnd, text.length);
		if (markup)
		{
			cfDomNode._cf_innerHTML += markup;
		}
	}
	
	// See earlier comments for why this try/catch is required
	// to handle IE weirdness
	try
	{
		cfDomNode.innerHTML = cfDomNode._cf_innerHTML;
	}
	catch (e) {}
	cfDomNode._cf_innerHTML = "";
}

$A.replaceHTML.processResponseText.scriptTagChars = [['s', 'S'], ['c', 'C'], ['r', 'R'], ['i', 'I'], ['p', 'P'], ['t', 'T']];

// Finds a specified element. If parent is specified, looks for
// the element under the specified parent element, matching for
// either id or name.
$D.getElement = function(elementId, elementParent)
{
	var elementFinder = function(element)
	{
		return (element.name == elementId || element.id == elementId);
	}

	var result = $D.getElementsBy(elementFinder, null, elementParent);

	if (result.length == 1)
	{
		return result[0];
	}
	else
	{
		return result;
	}
};

// Copied over from the YUI DOM utilities to reduce download size
// Copy of code should be OK, since YUI is under BSD
$D.getElementsBy = function(method, tag, root) 
{
	tag = tag || '*';

	var nodes = [];
            
	if (root)
	{
		root = $D.get(root);
		if (!root) 
		{ 
			// if no root node, then no children
			return nodes;
		}
	} 
	else 
	{
		root = document;
	}

	var elements = root.getElementsByTagName(tag);
            
	if ( !elements.length && (tag == '*' && root.all) ) 
	{
		elements = root.all; // IE < 6
	}
            
	for (var i = 0, len = elements.length; i < len; ++i) 
	{
		if ( method(elements[i]) ) 
		{ 
			nodes[nodes.length] = elements[i]; 
		}
	}

	return nodes;
};

// Copied over from the YUI DOM utilities to reduce download size
// Copy of code should be OK, since YUI is under BSD
$D.get = function(el) 
{
	if (!el) { return null; } // nothing to work with
            
	if (typeof el != 'string' && !(el instanceof Array) ) 
	{ // assuming HTMLElement or HTMLCollection, so pass back as is
		return el;
	}

	if (typeof el == 'string') 
	{ // ID
		return document.getElementById(el);
	}
	else 
	{ // array of ID's and/or elements
		var collection = [];
		for (var i = 0, len = el.length; i < len; ++i) 
		{
			collection[collection.length] = $D.get(el[i]);
		}

		return collection;
	}

	return null; // safety, should never happen
};

$E.loadEvents = {};

// A replacement for the YUI custom event, trimmed down for our needs,
// so we don't need to import YUI event JS. Note that this is not
// a general purpose event, it is specialized for what we need. If
// you plan to use it, please take a good look at its limited capabilites
// to make sure it fits your needs.
$E.CustomEvent = function(eventName, domNode)
{
	// Note that we take eventName and domNode as arguments
	// but do not use them. Keeping this function signature
	// for possible future needs.
	
	return {
		name : eventName,
		domNode : domNode,
		subs : [],
		
		subscribe : function(func, params)
		{
			var dup = false;
			for (var i=0; i<this.subs.length; i++)
			{
				var sub = this.subs[i];
				if (sub.f == func && sub.p == params)
				{
					dup = true;
					break;
				}
			}
			
			// Register only if not registered already
			if (!dup) this.subs.push({f:func, p:params});
		},
		
		fire : function()
		{
			for (var i=0; i<this.subs.length; i++)
			{
				var sub = this.subs[i];
				sub.f.call(null, this, sub.p);
			}
		},
		
		unsubscribe : function()
		{
			this.subscribers = [];
		}
	}
};

$E.windowLoadImpEvent = new $E.CustomEvent("cfWindowLoadImp");
$E.windowLoadEvent = new $E.CustomEvent("cfWindowLoad");
$E.windowLoadUserEvent = new $E.CustomEvent("cfWindowLoadUser");

$E.listeners = [];

// Specialized version of YUI's addListener, just for our needs
// We assume that all parameters have valid values, since this
// is only used internally.
$E.addListener = function(el, ev, fn, params)
{
	// Store the listener for future lookups
	var l = {el:el, ev:ev, fn:fn, params:params};
	$E.listeners.push(l);
	
	var wrappedFn = function(e)
	{
		if (!e) var e = window.event; // IE doesn't pass e in, but stores it on window.event
		fn.call(null, e, params);
	}
	
	// Register the listener for its event
	if (el.addEventListener)
	{
		// The w3c way
		el.addEventListener(ev, wrappedFn, false);
		return true; // Success, in case anyone's interested
	}
	else if (el.attachEvent)
	{
		// The one true IE way
		el.attachEvent('on' + ev, wrappedFn);
		return true; // Success, in case anyone's interested
	}
	else
	{
		return false; // Failure, in case anyone's interested
	}
};

// Specialized function, only finds listeners registered via
// ColdFusion.Event.addListeners
$E.isListener = function(el, ev, fn, params)
{
	var found = false;
	
	var ls = $E.listeners;
	for (var i=0; i<ls.length; i++)
	{
		if (ls[i].el == el && ls[i].ev == ev
			&& ls[i].fn == fn && ls[i].params == params)
		{
			found = true;
			break;
		}
	}
	
	return found;
};

// Fires the specified event on all CF bind handlers
// registered on the specified HTML element id.
$E.callBindHandlers = function(id, formId, ev)
{
	var el = document.getElementById(id);
	if (!el) return;
	
	var ls = $E.listeners;
	for (var i=0; i<ls.length; i++)
	{
		if (ls[i].el == el && ls[i].ev == ev
			&& ls[i].fn._cf_bindhandler)
		{
			ls[i].fn.call(null, null, ls[i].params);
		}
	}
}

// If the window load event has not fired, this function will register a function
// to be called on window load. If the window load event has fired, which would
// typically be the case when innerHTML for a node is being dynamically replaced,
// this function register the function to be called when replacement is complete. 
// If a function is registered with the important flag turned on, then it will be
// invoked before functions without the important flag. This is especially important
// for internal initialization functions which need to be run before other onLoad fns.
$E.registerOnLoad = function(func, params, important, user)
{
	if ($E.registerOnLoad.windowLoaded)
	{
		if (params && params._cf_containerId
			&& $E.loadEvents[params._cf_containerId])
		{
			// If a container is defined, wait for the
			// container to finish loading before calling
			// the function
			if (user)
			{
				$E.loadEvents[params._cf_containerId].user.subscribe(func, params);
			}
			else
			{
				$E.loadEvents[params._cf_containerId].system.subscribe(func, params);
			}
		}
		else
		{
			func.call(null, null, params);
		}
	}
	else
	{
		if (user)
		{
			$E.windowLoadUserEvent.subscribe(func, params);
		}
		else if (important)
		{
			$E.windowLoadImpEvent.subscribe(func, params);
		}
		else
		{
			$E.windowLoadEvent.subscribe(func, params);
		}
	}
};

// Marker to indicate whether or not the window has loaded.
$E.registerOnLoad.windowLoaded = false;

// Utility function, should only be used to register
// ColdFusion.Event.windowLoadHandler.
$E.onWindowLoad = function(fn)
{
	if (window.addEventListener) //DOM method for binding an event
	{
		window.addEventListener("load", fn, false);
	}
	else if (window.attachEvent) //IE exclusive method for binding an event
	{
		window.attachEvent("onload", fn);
	}
	else if (document.getElementById) //support older modern browsers
	{
		window.onload = fn;
	}
};

//Function that adds an empty span element as the first child of the body
$C.addSpanToDom = function()
{
	var emptyspan = document.createElement("span");
	document.body.insertBefore(emptyspan, document.body.firstChild);
};

// Window load handler, will be invoked from cfajaxbase.js
$E.windowLoadHandler = function(e)
{
	// Switch s.gif on Ext to a local version
	// This has to be done prior to firing load events so
	// we *never* use Ext's default.
	if (window.Ext) Ext.BLANK_IMAGE_URL 
		= _cf_ajaxscriptsrc + "/ajax/resources/ext/images/default/s.gif";
	
	//Add an empty span as the first child of body
	//This is being done to avoid the issues ext-core.js runs into on IE when the first node of the 
	//of the body is text.
	$C.addSpanToDom();
	$L.init();
	
	$E.registerOnLoad.windowLoaded = true;
	$E.windowLoadImpEvent.fire();
	$E.windowLoadImpEvent.unsubscribe();
	$E.windowLoadEvent.fire();
	$E.windowLoadEvent.unsubscribe();
	$E.windowLoadUserEvent.fire();
	$E.windowLoadUserEvent.unsubscribe();
};

$E.onWindowLoad($E.windowLoadHandler);

// Registers bind events for the specified set of bindElements.
// - bindElements : A 2 dimensional array, with each row containing
//					the following elements:
//					Element 0 : The element to bind to
//					Element 1 : The element container (e.g., form), if any.
//					Element 2 : The event to bind on
// - bindParams : As defined on different bind handlers
// - bindHandler : The bind callback handler to use
// - bindOnLoad : Whether or not to call the bind on page load
$B.register = function(bindElements, bindParams, bindHandler, bindOnLoad)
{
	for (var i=0; i<bindElements.length; i++)
	{
		var element = bindElements[i][0];
		var container = bindElements[i][1];
		var event = bindElements[i][2];
		
		// Controls which need to provide their own custom
		// event registration model may provide a custom
		// _cf_register function to wrap that functionality
	
		// First check whether element itself represents a variable
		// This is especially true for Spry datasets
		if (window[element])
		{
			var elVar = eval(element);	
			if (elVar && elVar._cf_register)
			{
				elVar._cf_register(event, bindHandler, bindParams);
				continue;
			}
		}
		
		// Now check whether we have a cached object for element
		var elObj = $C.objectCache[element];
		if (elObj && elObj._cf_register)
		{
			elObj._cf_register(event, bindHandler, bindParams);
			continue;
		}
		
		var bindEl = $D.getElement(element, container);
		
		// bindEl is said to be found if it is non-null, and either does not have 
		// a length attribute (not an array) or has a length > 0 or is a
		// select box, which may have zero length.
		var elFound = (bindEl && ((!bindEl.length && bindEl.length != 0) 
									|| (bindEl.length && bindEl.length > 0) 
									|| bindEl.tagName == "SELECT"));
		if (!elFound)
		{
			$C.handleError(null, "bind.register.elnotfound", "bind", [element]);
		}
		
		// If multiple elements are found, register on all
		// Check to be sure that the element found is not a select box
		// - we have to register on a select box as a single control,
		// not as an array of controls
		if (bindEl.length > 1 && !bindEl.options)
		{
			for (var j=0; j<bindEl.length; j++)
			{
				$B.register.addListener(bindEl[j], event, bindHandler, bindParams);
			}
		}
		else
		{
			$B.register.addListener(bindEl, event, bindHandler, bindParams);
		}
	}
	
	// When binding to a DOM element, save the bind handler and params
	// so that bind invocations can be forced later, as required
	if (!$C.bindHandlerCache[bindParams.bindTo]
		&& typeof(bindParams.bindTo) == 'string')
	{
		$C.bindHandlerCache[bindParams.bindTo] = function()
		{
			bindHandler.call(null, null, bindParams);
		}
	}
	
	if (bindOnLoad)
	{
		bindHandler.call(null, null, bindParams);
	}
};

$B.register.addListener = function(bindEl, event, bindHandler, bindParams)
{
	// Register the listener only if a duplicate was not found.
	if (!$E.isListener(bindEl, event, bindHandler, bindParams)) 
		$E.addListener(bindEl, event, bindHandler, bindParams);	
};

// Assigns a value to a bind target
$B.assignValue = function(bindTo, bindToAttr, bindValue, bindToParams)
{
	if (!bindTo) return;
	
	// If we're binding to a function, just call it now
	if(bindTo.call)
	{
		bindTo.call(null, bindValue, bindToParams);
		return;	
	}
	
	//Now check if the js object associated with the id of the element has _cf_setValue defined, if so
	//call that to set the value
	var jsObj = $C.objectCache[bindTo];
	if(jsObj && jsObj._cf_setValue)
	{
		jsObj._cf_setValue(bindValue);
		return;
	}
	
	var bindToEl = document.getElementById(bindTo);
	if (!bindToEl)
	{
		$C.handleError(null, "bind.assignvalue.elnotfound", "bind", [bindTo]);
	}

	if (bindToEl.tagName == "SELECT")
	{
			
		var queryType = $U.checkQuery(bindValue);
		var selConfig = $C.objectCache[bindTo];
		if (queryType)
		{
			if (!selConfig || (selConfig && (!selConfig.valueCol || !selConfig.displayCol)))
			{
				$C.handleError(null, "bind.assignvalue.selboxmissingvaldisplay", "bind", [bindTo]);
				return;
			}
		}
		else
		{
			// Not a query, validate bindValue as a 2D array
			if (typeof(bindValue.length) == 'number' && !bindValue.toUpperCase)
			{
				if (bindValue.length > 0 && (typeof(bindValue[0].length) != 'number' || bindValue[0].toUpperCase))
				{
					$C.handleError(null, "bind.assignvalue.selboxerror", "bind", [bindTo]);
					return;
				}
			}
			else
			{
				$C.handleError(null, "bind.assignvalue.selboxerror", "bind", [bindTo]);
				return;
			}
		}
		
		// Clear options from target
		bindToEl.options.length = 0;
		var selectValueArray;
		var needToSetDefaultSelection = false;
		if (selConfig) 
		{
			selectValueArray = selConfig.selected;
			if (selectValueArray && selectValueArray.length > 0) {
				needToSetDefaultSelection = true;
			}
		}	
		if (!queryType)
		{	
			// Bind value must be a 2D array with values in
			// first column and display text in second column
			for (var i=0; i<bindValue.length; i++)
			{
				var opt = new Option(bindValue[i][1], bindValue[i][0]);
				bindToEl.options[i] = opt;
				if(needToSetDefaultSelection)
				{
					for(var j=0; j<selectValueArray.length; j++)	
					{
						if(selectValueArray[j] == opt.value)
							opt.selected = true;
					}
				}
			}
		}
		else if (queryType == 'col')
		{
			var valueData = bindValue.DATA[selConfig.valueCol];
			var displayData = bindValue.DATA[selConfig.displayCol];
			
			if (!valueData || !displayData)
			{
				$C.handleError(null, "bind.assignvalue.selboxinvalidvaldisplay", "bind", [bindTo]);
				return;
			}
			
			for (var i=0; i<valueData.length; i++)
			{
				var opt = new Option(displayData[i], valueData[i]);
				bindToEl.options[i] = opt;
				if(needToSetDefaultSelection)
				{
					for(var j=0; j<selectValueArray.length; j++)	
					{
						if(selectValueArray[j] == opt.value)
							opt.selected = true;
					}
				}				
			}
		}
		else if (queryType == 'row')
		{
			// First, find the column indices
			var valueIdx = -1;
			var displayIdx = -1;
			for (var i=0; i<bindValue.COLUMNS.length; i++)
			{
				var col = bindValue.COLUMNS[i]; 
				
				if (col == selConfig.valueCol)
				{ 
					valueIdx = i;
				}
				
				if (col == selConfig.displayCol)
				{
					displayIdx = i;
				}
				
				if (valueIdx != -1 && displayIdx != -1)
				{
					break;
				}
			}
			
			if (valueIdx == -1 || displayIdx == -1)
			{
				$C.handleError(null, "bind.assignvalue.selboxinvalidvaldisplay", "bind", [bindTo]);
				return;
			}
			
			for (var i=0; i<bindValue.DATA.length; i++)
			{
				var opt = new Option(bindValue.DATA[i][displayIdx], bindValue.DATA[i][valueIdx]);
				bindToEl.options[i] = opt;
				if (needToSetDefaultSelection) {
					for (var j = 0; j < selectValueArray.length; j++) {
						if (selectValueArray[j] == opt.value) 
							opt.selected = true;
					}
				}
			}
		}
	}
	else
	{
		bindToEl[bindToAttr] = bindValue;
	}
	
	// Fire the change event for the element being assigned to
	// so that other controls which bind to it can trigger their
	// bind expressions. Note that controls registered for events
	// other than 'change' will not have their bind expressions invoked.
	$E.callBindHandlers(bindTo, null, 'change');
	
	$L.info("bind.assignvalue.success", "bind", [bindValue, bindTo, bindToAttr]);
};

// Bind handler for bind events local to the browser
// Params contains keys as follows:
// - bindTo : Id of the element to bind data to
// - bindToAttr : The attribute of bindTo to assign the evaluated bind expression
// - bindExpr : The bind expression as a tokenized string. Every {elementid} and
//              every constant string section is a separate token. Every {elementid}
//				is expressed as an array with 3 elements:
//				Element 0 : the element id
//              Element 1 : the element container (e.g., form), if any
//				Element 2 : the attribute to bind to
$B.localBindHandler = function(e, params)
{
	var bindToEl = document.getElementById(params.bindTo);
	
	var bindValue = $B.evaluateBindTemplate(params, true);
		
	$B.assignValue(params.bindTo, params.bindToAttr, bindValue);
};
$B.localBindHandler._cf_bindhandler = true; // marker for custom event propagation

// Utility method to evaluate a bind template
$B.evaluateBindTemplate = function(params, required, encodeParams, ignoreNotFound, isurlbind)
{	

	var bindExpr = params.bindExpr;
	var bindValue = "";
    if(typeof isurlbind == 'undefined')
		isurlbind = false;
	for (var i=0; i<bindExpr.length; i++)
	{
		if (typeof(bindExpr[i]) == "object")
		{
			var elValue = null;
			// Value can be in json object form or can be attached with a html element.
			// Bug 82388: First element in array is object then we can assume its a genuine object 
			// parameter and not a bind element. See bug 82369 for more detail. 
			if (!bindExpr[i].length || typeof bindExpr[i][0] == 'object') {				
				elValue = $X.JSON.encode(bindExpr[i]);
			}			
			else {
				var elValue = $B.getBindElementValue(bindExpr[i][0], bindExpr[i][1], bindExpr[i][2], required, ignoreNotFound);
				if (elValue == null) {
					if (required) {
						// If the required flag is true, and the value is not available,
						// reset the bind value and return
						bindValue = '';
						break;
					}
					else {
						elValue = ''; // If not defined, send empty string
					}
				}
			}
			
			if (encodeParams) elValue = encodeURIComponent(elValue);
			
			bindValue += elValue;
		}
		else
		{
			var value = bindExpr[i];
			//BugId: 77816, In case of url binding with simple type like String/number, we need to encode the param value
			// Here it has been assumed that first value will be page URI (like xyz.cfm) and
			// next param not strating with '&' char and type string needs to be encoded.

			if (isurlbind == true && i > 0) {
				if (typeof(value) == 'string' && value.indexOf('&') != 0) {
					value = encodeURIComponent(value);
				}
			}
			bindValue += value;
			
		}
	}
	
	return bindValue;
}

// Handles JavaScript function binds. Params contains keys as follows:
// - bindTo : Id of the element to bind data to
// - bindToAttr : The attribute of bindTo to assign the evaluated bind expression
// - bindExpr : The bind expression as a tokenized string. Every {elementid} and
//              every constant string section is a separate token. Every {elementid}
//				is expressed as an array with 3 elements:
//				Element 0 : the element id
//              Element 1 : the element container (e.g., form), if any
//				Element 2 : the attribute to bind to
// - callFunction : The function to invoke
$B.jsBindHandler = function(e, params)
{
	var bindExpr = params.bindExpr;
	var argumentArray = new Array();
	
	var functionExpr = params.callFunction + "(";

	for (var i=0; i<bindExpr.length; i++)
	{
		var elValue;
		if (typeof(bindExpr[i]) == "object" )
		{
			if(bindExpr[i].length)
				//bug - 82369:In some cases the parameter passed for Js functions  are a genuine array 
				// of object which is not meant	for extracting a binded attribute. Till recently it was
				// assumed that if an array is passed as parameter then it represents attribute bind and
				// we call js api to extract element id and attribute id which supposed to be true only 
				//when it represents string object. Now we have added an extra condition in which we wil 
				//check that if the first element of array is object then it assumed that it is a genuine
				// parameter and needs to be passed to targetted JS function in original form.
				if(typeof bindExpr[i][0] == 'object')
					elValue = bindExpr[i];	
				else
					elValue = $B.getBindElementValue(bindExpr[i][0], bindExpr[i][1], bindExpr[i][2], false);
			else
			{
				elValue = bindExpr[i];				
			}	
		}
		else
		{
			elValue = bindExpr[i];
		}

//After changing the function call behavior from eval to function.apply as fix of 
// BugId:77647, there is no need of escaping special char. Char was being escaped 
// to retain them while passing same to construct function definition. 

/*		
		// Escape \, ', \r\n, \n and \r chars in strings, or the expression turns out funny
		if (elValue && elValue.replace)
		{ 
			elValue = elValue.replace(/\\/g, '\\\\');
			elValue = elValue.replace(/\'/g, '\\\'');
			elValue = elValue.replace(/\r\n/g, '\\r\\n');
			elValue = elValue.replace(/\n/g, '\\n');
			elValue = elValue.replace(/\r/g, '\\r');

		}

*/
		if (i != 0)
		{
			functionExpr += ",";
		}
		
		argumentArray[i] = elValue;
		functionExpr += "'" + elValue + "'";
	}
	
	functionExpr += ")";
	
    //BugId:77647 eval cannot accept an object reference passed as param argument. We have changed this
	//to function.apply which works well with references.
    var bindValue = params.callFunction.apply(null, argumentArray);

	//var bindValue = eval(functionExpr);
	$B.assignValue(params.bindTo, params.bindToAttr, bindValue, params.bindToParams);	
};
$B.jsBindHandler._cf_bindhandler = true; // marker for custom event propagation

// Handles URL bind calls. Params contains keys as follows:
// - bindTo : Id of the element to bind to
// - bindToParams : params to pass to bindTo, if bindTo is a function
// - bindToAttr : The attribute to bind to. If null, replaceHTML is called.
// - bindExpr : The bind expression as a tokenized string. Every {elementid} and
//              every constant string section is a separate token. Every {elementid}
//				is expressed as an array with 3 elements:
//				Element 0 : the element id
//              Element 1 : the element container (e.g., form), if any
//				Element 2 : the attribute to bind to 
// - errorHandler :  The error handler function to invoke on error, optional
$B.urlBindHandler = function(e, params)
{
	var targetId = params.bindTo;
	
	if ($C.objectCache[targetId]
		&& $C.objectCache[targetId]._cf_visible === false)
	{
		// Do not process URL binds for markup which is not visible
		// e.g., a hidden window, a tab which is not selected.
		// Also, mark the view as "dirty", since state of bound control has changed. 
		// A window/tab/whatever should fetch markup for itself when being shown
		// only if the view is dirty - for "clean" views, where bound controls have
		// not changed, there is no need to fetch markup on show.
		$C.objectCache[targetId]._cf_dirtyview = true;
		return;
	}
	
	var url = $B.evaluateBindTemplate(params, false, true, false, true); 
    //Bug:78338, Extract and store returnformat so that same can be used to decode response. 
	var returnformat = $U.extractReturnFormat(url);
	if(returnformat == null || typeof returnformat == 'undefined')
		returnformat = 'JSON';
	
	// In case of url binding with a js callback (In case of grid onchange), we need to make a request
	// similar to sendMessage. So later check for function or undefined callback.
	if (params.bindToAttr || typeof params.bindTo == 'undefined' || typeof params.bindTo == 'function')
	{
		var params = {"bindTo":params.bindTo, "bindToAttr":params.bindToAttr, "bindToParams":params.bindToParams,
						"errorHandler":params.errorHandler, "url":url, returnFormat: returnformat};
		
		try
		{
			$A.sendMessage(url, "GET", null, true, $B.urlBindHandler.callback, params);
		}
		catch (e)
		{
			$C.handleError(params.errorHandler, "ajax.urlbindhandler.connectionerror", "http", [url, e]);
		}
	}
	else
	{
		$A.replaceHTML(targetId, url, null, null, null, params.errorHandler);
	}
};
$B.urlBindHandler._cf_bindhandler = true; // marker for custom event propagation

$B.urlBindHandler.callback = function(req, callbackParams)
{
	if ($A.isRequestError(req))
	{
		$C.handleError(callbackParams.errorHandler, "bind.urlbindhandler.httperror", 
									"http", [req.status, callbackParams.url, req.statusText],
									req.status, req.statusText);
	}
	else
	{
		$L.info("bind.urlbindhandler.response", "http", [req.responseText]);

		var responseObj;
		try
		{
			if(callbackParams.returnFormat == null  || callbackParams.returnFormat === 'JSON')
				responseObj = $X.JSON.decode(req.responseText);
			else
				responseObj = req.responseText;	
		}
		catch (e)
		{
			if (req.responseText != null && typeof req.responseText == 'string') {
				responseObj = req.responseText;
			}
			else {
				$C.handleError(callbackParams.errorHandler, "bind.urlbindhandler.jsonerror", "http", [req.responseText]);
			}			
		}
		$B.assignValue(callbackParams.bindTo, callbackParams.bindToAttr, responseObj, callbackParams.bindToParams);
	}
};

// Just sets up metadata for a select, in case it's processing
// queries in its response
$A.initSelect = function(selectId, valueCol, displayCol, selected)
{
	$C.objectCache[selectId] = {'valueCol':valueCol, 'displayCol':displayCol, selected:selected};
};

// If Spry is being used, add functions to the Spry datasets
// to allow CF to extract data from them in bind expressions.
$S.setupSpry = function()
{
	if (typeof(Spry) != 'undefined' && Spry.Data)
	{
		// Gets the named attribute out of the current selected row
		Spry.Data.DataSet.prototype._cf_getAttribute = function(attribute)
		{
			var val;
			var row = this.getCurrentRow();
			// Row may not be selected yet
			if (row) val = row[attribute];
			return val;
		};
		
		// Registers the specified bindHandler to listen for the dataset's
		// onCurrentRowChanged and onDataChanged events
		Spry.Data.DataSet.prototype._cf_register = function(event, bindHandler, bindParams)
		{
			var obs = {bindParams:bindParams};
			obs.onCurrentRowChanged = function()
			{
				bindHandler.call(null, null, this.bindParams);
			};
			obs.onDataChanged = function()
			{
				bindHandler.call(null, null, this.bindParams);
			};
			this.addObserver(obs);
		};
		
		// Logger integration
		if (Spry.Debug.trace) // Defensive code, in case Spry upgrades
		{
			var spryDebugTrace = Spry.Debug.trace;
			Spry.Debug.trace = function(str)
			{
				$L.info(str, "spry");
				spryDebugTrace(str);
			};
		}
		
		if (Spry.Debug.reportError) // Defensive code, in case Spry upgrades
		{
			var spryDebugError = Spry.Debug.reportError;
			Spry.Debug.reportError = function(str)
			{
				$L.error(str, "spry");
				spryDebugError(str);
			}
		}
		
		$L.info("spry.setupcomplete", "bind");
	}
};
$E.registerOnLoad ($S.setupSpry, null, true);

// Handles binds to Spry datasets
$S.bindHandler = function(event, params)
{
	var url;
	var query = '_cf_nodebug=true&_cf_nocache=true';
	if (window._cf_clientid)
	{
		query += '&_cf_clientid=' + _cf_clientid;
	}
	
	var dataset = window[params.bindTo];
	
	// Ignore element not found errors when initially
	// defining the dataset; Spry datasets have to be defined
	// prior to page load, at which point *no* elements will
	// be available
	var ignoreNotFound = (typeof(dataset) == 'undefined');
	
	if (params.cfc) // CFC bind
	{
		var cfcFunctionArgs = {};
		var bindExpr = params.bindExpr;
		for (var i=0; i<bindExpr.length; i++)
		{
			var elValue;
			if (bindExpr[i].length == 2)
			{
				// It's a constant value bind
				elValue = bindExpr[i][1];
			}
			else
			{
				// It's a dynamic bind
				elValue = $B.getBindElementValue(bindExpr[i][1], bindExpr[i][2], bindExpr[i][3],
																false, ignoreNotFound);
			}
			cfcFunctionArgs[bindExpr[i][0]] = elValue;
		}
		
		cfcFunctionArgs = $X.JSON.encode(cfcFunctionArgs);
		query += '&method=' + params.cfcFunction;
		query += '&argumentCollection=' + encodeURIComponent(cfcFunctionArgs);

		$L.info("spry.bindhandler.loadingcfc", "http",
							[params.bindTo, params.cfc, params.cfcFunction, cfcFunctionArgs]);
		url = params.cfc;
	}
	else // URL bind
	{
		url = $B.evaluateBindTemplate(params, false, true, ignoreNotFound);
		$L.info("spry.bindhandler.loadingurl", "http", [params.bindTo, url]);
	}
	
	var options = params.options || {};

	if ((dataset && dataset._cf_type == 'json') || params.dsType == 'json')
	{
		query += '&returnformat=json';
	}

	if (dataset)
	{
		if (dataset.requestInfo.method == 'GET')
		{
			options.method = 'GET';
			if (url.indexOf('?') == -1)
			{
				url += '?' + query;
			}
			else
			{
				url += '&' + query;
			}
		}
		else
		{
			options.postData = query;
			options.method = 'POST';
			// This looks weird, but if the URL is not
			// reset to '', Spry won't pick up the changed
			// options object, since it finds that setURL
			// below is sending the same URL in for POST.
			dataset.setURL('');
		}

		dataset.setURL(url, options);
		dataset.loadData();
	}
	else
	{
		if (!options.method || options.method == 'GET')
		{
			if (url.indexOf('?') == -1)
			{
				url += '?' + query;
			}
			else
			{
				url += '&' + query;
			}
		}
		else
		{
			options.postData = query;
			// Spry caches data based on URL, even for
			// POST requests. POSTs may need to get new
			// data based on the postData being set, so 
			// we're forcibly switching caching off for POSTs
			// to make sure everything works right.
			options.useCache = false;
		}
		
		// Have to create a new dataset
		// Only XML dataset support for now, until Spry provides a JSON dataset
		var ds;
		if (params.dsType == 'xml')
		{
			ds = new Spry.Data.XMLDataSet(url, params.xpath, options);
		}
		else // JSON
		{
			ds = new Spry.Data.JSONDataSet(url, options);
			ds.preparseFunc = $S.preparseData;
		}
		
		ds._cf_type = params.dsType;
		
		// Setup error handling
		var cfErrorHandler = {
			onLoadError: function(req)
			{
				$C.handleError(params.errorHandler, "spry.bindhandler.error", "http",
										[params.bindTo, req.url, req.requestInfo.postData]);
			}
		};
		ds.addObserver(cfErrorHandler);
		
		window[params.bindTo] = ds;
	}
};
$S.bindHandler._cf_bindhandler = true;

$S.preparseData = function(ds, rawdata)
{
	// Get past whitespace
	var firstNonWhitespaceIdx = $U.getFirstNonWhitespaceIndex(rawdata);
	if (firstNonWhitespaceIdx > 0)
	{
		rawdata = rawdata.slice(firstNonWhitespaceIdx);
	}
		
	// Strip off the secure JSON prefix, if present
	if (window._cf_jsonprefix && rawdata.indexOf(_cf_jsonprefix) == 0)
	{
		rawdata = rawdata.slice(_cf_jsonprefix.length);
	}
	
	return rawdata;
};

//init function for pod
$P.init = function(podname) 
{
	$L.info("pod.init.creating", "widget", [podname]);
	var podObj = {};
	podObj._cf_body = podname + "_body";
	$C.objectCache[podname] = podObj;
};

// Handles CFC binds. Params contains keys as follows:
// - bindTo : Id of the element to bind data to
// - bindToAttr : The attribute of bindTo to assign the evaluated bind expression
// - bindExpr : The bind expression as a tokenized string. Every {elementid} and
//              every constant string section is a separate token. Every {elementid}
//				is expressed as an array with 4 elements:
//				Element 0 : the name of the CFC argument to assign the value to
//				Element 1 : the element id, or the constant value to assign to the bind expression
//              Element 2 : the element container (e.g., form), if any
//				Element 3 : the attribute to bind to
//				A single element array is passed in for constant value binds.
// - cfc : Full URL to the CFC to call
// - cfcFunction : The function to invoke on the CFC
// - httpMethod : The HTTP method to use, GET or POST. This is an optional parameter.
// - errorHandler : The error handler function to use
// - proxyCallHandler : Function to pass through to proxy for call handling, optional
$B.cfcBindHandler = function(e, params)
{
	var httpMethod = (params.httpMethod) ? params.httpMethod : "GET";
	
	var cfcFunctionArgs = {};
	var bindExpr = params.bindExpr;
	for (var i=0; i<bindExpr.length; i++)
	{
		var elValue;
		if (bindExpr[i].length == 2)
		{
			// It's a constant value bind
			elValue = bindExpr[i][1];
		}
		else
		{
			// It's a dynamic bind
			elValue = $B.getBindElementValue(bindExpr[i][1], bindExpr[i][2], bindExpr[i][3], false);
		}
		cfcFunctionArgs[bindExpr[i][0]] = elValue;
	}
	
	var callback = function(bindValue, callbackParams)
	{
		$B.assignValue(callbackParams.bindTo, callbackParams.bindToAttr, bindValue, callbackParams.bindToParams);
	}

	var callbackParams = {"bindTo":params.bindTo, "bindToAttr":params.bindToAttr, "bindToParams":params.bindToParams};
	var proxy = {"async":true, "cfcPath":params.cfc, "httpMethod":httpMethod, 
					"callbackHandler":callback, "errorHandler" : params.errorHandler};

	if (params.proxyCallHandler)
	{
		proxy.callHandler = params.proxyCallHandler;
		proxy.callHandlerParams = params;
	}
	
	$X.invoke(proxy, params.cfcFunction, params._cf_ajaxproxytoken, cfcFunctionArgs, callbackParams);
};
$B.cfcBindHandler._cf_bindhandler = true; // marker for custom event propagation

$U.extractReturnFormat = function(url)
{
	 var returnFormat;
	 var uc_url = url.toUpperCase();
	 var index = uc_url.indexOf('RETURNFORMAT');	 
	 if (index > 0)
	 {
		// If present, there can be some more param present after returnformat
		// (look for '&') or can be last one so endindex will be last char of url. 
	 	var endIndex = uc_url.indexOf('&', index+13); // 12 (returnformat) + 1 (=), example: returnformat=XXX
		if(endIndex < 0)
			endIndex = uc_url.length;
		returnFormat = uc_url.substring(index+13, endIndex);	
	 }
	 return returnFormat	
}

$U.replaceAll = function(string, regex, replacement)
{
	var index = string.indexOf(regex);
	while(index > -1)
	{
		string = string.replace(regex, replacement);
		index = string.indexOf(regex);
	}
	return string;
}

$U.cloneObject = function(obj)
{
	var newObj = {};
	for(key in obj)
	{
		var value = obj[key] ;
		if(typeof value == 'object'){
        	value = $U.cloneObject(value);		
		}
		newObj.key = value;
	}
	return newObj;
}

$C.clone = function(obj, deepCloning)
{
	if(typeof(obj) != 'object') return obj;
	
	if(obj == null) return obj;

	var cloneObj = new Object();

	for (var i in obj) 
	{
		if(deepCloning === true)
			cloneObj[i] = $C.clone(obj[i]);
		else
			cloneObj[i] =obj[i];
	}

	return cloneObj;
}

$C.printObject = function(obj)
{
	var str = '';
	for(key in obj)
	{
		str  =  str + '  ' + key + '=';
		value = obj[key] ;
		if(typeof(value) == 'object'){
        	value = $C.printObject(value);		
		}
		str += value;
	}
	return str;
};


}; // Close if (!window.ColdFusion)

} // Close cfinit function
cfinit(); // Call cfinit to get everything setup