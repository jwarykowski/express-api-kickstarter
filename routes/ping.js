'use strict';

const express = require('express');

module.exports = () => {
    const router = new express.Router();

    router.get('/ping', (req, res) => {
        res.status(200).send();
    });

    return router;
};
