-- NOTE: The : character will be used to dentoe variables that will
-- have data from the backend programming language

-- Query for Home page table 
select * 
from Games g 
join Publishers p on g.publisherID = p.publisherID 
join Consoles c on c.consoleID = g.consoleID 
limit 5;


-- Query for BROWSE page
-- example for :userSelectedFilterType will be “publisherName”, gameName, gameReleaseYear
-- and etc. If a user selects more than one filter, they will be added to this query.
-- For example, if there are 5 filters selected, one “where” and 4 “and” condition will be added.
select gameName, gameReleaseYear, consoleName, consoleType, publisherName, consoleDeveloper
from Games g 
join Consoles c on c.consoleID = g.consoleID
join Publishers p on g.publisherID = p.publisherID
where :userSelectedFilterType = :userSelectedFilter
--if there is more than one filter is selected
and :userSelectedFilterType = :userSelectedFilter


-- Query to get auto generate filters
-- The result tables are not unique nor ordered. They will be sorted in the backend
-- because javascript is faster if the data gets too large.
select distinct gameReleaseYear from Games;
select * from Consoles;
select * from Publishers;


-- Query for Game page
-- This query will be triggered when a user clicks a game name on the Browse table.
select * 
from Games g 
join Publishers p on g.publisherID = p.publisherID 
join Consoles c on c.consoleID = g.consoleID 
where gameName = :gameNameFromBrowsePageTable;


-- Query for Publisher page 
-- This query will be triggered when a user clicks a publisher name on the Browse
-- table or from the Game results page.
Select publisherName, yearFounded, hqCountry from Publishers where publisherName =  :publisherNameFromBrowsePageTable;


-- Query for Console page
-- This query will be triggered when a user clicks a console name on the Browse
-- table or from the Game results page.
Select * from Consoles where consoleName =  :consoleNameFromBrowsePageTable;


-- Query for User page (gets user from username in URI)
SELECT username, firstName, lastName FROM Users WHERE username = :username;


-- Query for User page (gets list from username in URI)
SELECT l.listID, l.listName
FROM Lists l
INNER JOIN Users u ON l.createdBy = u.userID AND u.userID =
(SELECT userID FROM Users WHERE username = :username);


-- Query for Lists page (gets a list of games by listID in query)
SELECT gameName, gameReleaseYear, c.consoleName AS console, p.publisherName AS publisher
FROM Games g
INNER JOIN GamesLists gl on gl.gameID = g.gameID
INNER JOIN Lists l on l.listID = gl.listID
INNER JOIN Consoles c on g.consoleID = c.consoleID
INNER JOIN Publishers p on g.publisherID = p.publisherID
WHERE l.listID = :listID;


-- Query for Lists page (gets a list name by listID in query)
SELECT listName FROM Lists WHERE listID = :listID;


-- Query for Lists page (gets a list description by listID in query)
SELECT listDescription FROM Lists WHERE listID = :listID;


-- Query for List Creation page (gets a list of all games sorted by game name then console name)
SELECT g.gameID, g.gameName, c.consoleName
FROM Games g
LEFT JOIN GamesConsoles gc ON gc.gameID = g.gameID
LEFT JOIN Consoles c ON gc.consoleID = c.consoleID
ORDER BY gameName, consoleName;


-- SELECT queries for Admin page
SELECT * FROM Games;  -- gets a list of all games
SELECT * FROM Consoles;  -- gets a list of all consoles
SELECT * FROM Publishers;  -- gets a list of all publishers
SELECT * FROM Users;  -- gets a list of all users

-- INSERT queries for Admin page
INSERT INTO Games(gameName, gameReleaseYear, consoleID, publisherID)
VALUES (:gameName, :gameReleaseYear, :consoleID, :publisherID);

INSERT INTO Publishers(publisherName, yearFounded, hqCountry, ceo)
VALUES (:publisherName, :yearFounded, :hqCountry, :ceo);

INSERT INTO Consoles(consoleName, consoleDeveloper, consoleType) 
VALUES(:consoleName, :consoleDeveloper, :consoleType);

-- UPDATE queries for Admin page
UPDATE Games
SET gameName=:gameName, gameReleaseYear=:gameReleaseYear, consoleID=:consoleID, publisherID=:publisherID
WHERE gameID = :gameID;

UPDATE Publishers
SET publisherName=:publisherName, yearFounded=:yearFounded, hqCountry=:hqCountry, ceo=:ceo
WHERE publisherID = :publisherID;

UPDATE Consoles
SET consoleName=:consoleName, consoleDeveloper=:consoleDeveloper, consoleType=:consoleType
WHERE publisherID = :publisherID;

UPDATE Users
SET username=:username, firstName=:firstName, lastName=:lastName, email=:email, `password`=:password
WHERE userID = :userID;

-- DELETE queries for Admin page
DELETE FROM Games WHERE gameID = :gameID;
DELETE FROM Consoles WHERE consoleID = :consoleID;
DELETE FROM Publishers WHERE publisherID = :publisherID;
DELETE FROM Users WHERE userID = :userID;


-- DELETE query for Lists page
DELETE FROM Lists WHERE listID = :listID;


-- INSERT query for Register page
INSERT INTO Users(username, firstName, lastName, email, `password`)
VALUES (:username, :firstName, :lastName, :email, :password);