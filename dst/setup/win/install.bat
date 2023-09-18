cd /d %~dp0
cd ../..
setx OOO_LOCAL_SERVER_HOME "%CD%"
setx OOO_LOCAL_SERVER_HOME_BIN "%CD%\script\main.js"
