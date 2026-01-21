import cfc.dao.AttachmentsDao;
import cfc.model.Attachments;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:ATTACHMENTS" displayName="AttachmentsService" name="AttachmentsService" {

    variables.instance = {
        AttachmentsDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.AttachmentsDao = new AttachmentsDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* ATTACHMENTS SERVICES */
	
	/* Create ATTACHMENTS */
	public Attachments function createAttachments(Attachments item) {
		/* Auto-generated method 
           Insert a new record in ATTACHMENTS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.AttachmentsDao.create(arguments.item);
        //var qry = variables.instance.AttachmentsDao.readByRowId(local.idcol);
        //var Attachments = loadObjectFromQuery(local.qry); 

        /* return created item */
        //return local.Attachments;
        return arguments.item;
	}	
	
	/* Delete Attachments */
	public void function deleteAttachments(string attId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.AttachmentsDao.delete(arguments.attId); 

		/* return success */
		return;
	}
	
	/* Get Attachments */
	public Attachments function getAttachments(string attId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.AttachmentsDao.read(arguments.attId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	public Attachments function getAttachmentsRepairId(required string repairId) {
        var qry = variables.instance.AttachmentsDao.readByRepairId(arguments.repairId);
        var obj = loadObjectFromQuery(qry);
        return local.obj;
    }
	
	
	
	/* Update Attachments */
	public Attachments function updateAttachments(Attachments item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update Attachments */		
		variables.instance.AttachmentsDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count Attachments */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.AttachmentsDao.count(); 
	}

    private Attachments function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Attachments object
        local.obj = new Attachments();
        local.obj.setAttId(arguments.resultSet.ATT_ID[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        local.obj.setName(arguments.resultSet.NAME[1]);
        try{
        local.obj.setAttachment(arguments.resultSet.ATTACHMENT[1]);	
        } catch (any e) {
        	addToRequest("error", {message="#e.message#"});
        	
        }        
        local.obj.setThumbnail(arguments.resultSet.THUMBNAIL[1]);
        local.obj.setContentType(arguments.resultSet.CONTENT_TYPE[1]);
        local.obj.setDescription(arguments.resultSet.DESCRIPTION[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Attachments
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Attachments();
	        local.obj.setAttId(arguments.resultSet.ATT_ID[local.row]);
        	local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
        	local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
        	local.obj.setName(arguments.resultSet.NAME[local.row]);
        	try{
        		local.obj.setAttachment(arguments.resultSet.ATTACHMENT[local.row]);
       		 } catch (any e) {
        			addToRequest("error", {message="#e.message#"});
        		}
        	local.obj.setThumbnail(arguments.resultSet.THUMBNAIL[local.row]);
        	local.obj.setContentType(arguments.resultSet.CONTENT_TYPE[local.row]);
        	local.obj.setDescription(arguments.resultSet.DESCRIPTION[local.row]);
        	local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
        	local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
        	local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
        	local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
        	local.obj.setValid(arguments.resultSet.VALID[local.row]);
        	local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
        	local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
