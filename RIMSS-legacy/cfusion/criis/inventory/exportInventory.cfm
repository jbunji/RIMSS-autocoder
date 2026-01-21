<cfparam name="exportType" default="print" >

<cfquery dbtype="query" name="QoQNoun">
	select noun
	from rc.qAssets
	group by noun
</cfquery>
		
<cfsavecontent variable="content" >
	<cfif exportType EQ "pdf">	
	
	</cfif>
		<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
			*****CONTROLLED UNCLASSIFIED INFORMATION*****
		</div>	
		<br/>
		<div class="mainContent">
               <table class="globalTable font10" id="inventoryTable" cellspacing="0" cellpadding="0">
                     <thead>     
						<tr>
							<th>Serno</th>
							<cfif #rc.system# EQ "POD">
								<th>Cumulative Hrs</th>
								<th>Bench Hrs</th>
								<th>Operational Hrs</th>
							</cfif>
                            <th>Status</th>
                            <th>Current Loc</th>
                            <th>Assign Loc</th>
							<cfif #rc.system# EQ "POD">
								<th>CPOT</th>
							</cfif>
                            
                            <th>Is In Transit</th>
							<th>Tracking Number</th>
							<th>Next PMI Due</th>
							<th>Remarks</th>
                        </tr>
                        
						
                     </thead>
                   <tbody>      
                   <cfoutput query="rc.qAssets">
						<cfquery dbtype="query" name="QoQAssets">
							select *
							from rc.qAssets
							where noun = '#QoQNoun.noun#'
						</cfquery>
						<tr>
				   			<td bgcolor="##027FD1" style="text-align:center;font-weight:bold;color:white" colspan="13">#encodeForHTML(QoQNoun.noun)#</td>	
						</tr> 
				   	   <cfloop query="QoQAssets"> 
                        <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
                            <td style="width:50px">#EncodeForHTML(trim(SERNO))#</td>
							<cfif #rc.system# EQ "POD">
								<td style="width:50px">#EncodeForHTML(delta)#</td>
								<td style="width:50px">#EncodeForHTML(bench)#</td>
								<td style="width:50px">#EncodeForHTML(flight)#</td>			
							</cfif>					
                            <td style="width:50px">#EncodeForHTML(trim(STATUS))#</td>
                            <td style="width:200px">#EncodeForHTML(trim(CURR))#</td>
                            <td style="width:200px">#EncodeForHTML(trim(ASSIGN))#</td>
							<cfif #rc.system# EQ "POD">
								<td style="width:50px">#EncodeForHTML(trim(ETM))#</td>
							</cfif>
                            <td style="width:50px">#EncodeForHTML(trim(IN_TRANSIT))#</td>       
							<td  style="width:100px">
								<cfswitch expression="#shipper#">
									<cfcase value="FEDEX">
										<a href="http://www.fedex.com/Tracking?action=track&tracknumbers=#EncodeForURL(TCN)#" target="_blank">#EncodeForHTML(trim(TCN))#</a>
										<span style="font-size:8px;padding-left:5px;">(#EncodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfcase value="UPS">
										<a href="http://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=#EncodeForURL(TCN)#" target="_blank">#EncodeForHTML(trim(TCN))#</a>
										<span style="font-size:8px;padding-left:5px;">(#EncodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfcase value="DHL">
										<a href="http://webtrack.dhlglobalmail.com/?mobile=&trackingnumber=#EncodeForURL(TCN)#" target="_blank">#EncodeForHTML(trim(TCN))#</a>
										<span style="font-size:8px;padding-left:5px;">(#EncodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfcase value="GOV">
										#EncodeForHTML(trim(TCN))#	
										<span style="font-size:8px;padding-left:5px;">(#EncodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfdefaultcase>
										&nbsp;
									</cfdefaultcase>
								</cfswitch> 
							</td>
							<cfif NEXT_DUE_DATE NEQ "">
								<cfif DateDiff('d',now(),NEXT_DUE_DATE)+1 GT 30>
									<td style="background-color:green; width: 50px">#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
								<cfelseif (DateDiff('d',now(),NEXT_DUE_DATE)+1 LTE 30) AND (DateDiff('d',now(),NEXT_DUE_DATE)+1 GT 7)>
									<td style="background-color:yellow;width: 50px">#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
								<cfelse>
									<td style="background-color:red;width: 50px">#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
								</cfif>
							<cfelse>
								<td>&nbsp;</td>
							</cfif>   
							<td>#EncodeForHTML(trim(REMARKS))#</td>            
                        </tr>
                     </cfloop>   
                   </cfoutput>
                   </tbody>
               </table>			   
		  </div>
		  <br/>
		  <div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
			  *****CONTROLLED UNCLASSIFIED INFORMATION*****
		  </div>
		
				
</cfsavecontent>				

<cfif exportType EQ "excel">
	<cfcontent type="application/msexcel">
	<cfheader name="Content-Disposition" value="filename=inventory.xls">
	
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
	 if(rc.system EQ "POD"){
	 	table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(11);
	 }else{
	 	 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(7);
	 }
	 table.setWidthPercentage(100);
	 font = CreateObject("java", "com.lowagie.text.Font");
	 header = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 1);
	 body = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 0);
	 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Serno", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 if(rc.system EQ "POD"){							
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Cumulative Hrs", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Bench Hrs", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Operational Hrs", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
	 }
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Status", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Current Loc", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Assign Loc", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 if(rc.system EQ "POD"){
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("CPOT", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);	 	 
	 }
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Is In Transit", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Tracking Number", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Remarks", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 
	 
	for(i=1; i LTE rc.search.recordcount;i++){
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.serno[i]), body)));
	   	
	   	if(rc.system EQ "POD"){
		    table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.delta[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.bench[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.flight[i]), body)));
	   	}
	   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.status[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.curr[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.assign[i]), body)));
	   	
	   	if(rc.system EQ "POD"){
	   		table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.etm[i]), body)));
	   	}
	   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.in_transit[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.tcn[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(EncodeForHTML(rc.search.remarks[i]), body)));	   	
	   	
   }
						   
	 document.add(table);	
	 
	 
	 // close the document (PDF Writer is listening and will automatically
	 // create the PDF for us
	 document.close();
 </cfscript>
 
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
	         
			
			
			


	            	