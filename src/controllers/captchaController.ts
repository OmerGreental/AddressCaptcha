import { Request, Response } from "express";
import {analyzeResults, getLocationsPhotoArray} from "../services/captchaService";

export const nearbySearchController = async (req: Request, res: Response) => {
    try {
        const { address } = req.body;

        if (!address) {
            res.status(400).json({ error: "Missing required parameters: address" });
        }

        const places = await getLocationsPhotoArray(address);
        res.json({ places });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const resultAnalysisController = async (req: Request, res: Response) => {
    try {
        const { results } = req.body;
        if (!results) {
            res.status(400).json({ error: "Missing required parameters: results" });
        }

        const answer = analyzeResults(results);
        res.json({ answer });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
