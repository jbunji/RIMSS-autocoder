<cfparam name="exportType" default="print" >


		
<cfsavecontent variable="content" >
	<cfif exportType EQ "pdf">	
	
	</cfif>
		
		<cfif isDefined("rc.qSearch")>
		<div class="mainContent">  
			<cfif rc.qSearch.count()>
			<form id="searchPartsOrderedResults" name="searchPartOrderedResults" method="post" action="index.cfm">
			   
			   <table class="globalTable" id="partOrderedTable">
			   		<tr bgcolor="#CCCCCC">
			   			<td align="center" colspan="5"><b>REQUESTS</b></td>
			   			<td align="center" colspan="2" style="border-left-width:3px;"><b>ACKNOWLEDGE</b></td>
			   			<td align="center" colspan="5" style="border-left-width:3px;"><b>FILL ACTIONS</b></td>
			   		</tr>
			         	<tr>
							<td class="theadth" bgcolor="#5A5A5A" width="4%">UNIT</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">PART NOUN REQUESTED</td>
							<td class="theadth" bgcolor="#5A5A5A" width="8%">PART NUMBER</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">SERNO</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%" >DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A" width="5%" style="border-left-width:3px;">PART NOUN ISSUED</td>
							<td class="theadth" bgcolor="#5A5A5A" width="5%">PART NUMBER</td>
							<td class="theadth" bgcolor="#5A5A5A">SERNO</td>
							<td class="theadth" bgcolor="#5A5A5A">DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A">TRACKING No</td>
			         	</tr>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qSearch.next()#"> 
				        <tr class="<cfif rc.qSearch.getCursor() mod 2> odd <cfelse> even </cfif>" id="#HTMLEditFormat(trim(rc.qSearch.getOrderId()))#">
                            <td>#HTMLEditFormat(trim(rc.qSearch.getUnit()))#</td>
							<td>#HTMLEditFormat(trim(rc.qSearch.getRemNoun()))#</td>
                            <td>#HTMLEditFormat(trim(rc.qSearch.getRemPartNo()))#</td>
							<td>#HTMLEditFormat(trim(rc.qSearch.getRemSerNo()))#</td>
							<td>#DateFormat(HTMLEditFormat(trim(rc.qSearch.getInsDate())),"dd-mmm-yyyy")#</td>
							<td>#DateFormat(HTMLEditFormat(trim(rc.qSearch.getAcknowledgeDate())),"dd-mmm-yyyy")#</td>
							<td>
								#HTMLEditFormat(trim(rc.qSearch.getRepNoun()))#
							</td>
							<td>								
								#HTMLEditFormat(trim(rc.qSearch.getRepPartNo()))#
							</td>
                            <td>
                            	#HTMLEditFormat(trim(rc.qSearch.getRepSerNo()))#
							</td>
							<td>
								#DateFormat(HTMLEditFormat(trim(rc.qSearch.getFillDate())),"dd-mmm-yyyy")#
							</td>
							<td>
								<cfif HTMLEditFormat(trim(rc.qSearch.getTcn())) NEQ ''>
									<cfswitch expression="#rc.qSearch.getShipper()#">
										<cfcase value="FEDEX">
											#HTMLEditFormat(trim(rc.qSearch.getTcn()))#
											<span style="font-size:8px;padding-left:5px;">(#HTMLEditFormat(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="UPS">
											#HTMLEditFormat(trim(rc.qSearch.getTcn()))#
											<span style="font-size:8px;padding-left:5px;">(#HTMLEditFormat(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="DHL">
											#HTMLEditFormat(trim(rc.qSearch.getTcn()))#
											<span style="font-size:8px;padding-left:5px;">(#HTMLEditFormat(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="GOV">
											#HTMLEditFormat(trim(rc.qSearch.getTcn()))#	
											<span style="font-size:8px;padding-left:5px;">(#HTMLEditFormat(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfdefaultcase>
											&nbsp;
										</cfdefaultcase>
								 	</cfswitch>
								</cfif>
							</td>
							</tr>
						<cfset prevConfig = #HTMLEditFormat(trim(rc.qSearch.getConfig()))#>	   
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
			   </form>
			<cfelse>
                <div class="global_notice_msg">No Data Found</div>   
			</cfif>
		</div>	
	</cfif>
				
</cfsavecontent>				

<cfif exportType EQ "excel">
	<cfcontent type="application/msexcel">
	<cfheader name="Content-Disposition" value="filename=partOrdered.xls">
	
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

	 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(11);
	 
	 table.setWidthPercentage(100);
	 font = CreateObject("java", "com.lowagie.text.Font");
	 header = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 1);
	 body = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 0);
	 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("REQUESTS", header));
	 cell.setBackgroundColor(color.gray);
	 cell.setColspan(5);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("ACK", header));
	 cell.setBackgroundColor(color.gray);
	 cell.setColspan(1);
	 table.addCell(cell);
	 	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("FILL ACTIONS", header));
	 cell.setBackgroundColor(color.gray);
	 cell.setColspan(5);
	 table.addCell(cell);
	 
	 
	 
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("UNIT", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PART NOUN REQUESTED", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PART NUMBER", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SERNO", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("DATE/TIME", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("DATE/TIME", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);	 	 

	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PART NOUN ISSUED", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PART NUMBER", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SERNO", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("DATE/TIME", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("TRACKING No", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	for(i=1; i LTE rc.search.recordcount;i++){
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.UNIT[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.REM_NOUN[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.REM_PARTNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.REM_SERNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(DateFormat(HTMLEditFormat(trim(rc.search.INS_DATE[i])),"dd-mmm-yyyy"), body)));	   
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(DateFormat(HTMLEditFormat(trim(rc.search.ACKNOWLEDGE_DATE[i])),"dd-mmm-yyyy"), body)));	   		   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.REP_NOUN[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.REP_PARTNO[i]), body)));	   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.REP_SERNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(DateFormat(HTMLEditFormat(trim(rc.search.FILL_DATE[i])),"dd-mmm-yyyy"), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.TCN[i]), body)));
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
		
		<style>
						
			.menubuttons.left {
			    cursor: pointer !important;
			    border: 1px solid #fff;
			    background-color: #ff0000;
			    color: #fff;
			}
			
			.menubuttons.middle {
			    cursor: pointer !important;
			    border: 1px solid #000;
			    background-color: #FFFF00;
			    color: #000;
			}
			
			.menubuttons.right {
			    cursor: pointer !important;
			    border: 1px solid #fff;
			    border-color: #fff;
			    background-color: #009900;
			    color: #fff;
			}
		</style>
		
	</head>
	
	<cfoutput>#content#</cfoutput>
</cfif>
	         
			
			
			


	            	