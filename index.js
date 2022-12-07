const express = require('express')
const mongoose = require('mongoose')
const TodoTask = require('./models/TodoTask')
const app = express()

//connection
//mongoose.set('useFindAndModify',false)
mongoose.connect('mongodb+srv://username:nqqnAJpXCnzbor86@cluster0.dzj4ry5.mongodb.net/todo', { useNewUrlParser: true }, () => {
    console.log("Connected to database...")

    app.listen(3000, () => {
        console.log("Server Up...")
    })

})

app.use('/static', express.static("public"))
app.use(express.urlencoded({ extended: true }))


app.set('view-engine', "ejs")

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    })
    try {
        await todoTask.save()
        res.redirect('/')
    } catch (err) {
        res.redirect('/')
    }
})
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
