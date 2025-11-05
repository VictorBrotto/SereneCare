@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set ERROR_CODE=0

set MAVEN_PROJECTBASEDIR=%~dp0

if not "%MAVEN_PROJECTBASEDIR%"=="" (
  set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%
)

set MAVEN_CMD_LINE_ARGS=%*

set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

if exist %WRAPPER_JAR% (
  "%JAVA_HOME%\bin\java" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" ^
    -cp %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
) else (
  echo Could not find %WRAPPER_JAR%
  echo Please run "mvn -N io.takari:maven:wrapper" to generate the Maven wrapper.
  set ERROR_CODE=1
)

exit /B %ERROR_CODE%
