CREATE TABLE "player" (
        Id serial PRIMARY KEY,
        Name varchar( 100 )  NOT NULL,
        Salary numeric(18,2) NOT NULL,
        Age integer 
);
CREATE TABLE "tech" (
        Id serial PRIMARY KEY,
        Technoname varchar( 100 ) NOT NULL,
        Category varchar( 100 )   NOT NULL,
        Details varchar( 100 )    NOT NULL
);
