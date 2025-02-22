import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import captchaRoutes from "./routes/captchaRoutes";
import {requestLogger} from "./middlewares/requestLogger";
import {getNearbyPlacesByAddress} from "./utils/apiWrapper";
import {FetchMode} from "./utils/googleMapsApiHelper";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Log requests

// Routes
app.use("/api", captchaRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
