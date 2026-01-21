<cfparam name="exportType" default="print" >
<!---<cfset form.btnSearch ="">--->

	<cfset dbUtils = application.objectFactory.create("DBUtils") />
		<cfset programLookup = application.sessionManager.getProgramSetting() />
	<cfset sysLookup = dbUtils.getSysIdByProgram(programLookup)/>	
	<cfset getSoftwareList = dbUtils.getSoftwareBySysId(sysLookup)/> 
<!---<cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qspares.getAssetId()))# />	
<cfset swQry1 = #dbUtils.getSoftwareByAssetId(val(rc.qsearch.asset_id))# />--->
<!---<cfset swQry1 = #dbUtils.getSoftwareByAssetId(val(rc.qsearch.assigned_site_id))# />--->
<!---<cfdump var = "#swQry#">
<cfdump var = "#swQry1#">--->
<!---<cfdump var = "#rc.qsearch.remarks#">--->
	<!---<cfdump var ="#swQry.SW_NUMBER#">--->
	<!---<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
	<cfset spareNouns = dropDownUtilities.getNouns(program = APPLICATION.sessionmanager.getProgramSetting()) />--->
	<!---<cfdump var = "#dbUtils#">--->
<!---<cfdump var ="#rc.qSpares.next()#">--->
<!---<cfdump var ="#rc.qSpares#">--->
		<cfsetting showdebugoutput="true" >
<cfsavecontent variable="content" >
	<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
	</div>	
	<br/>
	<cfif exportType EQ "pdf">	
	
	</cfif><!---<cfdump var = "#swQry#">--->
		<!---<cfif isDefined("rc.qSpares")>			
		<div class="mainContent">  
			<cfif rc.qSpares.count()>
			<form id="searchSparesResults" name="searchSparesResults" method="post"  action="controller.cfm?action=updateSpares"><input type="submit" value="MASS UPDATE" name="btnUpdate" id="btnUpdate" />--->
		
			   <table class="globalTable sticky-headers" id="sparesTable">
			         <thead>
			         <!---	<tr>
							<th colspan="13" class="filter">
								<cfoutput><cfif rc.qSpares.count() gt 1> <div style="float:left">Spares Count: #rc.qSpares.count()#</div></cfif></cfoutput>
                              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
                            </th>
                        </tr>--->
			         	<tr>
			         		<!---<th class="noSort">&nbsp;</th>
			         		<th class="noSort">&nbsp;</th>--->
							<th>Spare Noun</th>
							<th>Spare Part Number</th>
							<th>Spare Serial Number</th>
							<th>Status</th>
							<th>Warranty Exp</th>
							<th>Location</th>
							<th>Depot</th>
							<th>Software Number/Title</th>
							<th>Remarks</th>
							<!---<th class="noSort">&nbsp;</th>
							<th class="noSort ">&nbsp;</th>--->
			         	</tr>
						
			         </thead>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qspares.next()#">
				   	   <tr>
				   	   <cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qspares.getAssetId()))# />				   	   
				   	   
				   	   <cfset warrantyDate = isDate(rc.qspares.getMfgDate()) ? UCASE(TRIM(DateFormat(rc.qspares.getMfgDate(),"dd-mmm-yyyy"))) : ""/>    
				       <!--- <tr id="node_#rc.qspares.getEncryptedAssetId()#" data-id="node_#rc.qspares.getEncryptedAssetId()#" class="<cfif rc.qspares.getCursor() mod 2> odd <cfelse> even </cfif> <cfif rc.qspares.getIsOrdered() EQ 'Y'>disable</cfif> rootNode">
				        	
				        	<td><cfif rc.qspares.getIsOrdered() EQ 'N'><input type="checkbox" id="check" name="check"></cfif><input disabled="true" name="assetID" type="hidden" value="#rc.qspares.getAssetId()#"></td>
				        	
                            <!---<td class="edit editIcon"><cfif rc.qspares.getIsOrdered() EQ 'N'><a href="index.cfm?action=edit.spare&spareAsset=#rc.qspares.getEncryptedAssetId()#"></a></cfif></td>--->--->
                            <td>#encodeForHTML(trim(rc.qspares.getNoun()))#</td>
                            <td>#encodeForHTML(trim(rc.qspares.getPartNo()))#</td>
                            <td>#encodeForHTML(trim(rc.qspares.getSerNo()))#</td>
                             <td>#encodeForHTML(trim(rc.qSpares.getStatus()))#</td>                 
							<td>#encodeForHTML(trim(warrantyDate))#</td>
                           <td>#encodeForHTML(trim(rc.qSpares.getCurrentLoc()))#</td>
							<td>#encodeForHTML(trim(rc.qspares.getDepotLoc()))#</td>
							
							<td width="30%">
									  <div class="sw1">
										<ul>
									  	<cfloop query="swQry">
									  		<li>#encodeForHTML(SW_TITLE)# - #encodeForHTML(SW_NUMBER)#</li>
									  	</cfloop>
									  	</ul>
									  </div>
									                          							
							</td>
						<td>	
								#encodeForHTML(trim(rc.qspares.getRemarks()))#		
							</td>
							<!---<td class="add addIcon"><cfif rc.qspares.getIsOrdered() EQ 'N'><a href="index.cfm?action=add.like.spare&spareAsset=#rc.qspares.getEncryptedAssetId()#"></a></cfif></td>
							<td class="delete deleteIcon "><cfif rc.qspares.getIsOrdered() EQ 'N'><a href="index.cfm?action=delete.spare&spareAsset=#rc.qspares.getEncryptedAssetId()#"></a></cfif></td>--->
                        </tr>	   
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
		   	<br/>
			<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
				*****CONTROLLED UNCLASSIFIED INFORMATION*****
			</div>	
