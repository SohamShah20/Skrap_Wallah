import { Router } from "express";
import {updatereq,request,getacceptedrequests,getrequests,getdealer,payreceived, feedback,getclosedrequests,getbill,deletereq,getDealerFromRequest,getscraps} from '../controllers/customerController.js';

import express from "express";
import { verifyToken } from "../utils/Verifyuser.js";
const router = express.Router();

router.post('/request',verifyToken,request);
router.put('/payreceived/:id',verifyToken,payreceived);

router.get('/getrequests',verifyToken,getrequests);
router.get('/getdealer/:id',verifyToken,getdealer);
router.get('/getacceptedrequests/:id',verifyToken,getacceptedrequests);
router.get('/getclosedrequests/:id',verifyToken,getclosedrequests);
router.get('/getbill/:id',verifyToken,getbill);  
router.post('/feedback/:id',verifyToken, feedback);
router.post('/updatereq/:id',verifyToken,updatereq);
router.delete('/deletereq/:id',verifyToken, deletereq);
router.get('/getscraps',verifyToken, getscraps);
router.get('/getDealerFromRequest/:req_id',verifyToken, getDealerFromRequest);

export default router;