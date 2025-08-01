import { Router } from "express";
import express from "express";
import { verifyToken } from "../utils/Verifyuser.js";
import { resetpass,updateuser } from "../controllers/userController.js";
const router = express.Router();

router.post('/resetpass/:id',verifyToken,resetpass);
router.post('/updateuser/:id',verifyToken,updateuser);

export default router;