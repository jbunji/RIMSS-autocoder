import cfc.dao.DBUtils;

import cfc.utils.Datasource;

component  displayname="DropDownDao" hint="Provides queries to populate drop downs in CFM page." {
    variables.instance = {};
    variables.instance.datasource = "";
    variables.instance.dbUtils = "";
    variables.instance.objectFactory = "";

    public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;

        return this;
    }
    
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    public any function getDBUtils(){
       if(isSimpleValue(variables.instance.dbUtils)){
           variables.instance.dbUtils = getObjectFactory().create("DbUtils");    
        }       
       return variables.instance.dbUtils;      
    }
    
    public Array function getActsStatus() {
        var sql = "select code_id, code_value, ct_code_id " &
                  "from globaleye.code " &
                  "where code_id in (select code_id " &
                                     "from globaleye.code_group " &
                                     "where group_cd = (select code_id from globaleye.code where code_type = 'GROUP' and code_value = 'ACTS_STATUS')) " &
                   "and CT_CODE_ID is not null " &                                     
                   "order by code_value";
        var qry = new Query();
        var status = ArrayNew(2);
        var results = "";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qryStatus");
        local.qry.setSql(local.sql);
        /*local.qry.addParam(name="owner",value=ucase(trim(arguments.user)),cfsqltype="cf_sql_varchar");*/
        local.results = local.qry.execute().getResult();
        for (i=1;i lte results.recordcount;i=i+1) {
            ArrayAppend(status[i],results.code_id[i]);
            ArrayAppend(status[i],results.code_value[i]);
            ArrayAppend(status[i],results.ct_code_id[i]);
        }
        return status;
    }
    
    public Array function getProgramStatus(required string program) {
        var sql = "select code_id, code_value " &
                  "from globaleye.code " &
                  "where code_id in (select code_id " &
                                     "from globaleye.code_group " &
                                     "where group_cd = (select code_id from globaleye.code where code_type = 'GROUP' and code_value = :status)) " &
                   "order by code_value";
        var qry = new Query();
        var status = ArrayNew(2);
        var results = "";
        if(application.sessionManager.getMaintLevelSetting() EQ "DEPOT") {
        	var programStatus = ucase(trim(ARGUMENTS.program)) & "_DEPOT_STATUS";
        	local.qry.setDatasource(variables.instance.datasource.getDsName());
        	local.qry.setName("qryStatus");
        	local.qry.setSql(local.sql);
        	local.qry.addParam(name="status",value=programStatus,cfsqltype="cf_sql_varchar");
        	local.results = local.qry.execute().getResult();       	
        	
        	if(!local.results.recordcount){
            	local.qry.clearParams();
            	local.qry.addParam(name="status",value="DEPOT_STATUS",cfsqltype="cf_sql_varchar");
            	local.results = local.qry.execute().getResult();    
        	}	
        } else {
        	var programStatus = ucase(trim(ARGUMENTS.program)) & "_STATUS";
        	local.qry.setDatasource(variables.instance.datasource.getDsName());
        	local.qry.setName("qryStatus");
        	local.qry.setSql(local.sql);
        	local.qry.addParam(name="status",value=programStatus,cfsqltype="cf_sql_varchar");
        	local.results = local.qry.execute().getResult();
        	
        	if(!local.results.recordcount){
            	local.qry.clearParams();
            	local.qry.addParam(name="status",value="ACTS_STATUS",cfsqltype="cf_sql_varchar");
            	local.results = local.qry.execute().getResult();    
        	}	
        }
        
        for (local.i=1;local.i <= results.recordcount;local.i++) {
            ArrayAppend(status[local.i],results.code_id[local.i]);
            ArrayAppend(status[local.i],results.code_value[local.i]);
        }
        return status;
    }
    
    public Array function getProgramPartStatus(required string program) {
        var sql = "select code_id, code_value " &
                  "from globaleye.code " &
                  "where code_id in (select code_id " &
                                     "from globaleye.code_group " &
                                     "where group_cd = (select code_id from globaleye.code where code_type = 'GROUP' and code_value = :status)) " &
                   "order by code_value";
        var qry = new Query();
        var status = ArrayNew(2);
        var results = "";
        var programStatus = ucase(trim(ARGUMENTS.program)) & "_PART_STATUS";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qryStatus");
        local.qry.setSql(local.sql);
        local.qry.addParam(name="status",value=programStatus,cfsqltype="cf_sql_varchar");
        local.results = local.qry.execute().getResult();
        
        if(!local.results.recordcount){
            local.qry.clearParams();
            local.qry.addParam(name="status",value="ACTS_PART_STATUS",cfsqltype="cf_sql_varchar");
            local.results = local.qry.execute().getResult();    
        }
        
        for (local.i=1;local.i <= results.recordcount;local.i++) {
            ArrayAppend(status[local.i],local.results.code_id[local.i]);
            ArrayAppend(status[local.i],local.results.code_value[local.i]);
        }
        return status;
    }
    
    public Array function getProgramRepairStatus(required string program) {
        var sql = "select code_id, code_value " &
                  "from globaleye.code " &
                  "where code_id in (select code_id " &
                                     "from globaleye.code_group " &
                                     "where group_cd = (select code_id from globaleye.code where code_type = 'GROUP' and code_value = :status)) " &
                   "order by code_value";
        var qry = new Query();
        var status = ArrayNew(2);
        var results = "";
        var programStatus = ucase(trim(ARGUMENTS.program)) & "_REPAIR_STATUS";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qryStatus");
        local.qry.setSql(local.sql);
        local.qry.addParam(name="status",value=programStatus,cfsqltype="cf_sql_varchar");
        local.results = local.qry.execute().getResult();
        
        if(!local.results.recordcount){
            local.qry.clearParams();
            local.qry.addParam(name="status",value="ACTS_REPAIR_STATUS",cfsqltype="cf_sql_varchar");
            local.results = local.qry.execute().getResult();    
        }
        
        for (local.i=1;local.i <= local.results.recordcount;local.i++) {
            ArrayAppend(status[i],local.results.code_id[local.i]);
            ArrayAppend(status[i],local.results.code_value[local.i]);
        }
        return status;
    }
    
    public query function getNouns(required string program, string partnoId=""){
        var local = {};

        local.qry = new Query();
       local.qry.setName("qNouns");
       local.qry.setDatasource(variables.instance.datasource.getDsName());
       local.qryResult = "";
       //local.partNoIdClause = IsNumeric(ARGUMENTS.partNoId) && ARGUMENTS.partNoId ? " AND p.partnoId = :partNoId " : "";
       
        /*local.sql = "
            SELECT DISTINCT(p.noun) noun
            FROM globaleye.part_list p,
              globaleye.asset a,
              globaleye.code c
            WHERE p.partno_id = a.partno_id
            AND a.sys_id = :sysId  
            AND p.sys_type = c.code_id(+)
            AND UPPER(TRIM(c.code_value)) = 'PART'
            AND a.nha_asset_id is null
            #local.partNoIdClause#
            AND p.active = 'Y'
            AND a.active = 'Y'
            order by p.noun
        ";
        */
        
        local.sql = "SELECT DISTINCT noun--, pgm_id
                  FROM globaleye.part_list pl0, globaleye.code c0
                  WHERE partno_id IN
                    (SELECT partno_c
                    FROM globaleye.cfg_list
                      START WITH partno_p IN
                      (SELECT partno_id
                      FROM globaleye.part_list pl1,
                        globaleye.code c1,
                        globaleye.code c2
                      WHERE pl1.pgm_id   = c1.code_id
                      AND UPPER(TRIM(c1.code_value))  = :program
                      AND pl1.sys_type   = c2.code_id
                      AND c2.code_value != 'PART'
                      )
                      CONNECT BY nocycle prior partno_c = partno_p
                    )
                  AND noun NOT IN
                 (SELECT noun
                    FROM globaleye.part_list pl,globaleye.partno_code pc, code c
                   WHERE pl.partno_id = pc.partno_id
                         AND c.CODE_ID = pc.group_cd
                         AND c.code_value IN ('BIT_PC', 'NSP'))
                  and pl0.pgm_id = c0.code_id
                  and c0.code_value = :program
                  and pl0.active = 'Y'    
                  ORDER BY 1
        ";
        
        local.qry.addParam(name="program", value="#UCASE(TRIM(ARGUMENTS.program))#",cfsqltype="CF_SQL_VARCHAR"); 
        //local.qry.addParam(name="partnoId", value="#val(ARGUMENTS.partNoId)#",cfsqltype="CF_SQL_NUMERIC"); 
        local.qry.setSQL(local.sql);
        local.qryResult = local.qry.execute().getResult();
        
        return local.qryResult;                    
   }       
   
   public query function getPartsByNounPart(string noun="", partNoId=""){
        var local = {};
        local.clauses = [];
        local.clauseString = "";
        local.nounClause = Len(trim(ARGUMENTS.noun)) ? " AND UPPER(TRIM(noun)) = :noun " : "";
        local.partnoClause = Len(trim(ARGUMENTS.partNoId)) ? " AND TRIM(partno_id) = :partnoId " : "";
        
        if(Arraylen(local.clauses)){
            local.clauseString = " WHERE " & ArrayToList(local.clauses," AND ");    	
        }
        
        
        
       //local.partnoCodeService = application.objectFactory.create("PartnoCodeService");
       //local.partnoIdList = local.partnoCodeService.getPartnoIdAsValueListByProgram(val(ARGUMENTS.programId));
        
        local.qry = new Query();
       local.qry.setName("qNouns");
       local.qry.setDatasource(variables.instance.datasource.getDsName());
       local.qryResult = "";
       
        /*local.sql = "
            SELECT DISTINCT(p.noun),
			  p.partno_id,
			  p.partno,
			  p.nsn
			FROM globaleye.part_list p,
			  globaleye.asset a,
			  globaleye.code c
			WHERE p.partno_id = a.partno_id
			AND a.sys_id = :sysId 
			AND p.sys_type = c.code_id(+)
			AND UPPER(TRIM(c.code_value)) = 'PART'
			AND a.nha_asset_id IS NULL
			AND p.active = 'Y' 
			AND a.active= 'Y'  
			#local.nounClause#
			#local.partNoClause#
			ORDER BY p.noun,p.partno,p.nsn
        ";
*/        
        
        local.sql = "
        SELECT DISTINCT partno, partno_id, nsn, loc_idr, noun
		FROM globaleye.part_list
		WHERE partno_id IN
		  (SELECT partno_c
		  FROM globaleye.cfg_list
		    START WITH partno_p IN
		    (SELECT partno_id
		    FROM globaleye.part_list pl1,
		      globaleye.code c1,
		      globaleye.code c2
		    WHERE pl1.pgm_id   = c1.code_id
		    AND c1.code_value  = :program
		    AND pl1.sys_type   = c2.code_id
		    AND c2.code_value != 'PART'
		    )
		    CONNECT BY nocycle prior partno_c = partno_p
		  ) 
		 #local.nounClause#  
		 #local.partnoClause# 
		 and active = 'Y' 
		ORDER BY 1
        
        ";
        
        
        
        /*local.sql = "
            SELECT DISTINCT(partno) partno,
			  partno_id,
			  nsn,
			  loc_idr,
			  site
			FROM
			  (SELECT p.partno_id,
			    p.partno,
			    p.noun,
			    p.nsn,
			    p.loc_idr,
			    site.code_value site
			  FROM globaleye.cfg_list cl,
			    globaleye.cfg_set cs,
			    globaleye.part_list p,
			    globaleye.code c,
			    globaleye.location l,
			    globaleye.code site
			  WHERE cs.cfg_set_id = cl.cfg_set_id
			  AND cl.partno_p = p.partno_id
			  AND p.sys_type = c.code_id
			  AND p.loc_idr = l.loc_id(+)
			  AND l.site_cd = site.code_id(+)
			  AND UPPER(TRIM(c.code_value)) = 'PART'
			  AND cs.pgm_id = :programId
			  AND p.active = 'Y'
			    CONNECT BY nocycle prior cl.partno_c = cl.partno_p
			  )
			 #local.clauseString# 
			ORDER BY partno,
			  nsn
        ";*/
        
        local.qry.addParam(name="program", value="#UCASE(APPLICATION.sessionmanager.getProgramSetting())#",cfsqltype="CF_SQL_VARCHAR"); 
        local.qry.addParam(name="programId", value="#val(application.sessionmanager.getProgramIdSetting())#",cfsqltype="CF_SQL_NUMERIC");  
        local.qry.addParam(name="noun", value="#ucase(trim(ARGUMENTS.noun))#",cfsqltype="CF_SQL_VARCHAR", null=(!len(trim(ARGUMENTS.noun))) ? "true" : "false"); 
        local.qry.addParam(name="partNoId", value="#val(trim(ARGUMENTS.partnoId))#",cfsqltype="CF_SQL_NUMERIC", null=(!len(trim(ARGUMENTS.partNoId))) ? "true" : "false"); 
        local.qry.setSQL(local.sql);
        try{
        local.qryResult = local.qry.execute().getResult();
        }catch(any e){}
        
        return local.qryResult;                    
   } 
   
   
   public Array function getSpareLocations(required string program) {
        var sql = "SELECT loc_id, set_name,display_name " &
                  "FROM globaleye.loc_set " &
                  "where set_name = :program " &
                  "and active = 'Y' " &                  
                   "order by display_name";
        var qry = new Query();
        var locs = ArrayNew(2);
        var results = "";
        var spareLocation = ucase(trim(ARGUMENTS.program)) & "_SPARE_LOCATIONS";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qrySpareLocs");
        local.qry.setSql(local.sql);
        local.qry.addParam(name="program",value=spareLocation,cfsqltype="cf_sql_varchar");
        local.results = local.qry.execute().getResult();
        if(!local.results.recordcount){
        	local.qry.clearParams();
            local.qry.addParam(name="program",value="ACTS_SPARE_LOCATIONS",cfsqltype="cf_sql_varchar");
            local.results = local.qry.execute().getResult();   	
        }

        for (local.i=1;local.i <= local.results.recordcount;local.i++){
            ArrayAppend(locs[i],local.results.loc_id[i]);
            ArrayAppend(locs[i],local.results.display_name[i]);
        }
        return locs;
    }
    
    public Array function getSpareDepotLocations(required string program) {
        var sql = "SELECT loc_id, set_name,display_name " &
                  "FROM globaleye.loc_set " &
                  "where set_name = :program " &
                  "and active = 'Y' " &                  
                   "order by display_name";
        var qry = new Query();
        var locs = ArrayNew(2);
        var results = "";
        var spareLocation = ucase(trim(ARGUMENTS.program)) & "_DEPOT_LOC";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qrySpareDepotLocs");
        local.qry.setSql(local.sql);
        local.qry.addParam(name="program",value="#spareLocation#",cfsqltype="cf_sql_varchar");
        local.results = local.qry.execute().getResult();
        
        if(!local.results.recordcount){
        	local.qry.clearParams();
            local.qry.addParam(name="program",value="ACTS_DEPOT_LOC",cfsqltype="cf_sql_varchar");
            local.results = local.qry.execute().getResult(); 
      
        }

        for (local.i=1;local.i <= local.results.recordcount;local.i++) {
            ArrayAppend(locs[i],local.results.loc_id[local.i]);
            ArrayAppend(locs[i],local.results.display_name[local.i]);
        }
        return locs;
    }
    
    
    public query function getAllLocations(boolean getSquad=false) {
        var sql = " SELECT l.loc_id,
			         majcom.code_value majcom,
			         site.code_value site,
			         unit.code_value unit,
			         squad.code_value squad,
			         l.ct_loc_id,
			         L.SITE_CD
			    FROM globaleye.LOCATION l,
			         globaleye.code majcom,
			         globaleye.code site,
			         globaleye.code unit,
			         globaleye.code squad,
			         core_tables.lu_locations lu
			   WHERE     l.majcom_cd = majcom.code_id
			         AND l.site_cd = site.code_id
			         AND l.unit_cd = unit.code_id
			         AND l.squad_cd = squad.code_id(+)
			         AND l.active = 'Y'
			         AND LU.LOC_ID = L.CT_LOC_ID
			         AND LU.IS_ACTIVE = 'Y' 
			         AND LU.IS_VALID = 'Y' ";
				     
		if (arguments.getSquad) {            
        	local.sql &= " AND l.squad_cd is null ";                        
        }
				     
		sql &= "ORDER BY site, unit, squad ";
        var qry = new Query();
        var locs = ArrayNew(2);
        var results = "";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qryAllLocs");
        local.qry.setSql(local.sql);
        local.results = local.qry.execute().getResult();
        
      
        return local.results;
    }
    
    
    public query function getAllLocationsByBaseUnit() {
        var sql = " SELECT   l.loc_id, majcom.code_value majcom, site.code_value site,
				         unit.code_value unit,  l.ct_loc_id
				    FROM globaleye.LOCATION l,
				         globaleye.code majcom,
				         globaleye.code site,
				         globaleye.code unit
				   WHERE l.majcom_cd = majcom.code_id
				     AND l.site_cd = site.code_id
				     AND l.unit_cd = unit.code_id
				     AND l.squad_cd = squad.code_id(+)
				     AND l.active = 'Y'
				ORDER BY site, unit ";
        var qry = new Query();
        var locs = ArrayNew(2);
        var results = "";
        local.qry.setDatasource(variables.instance.datasource.getDsName());
        local.qry.setName("qryAllLocs");
        local.qry.setSql(local.sql);
        local.results = local.qry.execute().getResult();
        
      
        return local.results;
    }
   
}