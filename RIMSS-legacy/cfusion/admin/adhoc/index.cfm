<cfimport taglib="../../common/layout" prefix="RIMSS"/>



<cfsetting showdebugoutput="true" >
<RIMSS:layout section="admin" subSection="#application.sessionManager.getSubSection()#">
	<RIMSS:subLayout/>
	
	<cfset dbUtils = application.objectFactory.create("DBUtils") />
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	<cfset curlocId = 0>
	<cfset curSysId = 0>
	<cfset curLocId = application.sessionManager.getLocIdSetting()>
	<cfset curSysId = dbUtils.getSysIdByProgram(programLookup)/>
		

<!---<cfsilent>--->
	<cfparam name="hasAccess" default="false">
	<cfparam name="msg_status" default=""/>
	<cfparam name="msg" default=""/>
	<cfsetting requesttimeout="300"/>
    <cfif StructKeyExists(SESSION,"security") and SESSION.security.isAuthorized()>
    	<cfset user = SESSION.security.getUserName()/>
    <cfelse>
    	<cfset user = 'GLOBALEYE'/>
    </cfif>
	<cfset application.dsn = createobject("component", "cfc.utils.Datasource").init("GLOBALEYE") />
	
	      
    <cfset sys_id = ''>
    <cfif StructKeyExists(SESSION,"security") and SESSION.security.isAuthorized()>
	    <!--- set initial info based on security module --->
	    <cfset systems = session.security.getSystems()/>
	    <cfset systemids = session.security.getSystemIDs()/>
	    <cfset currentsysid = session.security.getCURRENTSYSTEMID()/>
	    <cfset sys_id = curSysId />
	    
	    <!---<cfset APPLICATION.skin =  codes.getCodeValue(currentsysid)/>--->
	       
	    <cfset qWcs = session.security.getWorkCentersByLocSys(curLocId,curSysId)>
	    <cfset qSystems = session.security.getSystemsByLocation(curLocId,true)> 
	    <cfset currentwcid = session.security.getCurrentWorkCenterID()/>
	    <cfset loc_id = curLocId/>
		<cfset hasAccess = true>
	</cfif>
	<cfset adhoc = createObject("component","com.cfc.adhoc").init("GLOBALEYE")>
	
	<cfset getLocations =  adhoc.getLocationsBySystem(sys_id)>
	<cfset locationArray = ListToArray(ValueList(getLocations.CURR_SITE))>
	
   	<CFPARAM name="db_msg" default=""/>
	<CFPARAM name="db_msg_status" default=""/>
  
<!---<cfimport taglib="../../skins" prefix="ge"/>--->
<cfsavecontent variable="head">

<!---<script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>--->

        <!---<script src="#application.rootpath#/common/js/jquery-1.8.2.js"></script>--->
<script src="js/jquery.clickmenu.js"></script>
<script src="js/jquery.tablednd_0_5.js"></script>

<link rel="stylesheet" type="text/css" href="css/clickmenu.css" />
<cfoutput><link href="css/StyleSheet.css?_#Now().getTime()#" rel="stylesheet" type="text/css" /></cfoutput>
     
<!---<style type="text/css">
	#sql{
		
		border:1px solid #666;
		height:220px;
		width:400px;
		white-space: pre-wrap;
		overflow:auto;
		font-family:"Courier New", Courier, monospace;
		color:#666;

	}
	
	#result table td{
		empty-cells:show;
	}
	
	
/*menus*/
#centerDiv, #orderDiv
{
	width: 200px; 
	top: 200px;
	left: 550px;
}


</style>--->

<style>
	.processing {
	    background-color: #FFFFCC !important;
	    color: #000000 !important;
	    font-size: 12px;
	    text-align: center;
	    margin: 0 auto;
	    width: 100%
	    white-space: nowrap
	}
</style>


