const express = require('express');
const router = express.Router();
const CTRL = global.CTRL;

router.get('/', (req, res) => {
    CTRL.emit('index/get', req.session)
    .then(data => res.render('pages/index', data))
    .catch(error => res.render('pages/error', { message: error.message }));
});

router.get('/login', (req, res) => {
    CTRL.emit('login/get', req.session)
    .then(data => {
        if (data.isAuthorized)
            res.redirect('/admin');
        else
            res.render('pages/login');
    })
    .catch(error => res.render('pages/error', { message: error.message }));
});

router.get('/admin', (req, res) => {
    CTRL.emit('admin/get', req.session)
    .then(data => {
        if (!data.isAuthorized)
            res.redirect('/login');
        else {
            res.render('pages/admin', data);
        }
    })
    .catch(error => res.render('pages/error', error))
});

router.post('/', (req, res) => {
    CTRL.emit('index/post', req.body)
    .then(() => res.redirect('/'))
    .catch(error => res.status(error.status || 400).render('pages/error', error))
});

router.post('/login', (req, res) => {
    CTRL.emit('login/post', req.body)
    .then(data => {
        if (data.isAuthorized){
            req.session.isAuthorized = true;
            res.redirect('/admin');
        }
    })
    .catch(error => res.status(error.status || 400).render('pages/error', error))
});

router.post('/admin/skills', (req, res) => {
    CTRL.emit('admin/skills', req.body)
    .then(() => res.redirect('/admin'))
    .catch(error => res.status(error.status || 400).render('pages/error', error))
});

router.post('/admin/upload', (req, res) => {
    CTRL.emit('admin/upload', req)
    .then(() => res.redirect('/admin'))
    .catch(error => res.status(error.status || 400).render('pages/error', error))
});

router.get('/favicon.ico', (req, res) => {
    res.status(204);
    res.end();
});

module.exports = router;
