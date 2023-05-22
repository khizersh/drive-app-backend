const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const UserRoute = require("./routes/users");
const FolderRoute = require("./routes/folder");



const app = express();
const cors = require("cors");

const username = "bigbeat";
const password = "bigbeat123";
const cluster = "<cluster name>";
const dbname = "drive-app";



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  next();
});


app.use("/user", UserRoute);
app.use("/folder", FolderRoute);


// const mongoUrl = `mongodb+srv://${username}:${password}@cluster0.a1hrtd3.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const mongoUrl = `mongodb://${username}:${password}@ac-vwmr06o-shard-00-00.a1hrtd3.mongodb.net:27017,ac-vwmr06o-shard-00-01.a1hrtd3.mongodb.net:27017,ac-vwmr06o-shard-00-02.a1hrtd3.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-drspkn-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.set('strictQuery', false)
mongoose.connect(
  mongoUrl,
  async(err)=>{
      if(err) throw err;
      console.log("conncted to db")
  }
)

// mongoose.connect(mongoUrl, {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });

// const server = http.createServer(app);
app.listen(port, () => console.log(`Listening on port ${port}`));
