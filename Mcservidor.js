const express = require('express');
const mysql = require("mysql2");
const app = express();
const port = 8000;

// Middleware para manejar datos en formato JSON
app.use(express.json());

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sosme2004',  // Asegúrate de que este sea el valor correcto
    database: 'tienda_minecraft'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
});

// Endpoint POST para insertar un nuevo cliente
app.post("/clientes", (req, res) => {
    const { nombre, correo, direccion, telefono } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !direccion || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO clientes (nombre, correo, direccion, telefono) VALUES (?, ?, ?, ?)";
    db.query(query, [nombre, correo, direccion, telefono], (err, results) => {
        if (err) {
            console.error("Error al insertar el cliente:", err);
            res.status(500).json({ error: "Error al insertar el cliente" });
            return;
        }
        res.json({ message: "Cliente insertado correctamente", id: results.insertId });
    });
});

// Endpoint PUT para actualizar un cliente
app.put("/clientes/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, correo, direccion, telefono } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !direccion || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "UPDATE clientes SET nombre = ?, correo = ?, direccion = ?, telefono = ? WHERE id_cliente = ?";
    db.query(query, [nombre, correo, direccion, telefono, id], (err, results) => {
        if (err) {
            console.error("Error al actualizar el cliente:", err);
            res.status(500).json({ error: "Error al actualizar el cliente" });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.json({ message: "Cliente actualizado correctamente" });
    });
});

// Endpoint DELETE para eliminar un cliente
app.delete("/clientes/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM clientes WHERE id_cliente = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar el cliente:", err);
            res.status(500).json({ error: "Error al eliminar el cliente" });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.json({ message: "Cliente eliminado correctamente" });
    });
});

// Endpoint POST para insertar un nuevo producto
app.post("/productos", (req, res) => {
    const { nombre_producto, descripcion, precio, stock, categoria } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre_producto || !descripcion || !precio || !stock || !categoria) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO productos (nombre_producto, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [nombre_producto, descripcion, precio, stock, categoria], (err, results) => {
        if (err) {
            console.error("Error al insertar el producto:", err);
            res.status(500).json({ error: "Error al insertar el producto" });
            return;
        }
        res.json({ message: "Producto insertado correctamente", id: results.insertId });
    });
});

// POST para registrar un nuevo pedido
app.post("/pedidos", (req, res) => {
    const { id_cliente, total } = req.body;

    // Validar que todos los campos estén presentes
    if (!id_cliente || !total) {
        return res.status(400).json({ error: "id_cliente y total son obligatorios" });
    }

    const query = "INSERT INTO pedidos (id_cliente, total) VALUES (?, ?)";
    db.query(query, [id_cliente, total], (err, results) => {
        if (err) {
            console.error("Error al registrar el pedido:", err);
            res.status(500).json({ error: "Error al registrar el pedido" });
            return;
        }
        res.json({ message: "Pedido registrado correctamente", id: results.insertId });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
