import { Router, Request, Response } from 'express';

const router = Router();

console.log("Prediction route");
router.get('/', (req: Request, res: Response) => {
    console.log("GET /");
    try {
        res.json({message:"Prediction logic"});
    }
    catch (error) {
        console.error('Error fetching transactions from database', error);
    }
})

export default router;