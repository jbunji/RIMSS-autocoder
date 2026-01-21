@echo off

setlocal

set CFUSION_HOME=%~dp0%\..

rem Sets JAVACMD
CALL %CFUSION_HOME%\bin\findjava.bat

%JAVACMD% -DCFUSION_HOME=%CFUSION_HOME% -cp %CFUSION_HOME%\lib\updates\*;%CFUSION_HOME%\lib\* coldfusion.tools.CfinfoMain %1 %2 %3

endlocal
