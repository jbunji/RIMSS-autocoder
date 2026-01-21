@echo off

setlocal

rem Sets JAVACMD
CALL findjava.bat

%JAVACMD% -cp cf-passwordreset.jar com.adobe.coldfusion.passwordreset.PasswordReset

endlocal

