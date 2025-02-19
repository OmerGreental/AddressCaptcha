import express from "express";
import {nearbySearchController, resultAnalysisController} from "../controllers/captchaController";

const router = express.Router();

router.post("/nearby-search", nearbySearchController);

router.post("/submit-answer", resultAnalysisController);



export default router;
