require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//routes
//get all resturants
app.get("/api/v1/resturants", async (req, res) => {
  try {
    // const result = await db.query("SELECT * FROM resturants");
    const resturantRatingData = await db.query(
      "select * from  resturants left join(select resturant_id,COUNT(*),TRUNC(AVG(rating),1) as average_rating from reviews group by resturant_id) reviews on resturants.id=reviews.resturant_id"
    );
    res.status(200).json({
      status: "sucess",
      result: resturantRatingData.rows.length,
      data: { resturants:resturantRatingData.rows },
    });
  } catch (error) {
    console.error(error);
  }
});

//get selected resturants

app.get("/api/v1/resturants/:id", async (req, res) => {
  try {
    const result = await db.query(
      "select * from  resturants left join(select resturant_id,COUNT(*),TRUNC(AVG(rating),1) as average_rating from reviews group by resturant_id) reviews on resturants.id=reviews.resturant_id where id=$1",
      [req.params.id]
    );
    console.log(result);
    const respnse = await db.query(
      "SELECT * FROM reviews WHERE resturant_id=$1",
      [req.params.id]
    );

    res.status(200).json({
      status: "sucess",

      data: { resturant: result.rows, review: respnse.rows },
    });
  } catch (error) {
    console.error(error.message);
  }
});

//create resturants
app.post("/api/v1/resturants/", async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO resturants (name, location, price_range) VALUES ($1,$2,$3) RETURNING * ",
      [req.body.name, req.body.location, req.body.price_range]
    );
    console.log(result, "fjghrjgrg");

    res.status(201).json({
      data: {
        resturant: result.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

//Upadate

app.put("/api/v1/resturants/:id", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE resturants SET name=$1,location=$2,price_range=$3 WHERE id=$4 RETURNING * ",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    console.log(result, "fjghrjgrg");

    res.status(201).json({
      data: {
        resturant: result.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

//delete

app.delete("/api/v1/resturants/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(" DELETE FROM resturants WHERE id=$1", [
      req.params.id,
    ]);
    if (!result.length) {
      res.json({
        message: "no resturanyt found",
      });
    }
    res.status(201).json({
      message: "deleted sucess fully",
    });
  } catch (error) {
    console.error(error.messag);
  }
});

// Review

// app.post("/api/v1/resturants/:id/reviews", async (req, res) => {
//   try {
//     const respnse = await db.query("SELECT * FROM reviews WHERE id=$1", [
//       req.params.id,
//     ]);

//     res.status(200).json({
//       data: {
//         reviews: respnse.rows
//       },
//     });
//   } catch (error) {
//     console.error(error.messag);
//   }
// });a[[[]]]
//[pst Review ]
app.post("/api/v1/resturants/:id", async (req, res) => {
  console.log("heerer", req.body);
  try {
    const response = await db.query(
      "INSERT INTO reviews(resturant_id,name,reviews,rating) VALUES($1,$2,$3,$4) RETURNING * ",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(response);
    res.status(201).json({
      data: {
        review: response.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const Port = process.env.PORT || 3001;
app.listen(Port, () => {
  console.log(`server running on porr ${Port}`);
});
