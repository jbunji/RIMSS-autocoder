component  displayname="Datasource" output="false" {
	property name="dsName" type="string" default="";

    variables.instance = {
        dsName = ''
    };

    public any function init(required string dsName) output="false" {
        variables.instance.dsName = arguments.dsName;
        return this;
    }

	public string function getDsName() {
		return variables.instance.dsName;
	}
}