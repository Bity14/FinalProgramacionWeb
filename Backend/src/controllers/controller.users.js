import { getConnection } from "../database/database.js";
import jwt from 'jsonwebtoken';



const registerUser = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log('Conexión exitosa a la base de datos');

        // Obtener datos del cuerpo de la solicitud
        const { nombre, email, contraseña, numeroCuenta, tipo, saldo } = req.body; 
        console.log('Datos recibidos:', req.body);
        
        // Validar que todos los campos estén completos
        if (!nombre || !email || !contraseña || !numeroCuenta || !tipo || saldo === undefined) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Crear la consulta para insertar el usuario en la base de datos
        const query = 'INSERT INTO Usuarios (nombre, email, contraseña, numeroCuenta, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [nombre, email, contraseña, numeroCuenta, tipo, saldo]);

        // Responder al frontend
        res.status(201).json({ message: "Usuario registrado exitosamente", userId: result.insertId });
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).json({ message: "Error en el servidor: " + error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const connection = await getConnection();

        // Obtiene datos del cuerpo de la solicitud
        const { email, contraseña } = req.body;

        // Consulta el usuario en la base de datos por email y contraseña
        const [result] = await connection.query(
            'SELECT * FROM Usuarios WHERE email = ? AND contraseña = ?', 
            [email, contraseña]
        );

        if (result.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Genera un token JWT con el email o ID del usuario
        const user = result[0];
        const token = jwt.sign(
            { userNumAcc: user.numeroCuenta, email: user.email }, 
            'tu_secreto_jwt', 
            { expiresIn: '1h' } // Define el tiempo de expiración del token
        );
        

        // Responder con el token JWT al frontend
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token, // Envía el token en la respuesta
            user: { id: user.id, email: user.email, nombre: user.nombre }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

const getAccountDetails = async (req, res) => {
    try {
        const userId = req.user.userNumAcc; // Extraído del token en el middleware de autenticación
        const connection = await getConnection();

        const [result] = await connection.query(
            'SELECT nombre, email, numeroCuenta, tipo, saldo FROM usuarios WHERE numeroCuenta = ?',
            [userId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los detalles de la cuenta" });
    }
};

export const methodsUsers = {
    loginUser,
    registerUser,
    getAccountDetails
};




