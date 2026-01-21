<cfoutput>
	#cgi.http_REFERER#
</cfoutput>	


<cfdocument format="pdf" pagewidth="8.5" pageheight="11">
	<cfinclude template="pdf.cfm">
</cfdocument>
<!---
<cfdocument format="pdf">
   <table>
   	<tr>
   		<td>Hello</td>
	</tr>
   </table>
</cfdocument>--->