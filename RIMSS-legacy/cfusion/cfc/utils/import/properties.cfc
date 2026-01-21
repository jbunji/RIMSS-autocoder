component  output="false" accessors = true
{
	property String action;
	property String type;
	
	
	public any function toString() output=true{
	   var local = {};
	   local.results = {};
	   
	   local.metaData = getMetaData(this);
	   if(Structkeyexists(local.metaData,"properties") and isArray(local.metaData['properties'])){
	   	   
	      local.properties = local.metaData['properties']; 
	      for(local.p=1;local.p<=ArrayLen(local.properties);local.p++){
	      	  local.name =  local.properties[local.p].name;
	           local.results[local.name] = (Structkeyexists(variables,local.name)) ? variables[local.name] :"";
	      
	      }	   
	   }
	   return SerializeJSON(local.results);  
	}
}