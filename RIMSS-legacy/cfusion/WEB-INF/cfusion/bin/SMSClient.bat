@echo off

setlocal
set CFUSION_HOME=
if "%CFUSION_HOME%"=="" goto err_cfusion_home

rem Sets JAVACMD
CALL %CFUSION_HOME%\bin\findjava.bat

%JAVACMD% -jar %CFUSION_HOME%\lib\smpp.jar 
goto end

:err_cfusion_home
echo.
echo CFUSION_HOME not set.  Please set CFUSION_HOME to your CFMX root directory

endlocal

:end
