

<!---<cfset SESSION.SPARESPROCS = "/RIMSS/CRISS/SPARES/">--->
<cfsetting showdebugoutput="true" >
<CFSCRIPT>	
	
    public any function decryptId(required string id){
        var local = {};
         
         local.result = 0;
        if(isNumeric(ARGUMENTS.id)){
           return trim(ARGUMENTS.id);
        }   
           try{
                if(len(trim(ARGUMENTS.id))){
                    local.result = Decrypt(arguments.id,getSecretKey(),"AES","HEX");
                }
              }catch(err e){
                  
              }
        
        return trim(local.result);  
    }
    
	   public string function getSecretKey(){
	        var local = {};
	        local.utilities = new cfc.utils.utilities();
	        if(!IsDefined("SESSION.secretKey")){
	        	local.path = getCurrentTemplatePath();
	            SESSION.secretKey = local.utilities.genAESKeyFromString(local.path,toBase64(local.path));
	            return SESSION.secretKey;
	        }else{
	            return SESSION.secretKey;	
	        }
	        	       
	   }     

if(url.action == 'viewP5Failure'){
	
	variables.repairID = decryptId(url.repairID);
	
	session.p5.repairID = '#variables.repairID#';
	session.p5.parentSerNo = '#url.parentSerNo#';
	
	
	location="p5failure.cfm";
	
	location(location,'no');		
}

if(url.action == 'exportp5'){
	
	session.p5.reportdate = form.reportdate;
	session.p5.failorig = form.failorig;
	session.p5.branch = form.branch;
	session.p5.unit = form.unit;
	session.p5.sentloc = form.sentloc;
	session.p5.address1 = form.address1;
	session.p5.address2 = form.address2;
	session.p5.city = form.city;
	session.p5.state = form.state;
	session.p5.zip = form.zip;
	session.p5.createdby = form.createdby;
	session.p5.createdbyemail = form.createdbyemail;
	session.p5.podcontactname = form.podcontactname;
	session.p5.podcontactphone = form.podcontactphone;
	session.p5.jobno = form.jobno;
	session.p5.faildate = form.faildate;
	session.p5.drsitemno = form.drsitemno;
	session.p5.serno = form.serno;
	session.p5.desc = form.desc;
	session.p5.parenttype = form.parenttype;
	session.p5.parentserno = form.parentserno;
	session.p5.aircrafttype = form.aircrafttype;
	session.p5.variant = form.variant;
	session.p5.block = form.block;
	session.p5.mountloc = form.mountloc;
	session.p5.railtype = form.railtype;
	session.p5.whenoccured = form.whenoccured;
	session.p5.gps = form.gps;
	session.p5.keystatus = form.keystatus;
	session.p5.keyType = form.keyType;
	session.p5.etm = form.etm;
	session.p5.track = form.track;
	session.p5.detail = form.detail;
	session.p5.chars = form.chars;
	session.p5.indications = form.indications;
	session.p5.frequency = form.frequency;
	
	location="p5export.cfm";
	
	location(location,'no');		
}

</CFSCRIPT> 