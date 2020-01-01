var express = require('express'),
    mongoose = require("mongoose"),
    dotenv = require("dotenv"),
    router = express.Router();

dotenv.config();

mongoose.connect(`mongodb+srv://shubhamg931:${process.env.PASS}@cluster0-fuc5u.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true });


var productSchema = mongoose.Schema({
  name:String,
  brand_name: String,
  image:String,
  categories:[String]
});

var Products = mongoose.model("Product",productSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Grofers Product Page' });
});

router.get("/products",function(req,res){
  Products.find({},function(err,outputs){
    if(err)
      console.log("error:" + err);
    else {
      res.send(outputs);
    }
  })
});

router.post("/products", function(req,res){
  Products.create({
    name: req.body.name,
    brand_name: req.body.brand_name,
    image: req.body.image,
    categories: req.body.categories.split(",").map(function(item) {
      return item.trim();
    })
  },function(err,output){
    if(err){
      res.send("Error:" + err);
    }else {
      res.send("Added Successfully");
    }
  })
});

router.get("/products/new", function(req,res){
  res.render("new");
});

router.get("/products/:id", function(req,res){
  Products.findById(req.params.id, function(err,output){
    if(err)
      console.log("ERROR:" + err);
    else {
      res.send(output);
    }
  })
});

router.put("/products/:id", function(req,res){
  var updated = {name: req.body.name,
    image: req.body.image,
    brand_name: req.body.brand_name,
    categories:req.body.categories.split(",").map(function(item) {
      return item.trim();
    })};
  Products.findByIdAndUpdate(req.params.id,updated,function(err,output){
    if(err)
      console.log("Error:" + err);
    else
      res.send(`Updated product with id: ${req.params.id} successfully`);
  });
});

router.delete("/products/:id", function(req,res){
  Products.findByIdAndRemove(req.params.id,function(err){
    if(err)
      console.log("error:" + err);
    else {
      res.send(`Deleted product with id: ${req.params.id}`);
    }
  })
});

module.exports = router;