<script>
	var sql = '';
	var d = {};
	
	function sendSQL(sql,dsn)
	{
		$.ajax({
		type: "POST",
		url : "sql.cfm",
		data: {'sql': sql,'datasource': dsn},
			success : function (data) {
				$("#result").html(data);
			},
			error: function( xhr, strError,XMLHttpRequest ){
			// On error display error message
			if (strError == 'timeout') {
				$("#result").text("Error1! The Query is taking too long to run, please adjust the query").addClass('global_notice_msg').removeClass('result_section_content_box');
			}
			else {
				$("#result").text("Error2! " + xhr.statusText + " " + strError).addClass('global_error_msg').removeClass('result_section_content_box');
			}
			},
			complete: function(data){
				// Clear all global message classes from message
				//resetMsg();
				$("#resultMessage").removeClass('global_error_msg global_success_msg global_info_msg global_notice_msg processing').addClass('message').addClass('processing');
				$("#resultMessage").text('');
				//$("#resultMessage").text("").removeClass('processing');
				if ($('#result').html().indexOf('sql_results_table') > -1) {
					// Add overflow class if table data is returned
					$('#result').addClass('result_section_content_box_overflow');
					//$('#sql_results_table').attr('width',resultWidth+'px');
				}
			}
		});
	}

	
	$(function(){
		var resultWidth = $("#result").width();
		//Set default ajax timeout value to 5 minutes
		//var userAgent = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C)";
		//beforeSend:function(req){req.setRequestHeader("User-Agent",userAgent);},
		/*$.ajaxSetup({
			timeout:29000,
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			error: function( xhr, strError,XMLHttpRequest ){
			// On error display error message
			$( "#result" ).text("Error! " + xhr.statusText + " " + strError  ).addClass('global_error_msg').removeClass('result_section_content_box');
			
			}
		});*/
		
		//hide export options container
		$('.exportContainer').hide();
		dsn = "";
		locArray=[];
		sysid = 0;
		locid = 0;
		//create dsn javascript variable to hold datasource
		<cfoutput>#toScript(application.dsn.getdsname(),"dsn")#</cfoutput>
		<cfoutput>#toScript(locationArray,"locArray")#</cfoutput>
		//create sysid variable for System
		<cfif Structkeyexists(session,"security")and session.security.isAuthorized()>
			<cfoutput>#toScript(curSysId,"sysid")#</cfoutput>
			<cfoutput>#toScript(curLocId,"locid")#</cfoutput>

		</cfif>


		//clear data button click to remove result data
		$('#clearResultSQL').click(function(event){
			$('#result').empty().html('&nbsp;').removeClass('result_section_content_box_overflow global_error_msg global_notice_msg').addClass('result_section_content_box');
		});

		//retrieve data button click to load query into sql.cfm file
		$('#runSQL').click(function(event){
			
			var d = new Date().getTime();
			//setProcessingMessage('Running SQL...');
			$("#resultMessage").text("Running SQL...").addClass('processing');
			//Clear message and display processing message
			//clearMsg();
			// Clear result data
			$('#result').empty().removeClass('result_section_content_box_overflow global_error_msg global_notice_msg').addClass('result_section_content_box');
			try {
				//var cleanSQL = sql.replace(/<\/?[^>]+(>|$)/g, " ");
				var cleanSQL = sql;
				cleanSQL = cleanSQL.replace(/--{SYS_ID}--/g,sysid);
				cleanSQL = cleanSQL.replace(/--{LOC_ID}--/g,locid);
				//load sql.cfm with sql query string
				sendSQL(cleanSQL,dsn);
				/*
				$('#result').load('sql.cfm', {
					'sql': cleanSQL,
					'datasource': dsn
				}, function(){
					// Clear all global message classes from message
					resetMsg();
					if ($('#result').html().indexOf('sql_results_table') > -1) {
						// Add overflow class if table data is returned
						$('#result').addClass('result_section_content_box_overflow');
						//$('#sql_results_table').attr('width',resultWidth+'px');
					}
				});
				*/
			}catch(e){
				alert(e.description);
			}

		});
		
		// add/remove hover class on mouseover/mouseout
		$('.columnHover').on("mouseover", function(event){
			$(this).addClass('hoverColumn');
		});
		$('.columnHover').on("mouseout", function(event){
			$(this).removeClass('hoverColumn');
		});
		
	});
	
	
	function getLocs(d)
	{
		
		var s = getGlobalRootPath();
		$.getJSON(s + "/local/adhoc/cfc/adhoc.cfc?queryFormat=column", d,
		   function(result){
		   	$(document.createElement('option')).val('').text('').appendTo($(locSelect));
		    if(result.ROWCOUNT > 0)
			{
				
				for(var i=0;i<result.ROWCOUNT;i++)
				{	
					$(document.createElement('option')).val(result.DATA.CURR_SITE[i]).text(result.DATA.CURR_SITE[i]).appendTo($(locSelect));
				}		
				
			}

		   });
		
	}
	
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
	  var rest = this.slice((to || from) + 1 || this.length);
	  this.length = from < 0 ? this.length + from : from;
	  return this.push.apply(this, rest);
	};
	
	

	// convert condition to SQL
	function convertCondition(col,cond,v,v2,c)
	{	
		if (typeof(v) == 'undefined') {
			var v = "";
		}
		if (typeof(v2) == 'undefined') {
			var v2 = "";
		}
		var isDate = false;
		//Check to see if row has "date" class
		if($(c).hasClass('date'))
		{
		 isDate = true;	
		}
		var con = '';
		var curValue = v;

			//normal class switch statement"
			if(isDate==false)
			{	
			switch ($.trim(cond)) {
				case 'starts with':
					con = col + " LIKE '" + v + "%'";
					break;
				case 'contains':
					con = col + " LIKE " + "'%" + v + "%'";
					break;
				case 'does not start with':
					con = "NOT(" + col + " LIKE '" + v + "%')";
					break;
				case 'does not contain':
					con = "NOT(" + col + " LIKE " + "'%" + v + "%')";
					break;
				case 'is in list':
					con = col + " IN(" + getQuotedValueList(v) + ")";
					break;
				case 'is not in list':
					con = col + " NOT IN(" + getQuotedValueList(v) + ")";
					break;
				case 'is equal to':
					con = col + " = '" + v + "'";
					break;
				case 'is not equal to':
					con = col + " <> '" + v + "'";
					break;
				case 'is greater than':
					con = col + " > '" + v + "'";
					break;
				case 'is greater than or equal to':
					con = col + " >= '" + v + "'";
					break;
				case 'is less than':
					con = col + " < '" + v + "'";
					break;
				case 'is less than or equal to':
					con = col + " <= '" + v + "'";
					break;
				case 'is null':
					con = col + " IS NULL";
					break;
				case 'is not null':
					con = col + " IS NOT NULL";
					break;
				default:
					con = '';
				}
			}else{
				//add to_date() clause or make empty string
				if($.trim(v).length>0)
				{
					curValue = "to_date('"+v+"')";	
				}else{
					curValue = "''";
				}
				if($.trim(v2).length>0)
				{
					curValue2 = "to_date('"+v2+"')";	
				}else{
					curValue2 = "''";
				}
				//'date' class switch statement
				switch ($.trim(cond)) {
				case 'is equal to':
					con = "trunc("+col+")" + " = " + curValue;
					break;
				case 'is not equal to':
					con = "trunc("+col+")" + " <> " + curValue;
					break;
				case 'is greater than':
					con = col + " > " + curValue;
					break;
				case 'is greater than or equal to':
					con = col + " >= "+ curValue;
					break;
				case 'is less than':
					con = col + " < "+ curValue;
					break;
				case 'is less than or equal to':
					con = col + " <= "+ curValue;
					break;
				case 'between':
					con = col + " BETWEEN "+ curValue + "\rAND " + curValue2;
					break;
				case 'is null':
					con = col + " IS NULL";
					break;
				case 'is not null':
					con = col + " IS NOT NULL";
					break;
				default:
					con = '';
			}
		}
		return con;	
	}
	
	//Create array of table names
	function getTableNames(obj)
	{
		var tableArray = []
		$(obj).find('tbody tr').each(function(i){
			//Get first item in the column left of '.'
			var col1 = $('td:eq(1)',this).text();
			var table = col1.split('.');
			var tablename = table[0];
			if ($.inArray(tablename,tableArray) == -1) {
				tableArray.push(tablename);
			}
		});
		return tableArray;	
	}
	
	function generateSQL(table){
		//var table = $('#columns');
		//sql statement
		var sql = "";
		//column array
		var sqlArray = [];
		//table array
		var sqlTableArray = getTableNames(table);
		//column array of just first column data
		var columnArray = [];
		//condition column array of just first condition column data
		var conditionColumnArray = [];
		//joinRules
		var joinRules = [
							{table1:'WCE_VW',table2:'DDR_VW',rulestr:'WCE_VW.REPAIR_ID=DDR_VW.REPAIR_ID'},
							{table1:'DDR_VW',table2:'DDR_PART_VW',rulestr:'DDR_VW.LABOR_ID=DDR_PART_VW.LABOR_ID(+)'}
						]

		//order by
		var orderByArray = [];
		
		//where clause
		var whereClauseArray = [];
		
		// canned rules (For when no conditions exist)
		var cannedRules = [
							{table:'WCE_VW',rulestr:'WCE_VW.LOC_ID=--{LOC_ID}--'},
							{table:'DDR_VW',rulestr:'DDR_VW.LOC_ID=--{LOC_ID}--'},
							{table:'DDR_PART_VW',rulestr:'DDR_PART_VW.LOC_ID=--{LOC_ID}--'}
							
						]
		
		// automatically added rules
		var autoRules = [
							{table:'DDR_VW',rulestr:'DDR_VW.DDR > 0'},
							{table:'WCE_VW',rulestr:'WCE_VW.SYS_ID=--{SYS_ID}--'},
							{table:'DDR_VW',rulestr:'DDR_VW.SYS_ID=--{SYS_ID}--'}
						]
		var rowcount = $(table).find('tbody tr').length;

		if(rowcount){
			sql += 'SELECT \r';
			$obj=$(table);
			var queryColumns = $(table).filter('#queryColumns');
			var queryConditions = $(table).filter('#conditions');
			$(queryColumns).find('tbody tr').each(function(i){
				var str = '';
				var col1 = $('td:eq(1)',this).text();
				var col2 = $('td:eq(2)',this).text();
				var col3 = $('td:eq(3)',this).text();
				
				if($.inArray($.trim(col1),columnArray) == -1){
					columnArray.push($.trim(col1));
				}
				 
				str += col1;

				if ($.trim(col2).length && $.trim(col2) != $.trim(col1)) {
					col2=col2.replace(/["']+/g,'');
					str += ' AS "' + col2 + '"' ;
				
				}
				sqlArray.push($.trim(str))
				
				for (i = 0; i < sqlArray.length; i++) {
				var table = sqlArray[i].split('.');
				var tablename = table[0];
					if ($.inArray(tablename,sqlTableArray) == -1) {
						sqlTableArray.push(tablename);
					}
				}
				
				
				//build order by array
				//check for existing order by clause
				var rowOrderValue = $.trim(col3);
				var clause = $.trim(col1) + " " + $.trim(col3);
				var col = $.trim(col1);
				var inarray = $.inArray(col,columnArray);
					//only show ORDER BY if order by clause exists
					if (rowOrderValue.length > 0) {
						if (inarray == -1) {
							orderByArray.push(clause);
						}
						else {
						
							orderByArray.remove(inarray);
							orderByArray.push(clause);
						}
					}
				
				
				
			});
			
			
			
			if(joinRules.length){
				for (i = 0; i < joinRules.length; i++) {
					if ($.inArray(joinRules[i].table1.toUpperCase(), sqlTableArray) >= 0 && $.inArray(joinRules[i].table2.toUpperCase(), sqlTableArray) >= 0) {
						//sql += "\rWHERE ";
						//sql += joinRules[0].rulestr;
						whereClauseArray.push(joinRules[i].rulestr);
						
					}
				}
				
			}
			
			if(autoRules.length){
				for (i = 0; i < autoRules.length; i++) {
					if ($.inArray(autoRules[i].table.toUpperCase(), sqlTableArray) >= 0) {
						whereClauseArray.push(autoRules[i].rulestr);
						
					}
				}
				
			}
			
			
			if($(queryConditions).find('tbody tr').length<=0)
			{
				if(cannedRules.length){
					for (i = 0; i < cannedRules.length; i++) {
						if ($.inArray(cannedRules[i].table.toUpperCase(), sqlTableArray) >= 0) {
							whereClauseArray.push(cannedRules[i].rulestr);
						}	
					}	
				}
			}

			$(queryConditions).find('tbody tr').each(function(i){
				//var str = '';
				
				var col1 = $('td:eq(1)',this).text();
				var col2 = $('td:eq(2)',this).text();
				var col3 = $('td:eq(3)',this).text();
				var col4 = $('td:eq(4)',this).text();
				var getCondition = convertCondition(col1,col2,col3,col4,$(this));
				
				if($.trim(getCondition).length > 0 && $.inArray($.trim(getCondition),whereClauseArray) == -1){
					whereClauseArray.push(getCondition);	
				}
				
				
				if(sqlArray.length <= 0)
				{
					sqlArray.push('*');
					//return '';
				}	
			});

			
			sql += sqlArray.join(', \r');
			sql += " \rFROM ";
			sql += sqlTableArray.join(',');
			
			if (whereClauseArray.length) {
				sql += "\rWHERE ";
				sql += whereClauseArray.join('\rAND ');
				
			}
			if(orderByArray.length){
				sql+= "\r ORDER BY ";
				sql += orderByArray.join(',');
			}
			
		}
		
	if(sql.length > 0)
	{
		
		$('#resultMessage').empty().removeClass('global_notice_msg');
		
		if(sql.indexOf('*')>=0)
		{
			$('#resultMessage').addClass('global_notice_msg').text('You must select at least one column in the Query Definitions section');
			$('.sqlData').attr('disabled',true);
		}else{
			$('.sqlData').removeAttr('disabled');
		}
		
	}else{
		$('#resultMessage').removeClass('global_notice_msg').empty();
		$('.sqlData').attr('disabled',true);
	}	
		
	return sql;
}


function addTableDnD(obj)
{
	if ($(obj).find('tbody tr').length > 1) {
		$(obj).find('tbody').tableDnD({
			onDrop: function(table, row){
				sql = generateSQL($('.statement'));
				$('#sql').text(sql);
			}
		});
	}
	
}

function getQuotedValueList(str){
	var strArray = str.split(',');
	var newStrArray=[];
	for(var i=0;i<strArray.length;i++)
	{
		newStrArray.push("'"+ $.trim(strArray[i]) +"'");	
	}
	return newStrArray.join(',');
}

function saveAllAliasInputs(){
	$('input.aliasInput').each(function(s){
			var txt = $(this).val();
			$(this).parent().text(txt);
		});
}
function saveAllValueInputs(){
	$('input.valueInput,input.date').each(function(s){
			var txt = $(this).val();
			$(this).parent().text(txt);
		});
}

function saveAllValueSelects(){

		$('select.selectLocationColumn').each(function(s){
			var txt = $(this).find('option:selected').text();
			$(this).parent().text(txt);
		});

}


function saveAllSortSelects(){
	$('select.orderSelect').each(function(s){
			var txt = $(this).find('option:selected').text();
			$(this).parent().text(txt);
		});
}

function saveAllConditionSelects(){
	$('select.conditionSelect').each(function(s){
			var txt = $(this).find('option:selected').text();
			$(this).parent().text(txt);
		});
}




$(document).ready(function()
{
	
	
	
	$("#queryColumns").delegate("td.order", "click", function(event){
		var $target = $(event.target);
		var i = 0;
		if ($target.is('td')) {

			saveAllSortSelects();
			var col = $(this).siblings(':first').text();
			var val = $(this).text();
			var orderSelect = $(document.createElement('select')).addClass('orderSelect').wrap('<div/>');
			var option = $(document.createElement('option')).text('').val('').appendTo(orderSelect);
			var option = $(document.createElement('option')).text('asc').val(parent + '.' + col).appendTo(orderSelect);
			var option = $(document.createElement('option')).text('desc').val(parent + '.' + col).appendTo(orderSelect);

			$(this).html(orderSelect.parent().html());
			$("select.orderSelect option",$(this)).each(function(i){
				if($.trim($(this).text()) == $.trim(val)){
					$(this).attr('selected','selected');
					$(this).parent().focus();
					
				}
			});

		}else{
			event.preventDefault();
		}
	});
	//Add click event to query alias column
	$("#queryColumns").delegate("td.alias", "click", function(event){
		var $target = $(event.target);
		var i = 0;
		
		if($target.is('td')){
			//reset all alias inputs to text value
			saveAllAliasInputs();
			var col = $(this).siblings(':first').text();
			var tdval = $(this).text();
			var b = $(document.createElement("input"));
			b.get(0).setAttribute('type','text');
			b.get(0).setAttribute('name','aliasInput');
			b.get(0).setAttribute('value',tdval);
			b.get(0).setAttribute('size',tdval.length + 5);
			$(b).addClass('aliasInput').wrap('<div/>');
			$(this).html($(b).parent().html());
			$(this).find('input.aliasInput').select();
		}else{
			event.preventDefault();
		}
	});
	
	
	//change event for alias
	$("#queryColumns").delegate("td.alias input.aliasInput", "change blur", function(event){
		var td = $(this).parent();
		var td_sibling = td.prev();
		var val = $.trim($(this).val());
		if ($.trim(val).length) {
			
			//clear both ' and " characters from the column string
			val=val.replace(/["']+/g,'');
			//check if alias has spaces
			var checkSpaces = $.trim(val).indexOf(' ');
			//Set td to value
			td.text(val);
		}else{
			//default to expression column text
			td.text(td_sibling.text());
		}
		//Generate SQL string
		sql = generateSQL($('.statement'));
		$('#sql').text(sql);
	});
	
	// Click event for query conditions
	$('#conditions').delegate("td.condition", "click", function(event){
		var $target = $(event.target);
		var i = 0;
		if ($target.is('td')) {
			//reset all condtion fields to text values
			saveAllConditionSelects();
			if($(this).parent().hasClass('loc'))
			{
				return false;
			}
			var col = $(this).siblings(':first').text();
			var col = $(this).siblings(':first').text();
			var val = $(this).text();
			//Check to see if row has 'date' class
			var conditionColumn = $(this).parent().hasClass('date');
			var conditionSelect = $(document.createElement('select')).addClass('conditionSelect').wrap('<div/>');
			//Setup 'date' drop down options
			if (conditionColumn==true) {
				var option = $(document.createElement('option')).text('is greater than').val('is greater than').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is less than').val('is less than').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is greater than or equal to').val('is greater than or equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is less than or equal to').val('is less than or equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is equal to').val('is equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is not equal to').val('is not equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('between').val('between').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is null').val('is null').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is not null').val('is not null').appendTo(conditionSelect);
			}
			//Setup default options
			else {
				var option = $(document.createElement('option')).text('is greater than').val('is greater than').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is less than').val('is less than').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is greater than or equal to').val('is greater than or equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('starts with').val('starts with').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('does not start with').val('does not start with').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('contains').val('contains').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('does not contain').val('does not contain').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is in list').val('is in list').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is not in list').val('is not in list').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is equal to').val('is equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is not equal to').val('is not equal to').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is null').val('is null').appendTo(conditionSelect);
				var option = $(document.createElement('option')).text('is not null').val('is not null').appendTo(conditionSelect);
			}
			$(this).html(conditionSelect.parent().html());
			$("select.conditionSelect option",$(this)).each(function(i){
				//alert($.trim($(this).text()) +'=='+ $.trim(val));
				if($.trim($(this).text()) == $.trim(val)){
					$(this).attr({selected:'selected'});
					$(this).parent().focus();
				}
			});

		}else{
			//event.preventDefault();
		}
	});
	
	//Change,Blur event for query condition columns
	$("#conditions").delegate("td.value,td.between", "click", function(event){
		var $target = $(event.target);
		var i = 0;
		if($target.is('td')){
			var prevTdText = $(this).closest('td').prevAll('td.condition').last().text();
			var parentTR = $(this).parent();
			var c='valueInput';
			//Disable click event for 'is null' and 'between' options
			if(prevTdText.indexOf('null')>=0)
			{	//Return false (disable click event)
				return false;
			}
			if($(this).hasClass('between')==true)
			{
				if(prevTdText.indexOf('between')<0)
				{
					//Return false (disable click event)
					return false;
				}
			}
			if($(parentTR).hasClass('date')==true)
				{
				 var c = 'date';	
				}
			if($(parentTR).hasClass('loc')==true)
				{
				 var c = 'loc';	
				}
			// Reset value inputs to text values
			saveAllValueInputs();
			//saveAllValueSelects();
			var col = $(this).siblings(':first').text();
			var dte = new Date().getTime();
			var val = $(this).html();
			if (c == 'loc') {
				
				var conditionLocationSelect = $(document.createElement('select')).attr({'multiple':'multiple','size':'3'}).addClass('conditionLocationSelect').wrap('<div/>');
				var option = $(document.createElement('option')).text('').val('').appendTo(conditionLocationSelect);
				for(var i=0;i<locArray.length;i++)
				{
					var option = $(document.createElement('option')).text(locArray[i]).appendTo(conditionLocationSelect);	
				}
				
				var curVal = $(this).html(conditionLocationSelect.parent().html());
				
				var selected = [];
				var index = []; 
				val = $.trim(val).replace(/<br>/g,"");
				var selected = $.trim(val).split(',');
				$("select.conditionLocationSelect option",$(this)).each(function(i){
					var curText = $.trim($(this).text());
					
					if(val.indexOf(curText)>-1 && curText.length>0){
						$(this).attr({selected:'selected'});
						$(this).parent().focus();
					}

				});


			}else{
				var b = $(document.createElement("input"));
				b.get(0).setAttribute('type', 'text');
				b.get(0).setAttribute('name', 'valueInput');
				b.get(0).setAttribute('value', val);
				$(b).addClass(c).wrap('<div/>');
				$(this).html($(b).parent().html());
				
			}
			
			
			// Add datepicker for inputs with class of date
			if(c=='date')
			{
				$(this).find('input.date').datepicker({dateFormat:'dd-M-yy',buttonText:'C',
				onClose: function(dateText, inst) {
					var td = $(this).parent();
					var val = $(this).val().toUpperCase();
					//Set td text to value of datepicker
					if ($.trim(val).length) {
						td.text(val);
					}else{
						td.text(val);
					}
					//Generate SQL string
					sql = generateSQL($('.statement'));
					$('#sql').text(sql);		
				}
				
				});
				
				$(this).find('input.date').select();
			}
			$(this).find('input.valueInput').select();
			
			
		}else{
			try{
			event.preventDefault();
			}catch(e){}
		}
	});
	//Add click,focus events to inputs with class of 'date'
	$("#conditions").delegate("td.value input.date", "click focus", function(event){
		var $target = $(event.target);
		var i = 0;
			//Add datepicker when input is clicked or gains focus
			$(this).find('input.date').datepicker({
				dateFormat: 'dd-M-yy'
			});
	});
	
	//Change,Blur of default inputs
	$("#conditions").delegate("td.value input.valueInput", "change blur", function(event){
		var td = $(this).parent();
		//alert($(this).hasClass('hasDatePicker'));
		var val = $(this).val();
		if ($.trim(val).length) {
			td.text(val);
		}else{
			td.text(val);
		}
		sql = generateSQL($('.statement'));
		$('#sql').text(sql);
	});
	
	$('select.conditionLocationSelect').on('keyup keydown', function (event) { 
	   	
		if ( event.keyCode == 9 ){ 
			var $target = $(event.target);
			if ($target.is('select')) {
				
					var selected = [];

					var options = $(this).find('option:selected').each(function(){
					
						if($.trim($(this).val()).length>0)
						{
						selected.push($(this).val());
						}
					});
					
					var txt = selected.join(',\r');
					$(this).parent().html(txt);
					//Generate SQL string
					sql = generateSQL($('.statement'));
					$('#sql').text(sql);
				
			}	
	    } 
	});
	
	$('select.conditionLocationSelect').live('blur dblclick', function (event) { 
	   		

			var $target = $(event.target);
			if ($target.is('select')) {
					var selected = [];
					
					var options = $(this).find('option:selected').each(function(){
					
						if($.trim($(this).val()).length>0)
						{
						selected.push($(this).val());
						}
					});
					
					var txt = selected.join(',\r');
					$(this).parent().html(txt);
					//Generate SQL string
					sql = generateSQL($('.statement'));
					$('#sql').text(sql);
				
			}else if ($target.is('option')){
				var selected = [];
					var options = $(this).find('option:selected').each(function(){
					
						if($.trim($(this).val()).length>0)
						{
						selected.push($(this).val());
						}
					});
					var txt = selected.join(',\r');
					$(this).parent().html(txt);
					//Generate SQL string
					sql = generateSQL($('.statement'));
					$('#sql').text(sql);
				
				
			}	

	});

	//Change,blur events for the location drop down
	$('select.conditionLocationSelect').on("change", function(event){
			var $target = $(event.target);
			var pos = -1;
			if ($target.is('select')) {
				
					var selected = [];

					var options = $(this).find('option:selected').each(function(){
					
						if($.trim($(this).val()).length>0)
						{
						selected.push($(this).val());
						}
					});

				
				if (selected.length >= 4) {
					if(selected.length>4)
					{
	
						selected = selected.splice(0,2);
					}
					var txt = selected.join(',\r');
					$(this).parent().html(txt);
					//Generate SQL string
					sql = generateSQL($('.statement'));
					$('#sql').text(sql);
				}
			}
			
	});

	//delete row
	$(".statement").delegate("td img.del", "click", function(event){
		var $target = $(event.target);
		if ($target.is('img')) {
			var trs = $(this).closest('tr').siblings().length;
			if(trs==1)
			{
				$(this).closest('tr').siblings().css('cursor','auto');	
			}
			$(this).closest('tr').remove();
			clearConditions();
			sql = generateSQL($('.statement'));
			$('#sql').text(sql);
		}
		return false;
	});
	
	
	
	//Change,blur events for the Sort Orders
	$('select.orderSelect').live("change blur", function(event){
			var $target = $(event.target);
			
			if ($target.is('select')) {
				var txt = $(this).find('option:selected').text();
				$(this).parent().text(txt);
			}
			//Generate SQL string
			sql = generateSQL($('.statement'));
			$('#sql').text(sql);
	});
	
	
	$('select.conditionSelect').blur(function(event){
		console.log("In on blur event for select.conditionSelect");
	})
	
	//Change, blur events for the conditions
	$('select.conditionSelect').live("change blur", function(event){
			var $target = $(event.target);
			
			if ($target.is('select')) {
				var txt = $(this).find('option:selected').text();
				var p = $(this).parent();
				$(this).parent().text(txt);
		
				if(txt.indexOf('null')>-1)
				{
					//clear out value column text
					$(p).next('td.value').empty();
				}
				if(txt.indexOf('between')<0)
				{
					//Clear out between column text
					$(p).nextAll('td.between').empty();
				}	

			}
			//Generate SQL string
			sql = generateSQL($('.statement'));
			$('#sql').text(sql);
	});
	
	
	function clearConditions()
	{
		return;
		if ($('#queryColumns').find('tbody tr').length <= 0) {
			$('.views').show();
			//if ($('#conditions').find('tbody tr').length > 0) {
				//$('#conditions').find('tbody tr').remove();
			//}
		}		
		
	}
	
	function hideViews(obj)
	{
		return;
		if($(obj).hasClass('wceview'))
			{
				$('.views').not('.wceview').hide();
			}else if ($(obj).hasClass('ddrview'))
			{
				$('.views').not('.ddrview').hide();
			}else{
				$('.views').show();
			}	
	}
	
	
	$('.queryMenu').clickMenu({onClick: function(event){
		//$('#sql').text(sql);
		var parent = $.trim($(this).parent().closest('li.hover').clone().children().remove().end().text());
		var col = $(this).clone().children().remove().end().text();
		var curcol = $(this).clone().children().remove().end();

		if ($(this).hasClass('table')) {
			hideViews($(this));
			return false;
		}else if(parent.length){
			var addRow = true;
			var urlIMG = '../../common/images/delete.png?_' + new Date().getTime();
			//Add table row to query columns table
			var title = parent + '.' + col;
			var tr = "<tr class='columnHover "+ parent +"'>";
			tr += "<td class='nodrag' align='center' valign='middle'><img class='del' src='" + urlIMG + "' width='10' height='10' title='Delete "+title+"' alt='Delete "+title+"'/>";
			tr += "<td class='expression' width='250px;'>" + parent + '.' + col;
			+"</td>";
			tr += "<td class='alias' width='250px;'>" + parent + '.' + col;
			+'</td>';
			tr += '<td class="order" width="150px;"></td>';
			tr += "</tr>";
			if(parent=='DDR_PART_VW' && $('.DDR_VW').length<=0)
			{
				addRow = false;
			}
			if (addRow) {
				$(tr).appendTo($('#queryColumns tbody'));
			}
		}
		//Add table drag and drop to Query columns table
		addTableDnD($('#queryColumns'));
		//Generate SQL string
		sql = generateSQL($('.statement'));
		$('#sql').text(sql);
		$('.queryMenu').trigger('closemenu');
		
		return false;
		
	}});
	
	//Conditions Menu section
	$('.conditionsMenu').clickMenu({onClick: function(event){
		var parent = $.trim($(this).parent().closest('li.hover').clone().children().remove().end().text());
		var col = $(this).clone().children().remove().end().text();
		var isDate = $(this).clone().children().remove().end().hasClass('date');
		var isLoc = $(this).clone().children().remove().end().hasClass('loc');
		var c = '';
		var v = 'value';
		if ($(this).hasClass('table')) {
			hideViews($(this));
			return false;
		}else if(parent.length){
			//default condition td value
			var type = 'starts with';
			if(isDate==true)
				{
					//default condition td value	
					type = 'is greater than';
					var c = 'date';	
				}
			if(isLoc==true)
				{
					//default condition td value	
					var type = 'is in list';
					var c = 'loc';	
				}
			//Add table row to conditions table
			var title = parent + '.' + col;
			var tr = "<tr class='columnHover "+ c+"'>";
			tr += "<td class='nodrag' align='center' valign='middle'><img class='del' src='../../common/images/delete.png' width='10' height='10' title='Delete "+title+"' alt='Delete "+title+"'/>";
			tr += "<td  class='conditionCol' nowrap='nowrap'>" + parent + '.' + col;
			+"</td>";
			tr += "<td class='condition' nowrap='nowrap' > " + type ;
			+'</td>';
			tr += '<td class="'+v+'" ></td>';
			tr += '<td class="between" ></td>';
			tr += "</tr>";

			$(tr).appendTo($('#conditions tbody'));
	
		}
		//Add table drag and drop to conditions table
		addTableDnD($('#conditions'));
		//Generate SQL string
		sql = generateSQL($('.statement'));
		$('#sql').text(sql);
		$('.conditionsMenu').trigger('closemenu');
		
		return false;
		
	}});
	
});
</script>

</cfsavecontent>
<cfhtmlhead text="#head#"/>

<!---</cfsilent>--->

<cfsetting showdebugoutput="yes"/>

    
<br>
  
<div class="mainContent">
<div class="adHoc">


<!--- Header Table --->
<div class="header_section">
	<div class="header ">
		<!---<div class="header_image"><img border="0" src="../../images/database_icon_smll.gif" alt="AdHocImage"/></div>	--->
		<div class="header_title clearfix">
			<div class="header_main_title">Ad-Hoc Reports</div>
			<div class="header_sub_title">User-friendly Ad-Hoc Query Builder for Global Eye Database</div>
			<div class="header_version" >&nbsp;</div>
		</div>
	</div>
</div>

<!--- Main Table (2 Columns)--->
<div class="adhoc" >
	<table border="0" cellpadding="0" cellspacing="5" width="100%" >
		<tr>
        	<td class="query_column">
        		<div class="query_column_title">Query Definition:</div>
					<div class="query_result_column">
						<div class="query_result_section bodytext">
							<div class="query_result_column_title">Result Columns:</div>
							<!--- Table to Add New Data Column --->
								<div class="centerDiv">
									<ul class="queryMenu">
										<li style="width:100%" ><img src='../../common/images/add.png' align="left"/>&nbsp;[[ Click to Add New Column ]]</span>
											<ul>
												
												<li class="table views wceview">WCE_VW
													<ul>
														<li>CURR_SITE</li>
														<li>CURR_UNIT</li>
														<li>WORK_CENTER</li>
										                <li>SERIAL_NUMBER</li>
														<li>PART_NUMBER</li>
														<li>BAD_ACTOR</li>
										                <li>WUC</li>
														<li>JOB_NUMBER</li>
														<li>WCE</li>
										                <li>TAIL_NUMBER</li>
														<li>DISCREPANCY</li>
														<li>NARRATIVE</li>
										                <li>START_DATE</li>
														<li>STOP_DATE</li>
														<li>SHOP_STATUS</li>
										                <li>DOC_NUMBER</li>
													</ul>
												</li>
												
												<li class="table views ddrview">DDR_VW
													<ul>
														<li>DDR</li>
														<li>CORRECTIVE</li>
										                <li>ACTION_TAKEN</li>
														<li>CORRECTED_BY</li>
														<li>INSPECTED_BY</li>
														<li>NEW_SHOP_STATUS</li>
														<li>WHEN_DISCOVERED</li>
														<li>HOW_MAL</li>
														<li>CREW_ID</li>
													</ul>
												</li>
												<li class="table views ddrpartview">DDR_PART_VW
													<ul>
														<li>PART_ACTION</li>
														<li>PART_NUMBER</li>
										                <li>SERIAL_NUMBER</li>
														<li>HOW_MAL</li>
													</ul>
												</li>
											</ul>
										</li>
									</ul>
								</div>
								<div class="query_result_column_panel">
									<div>
										<!--- table columns --->
										<table class="statement" id="queryColumns" border="0" cellpadding="3" cellspacing="3" width="100%">
											<thead>
												<tr class="column_header">
													<th width="16px">&nbsp;</th>
													<th>Expression</th>
													<th>Column</th>
													<th>Sort</th>
												</tr>
											</thead>
											<tbody>
												
											</tbody>
										</table>
									</div>
								</div>
						</div>
						
						<div>
							<div class="query_result_column_title">Query Conditions:</div>
							<div class="centerDiv">
									<ul class="conditionsMenu">
										<li style="width:100%"><img src='../../common/images/add.png' align="left"/>&nbsp;[[ Click to Add New Condition ]]</span>
											<ul>
												
												<li class="table views wceview">WCE_VW
													<ul>
														<li class="loc">CURR_SITE</li>
														<li>CURR_UNIT</li>
														<li>WORK_CENTER</li>
										                <li>SERIAL_NUMBER</li>
														<li>PART_NUMBER</li>
														<li>BAD_ACTOR</li>
										                <li>WUC</li>
														<li>JOB_NUMBER</li>
														<li>WCE</li>
										                <li>TAIL_NUMBER</li>
														<li>DISCREPANCY</li>
														<li>NARRATIVE</li>
										                <li class="date">START_DATE</li>
														<li class="date">STOP_DATE</li>
														<li>SHOP_STATUS</li>
										                <li>DOC_NUMBER</li>
													</ul>
												</li>
												
												<li class="table views ddrview">DDR_VW
													<ul>
														<li>DDR</li>
														<li>CORRECTIVE</li>
										                <li>ACTION_TAKEN</li>
														<li>CORRECTED_BY</li>
														<li>INSPECTED_BY</li>
														<li>NEW_SHOP_STATUS</li>
														<li>WHEN_DISCOVERED</li>
														<li>HOW_MAL</li>
														<li>CREW_ID</li>
													</ul>
												</li>
												<li class="table views ddrpartview">DDR_PART_VW
													<ul>
														<li>PART_ACTION</li>
														<li>PART_NUMBER</li>
										                <li>SERIAL_NUMBER</li>
														<li>HOW_MAL</li>
													</ul>
												</li>
											</ul>
										</li>
									</ul>
								</div>
								<div class="query_result_column_panel">
									<div>
										<!--- table columns --->
										<table class="statement"  id="conditions" border="0" cellpadding="3" cellspacing="3" width="100%">
											<thead>
												<tr class="column_header">
													<th width="16px">&nbsp;</th>
													<th width='165px;'>Column</th>
													<th width='130px;'>Condition</th>
													<th width='150px;'>Value</th>
													<th width='150px;'>End Value</th>
												</tr>
											</thead>
											<tbody>
												
											</tbody>
										</table>
									</div>
								</div>
						</div>
					</div>
			</td>

			<td class="operations_section" style="height:100%;">
				<!---<div class="fileOperations_column">
					<div class="fileOperations_column_title">File Operations:</div>
					<form name="fileOperation" id="fileOperation">
					<table class="fileOperations_column_table" width="100%">
					<tbody>
						<tr>
						    <td style="height: 34px"></td>
						    <td style="height: 34px">
						    <input type="reset" name="ClearBtn" tabIndex="-1" value="Clear"  id="ClearBtn" class="btn"  />
						    </td>
						</tr>
						<tr>
						    <td class="fileOperations_column_table_file">
						    <div>Query File</div>
						    	<input type="file" name="SavedQueryUpload" id="SavedQueryUpload" />
						    </td>
						
						    <td valign="bottom" style="height: 17px">
						    <input type="button" name="LoadBtn" value="Load"  id="LoadBtn" class="btn"  />
						    </td>
						</tr>
						<tr>
						    <td></td>
						    <td>
						    <input type="button" name="SaveBtn" value="Save..." id="SaveBtn" class="btn"  />
						    </td>
						</tr>
					</tbody>
					</table>
					</form>
				</div>
				<div style="margin:10px;">&nbsp;</div>--->
				<div class="sqlQuery_column" >
					<div class="sqlQuery_column_title">SQL Query:</div>
						<table style="height:100%;" border="0" cellpadding="0" cellspacing="0" width="100%">
						    <tbody>
							    <tr>
							        <td class="sqlQuery_column_content">
							        <textarea readonly="readonly" id="sql" style="width:99.5%;margin:0px"></textarea>
									<!---<div id="sql"></div>--->
							        </td>
							    </tr>
							</tbody>
						</table>
				</div>
			
			</td>
        </tr>
	</table>
</div>
<div >&nbsp;</div>
<div class="result_section">
	<table border="0" width="100%"  cellspacing="0" cellpadding="0">
		<tbody>
			<tr>
				<td class="result_section_title">Results: <input class="sqlData" type="button" disabled="disabled" id="runSQL" value="Retrieve Data"/> <input class="sqlData" type="button" disabled="disabled" id="clearResultSQL" value="Clear Data"/></td>
			</tr>
			
			<tr>
				<td class="result_section_content">
					<cfoutput><div id="resultMessage" class="message #msg_status#">#msg#</div></cfoutput>	
					<div id="result" class="result_section_content_box">&nbsp;</div>
				</td>
	
			</tr>
		</tbody>
	</table>
</div>

</div>
</div>
</RIMSS:layout>