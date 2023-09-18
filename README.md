# oooLocalServer
This is base application to edit local file with browser.

## Install(Windows)
Run
```bat
dst/setup/win/install.bat
```

## Start application (Windows)

Run following command and browser page raises.
```bat
node.exe %OOO_LOCAL_SERVER_HOME_BIN% -f "(File Name)" -a "(Application Name)"
```

## HTTP Command

### Load file data
```http
GET /command/load?id=(id)
```

### Save file data
```http
POST /command/save?id=(id)

(Set fild content as body of POST request)
```

### Close file
```http
GET /command/close?id=(id)
```
