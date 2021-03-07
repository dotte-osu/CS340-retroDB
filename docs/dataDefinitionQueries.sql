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

-- insert dummy data
INSERT INTO `Publishers`(`publisherName`, `yearFounded`, `hqCountry`, `ceo`) 
VALUES ('Nintendo',1889,'Japan','Shuntaro Furukawa'),
('Sega',1960,'Japan','Haruki Satomi'),
('Capcom',1979,'Japan','Kenzo Tsujimoto'),
('Electronic Arts',1982,'United States','Andrew Wilson'),
('Atari',1972,'United States','Frederic Chesnais');


-- Create Consoles table
DROP TABLE IF EXISTS `Consoles`;
CREATE TABLE `Consoles` (
 `consoleID` int(11) not null AUTO_INCREMENT,
 `consoleName` varchar(255) not null,
 `consoleReleaseYear` int(11),
 `consoleDeveloper` varchar(255),
 `consoleType` varchar(255),
  PRIMARY KEY (`consoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
INSERT INTO `Consoles`(`consoleName`, `consoleReleaseYear`, `consoleDeveloper`, `consoleType`) 
VALUES ('Super Nintendo Entertainment System',1990,'Nintendo','Home Console'),
('Nintendo 64',1998,'Nintendo','Home Console'),
('Sega Genesis',1989,'Sega','Home Console'),
('PlayStation',1994,'Sony','Home Console'),
('Atari 2600',1977,'Atari','Home Console');

-- Create Games table
DROP TABLE IF EXISTS `Games`;
CREATE TABLE `Games` (
 `gameID` int(11) not null AUTO_INCREMENT,
 `gameName` varchar(255) not null,
 `gameReleaseYear` int(11),
 `consoleID` int(11) not null,
 `publisherID` int(11),
  PRIMARY KEY (`gameID`),
  CONSTRAINT `console_fk` FOREIGN KEY (`consoleID`) REFERENCES `Consoles` (`consoleID`) ON DELETE CASCADE,
  CONSTRAINT `publisher_fk` FOREIGN KEY (`publisherID`) REFERENCES `Publishers` (`publisherID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
INSERT INTO `Games`(`gameName`, `gameReleaseYear`, `consoleID`, `publisherID`) 
VALUES ('Super Mario',1985,1,1),('Dr. Mario 64',2001,2,1),
('Aerobiz Supersonic',1994,3,2),('Sonic the Hedgehog',1991,3,2),
('Sonic Spinball',1993,3,2),('E.T. the Extra-Terrestrial',1982,5,5);

-- Create Users table
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `userID` int(11) AUTO_INCREMENT NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255),
  `lastName` varchar(255),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY(`userID`),
  CONSTRAINT UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
-- NOTE: These user do not work because the real passwords are hashed and these password are not
INSERT INTO `Users`(`username`, `firstName`, `lastName`, `email`, `password`)
VALUES ('test', 'Foo', 'Bar', 'fake@email.io', 'password1'),
('test2', 'Baz', 'Bar', 'fake2@email.io', 'password2'),
('test3', 'Foo', 'Baz', 'fake3@email.io', 'password3');
INSERT INTO `Users` (`username`, `email`, `password`)
VALUES ('noname', 'mystery@aol.com', 'password1'),
('noname2', 'mystery2@aol.com', 'password2');

-- Create Lists table
DROP TABLE IF EXISTS `Lists`;
CREATE TABLE `Lists` (
  `listID` int(11) NOT NULL AUTO_INCREMENT,
  `listName` varchar(255) NOT NULL,
  `listDescription` varchar(255),
  `lastUpdated` date,
  `createdBy` int(11),
  PRIMARY KEY (`listID`),
  CONSTRAINT `createdBy_fk` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
INSERT INTO `Lists` (`listName`, `listDescription`, `lastUpdated`, `createdBy`)
VALUES ('My Favorites', 'My favorite games', '2020-02-02', 1),
('Want to play', 'all of the games that I want to play', '2020-01-29', 2),
('My fav game', 'this is literally the best game ever made', '2020-02-07', 2),
('Mario', 'mario games', '2020-03-06', 1),
('Sonic', 'sanic gaems', '2020-03-06', 3);

-- Create GamesLists table
DROP TABLE IF EXISTS `GamesLists`;
CREATE TABLE `GamesLists` (
  `listID` int(11) NOT NULL,
  `gameID` int(11) NOT NULL,
  CONSTRAINT `list_fk` FOREIGN KEY (`listID`) REFERENCES `Lists` (`listID`) ON DELETE CASCADE,
  CONSTRAINT `game_fk` FOREIGN KEY (`gameID`) REFERENCES `Games` (`gameID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert dummy data
INSERT INTO `GamesLists`(`listID`, `gameID`)
VALUES (1,1),(1,2),(1,4),(2,3),(2,5),(2,6),(3,6),(4,1),(4,2),(5,4),(5,5);
