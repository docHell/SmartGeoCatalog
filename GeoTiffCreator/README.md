# GeoTiffCreator

#### This is an experimental software.
It has been used to create GeoTiff from a csv file created analyzing the displacement time-series map of some italian cities.
It has been selected only one deformation value per year to expect that the relative deformation in one-year is considerably higher than the accuracy of the measurement.



#### Each csv row must be like this

0;0;40.88263;14.30817;0.0;19920608T09:49:13Z

pointless ; pointless;  LATITUDE ; LONGITUDE ; THE VALUE ; THE DATE




In order to create GeoTiff it uses Gdal.

### WHAT U NEED 

To install GDall, I apologize, you need to install Phyton.

##### In ubuntu

The latest version of GDAL are available from UbuntuGIS-Stable PPA which needed to be added to the apt-repository. For this, run:

> sudo add-apt-repository -y ppa:ubuntugis/ppa

Do system upgrade as:

> sudo apt update

> sudo apt upgrade

Then you can install the latest version of GDAL as:

> sudo apt -y install gdal-bin python-gdal (if you are using python 2)

> sudo apt -y install gdal-bin python3-gdal (if you are using python 3)

You can confirm by typing in gdalinfo --version or ogrinfo on your terminal.


### HOW TO USE

* ANALYSE YOU CSV
```typescript
Analysis.getInstance().doAnalysis(filePathToAnalyze,ROWS);
```
Yes, you need to know how many rows you want to analyse ( I told you it is an experimental software ) 

This analysis will provide the bounding box and some other data like the min and max values.

* CREATE GEOJSON FILES

```typescript
GeoJsonCreator.getInstance().createGeoJson(filePathToAnalyze,ROWS,dirPathForGeoJson,maxValue).subscribe( (status : boolean) => {
  if (status) {
    // It ok, now correct the files.
      GeoJsonCreator.getInstance().correctGeoJson(dirPathForGeoJson);
  } else {
    // some errors    
  }
})
```
maxValue is a number provided by the analysis

* CREATE A GEOTIFF FOR EACH GEOJSON ( 1 folder for year ) 
```typescript
GeoTiffCreator.getInstance().createGeoTiff(dirPathOfTheGeoJsonFiles);
```

* MERGE THE GEOTIFF (1 geotiff for year )

widht -> image pixel width
height -> image pixel height
you can use the aspect ratio suggested after the analysis


```typescript
GeoTiffCreator.getInstance().mergeTiff(dirPathOfTheGeoJsonFiles, width, height);

```
