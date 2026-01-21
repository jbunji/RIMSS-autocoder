

/*
    Notes:  Can only have one log file "open" at a time.  
            If multiple javaLogger instances are on the same page, the loggers prior to the last one added will automatically be closed.
    Usage:  
            logger = new javaLogger(logName[,directory,level,limit,numberOfFiles,sourceClass,methodName,user]);
            logger.info(message[,sourceClass,methodName,user])
*/

/**
* @displayname "Wrapper for Java Logger" 
* @hint "Can only have one log file "open" at a time.  If multiple javaLogger instances are on the same page, the loggers prior to the last one added will automatically be closed."
* @output false
*/  
component
{   
    //Properties for only public methods
    
    property name="logName" type="String" default="javaLogger";
    
    property name="directory" type="String" default="";
    property name="filepath" type="String" default="/logs";
    property name="pattern" type="String" default="";
    property name="level" type="String" default="INFO";
    property name="limit" type="String" default="5000000";
    property name="numberOfFiles" type="String" default="10";
    property name="user" type="String" default="";
    property name="sourceClass" type="String" default="";
    property name="methodName" type="String" default="";
    property name="version" type="String" default="";

    variables.dateTime = CreateDateTime(2012,11,02,14,32,00);
    variables.dateTimeString = LSDateFormat(variables.dateTime,"yyyymmdd") & LSTimeFormat(variables.dateTime,"HHmm");
    variables.version = "0.0.1." & val(variables.dateTimeString);
    
    
    
    
    
	// Setup instance variables
	variables.instance = {
	   logger = '',
	   directory = "",
	   defaultDirectory = findDefaultDirectory(),
	   defaultLogName = "javaLogger",
	   logName = 'javaLogger',
	   fileHandler='',
	   filePath='',
	   level='INFO',
	   defaultLevel='INFO',
	   levelObject = "",
	   limit=5000000,
	   numberOfFiles = 10,
	   methodName = "",
	   pattern='',
	   user = '', 
	   sourceClass = '', 
	   initialized = false,
	   version = variables.version,
	   logManager = ""
	}; 
    
    
    
	/**
    * @hint Initializes component
    * @logName Sets name of Log File
    * @directory Sets directory where logs will be written
    * @level Sets level of logger The levels in descending order are: SEVERE (highest value), WARNING, INFO, CONFIG, FINE, FINER, FINEST (lowest value)
    * @limit Sets size limit of logger files (in bytes)
    * @numberOfFiles Sets the number of files the logger will create and rotate through
    * @sourceClass Sets the class or file that is calling the logger
    * @methodName Sets the method or function name that is calling the logger
    * @user Sets the current user that is calling the logger
    * @output false
    */
	public any function init(String logName = getLogName(), String directory=getDirectory(),String level=getLevel(), numeric limit = getLimit(), numeric numberOfFiles = getNumberOfFiles(), String sourceClass = getSourceClass(),String methodName=getMethodName(), String user = getUser()){
       var local = {}; 
       local.componentName = getMetadata(this).name;
       
       // Set directory and logName to defaults
       local.directory = (len(trim(ARGUMENTS.directory))) ? trim(ARGUMENTS.directory):getDefaultDirectory();
       local.logName = (len(trim(ARGUMENTS.logName))) ? trim(ARGUMENTS.logName):getDefaultLogName();           

       if(not listfindnocase("\,/",right(trim(local.directory),1))){
            local.directory &= "/";     
       } 

       // Create fullPath to concat directory and logname and clean up path
       local.fullPath = replace(local.directory & local.logName & ".log","\","/","ALL");
       local.fullPath = ReReplaceNoCase(local.fullPath,"%g|%u","","ALL");
        
       
       
       // Create directory if doesn't exist 
       if(not directoryExists(trim(local.directory))){
           	 DirectoryCreate(trim(local.directory));	       
       }

       //Create pattern from path created
       local.pattern = RereplaceNoCase(local.fullPath,"(.*)(\..*)","\1.%u.%g\2"); 

       setLogManager(createObject("java","java.util.logging.LogManager").getLogManager());
       
       // Create Logger and clear out existing handlers
       setLogger(createLogger(ARGUMENTS.logName)); 
       
       //Create logger based on component name 
       //setLogger(createLogger(local.componentName)); 
       
       
        
       // Set component properties 
       setDirectory(trim(local.directory)); 
       setLogName(trim(local.logName)); 
       setFilePath(trim(local.fullPath)); 
       setPattern(trim(local.pattern)); 
       setNumberOfFiles(trim(ARGUMENTS.numberOfFiles));
       setLimit(trim(ARGUMENTS.limit)); 
       setSourceClass(trim(ARGUMENTS.sourceClass));
       setMethodName(trim(ARGUMENTS.methodName)); 
       setUser(ucase(trim(ARGUMENTS.user)));       
       setInitialized(true); 
       //Set Logger Properties
       getLogger().setUseParentHandlers(false);
       setLevelObject(createObject("java", "java.util.logging.Level"));
       createFileHandler();
       setLevel(trim(ARGUMENTS.level)); 

       return this; 
    }
    
    
    private any function findDefaultDirectory(){
        var local = {};
        local.defaultDirectory = GetDirectoryFromPath(GetCurrentTemplatePath()) & "logs\";
        
        local.system = CreateObject("java","java.lang.System");
        local.systemProps = local.system.getProperties();

        if(StructKeyexists(local.systemProps,"user.home")){
            local.defaultDirectory = local.systemProps['user.home'] & "\logs\";    	
        }
        return local.defaultDirectory;    	
    }
    
    
    /**
    * @hint Creates an instance of the java logger
    * @output false
    */  
    private any function createLogger(String logName=""){
        var local = {};
        close(trim(ARGUMENTS.logName));
        local.logger = createObject("java","java.util.logging.Logger").getLogger(trim(ARGUMENTS.logName));
       
        setLogger(local.logger);
        getLogManager().addLogger(local.logger);
        return local.logger;
    }
    
    /**
    * @hint Gets the version 
    * @output false
    */
    public any function getVersion(){
        return variables.instance.version;   
    }
    
    /**
    * @hint Gets the current logger
    * @output false
    */  
    public any function getLogger(){
        return variables.instance.logger;   
    }
    /**
    * @hint Sets the current logger
    * @logger logger to be set
    * @output false
    */
    private any function setLogger(required any logger){
        variables.instance.logger = ARGUMENTS.logger;
        return this;   
    }
    
    /**
    * @hint Gets the current log name
    * @output false
    */  
    public any function getLogName(){
        return variables.instance.logName;   
    }
    /**
    * @hint Sets the current log name
    * @logName log name to be set
    * @output false
    */
    private any function setLogName(required String logName){
        variables.instance.logName = ARGUMENTS.logName;
        return this;   
    }
    
     /**
    * @hint Gets the current filepath
    * @output false
    */  
    public any function getFilePath(){
        return variables.instance.filePath;   
    }
    
    /**
    * @hint Sets the current filepath
    * @filepath filepath to be set
    * @output false 
    */
    private any function setFilePath(required String filePath){
        variables.instance.filePath = ARGUMENTS.filePath;
        return this;   
    }
    
    /**
    * @hint Gets the current directory
    * @output false
    */  
    public any function getDirectory(){
        return variables.instance.directory;   
    }
    
    /**
    * @hint Sets the current directory
    * @initialized directory to be set
    * @output false  
    */
    private any function setDirectory(required String directory){
        variables.instance.directory = ARGUMENTS.directory;
        return this;   
    }
    
    /**
    * @hint Gets the initialized flag
    * @output false
    */  
    private any function getInitialized(){
        return variables.instance.initialized;   
    }
    
    /**
    * @hint Sets the initialized flag
    * @initialized initialized flag to be set
    * @output false 
    */
    private any function setInitialized(required boolean initialized){
        variables.instance.initialized = ARGUMENTS.initialized;
        return this;   
    }
    
    /**
    * @hint Gets the default directory
    * @output false
    */   
    private any function getDefaultDirectory(){
        return variables.instance.defaultDirectory;   
    } 
    
    /**
    * @hint Gets the default logname
    * @output false
    */  
    private any function getDefaultLogName(){
        return variables.instance.defaultLogName;   
    } 

    /**
    * @hint Gets the source class
    * @output false
    */  
    public any function getSourceClass(){
        return variables.instance.sourceClass;   
    }
    /**
    * @hint Sets the source class
    * @sourceClass Source class to be set
    * @output false
    */
    public any function setSourceClass(required String sourceClass){
        variables.instance.sourceClass = ARGUMENTS.sourceClass;
        return this;   
    }
    
    /**
    * @hint Gets the method name
    * @output false
    */  
    public any function getMethodName(){
        return variables.instance.methodName;   
    }
    /**
    * @hint Sets the method name
    * @method Method name to be set
    * @output false
    */
    public any function setMethodName(required String methodName){
        variables.instance.methodName = ARGUMENTS.methodName;
        return this;   
    }

    /**
    * @hint Gets the user
    * @output false
    */    
    public any function getUser(){
        return variables.instance.user;   
    }
    
    /**
    * @hint Sets the user
    * @user user to be set
    * @output false
    *  
    */
    public any function setUser(required String user){
        variables.instance.user = ARGUMENTS.user;
        return this;   
    }
    
    
    /**
    * @hint Gets the log manager
    * @output false
    */  
    public any function getLogManager(){
        return variables.instance.logManager;   
    } 
    
    
    /**
    * @hint Sets the logManager
    * @logManager to be set
    * @output false
    *  
    */
    public any function setLogManager(required String logManager){
        variables.instance.logManager = ARGUMENTS.logManager;
        return this;   
    }
    
    
    /**
    * @hint Creates a file handler for the logger
    * @output false
    */
    private any function createFileHandler(){
       var local = {};
           close();
	       local.filehandler = createObject("java","java.util.logging.FileHandler").init(trim(getPattern()),trim(getLimit()),trim(getNumberOfFiles()),true);
	       local.simpleFormatter = CreateObject("java", "java.util.logging.SimpleFormatter").init();
	       local.filehandler.setFormatter(local.simpleFormatter);
	       setFileHandler(local.fileHandler);
           if(not ArrayLen(getLogger().getHandlers())){
                getLogger().addHandler(local.filehandler);
           }
       return local.fileHandler;  
    }
    
    /**
    * @hint Gets the current file handler
    * @output false
    */
    private any function getFileHandler(){
       return variables.instance.fileHandler;  
    }
    
    /**
    * @hint Sets the fileHandler
    * @fileHandler handler to be set
    * @output false
    *  
    */
    private any function setFileHandler(required any fileHandler){
      
       variables.instance.fileHandler = ARGUMENTS.fileHandler;	
       return this;  
    }

    /**
    * @hint Gets the default level
    * @output false
    */
    private any function getDefaultLevel(){
        return variables.instance.defaultLevel;   
    }
    
    /**
    * @hint Gets the current level
    * @output false
    */
    public any function getLevel(){
        return variables.instance.level;   
    }
    
    /**
    * @hint Gets the level object
    * @output false
    */
    public any function getLevelObject(){
        return variables.instance.levelObject;   
    }
    
    /**
    * @hint Sets the level object
    * @output false
    */
    private any function setLevelObject(levelObject){
    	variables.instance.levelObject = ARGUMENTS.levelObject;
        return this;   
    }

    /**
    * @hint Gets the current limit (file size)
    * @output false
    */
    public any function getLimit(){
        return variables.instance.limit;   
    }
    
    /**
    * @hint Sets the limit in bytes (file size)
    * @limit Number in bytes (file size) to be set
    * @output false
    */
    private any function setLimit(required numeric limit){
        variables.instance.limit = ARGUMENTS.limit;
        return this;   
    }
    
    /**
    * @hint Gets the current number of files setting for logger rotation
    * @output false
    */
    public any function getNumberOfFiles(){
        return variables.instance.numberOfFiles;   
    }
    
    
    /**
    * @hint Sets the number of files for logger rotation
    * @numberOfFiles number in bytes to be set
    * @output false
    */
    private any function setNumberOfFiles(required numeric numberOfFiles){
        variables.instance.numberOfFiles = ARGUMENTS.numberOfFiles;
        return this;   
    }

    /**
    * @hint Gets the current pattern
    * @output false
    */
    public any function getPattern(){
        return variables.instance.pattern;   
    }
    
    /**
    * @hint Sets the pattern
    * @pattern Pattern to be set
    * @output false
    */
    private any function setPattern(required String pattern){
        variables.instance.pattern = ARGUMENTS.pattern;
        return this;   
    }
    
    /**
    * @hint Closes all loggers
    * @output false
    */
    public void function closeAll(){
        var local = {};
        
        try{
        	if(isInstanceOf(getLogger(),"java.util.logging.Logger")){
		        local.logManager = createObject("java","java.util.logging.LogManager").getLogManager();
		        local.logManager.addLogger(getLogger());
		        local.logManager.reset();
		        
		        /*local.handlers = getLogger().getHandlers();
		        
		        for (local.h=1;local.h <= ArrayLen(local.handlers);local.h++){
				    if(isInstanceOf(local.handlers[local.h],"java.util.logging.FileHandler")){
				     local.handlers[local.h].flush();
		               local.handlers[local.h].close();
		            }
		            getLogger().removeHandler(local.handlers[local.h]);  	    
				}*/
			}
	        
		}catch(any e){}
    }

    /**
    * @hint Closes all handlers for logger
    * @output false
    */
    public void function close(String logName=getLogName()){
        var local = {};
        
        try{
        	local.logger = getLogManager().getLogger(ARGUMENTS.logName);
            if( isDefined("local.logger") and isInstanceOf(local.logger,"java.util.logging.Logger")){
            	
            	local.handlers = local.logger.getHandlers();

                for (local.h=1;local.h <= ArrayLen(local.handlers);local.h++){
                    if(isInstanceOf(local.handlers[local.h],"java.util.logging.FileHandler")){
                     local.handlers[local.h].flush();
                       local.handlers[local.h].close();
                       local.logger.removeHandler(local.handlers[local.h]);     
                    }
                            
                }
                
            }
            
        }catch(any e){}
    }
    
    /**
    * @hint Logs level messages
    * @message Message to be logged
    * @output false
    */
    private void function logMessage(required String message,String level=getDefaultLevel(), String sourceClass = getSourceClass(),String methodName = getMethodName(), String user = getUser()){
        var local = {};
        local.message = (len(trim(ARGUMENTS.user))) ? "(#ucase(trim(ARGUMENTS.user))#) " & trim(ARGUMENTS.message) : trim(ARGUMENTS.message);
        getLogger().logp(getLevelObject().parse(ucase(trim(ARGUMENTS.level))),trim(ARGUMENTS.sourceClass),trim(ARGUMENTS.methodName),trim(local.message));
    }
    
    /////////////** Public API **/////////////
    
    /**
    * @hint Sets the level of the logger
    * @level logger level (SEVERE,WARNING,INFO,CONFIG,FINE,FINER,FINEST,OFF)
    * @output false
    */
    public any function setLevel(required String level){
        var local = {};
        variables.instance.level = UCASE(TRIM(ARGUMENTS.level));
        try{
            getLogger().setLevel(getLevelObject().parse(UCASE(TRIM(ARGUMENTS.level))));

            
        }catch("java.lang.IllegalArgumentException" e){
           getLogger().setLevel(getLevelObject().parse(trim("INFO"))); 
        }

        catch(any e){
            variables.instance.level = "INFO";  
        }
        return this;   
    }

    /**
	* @hint Logs a severe level message
	* @message Message to be logged
	* @output false
	*/
    public void function severe(required String message, String sourceClass ,String methodName, String user){        
        ARGUMENTS.level = "SEVERE";
        logMessage(argumentCollection = ARGUMENTS); 
        //getLogger().severe(trim(ARGUMENTS.message)); 
    }
    
    /**
    * @hint Logs a warning level message
    * @message Message to be logged
    * @output false
    */
    public void function warning(required String message, String sourceClass,String methodName, String user){       
        ARGUMENTS.level = "WARNING";
        logMessage(argumentCollection = ARGUMENTS); 
        //getLogger().warning(trim(ARGUMENTS.message)); 
    }

    /**
    * @hint Logs a info level message
    * @message Message to be logged
    * @output false
    */
    public void function info(required String message, String sourceClass,String methodName, String user){        
        ARGUMENTS.level = "INFO";
        logMessage(argumentCollection = ARGUMENTS); 
    }
   
    /**
    * @hint Logs a config level message
    * @message Message to be logged
    * @output false
    */ 
    public void function config(required String message, String sourceClass,String methodName, String user){       
        ARGUMENTS.level = "CONFIG";
        logMessage(argumentCollection = ARGUMENTS);    
    }

    /**
    * @hint Logs a fine level message
    * @message Message to be logged
    * @output false
    */
    public void function fine(required String message, String sourceClass,String methodName, String user){        
        ARGUMENTS.level = "FINE";
        logMessage(argumentCollection = ARGUMENTS);    
    }
    
    /**
    * @hint Logs a finer level message
    * @message Message to be logged
    * @output false
    */
    public void function finer(required String message,String sourceClass,String methodName, String user){       
        ARGUMENTS.level = "FINER";
        logMessage(argumentCollection = ARGUMENTS);   
    }    
    
    /**
    * @hint Logs a finest level message
    * @message Message to be logged
    * @output false
    */
    public void function finest(required String message, String sourceClass,String methodName, String user){
        ARGUMENTS.level = "FINEST";
        logMessage(argumentCollection = ARGUMENTS);   
        
    } 
    
    /**
    * @hint Gets instance structure
    * @output false
    */
    public struct function getInstance(){
        return variables.instance;	
    }
    
    
    
    
    
}