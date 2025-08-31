@echo off
rem This command prevents the commands themselves from being displayed, only their output.

setlocal enabledelayedexpansion
rem This enables a feature called "delayed expansion", which allows us to use variables that change inside a loop.

rem Get the directory where this batch file is located.
set "base_dir=%~dp0"

rem The /R in the for loop makes it recursive. It will search in the base_dir and all of its subdirectories.
for /R "%base_dir%" %%F in (*.gpkg) do (
    echo Processing file: "%%F"
    
    rem Create the output filename by replacing .gpkg with .geojson
    set "geojson_file=%%~dpnF.geojson"
    
    rem Run the ogr2ogr conversion command.
    rem The -f GeoJSON specifies the output format.
    ogr2ogr -f GeoJSON "!geojson_file!" "%%F"
    
    rem Check if the conversion was successful before deleting the original file.
    if !errorlevel! equ 0 (
        echo Converted to: "!geojson_file!"
        echo Deleting original file: "%%F"
        del "%%F"
    ) else (
        echo ERROR: Failed to convert "%%F". Original file not deleted.
    )
)

echo.
echo Conversion complete.
pause
rem Pauses the script to show the output before closing the window. 