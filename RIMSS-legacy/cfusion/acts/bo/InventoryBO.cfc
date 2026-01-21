import cfc.model.CfgMeters;
import cfc.model.MeterHist;


component displayname="InventoryBO" hint="Inventory Buisiness Object" accessors="true"   
{
	
    /* init */
    public function init() {
        /* return success */
        return this;
    }
    
    
    /* Update Asset */
    public void function updateAsset(required any asset, required any invAsset, required CfgMeters cfgMeters, required MeterHist meterHist, boolean validateMeters) {               
        	var meterHistService = application.objectFactory.create("MeterHistService");
        var cfgMetersService = application.objectFactory.create("CfgMetersService");	
        var assetService = application.objectFactory.create("AssetService");
        var invAssetService = application.objectFactory.create("InvAssetsService");
        
   
		/* validate Event related objects before update */        
		if(arguments.validateMeters){
	        validateMeterHist(arguments.meterHist);
	        validateCfgMeters(arguments.cfgMeters);
        }
        validateAsset(arguments.asset);
    
		/* perform Asset update transaction */    
        transaction {
            try {
            	
            	if(arguments.validateMeters){
                	local.meterHistService.createMeterHist(arguments.meterHist);
                	local.cfgMetersService.createCfgMeters(arguments.cfgMeters);
                }
                local.assetService.updateAsset(arguments.asset);
                try{
                	local.invAssetService.updateInvAssets(arguments.invAsset);
                }catch(any e){}
                
                TransactionCommit();
            } catch (any e) {
                TransactionRollback();
                throw(type="UpdateException", message=e.message, detail=e.detail);
                
            }
        }
    }

    private void function validateAsset(required any asset){
    	if(isNull(arguments.asset.getStatusCd())){
    		throw (type="MaintenanceException" message="Missing Status", detail="Please select a Status.");
    	}
    	
    }    

    /* Validate MeterHist Object */
    private void function validateMeterHist(required MeterHist meterHist) {
        arguments.meterHist.validate();
        
        if (isNull(arguments.meterHist.getMeterIn()) or !len(trim(arguments.meterHist.getMeterIn()))) {
            throw (type="MaintenanceException" message="Missing ETM Start", detail="Please enter a value for ETM Start.");
        } else {
            if (!IsNumeric(arguments.meterHist.getMeterIn())) {
                throw (type="MaintenanceException" message="Invalid ETM Start", detail="Please enter in a valid ETM Start.");
            }
        }

        if (!IsNull(arguments.meterHist.getMeterOut()) and len(trim(arguments.meterHist.getMeterOut()))) {
            if (!IsNumeric(arguments.meterHist.getMeterOut())) {
                throw (type="MaintenanceException" message="Invalid ETM Comp [#arguments.cfgMeters.getValueOut()#]", detail="Please enter in a valid ETM Comp.");
            }
            
            if (arguments.meterHist.getChanged() neq 'Y' and lsparsenumber(arguments.meterHist.getMeterOut()) lt lsparsenumber(arguments.meterHist.getMeterIn())) {
                throw (type="MaintenanceException" message="ETM Comp is less than ETM Start1", detail="ETM Comp may not be less than the ETM Start.");
            }
        }
    }

    /* Validate CfgMeters Object */
    private void function validateCfgMeters(required CfgMeters cfgMeters) {
        arguments.cfgMeters.validate();
        
        if (isNull(arguments.cfgMeters.getValueIn()) or !len(trim(arguments.cfgMeters.getValueIn()))) {
            throw (type="MaintenanceException" message="Missing ETM Start", detail="Please enter a value for ETM Start.");
        } else {
            if (!IsNumeric(arguments.cfgMeters.getValueIn())) {
                throw (type="MaintenanceException" message="Invalid ETM Start", detail="Please enter in a valid ETM Start.");
            }
        }

        if (!IsNull(arguments.cfgMeters.getValueOut()) and len(trim(arguments.cfgMeters.getValueOut()))) {
            if (!IsNumeric(arguments.cfgMeters.getValueOut())) {
                throw (type="MaintenanceException" message="Invalid ETM Comp [#arguments.cfgMeters.getValueOut()#]", detail="Please enter in a valid ETM Comp.");
            }
            
            if (arguments.cfgMeters.getIsMeterChg() neq 'Y'  and lsparsenumber(arguments.cfgMeters.getValueOut()) lt lsparsenumber(arguments.cfgMeters.getValueIn())) {
                throw (type="MaintenanceException" message="ETM Comp is less than ETM Start2", detail="ETM Comp may not be less than the ETM Start.");
            }
        }
    }

}