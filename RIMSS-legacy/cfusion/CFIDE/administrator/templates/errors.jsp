<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title><%=(request.getAttribute("javax.servlet.error.status_code")!=null)? request.getAttribute("javax.servlet.error.status_code"):"Error" %></title>
	<link href="/CFIDE/administrator/templates/assets/style.css" rel="stylesheet"/>
    </head>
    <body>
	<div id="header"></div>
	<div id="spot">
	    <image src="/CFIDE/administrator/templates/assets/spot.png" />
	    <div id="title"><%=(request.getAttribute("javax.servlet.error.status_code")!=null)? request.getAttribute("javax.servlet.error.status_code"):"Error" %></div>
	</div>
	<div id="content">			
		<div id="error">
			The page you are trying to access can not be displayed. Please try again or notify the administrator.			 
		</div>	   
	</div>
    </body>
</html>