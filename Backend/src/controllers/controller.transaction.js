// src/controllers/controller.transactions.js
import { getConnection } from "../database/database.js";


const transferFunds = async (req, res) => {

    const userId = req.user.userNumAcc;
    const connection = await getConnection();
    const { toAccount, amount, transactionType } = req.body;


    switch(transactionType){
        case('transfer'):
        try {

           
            const [toAccountResult] = await connection.query(
              'SELECT numeroCuenta FROM usuarios WHERE numeroCuenta = ?',
              [toAccount]
            );
        
            if (toAccountResult.length === 0) {
              return res.status(404).json({ message: 'La cuenta de destino no existe' });
            }
        
            // 1. Verificar el saldo de la cuenta del usuario autenticado
            const [userAccountResult] = await connection.query(
              'SELECT saldo FROM usuarios WHERE numeroCuenta = ?',
              [userId]
            );
        
            const userBalance = userAccountResult[0].saldo ;
            
            if (userBalance < parseFloat(amount)) {
              return res.status(400).json({ message: 'Saldo insuficiente, su saldo:' + userBalance });
            }
            
            // 3. Debitar el monto de la cuenta del usuario
            await connection.query(
              'UPDATE usuarios SET saldo = saldo - ? WHERE numeroCuenta = ?',
              [amount, userId]
            );
        
            // 4. Acreditar el monto en la cuenta de destino
            await connection.query(
              'UPDATE usuarios SET saldo = saldo + ? WHERE numeroCuenta = ?',
              [amount, toAccount]
            );
        
            // 5. Registrar la transacción en la base de datos
            await connection.query(
                'INSERT INTO transacciones (cuenta_origen, cuenta_destino, tipo, monto) VALUES (?, ?, ?, ?)',
                [userId, toAccount, transactionType, amount]
              );
            
            res.status(200).json({ message: 'Transacción realizada con éxito' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al procesar la transacción' });
          }
        break;

        // Para retirar dinero
        case('withdraw'):
        try {
            // 1. Verificar si la cuenta del usuario tiene suficiente saldo
            const [userAccountResultWithdraw] = await connection.query(
                'SELECT saldo FROM usuarios WHERE numeroCuenta = ?',
                [userId]
            );
    
            const userBalanceWithdraw = userAccountResultWithdraw[0]?.saldo;
    
            //  Comprobar si el saldo es suficiente para el retiro
            if (userBalanceWithdraw < amount) {
                return res.status(400).json({ message: 'Saldo insuficiente, su saldo actual es: ' + userBalanceWithdraw });
            }

            if (amount <= 0) {
                return res.status(400).json({ message: 'El monto a retirar debe ser mayor a cero.' });
            }
    
            //  Debita el monto de la cuenta del usuario (retiro)
            await connection.query(
                'UPDATE usuarios SET saldo = saldo - ? WHERE numeroCuenta = ?',
                [amount, userId]
            );
    
            //  Registrar la transacción de retiro en la base de datos
            await connection.query(
                'INSERT INTO transacciones (cuenta_origen, cuenta_destino, tipo, monto) VALUES (?, NULL, ?, ?)',
                [userId, transactionType, amount]
            );
    
            res.status(200).json({ message: 'Retiro realizado con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al procesar el retiro' });
        }
        break;

        case('deposit'):

        try{

            //Verifica que el monto sea mayor a cero
            if (amount <= 0) {
                return res.status(400).json({ message: 'El monto a depositar debe ser mayor a cero.' });
            }


            //Añade el saldo
            await connection.query(
                'UPDATE usuarios SET saldo = saldo + ? WHERE numeroCuenta = ?',
                [amount, userId]
            )

            //Registra la transacción en la base de datos
            await connection.query(
                'INSERT INTO transacciones (cuenta_origen, cuenta_destino, tipo, monto) VALUES (?, NULL, ?, ?)',
                [userId, transactionType, amount]
            );


            res.status(200).json({message: 'Deposito realizado con exito'});

        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Error al procesar el deposito'})
        }

        

    }

  
};



export const methodsTransaction = {
  transferFunds
};