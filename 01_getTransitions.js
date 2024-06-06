// get secondary vegetation age for a reference year and their previous land use 
// dhemerson conciani (dhemerson.costa@ipam.org.br)

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


// 


Map.addLayer(secVeg, {palette: ['red', 'yellow', 'green'], min: 1, max:20}, 'secondary age')
Map.addLayer(destinationClass.randomVisualizer(), {}, 'destination class')
