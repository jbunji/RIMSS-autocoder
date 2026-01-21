import cfc.model.Sorties;
import cfc.utils.javaLoggerProxy;


component  hint="Sorties Business Object" output="false"
{

	variables.instance={
       componentName = "sortiesBO",
       javaLoggerProxy = new  javaLoggerProxy(),
       objectFactory = '',
       sortieService = '',
       locationService = ''
    };

    /* init */
    public function init() {
        /* return success */
        return this;
    }
    /* Get Component Name */
    public any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = getMetaData(this).name;   
        }
       return variables.instance.componentName;      
    }
    
    /* Java Logger Proxy */
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    /*get Object Factory */
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    public any function getLocationService(){
       if(isSimpleValue(variables.instance.locationService)){
           variables.instance.locationService = getObjectFactory().create("LocationService");    
        }       
       return variables.instance.locationService;      
    }
    
    public any function getSortieService(){
       if(isSimpleValue(variables.instance.sortieService)){
           variables.instance.sortieService = getObjectFactory().create("SortiesService");    
        }       
       return variables.instance.sortieService;      
    }
    
    /* Create Sortie */
    public Sorties function createSortie(required Sorties sortie) {
        var local = {};
        local.sortieService = getSortieService();
        
        /* validate Sortie related objects before insert */
        validateSortie(arguments.sortie);
        
         transaction {
         	try {
                // insert sortie
                local.result = local.sortieService.createSorties(arguments.sortie);

                // commit transcation
                TransactionCommit();
                return local.result;
            } catch (any e) {
                TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            } 
 
         };

    }

    /* Update Sortie */
    public Sorties function updateSortie(required Sorties sortie) {
        var local = {};
        local.sortieService = getSortieService();
        
        /* validate Sortie related objects before insert */
        validateSortie(arguments.sortie);
        
         transaction {
            try {
                // insert sortie
                local.result = local.sortieService.updateSorties(arguments.sortie);

                // commit transcation
                TransactionCommit();
                return local.result;
            } catch (any e) {
                TransactionRollback();
                throw(type="UpdateException", message=e.message, detail=e.detail);
            } 
 
         };

    }
    
    /* Delete Sortie */
    public void function deleteSortie(required numeric sortieId) {
        var local = {};
        local.result = false;
        local.sortieService = getSortieService();  
        
        transaction {
	        try{
	            local.sortieService.deleteSorties(trim(ARGUMENTS.sortieId));
	            // commit transcation
                TransactionCommit();
	        }catch(any e){
	            TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);   	
	        }
        }
          
    }
    

	/* Validate Sortie Object */
	private void function validateSortie(required Sorties sortie) {
	   arguments.sortie.validate();
    }
	
	
}