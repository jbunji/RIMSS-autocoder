@echo off
rem  Look for a workable Java executable.
rem  This script should find a java executable
rem  and set the env variable JAVACMD to that executable

rem first try standalone jre
set JAVACMD=%CFUSION_HOME%\..\jre\bin\java.exe
if EXIST %JAVACMD% (
    goto runit
)


rem standalone but CFUSION_HOME not defined and in scripts directory
set JAVACMD=..\..\jre\bin\java.exe
if EXIST %JAVACMD% (
    goto runit
)

rem pointed to by JAVA_HOME
if "%JAVA_HOME%"=="" (
	echo JAVA_HOME is not set.  Please set the JAVA_HOME environment variable
	echo to the path of your JDK.
	exit /B
)

set JAVACMD="%JAVA_HOME%\bin\java.exe"
if EXIST %JAVACMD% (
    goto runit
)

set JAVACMD="%JAVA_HOME%\jre\bin\java.exe"
if EXIST %JAVACMD% (
    goto runit
)

echo Unable to find java command. If the script doesn't run, please
echo set the JAVA_HOME environment variable.
set JAVACMD=java

:runit


