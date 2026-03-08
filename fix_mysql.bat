@echo off
echo XAMPP MySQL Onarimi Basliyor...

set MYSQL_DIR=C:\xampp\mysql
set DATA_DIR=%MYSQL_DIR%\data
set BACKUP_DIR=%MYSQL_DIR%\backup
set CORRUPT_DIR=%MYSQL_DIR%\data_corrupt

echo 1. Mevcut data klasoru data_corrupt olarak adlandiriliyor...
if exist "%CORRUPT_DIR%" (
    rmdir /S /Q "%CORRUPT_DIR%"
)
if exist "%DATA_DIR%" (
    ren "%DATA_DIR%" "data_corrupt"
)

echo 2. Backup klasorunden yeni temiz data klasoru olusturuluyor...
xcopy "%BACKUP_DIR%" "%DATA_DIR%" /E /I /H /Y > nul

echo 3. iBdata1 dosyasi ve proje veritabanlari (sanatci_anisina, test) kopyalaniyor...
copy /Y "%CORRUPT_DIR%\ibdata1" "%DATA_DIR%\ibdata1" > nul
xcopy "%CORRUPT_DIR%\sanatci_anisina" "%DATA_DIR%\sanatci_anisina" /E /I /H /Y > nul
xcopy "%CORRUPT_DIR%\test" "%DATA_DIR%\test" /E /I /H /Y > nul

echo Onarim tamamlandi!
