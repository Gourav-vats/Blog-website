const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

// ---------------------------------------------------------------------

const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// ---------------------------------------------------------------------

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ---------------------- Connecting to MonogDB ------------------------

const mongoDB = "mongodb://localhost:27017/blogsDB";
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const blogsSchema = new mongoose.Schema({
    blogTitle: String,
    blogContent: String,
});

const Blog = mongoose.model("Blog", blogsSchema);

// ---------------------- GET Requests ---------------------------------

app.get("/", (req, res) => {
    Blog.find({}, (err, foundBlogs) => {
        if (!err) {
            res.render("home", {
                homeStartingContent: homeStartingContent,
                postsData: foundBlogs,
            });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/error", (req, res) => {
    res.render("error");
});

app.get("/posts/:postId", (req, res) => {
    Blog.findOne({ _id: req.params.postId }, (err, blog) => {
        if (!err) {
                res.render("post", {
                    titleText: blog.blogTitle,
                    postText: blog.blogContent,
                });
        }
    });
});

// ---------------------- POST Requests---------------------------------

app.post("/compose", (req, res) => {

    Blog.find({}, (err, foundBlogs) => {
        if (!err) {
            var found = 0;
            foundBlogs.forEach((blog) => {
                if (blog.blogTitle == req.body.titleText) {
                    found = 1;
                }
            });

            if (found === 1) {
                res.redirect("/error");
            } else {
                const blog = new Blog({
                    blogTitle: req.body.titleText,
                    blogContent: req.body.postText,
                });

                blog.save((err) => {
                    if (!err) {
                        res.redirect("/");
                    }
                });
            }
        }
    });
});

// ---------------------------------------------------------------------

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
