DROP KEYSPACE IF EXISTS menuItems;
CREATE KEYSPACE menuItems WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }  AND durable_writes = true;
CREATE TABLE menuItems.dishes (
    restaurant_id int,
    category TEXT,
    subCategory TEXT,
    name TEXT,
    description TEXT,
    price decimal,
    PRIMARY KEY (restaurant_id, category, subCategory)
);

COPY menuItems.dishes (restaurant_id, category, subCategory, name, description, price) FROM '/Users/user01/Desktop/git_tutorial/work/Menu/database/SDC/cassandraMenus.csv' WITH DELIMITER=',' AND HEADER=TRUE;