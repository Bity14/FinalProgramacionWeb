import { getConnection } from "../database/database.js";

const loan = async (req, res) => {
    let connection;
    try {
        // Establecer la conexión con la base de datos
        connection = await getConnection();

        // Obtener el número de cuenta del usuario (del token de autenticación), el monto solicitado y el plazo
        const userId = req.user.userNumAcc; 
        const { amount, term } = req.body;

        // Verificar que el monto sea positivo y el plazo sea válido
        if (amount <= 0) {
            return res.status(400).json({ message: 'El monto del préstamo debe ser mayor a cero.' });
        }
        if (term <= 0) {
            return res.status(400).json({ message: 'El plazo del préstamo debe ser mayor a cero.' });
        }

        // Verificar si el usuario existe
        const [userResult] = await connection.query(
            'SELECT numeroCuenta, email FROM usuarios WHERE numeroCuenta = ?',
            [userId]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'Cuenta no encontrada.' });
        }

        // Insertar el préstamo en la tabla de préstamos con estado "pendiente"
        await connection.query(
            'INSERT INTO prestamos (cuentaUsuario, monto, plazo, estado) VALUES (?, ?, ?, ?)',
            [userId, amount, term, 'pendiente']
        );

        res.status(200).json({ message: 'Solicitud de préstamo registrada con éxito. Pendiente de aprobación.' });
    } catch (error) {
        console.error('Error al registrar la solicitud de préstamo:', error);
        res.status(500).json({ message: 'Error al registrar la solicitud de préstamo.' });
    }
};

export const methodsLoan = {
    loan
};
