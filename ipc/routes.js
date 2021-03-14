const express = require('express');
const router = express.Router();
const Account = require('./models/Account');
const Article = require('./models/Article');
const jwt = require('jsonwebtoken');



// GET: { /all }
// returns all articles, ordered by most recent
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find({});
        const sortedArticles = articles.sort((a, b) => b.lastUpdated - a.lastUpdated);
        res.json(sortedArticles);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


// GET: { /articles/:agency }
// returns all articles in that agency
router.get('/articles/:agency', async (req, res) => {
    try {
        const articles = await Article.find({ author: req.params.agency });
        const sortedArticles = articles.sort((a, b) => b.lastUpdated - a.lastUpdated);
        res.json(sortedArticles);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


// POST: { /article } - use by Delegate
// create article
/*
    {
        title,
        content,
        author
    }
*/
router.post('/article', verifyToken, async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        enabled: 'false',
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle)
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});


// PATCH: { /article/:id }
// edit AND approve article
/*
    {
        title,
        content,
        author,
        enabled
    }
*/
router.patch('/article/:id', verifyToken, getArticle, async (req, res) => {
    
    if (req.body.title != null) {
        res.article.title = req.body.title;
    }
    if (req.body.content != null) {
        res.article.content = req.body.content;
    }
    if (req.body.author != null) {
        res.article.author = req.body.author;
    }
    if (req.body.enabled != null) {
        res.article.enabled = req.body.enabled;
    }

    try {
        const updatedArticle = await res.article.save();
        res.json(updatedArticle);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
});


// GET: { /article/:id }
// returns that single article
router.get('/article/:id', getArticle, async (req, res) => {
    res.status(200).json(res.article);
});


// DELETE: { /article/:id }
router.delete('/article/:id', verifyToken, getArticle, async (req, res) => {
    try {
        await res.article.remove();
        res.json({
            message: 'Article deleted successfully.'
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
});


// GET: { /auth/login }
// logins user/returns jwtToken
/*
    {
        username,
        password
    }
*/
router.post('/auth/login', async (req, res) => {
    // Check if email exists
    const accountInDB = await Account.findOne({username: req.body.username});
    if(!accountInDB) return res.status(400).json({
        message: 'Username or password is wrong'
    });
    
    // Check if password is valid
    const validPass = (accountInDB.password === req.body.password);
    if(!validPass) return res.status(400).json({
        message: 'Username or password is wrong'
    });

    
    // Makes pass -- Now, create and assign a token
    const token = jwt.sign({
        // information that will be available for user
        name: accountInDB.name,
        username: accountInDB.username
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});


// POST: { /auth/account }
// create an account
router.post('/auth/account', async (req, res) => {
    const account = new Account({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    try {
        const newAccount = await account.save();
        res.status(201).json(newAccount)
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});


module.exports = router;


// Middleware: Gets Article
async function getArticle(req, res, next) {
    let article;

    try {
        article = await Article.findById(req.params.id);
        if (article == null) {
            return res.status(404).json({
                message: `Cannot find article with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.article = article;
    next();
}


// Middleware: Verify token
async function verifyToken (req, res, next) {
    const token = req.header('auth-token'); // checks if there is this header
    if(!token) return res.status(401).send('Not authorized... like at all.');

    try { 
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.tokenData = verified;
    } catch (error) {
        res.status(400).send('Invalid token... what is this funny business!?');
    }
    next();
}