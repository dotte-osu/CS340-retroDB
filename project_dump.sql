-- Dummy dump data
-- Create Games table
DROP TABLE IF EXISTS `Games`;
CREATE TABLE `Games` (
 `gameID` int(11) not null AUTO_INCREMENT,
 `gameName` varchar(255) not null,
 `gameReleaseYear` int(11),
 `consoleID` int(11) not null,
 `publisherID` int(11),
  PRIMARY KEY (`gameID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `Games`(`gameName`, `gameReleaseYear`, `consoleID`, `publisherID`) 
VALUES ('Super Mario',1985,1,1),('Dr. Mario 64',2001,2,1),
('Aerobiz Supersonic',1994,3,2),('Sonic the Hedgehog',1991,3,2),
('Sonic Spinball',1993,3,2),('E.T. the Extra-Terrestrial',1982,4,3);


-- Create Publishers table
DROP TABLE IF EXISTS `Publishers`;
CREATE TABLE `Publishers` (
 `publisherID` int(11) not null AUTO_INCREMENT,
 `publisherName` varchar(255) not null,
 `yearFounded` int(11),
 `hqCountry` varchar(255),
 `ceo` varchar(255),
  PRIMARY KEY (`publisherID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `Publishers`(`publisherName`, `yearFounded`, `hqCountry`, `ceo`) 
VALUES ('Nintendo',1889,'Japan','Shuntaro Furukawa'),
('Sega',1960,'Japan','Haruki Satomi'),
('Atari',1972,'United States','Frederic Chesnais');


-- Create Consoles table
DROP TABLE IF EXISTS `Consoles`;
CREATE TABLE `Consoles` (
 `consoleID` int(11) not null AUTO_INCREMENT,
 `consoleName` varchar(255) not null,
 `consoleDeveloper` varchar(255),
 `consoleType` varchar(255),
  PRIMARY KEY (`consoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `Consoles`(`consoleName`, `consoleDeveloper`, `consoleType`) 
VALUES ('Super Nintendo Entertainment System','Nintendo','Home Console'),
('Nintendo 64','Nintendo','Home Console'),
('Sega Genesis','Sega','Home Console'),
('Atari 2600','Atari','Home Console');

-- Create Lists table
DROP TABLE IF EXISTS `Lists`;
CREATE TABLE `Lists` (
  `listID` int(11) NOT NULL AUTO_INCREMENT,
  `listName` varchar(255) NOT NULL,
  `listDescription` varchar(255),
  `lastUpdated` date,
  `createdBy` int(11),  -- TODO: will reference Users table once created
  PRIMARY KEY (`listID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
INSERT INTO `Lists` (`listName`, `listDescription`, `lastUpdated`)
VALUES ('My Favorites', 'My favorite games', '2020-02-02'),
('Want to play', 'all of the games that I want to play', '2020-01-29');

-- Create GamesLists table
DROP TABLE IF EXISTS `GamesLists`;
CREATE TABLE `GamesLists` (
  `listID` int(11) NOT NULL,
  `gameID` int(11) NOT NULL,
  CONSTRAINT `list_fk` FOREIGN KEY (`listID`) REFERENCES `Lists` (`listID`),
  CONSTRAINT `game_fk` FOREIGN KEY (`gameID`) REFERENCES `Games` (`gameID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
INSERT INTO `GamesLists`(`listID`, `gameID`)
VALUES (1,1),(1,2),(1,4),(2,3),(2,5),(2,6)