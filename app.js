//jshint esversion:6

// define JS dependencies
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash"); // lodash: _ lol

const app = express();

app.set('view engine', 'ejs'); // use html/ejs code found in the views folder

// required code for use of bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public")); // location of css code

// global variables

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];

// start of program logic

// run on heroku at: https://blog-ejs-v1.herokuapp.com/
// or locally on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

// home route or endpoint: this route opens home.ejs
app.get("/", function(req, res) {
  // key pair: EJS variable from views : const variable from app.js
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts // pass array of JS objects to home.ejs
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

// post response using bodyParser (post method route)
app.post("/compose", function(req, res) {
  // store data submitted from compose.ejs into js object post
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  // scan the posts array for duplicate titles
  let gotDuplicate = false;
  for (i = 0; i < posts.length; i++) {
    // console.log("length of posts = " + posts.length); // for debug
    // console.log(posts); // for debug
    if (posts[i].title == post.title) {
      gotDuplicate = true; // found a duplicate
      break; // step out of for loop
    };
  };
  if (gotDuplicate) { // found a duplicate
    res.write("<h1>it looks like we have a duplicate title here >>>---> " + req.body.postTitle + "</h1>"); // send back to browser
    res.write("<h2>press the back arrow to preserve your input and re-enter a unique title ...");
    res.send();; // console.log(gotDuplicate); // for debug
  } else { // no duplicates
    posts.push(post); // push js object post to global array definition posts[]
    // console.log(posts); // for debug
    res.redirect("/"); // redirect or goto home route app.get("/")
  };
});

// this is express routing building a dynamic url,
// using the express routing parameter :topic
// for example: from localhost:3000/post/sports
// where sports is substituted into :topic
// the express routing parameters are found in req.params
app.get("/posts/:topic", function(req, res) {
  // console.log(req.params); // for debug
  let topic = _.lowerCase(req.params.topic); // use lodash lowercase method
  let error = ""; // initialize error field
  let pageRendered = false;
  //step thru entire posts array of js objects named post looking for a match to the express routing parameter
  posts.forEach(function(post) {
    let title = _.lowerCase(post.title);
    // console.log(topic, title); // for debug
    if (topic === title) {
      // console.log("match found");  // for debug
      pageRendered = true;
      res.render("post", {
        title: title,
        content: post.content,
        error: error
      });
    }
  });

  // the following if statement prevents the browser from waiting for a response
  // from the server if no match is found
  // if the page is rendered do nothing else send an error
  if (pageRendered) {
    ; // TRUE: the page was rendered, so do nothing
  } else {
    // a matching title was not found so a page was not rendered
    // this will happen if the title was entered manually in error from the url line
    // console.log("no match found"); // for debug
    error = "no match found, try again or press the HOME button to continue ...";
    res.render("post", {
      title: "",
      content: "",
      error: error
    });
  }
});
