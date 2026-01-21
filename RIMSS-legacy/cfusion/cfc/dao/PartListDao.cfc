import cfc.model.PartList;
import cfc.utils.Datasource;

component output="false" displayName="PartListDao" name="PartListDao" {
    variables.instance = {
        datasource = 0
    };

	/* Auto-generated method
       Add authroization or any logical checks for secure access to your data */
	/* init */
	public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
		return this ;
	}

    /* retrieve datasource object from variables.instance */
    private any function getDatasource() {
        return variables.instance.datasource;
    }
	
	/* create */
	public any function create(required PartList newPartList) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.PART_LIST ( " &
                    "PARTNO_ID, PARTNO, SYS_TYPE, PGM_ID, NOUN,  " & 
                    "INS_BY, INS_DATE, ACTIVE, SN_TRACKED, VALID,  " & 
                    "VAL_BY, VAL_DATE, WUC_CD, MDS_CD, VERSION,  " & 
                    "NSN, CAGE, NHA_ID, CONFIG, UNIT_PRICE,  " & 
                    "CT_SYS_ID, CHG_BY, CHG_DATE, ERRC, LSRU_FLAG,  " & 
                    "EXCH_COST, LOC_IDR, MSL) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newPartList.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getPartnoId()) and !len(trim(arguments.newPartList.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getPartno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getPartno()) and !len(trim(arguments.newPartList.getPartno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getSysType()) and !len(trim(arguments.newPartList.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getPgmId()) and !len(trim(arguments.newPartList.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getNoun())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getNoun()) and !len(trim(arguments.newPartList.getNoun()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getInsBy()) and !len(trim(arguments.newPartList.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartList.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartList.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newPartList.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getActive()) and !len(trim(arguments.newPartList.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getSnTracked())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getSnTracked()) and !len(trim(arguments.newPartList.getSnTracked()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getValid()) and !len(trim(arguments.newPartList.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getValBy()) and !len(trim(arguments.newPartList.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartList.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartList.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newPartList.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getWucCd()) and !len(trim(arguments.newPartList.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getMdsCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getMdsCd()) and !len(trim(arguments.newPartList.getMdsCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getVersion())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getVersion()) and !len(trim(arguments.newPartList.getVersion()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getNsn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getNsn()) and !len(trim(arguments.newPartList.getNsn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getCage())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getCage()) and !len(trim(arguments.newPartList.getCage()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getNhaId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getNhaId()) and !len(trim(arguments.newPartList.getNhaId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getConfig())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getConfig()) and !len(trim(arguments.newPartList.getConfig()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getUnitPrice())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getUnitPrice()) and !len(trim(arguments.newPartList.getUnitPrice()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getCtSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getCtSysId()) and !len(trim(arguments.newPartList.getCtSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getChgBy()) and !len(trim(arguments.newPartList.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartList.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartList.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newPartList.getErrc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getErrc()) and !len(trim(arguments.newPartList.getErrc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getLsruFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getLsruFlag()) and !len(trim(arguments.newPartList.getLsruFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getExchCost())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getExchCost()) and !len(trim(arguments.newPartList.getExchCost()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getLocIdr())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getLocIdr()) and !len(trim(arguments.newPartList.getLocIdr()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartList.getMsl())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartList.getMsl()) and !len(trim(arguments.newPartList.getMsl()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="PartListDao could not insert the following record: #arguments.newPartList.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string partnoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new PartList();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.partnoId = arguments.partnoId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="PartListDao could not find the following record: Partno_Id[#arguments.partnoId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new PartList();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.rowId = arguments.rowId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="PartListDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required PartList chgPartList) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.PART_LIST SET " & 
                    "PARTNO = ?, SYS_TYPE = ?, PGM_ID = ?, NOUN = ?,  " &
                    "INS_BY = ?, INS_DATE = ?, ACTIVE = ?, SN_TRACKED = ?, VALID = ?,  " &
                    "VAL_BY = ?, VAL_DATE = ?, WUC_CD = ?, MDS_CD = ?, VERSION = ?,  " &
                    "NSN = ?, CAGE = ?, NHA_ID = ?, CONFIG = ?, UNIT_PRICE = ?,  " &
                    "CT_SYS_ID = ?, CHG_BY = ?, CHG_DATE = ?, ERRC = ?, LSRU_FLAG = ?,  " &
                    "EXCH_COST = ?, LOC_IDR = ?, MSL = ? " &
                "WHERE PARTNO_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getPartno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getPartno()) and !len(trim(arguments.chgPartList.getPartno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getSysType()) and !len(trim(arguments.chgPartList.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getPgmId()) and !len(trim(arguments.chgPartList.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getNoun())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getNoun()) and !len(trim(arguments.chgPartList.getNoun()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getInsBy()) and !len(trim(arguments.chgPartList.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartList.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartList.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getActive()) and !len(trim(arguments.chgPartList.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getSnTracked())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getSnTracked()) and !len(trim(arguments.chgPartList.getSnTracked()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getValid()) and !len(trim(arguments.chgPartList.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getValBy()) and !len(trim(arguments.chgPartList.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartList.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartList.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getWucCd()) and !len(trim(arguments.chgPartList.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getMdsCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getMdsCd()) and !len(trim(arguments.chgPartList.getMdsCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getVersion())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getVersion()) and !len(trim(arguments.chgPartList.getVersion()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getNsn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getNsn()) and !len(trim(arguments.chgPartList.getNsn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getCage())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getCage()) and !len(trim(arguments.chgPartList.getCage()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getNhaId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getNhaId()) and !len(trim(arguments.chgPartList.getNhaId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getConfig())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getConfig()) and !len(trim(arguments.chgPartList.getConfig()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getUnitPrice())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getUnitPrice()) and !len(trim(arguments.chgPartList.getUnitPrice()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getCtSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getCtSysId()) and !len(trim(arguments.chgPartList.getCtSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getChgBy()) and !len(trim(arguments.chgPartList.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartList.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartList.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getErrc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getErrc()) and !len(trim(arguments.chgPartList.getErrc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getLsruFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getLsruFlag()) and !len(trim(arguments.chgPartList.getLsruFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getExchCost())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getExchCost()) and !len(trim(arguments.chgPartList.getExchCost()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getLocIdr())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getLocIdr()) and !len(trim(arguments.chgPartList.getLocIdr()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getMsl())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartList.getMsl()) and !len(trim(arguments.chgPartList.getMsl()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartList.getPartnoId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="PartListDao could not update the following record: #arguments.chgPartList.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string partnoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.PART_LIST " &
                "WHERE PARTNO_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.partnoId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="PartListDao could not delete the following record: Partno_Id[#arguments.partnoId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT PARTNO_ID, PARTNO, SYS_TYPE, PGM_ID, NOUN,  " & 
                    "INS_BY, INS_DATE, ACTIVE, SN_TRACKED, VALID,  " & 
                    "VAL_BY, VAL_DATE, WUC_CD, MDS_CD, VERSION,  " & 
                    "NSN, CAGE, NHA_ID, CONFIG, UNIT_PRICE,  " & 
                    "CT_SYS_ID, CHG_BY, CHG_DATE, ERRC, LSRU_FLAG,  " & 
                    "EXCH_COST, LOC_IDR, MSL " &
                "FROM GLOBALEYE.PART_LIST ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"partnoId")) {
            if (whereClauseFound) {
                local.sql &= " AND PARTNO_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE PARTNO_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.partnoId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"rowId")) {
            if (whereClauseFound) {
                local.sql &= " AND ROWIDTOCHAR(ROWID) = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ROWIDTOCHAR(ROWID) = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.rowId),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
