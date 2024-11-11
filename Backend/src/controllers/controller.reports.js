// reports.js (ruta para reportes)
import { getConnection } from "../database/database.js";

const getIncomeReport = async (req, res) => {
  try {
    const userId = req.user.userNumAcc;
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT fecha, monto FROM transacciones WHERE (tipo = 'deposit' AND cuenta_origen = ?) OR (tipo = 'transfer' AND cuenta_destino = ?)", [userId, userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los ingresos" });
  }
};

const getExpenseReport = async (req, res) => {
  try {
    const userId = req.user.userNumAcc;
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT fecha, monto FROM transacciones WHERE tipo IN ('transfer', 'withdraw') AND cuenta_origen = ?", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los egresos" });
  }
};

const getDebtReport = async (req, res) => {
  try {
    const userId = req.user.userNumAcc;
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT fecha_solicitud, monto, plazo, estado FROM prestamos WHERE cuentaUsuario = ?", [userId]);

    const formattedRows = rows.map(row => ({
        fecha: row.fecha_solicitud,  
        monto: row.monto,
        plazo: row.plazo,
        estado: row.estado
      }));

    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las deudas" });
  }
};

export const methodsReports = {
    getIncomeReport,
    getExpenseReport,
    getDebtReport,
  };