</cfsavecontent>				

<cfif exportType EQ "excel">
	<cfcontent type="application/msexcel">
	<cfheader name="Content-Disposition" value="filename=spares.xls">
	
		<cfoutput>#content#</cfoutput>
				
<cfelseif exportType EQ "pdf" >
<cfset fileName = "PDF_Export.pdf" />

<cfscript>
	filePath = getTempDirectory() & fileName;
	 // create a 'Document' object
	 document = CreateObject("java", "com.lowagie.text.Document");
	 document.init();
	 // get an outputstream for the PDF Writer
	 fileIO = CreateObject("java", "java.io.FileOutputStream");
	 // call the constructor, pass the location where you want
	 // the pdf to be created
	 fileIO.init(filePath);
	 // get a PDF Writer var
	 writer = CreateObject("java", "com.lowagie.text.pdf.PdfWriter");
	 // call the static 'getInstance' factory method
	 writer.getInstance(document, fileIO);
	 
	 
	 // open the document
	 document.open();
	 // create a new paragraph
	 
	 color = CreateObject("java", "java.awt.Color");

	 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(9);
	 
	 table.setWidthPercentage(100);
	 font = CreateObject("java", "com.lowagie.text.Font");
	 header = CreateObject("java", "com.lowagie.text.Font").init(1, 9, 1);
	 body = CreateObject("java", "com.lowagie.text.Font").init(1, 9, 0);
	 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
	 
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Spare Noun", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Spare Part Number", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Spare Serial Number", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Status", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Warranty Exp", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);	 	 

	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Location", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Depot", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Software Number/Title", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	/* 
	  cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Software Title", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);*/
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Remarks", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	  swNum = '';
		 swTitle = '';
		/* remarks = '';*/
	for(i=1; i LTE rc.qsearch.recordcount;i++){
			dbUtils = application.objectFactory.create("DBUtils");
		/*swQry = dbUtils.getSoftwareByAssetId(val(rc.qsearch.getAssetId[i]));*/
		swQry = dbUtils.getSoftwareByAssetId(val(rc.qsearch.asset_id[i]));
		/*swQrye = dbUtils.getSoftwareByAssetId(val(rc.qsearch));*/
	/*	<cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qspares.getAssetId()))# />	*/
		/*swQry = dbUtils.getSoftwareByAssetId(val(rc.qConfigs.asset_id[i]));*/
			swNum = ValueList(swQry.sw_number);
			swTitle = ValueList(swQry.sw_title);
			total = (swNum) ; (swTitle);
			/*remarks = ValueList(swQrye.remarks);*/
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.NOUN[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.PARTNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.SERNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.STATUS[i]), body)));	   
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(DateFormat(rc.qsearch.MFG_DATE[i],"dd-mmm-yyyy"), body)));	   		   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.CURRENT_LOC[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.DEPOT_LOC), body)));
/*	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(total), body)));*/
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(swNum & swTitle), body)));	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.REMARKS[i]), body))); 	 
  	/*table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(remarks), body)));	*/ 
  	  } 
  	  document.add(table);	
  	  document.close(); 
  	  </cfscript>
<!---	/* 	   table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qspares.remarks[i]) ,body)));*/
					   
	/*	   table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.SW_NUMBER) ,body)));*/
	 /*  	  	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(getSoftwareList.SW_TITLE), body)));	 
\
  	 	/* table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qspares.GETREMARKS), body)));*/
  	/*table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init, body)));
	 table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.GETREMARKS), body)));	   	*/
	 
	 // close the document (PDF Writer is listening and will automatically
	 // create the PDF for us
	 --->

 
<cfcontent type="application/pdf" file="#filePath#"/> 
<cfheader name="content-diposition" value="attachment; filename=#fileName#">



<cfelseif exportType EQ "print">
	<head>
		<cfoutput>			
        	<link href="#application.rootpath#/common/css/common.css" rel="stylesheet" type="text/css" />	
		</cfoutput>
		<script>
			window.print();
		</script>
	</head>
	
	<cfoutput>#content#</cfoutput>
</cfif>
	         
			
			
			


	            	