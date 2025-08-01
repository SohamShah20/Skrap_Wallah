import { Router } from "express";
import {createdealer, setPrice,getdealers,dealeradmin} from '../controllers/adminController.js';
import express from "express";
import { verifyToken } from "../utils/Verifyuser.js";
const router = express.Router();

router.post('/createdealer',verifyToken,createdealer);
router.post('/setprice',verifyToken, setPrice);
router.get('/getdealers',verifyToken, getdealers);
router.get('/dealeradmin/:id',verifyToken, dealeradmin);

export default router;