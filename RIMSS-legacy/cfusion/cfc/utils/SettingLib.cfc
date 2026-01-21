<cfcomponent displayname="SettingLib" hint="Library for setting Page Processing Tags" output="false">
    <cffunction name="init" output="false">
        <cfreturn this />
    </cffunction>

    <cffunction name="setEnableCfOutputOnly" output="false">
        <cfargument name="enableCfOutputOnly" required="true" type="boolean" />
        <cfsetting enableCfOutputOnly = "#arguments.enableCfOutputOnly#" />
    </cffunction>

    <cffunction name="setRequestTimeout" output="false">
        <cfargument name="requestTimeout" required="true" type="numeric" />
        <cfsetting requestTimeout = "#arguments.requestTimeout#" />
    </cffunction>

    <cffunction name="setShowDebugOutput" output="false">
        <cfargument name="showDebugOutput" required="true" type="boolean" />
        <cfsetting showDebugOutput = "#arguments.showDebugOutput#" />
    </cffunction>
</cfcomponent>