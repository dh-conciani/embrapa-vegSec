
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


