// get secondary vegetation age for a reference year and their previous land use 
// dhemerson conciani (dhemerson.costa@ipam.org.br)

// load ecoregions
var ecoregions = ee.FeatureCollection('users/dh-conciani/help/embrapa/ecoregions');

// read mapbiomas collection
var collection = ee.Image('projects/mapbiomas-workspace/public/collection8/mapbiomas_collection80_integration_v1');

// read secondary vegetation age
var secVeg = ee.Image('projects/mapbiomas-workspace/public/collection8/mapbiomas_collection80_secondary_vegetation_age_v2');

// set reference year
var year = 2021;

// get secondary vegetation for the reference year
var secVeg = secVeg.select('secondary_vegetation_age_' + year)
  .selfMask();

// get class in the reference year
var destinationClass = collection.select('classification_' + year)
  .updateMask(secVeg);
  
// get year of transition
var transitionYear = ee.Image(year - 1).subtract(secVeg).selfMask();

// set list of years to be assessed
var yearsList = ee.List.sequence({'start': 1985, 'end': year}).getInfo();

// create empty recipe
var sourceClass = ee.Image(0);
// for each year
yearsList.forEach(function(year_i) {
  // get mask
  var mask = transitionYear.updateMask(transitionYear.eq(year_i));
  // get class
  var x = collection.select('classification_' + year_i)
    .updateMask(mask);
  // store
  sourceClass = sourceClass.blend(x).selfMask();
});

// combine layers into a single image
var output = ee.Image(0)
  .add(destinationClass).multiply(100)
    .add(secVeg).multiply(100)
      .add(sourceClass);

// export
Export.image.toAsset({
    "image": output.toInt32(),
    "description": 'secondary_vegetation_trajs_by_age_v1',
    "assetId": 'users/dh-conciani/embrapa_trajs/secondary_vegetation_trajs_by_age_v1',
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": ecoregions.geometry()
});  


// import the color ramp module from mapbiomas 
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 62,
    'palette': palettes.get('classification7')
};

Map.addLayer(destinationClass, vis, 'destination class');
Map.addLayer(secVeg, {palette: ['red', 'yellow', 'green'], min: 1, max:20}, 'secondary age');
//Map.addLayer(transitionYear.randomVisualizer(), {}, 'transition year')
//Map.addLayer(collection, {}, 'collection', false);
Map.addLayer(sourceClass, vis, 'source class');
Map.addLayer(output.randomVisualizer(), {}, 'output', false)
