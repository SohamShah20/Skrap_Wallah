import { Router } from "express";
import {updatereq,request,getacceptedrequests,getrequests,getdealer,payreceived, feedback,getclosedrequests,getbill,deletereq,getDealerFromRequest,getscraps} from '../controllers/customerController.js';

import express from "express";
import { verifyToken } from "../utils/Verifyuser.js";
const router = express.Router();

router.post('/request',verifyToken,request);
router.put('/payreceived/:id',verifyToken,payreceived);

router.get('/getrequests/:id',getrequests);
router.get('/getdealer/:id',getdealer);
router.get('/getacceptedrequests/:id',getacceptedrequests);
router.get('/getclosedrequests/:id',getclosedrequests);
router.get('/getbill/:id',getbill);  
router.post('/feedback/:id',verifyToken, feedback);
router.post('/updatereq/:id',verifyToken,updatereq);
router.delete('/deletereq/:id',verifyToken, deletereq);
router.get('/getscraps', getscraps);
router.get('/getDealerFromRequest/:req_id', getDealerFromRequest);

export default router;