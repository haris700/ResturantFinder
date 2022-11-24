CREATE TABLE resturants(
    id  BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    location VARCHAR(250) NOT NULL,
    price_range INT NOT NULL check(price_range>=1 and price_range<=5)

    
);

CREATE TABLE reviews(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    resturant_id  BIGINT NOT NULL REFERENCES  resturants(id),
    name VARCHAR(250) NOT NULL,
    reviews TEXT NOT NULL,
    rating INT check(rating >=1 and rating <=5)
);
INSERT INTO resturants(id,name,location,price_range) values(12,'shanubakes','chennai',10000);