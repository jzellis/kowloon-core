const mongoose = require('mongoose');
const express = require('express');
const redis = require('redis');
const fs = require("fs");

const Kowloon = require('./src/kowloon.js');

global.__basedir = __dirname;

