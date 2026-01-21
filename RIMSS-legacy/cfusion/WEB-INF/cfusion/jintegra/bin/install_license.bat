REM Copy jintegra.xml to the %JINTEGRA_HOME%\lib directory.

cd ..\lib
java -cp jintegra.jar com.intrinsyc.license.JintegraLicenseTool clean
java -cp jintegra.jar com.intrinsyc.license.JintegraLicenseTool install
java -cp jintegra.jar com.intrinsyc.license.JintegraLicenseTool view