import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import transactionRoutes from './routes/transactions';
import predictionRoutes from './routes/prediction';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use('/api/predictions', predictionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});