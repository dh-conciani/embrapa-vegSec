// export areas per ecoregion
// dhemerson.costa@ipam.org.br

// an adaptation from:
// calculate area of @author João Siqueira

// set input image collection
var data = ee.ImageCollection('users/dh-conciani/embrapa_trajs')
  .mosaic();

// define years to be computed
var bands = ['constant'];

// get ecoregions
var territory =  ee.FeatureCollection('users/dh-conciani/help/embrapa/ecoregions');
territory = ee.Image().paint(territory, 'ID').rename('territory');
Map.addLayer(territory.randomVisualizer());

// change the scale if you need.
var scale = 30;

// define a Google Drive output folder 
var driverFolder = 'AREA-VEGSEC';
                
// Image area in hectares
var pixelArea = ee.Image.pixelArea().divide(10000);

// filter image
var image_i = data;

// Geometry to export
var geometry = 
    ee.Geometry.Polygon(
        [[[-60.68473183504133, -2.2728202272823275],
          [-60.68473183504133, -24.8757864226841],
          [-41.08512246004134, -24.8757864226841],
          [-41.08512246004134, -2.2728202272823275]]], null, false);
      
// convert a complex object to a simple feature collection 
  var convert2table = function (obj) {
    obj = ee.Dictionary(obj);
      var territory = obj.get('territory');
      var classesAndAreas = ee.List(obj.get('groups'));
      
      var tableRows = classesAndAreas.map(
          function (classAndArea) {
              classAndArea = ee.Dictionary(classAndArea);
              var classId = classAndArea.get('class');
              var area = classAndArea.get('sum');
              var tableColumns = ee.Feature(null)
                  .set('ecoregion', territory)
                  .set('pixelValue', classId)
                  .set('area', area);
              return tableColumns;
          }
      );
  
      return ee.FeatureCollection(ee.List(tableRows));
  };
  
  // compute the area
  var calculateArea = function (image, territory, geometry) {
      var territotiesData = pixelArea.addBands(territory).addBands(image)
          .reduceRegion({
              reducer: ee.Reducer.sum().group(1, 'class').group(1, 'territory'),
              geometry: geometry,
              scale: scale,
              maxPixels: 1e12
          });
          
      territotiesData = ee.List(territotiesData.get('groups'));
      var areas = territotiesData.map(convert2table);
      areas = ee.FeatureCollection(areas).flatten();
      return areas;
  };
  
// perform per year 
  var areas = bands.map(
      function (band_i) {
          var image = image_i.select(band_i);
            
          var areas = calculateArea(image, territory, geometry);
          // set additional properties
          areas = areas.map(
              function (feature) {
                  return feature.set('variable', band_i);
              }
          );
          return areas;
      }
  );
  
// apply function
areas = ee.FeatureCollection(areas).flatten();

// export 
Export.table.toDrive({
      collection: areas,
      description: 'vegSec_trajectories_byAge',
      folder: driverFolder,
      fileFormat: 'CSV'
});
