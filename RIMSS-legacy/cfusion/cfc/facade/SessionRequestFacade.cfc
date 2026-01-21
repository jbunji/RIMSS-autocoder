component  hint="Puts Session Request into  the REQUEST scope" output="false"
{
	variables.instance = {
       'sessionRequest' = {},
       'formRequest' = {}
       
    };

	public any function init(Struct sessionRequest){
        return this;    
    }
    
    public any function createSessionRequest(){
            SESSION.request = {};
            setSessionRequest(SESSION.request);  
        return this;    	
    }
    
    public void function checkForRequest(){
        if(not isDefined("SESSION.request")){
            createSessionRequest();    	
        }    	
    }
    
    public struct function getSessionRequest(){
    	checkForRequest();
        return variables.instance.sessionRequest;	
    }
    
    public Struct function setSessionRequest(Struct sessionRequest){
        variables.instance.sessionRequest = ARGUMENTS.sessionRequest;
        return this;  
    }
    
    
    public any function addFormToRequest(required Struct formRequest){
    	checkForRequest();
    	SESSION.request.form = Duplicate(ARGUMENTS.formRequest);   
        setFormRequest(SESSION.request.form);
        return this;
    }
    
    public any function addVariablesToRequest(required Struct requestVariables){
        checkForRequest();
        StructAppend(SESSION.request,ARGUMENTS.requestVariables,true);
        
        return this;
    }
    
    
    public any function getFormRequest(){
        return variables.instance.formRequest;
    }
    
    public any function setFormRequest(required struct formRequest){
        variables.instance.formRequest = ARGUMENTS.formRequest;
        return this ;
    }
    
    public any function addToRequest(required String key, required any value){
        SESSION.request['#ARGUMENTS.key#'] = ARGUMENTS.value;
        return this;
    }
    
    public any function removeFromRequest(required String key){
        if(isDefined("SESSION.request") and StructKeyExists(SESSION.request,trim(ARGUMENTS.key))){
            StructDelete(SESSION.request,ARGUMENTS.key);
        }
        return this;
    }
    
    public any function addToFormRequest(required String key, required any value){
        if(!isDefined("SESSION.request.form") and isDefined("SESSION.request")){
            SESSION.request.form = {};    	
        }
        SESSION.request.form['#ARGUMENTS.key#'] = ARGUMENTS.value;
        return this;
    }

    public any function removeFromFormRequest(required String key){

        if(isDefined("SESSION.request.form") and StructKeyExists(SESSION.request.form,trim(ARGUMENTS.key))){
            StructDelete(SESSION.request,ARGUMENTS.key);
        }
        return this;
    }
    
    
    public any function reset(){
      if(isDefined("SESSION.request")){
            StructDelete(SESSION,"request");	   
      }
      return this;  	
    }
    
    
	
}