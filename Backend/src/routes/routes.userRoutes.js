import express from "express";
import cors from 'cors'
import authMiddleware from './authMiddleware.js';
// Importar metodos de los controladores
import { methodsTransaction } from "../controllers/controller.transaction.js";
import { methodsUsers } from "../controllers/controller.users.js";
import { methodsLoan } from "../controllers/controller.loan.js";
import { methodsReports } from "../controllers/controller.reports.js";

const router = express.Router();

router.post("/register",cors({
    origin:'http://localhost:3000'
}), methodsUsers.registerUser);

router.post('/sign', cors({
    origin:'http://localhost:3000'
}),methodsUsers.loginUser);

router.get('/details',cors({
    origin:'http://localhost:3000'
}),authMiddleware,methodsUsers.getAccountDetails)

router.post('/transfer',cors({
    origin:'http://localhost:3000'
}),authMiddleware,methodsTransaction.transferFunds)

router.post('/loans', cors({
    origin:'http://localhost:3000'
}), methodsLoan.loan)

router.get('/reports/debts', cors({
    origin:'http://localhost:3000'
}), methodsReports.getDebtReport)

router.get('/reports/expenses', cors({
    origin:'http://localhost:3000'
}), methodsReports.getExpenseReport)

router.get('/reports/income', cors({
    origin:'http://localhost:3000'
}), methodsReports.getIncomeReport)

export default router;
