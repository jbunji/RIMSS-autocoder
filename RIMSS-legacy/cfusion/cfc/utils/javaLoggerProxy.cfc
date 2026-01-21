component  output="false"
{
	variables.instance = {
       logger = ''
    }; 
	
	public any function init(String logName, String directory,String level, numeric limit, numeric numberOfFiles, String sourceClass,String methodName, String user){
	   
	   if(not StructkeyExists(APPLICATION,"javaLogger")){
	   	   
            APPLICATION.javaLogger = new javaLogger(argumentCollection = ARGUMENTS);   
        }
        
        setLogger(APPLICATION.javaLogger);
	   
	   	return this;	
	}
	
	public any function getLogger(){
	   return variables.instance.logger;
	}
	
	public any function setLogger(required any logger){
       variables.instance.logger = ARGUMENTS.logger;
    }
	
	/**
    * @hint Gets the current log name
    * @output false
    */  
    public any function getLogName(){
        return getLogger().getLogName();   
    }
    
    /**
    * @hint Gets the current directory
    * @output false
    */  
    public any function getDirectory(){
        return getLogger().getDirectory();   
    }
    
    /**
    * @hint Gets the current level
    * @output false
    */
    public any function getLevel(){
        return getLogger().getLevel();
    }
    
    /**
    * @hint Gets the current number of files setting for logger rotation
    * @output false
    */
    public any function getNumberOfFiles(){
        return getLogger().getNumberOfFiles();   
    }
    
    /**
    * @hint Gets the current limit (file size)
    * @output false
    */
    public any function getLimit(){
        return getLogger().getLimit();   
    }
    
    /**
    * @hint Gets the source class
    * @output false
    */  
    public any function getSourceClass(){
        return getLogger().getSourceClass();   
    }
    
    /**
    * @hint Gets the method name
    * @output false
    */  
    public any function getMethodName(){
        return getLogger().getMethodName();   
    }
    
    /**
    * @hint Gets the user
    * @output false
    */    
    public any function getUser(){
        return getLogger().getUser();  
    }
    
    /**
    * @hint Logs a severe level message
    * @message Message to be logged
    * @output false
    */
    public void function severe(required String message, String sourceClass ,String methodName, String user){        
        getLogger().severe(argumentCollection = ARGUMENTS); 
    }
    
    /**
    * @hint Logs a warning level message
    * @message Message to be logged
    * @output false
    */
    public void function warning(required String message, String sourceClass,String methodName, String user){       
        getLogger().warning(argumentCollection = ARGUMENTS); 
    }

    /**
    * @hint Logs a info level message
    * @message Message to be logged
    * @output false
    */
    public void function info(required String message, String sourceClass,String methodName, String user){        
        getLogger().info(argumentCollection = ARGUMENTS); 
    }
   
    /**
    * @hint Logs a config level message
    * @message Message to be logged
    * @output false
    */ 
    public void function config(required String message, String sourceClass,String methodName, String user){       
        getLogger().config(argumentCollection = ARGUMENTS);     
    }

    /**
    * @hint Logs a fine level message
    * @message Message to be logged
    * @output false
    */
    public void function fine(required String message, String sourceClass,String methodName, String user){        
        getLogger().fine(argumentCollection = ARGUMENTS);     
    }
    
    /**
    * @hint Logs a finer level message
    * @message Message to be logged
    * @output false
    */
    public void function finer(required String message,String sourceClass,String methodName, String user){       
        getLogger().finer(argumentCollection = ARGUMENTS);  
    }    
    
    /**
    * @hint Logs a finest level message
    * @message Message to be logged
    * @output false
    */
    public void function finest(required String message, String sourceClass,String methodName, String user){
        getLogger().finest(argumentCollection = ARGUMENTS); 
        
    } 
    
    /**
    * @hint Gets instance structure
    * @output false
    */
    public struct function getInstance(){
        return getLogger().getInstance();  
    }
    
    
    	
}