// compute secondary vegetation and deforestation by cerrado ecoregion
// dhemerson.costa@ipam.org.br

// read mapbiomas secondary vegetation
var sec_veg = ee.Image('projects/mapbiomas-workspace/public/collection8/mapbiomas_collection80_deforestation_secondary_vegetation_v2'); 

// define years
var years = [1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 
             1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
             2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
             2021, 2022];

// build recipe
var recipe = ee.Image([]);

// remap collection to get classes
// 1. antropico  
// 2. veg. primaria
// 3. veg. secundaria
// 4. supressao veg. primaria
// 5. recuperaçao para veg. secundaria
// 6. supressão de veg secundaria
// 7. outras transições
years.forEach(function(year_i) {
  recipe = recipe.addBands(
    sec_veg.select('classification_' + year_i).divide(100).round()
         .rename('classification_' + year_i));
});

Map.addLayer(recipe.select('classification_2021'), {palette: [
  '#F9D232', '#3B6D0D', '#98F145', '#FA0000', '#767A7A', '#EA7514', '#005DFF'], min:1, max:7}, 'recipe')
