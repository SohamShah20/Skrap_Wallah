import { Router } from "express";
import {getrequests,acceptrequests,getacceptedrequests,genreceipt,getclosedrequests,getfeedbacks} from '../controllers/dealerController.js';
import express from "express";
import { verifyToken } from "../utils/Verifyuser.js";
const router = express.Router();

router.get('/getrequests/:id',verifyToken,getrequests);
router.put('/acceptrequests/:id',verifyToken,acceptrequests);
router.post('/genreceipt/:id',verifyToken,genreceipt);
router.get('/getacceptedrequests/:id',verifyToken,getacceptedrequests);
router.get('/getclosedrequests/:id',verifyToken,getclosedrequests);
router.get('/getfeedbacks/:id',verifyToken, getfeedbacks);
export default router;