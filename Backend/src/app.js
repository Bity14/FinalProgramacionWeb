import express, { Router } from 'express';
import cors from 'cors';
import { methodsUsers } from './controllers/controller.users.js'; // Asegúrate de tener la ruta correcta para tus controladores
import { methodsTransaction } from './controllers/controller.transaction.js';
import { methodsLoan } from './controllers/controller.loan.js';
import { methodsReports } from './controllers/controller.reports.js';
import authMiddleware from './authMiddleware.js';


const app = express();
const port = 4000;

// Configura CORS
app.use(cors({
    origin: 'http://localhost:3000', // Permite solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Rutas
app.post('/register', methodsUsers.registerUser);
app.post('/sign', methodsUsers.loginUser)
app.get('/details',authMiddleware, methodsUsers.getAccountDetails)
app.post('/transfer',authMiddleware, methodsTransaction.transferFunds)
app.post('/loans',authMiddleware, methodsLoan.loan)
app.get('/reports/debts', authMiddleware, methodsReports.getDebtReport)
app.get('/reports/expenses', authMiddleware, methodsReports.getExpenseReport)
app.get('/reports/income', authMiddleware, methodsReports.getIncomeReport)

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
    
export default app;




// import express from 'express'
// import router from './routes/routes.userRoutes.js';
// import cors from 'cors'

// //creo instancia de express
// const app = express();

// //Defino puerto
// app.set('port', 4000)

// // //importa router
// // app.use('/register', router)
// // app.use('/login', router)
// app.use(router)

// //Config de cors
// app.use(cors({
//     origin :'http://localhost:3000'
// }))

// export default app;
