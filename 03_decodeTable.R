## decode table
## dhemerson.costa@ipam.org.br

## read libraries
library(dplyr)

## avoid sci-notes
options(scipen= 9e3)

## read table
data <- read.csv('./table/vegSec_trajectories_byAge.csv')

## decode pixel value
data$from_id <- data$pixelValue %% 100
data$age <- as.integer((data$pixelValue / 100)) %% 100
data$to_id <- as.integer(as.integer((data$pixelValue / 100)) / 100)

## remove from with native 
data <- subset(data, from_id != 3 & from_id != 4 & from_id != 5 & from_id != 6 & from_id != 49 & from_id != 11 &
                 from_id != 12 & from_id != 32 & from_id != 29 & from_id != 50 & from_id != 13)

## translate table
data <- data %>%
  mutate(to_id = case_when(
    to_id == 3 ~ "Forest Formation",
    to_id == 4 ~ "Savanna Formation",
    to_id == 11 ~ "Wetland",
    to_id == 12 ~ "Grassland",
    to_id == 29 ~ "Rocky Outcrop",
    to_id == 5 ~ "Mangrove",
    to_id == 32 ~ "Hypersaline Tidal Flat",
    to_id == 6 ~ "Floodable Forest",
    TRUE ~ as.character(to_id)
  ))

data <- data %>%
  mutate(from_id = case_when(
    from_id == 15 ~ "Pasture",
    from_id == 25 ~ "Other non Vegetated Areas",
    from_id == 33 ~ "River, Lake and Ocean ",
    from_id == 9 ~ "Forest Plantation",
    from_id == 21 ~ "Mosaic of Uses",
    from_id == 24 ~ "Urban Area ",
    from_id == 39 ~ "Soybean",
    from_id == 41 ~ "Other Temporary Crops ",
    from_id == 20 ~ " Sugar cane",
    from_id == 30 ~ "Mining",
    from_id == 46 ~ "Coffee",
    from_id == 47 ~ "Citrus",
    from_id == 48 ~ "Other Perennial Crops",
    from_id == 40 ~ "Rice",
    from_id == 62 ~ "Cotton",
    from_id == 23 ~ "Beach, Dune and Sand Spot ",
    TRUE ~ as.character(from_id)
  ))

## remove unused columns
data <- data %>% select(-system.index, -.geo, -variable, -pixelValue)

## export
write.csv(data, './table/decodedTable.csv')
