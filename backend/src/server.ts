import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import transactionRoutes from './routes/transactions';
import predictionRoutes from './routes/prediction.route';
import { pipeline } from '@xenova/transformers';

//console.dir(predictionRoutes);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use('/api/prediction', predictionRoutes);
app.use('/api/transactions', transactionRoutes);
//const classifier = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli');

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});