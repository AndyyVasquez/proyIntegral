// src/App.jsx
import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [editId, setEditId] = useState(null);

  const usuariosRef = collection(db, "usuarios");

  const obtenerUsuarios = async () => {
    const data = await getDocs(usuariosRef);
    setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const agregarUsuario = async () => {
    if (nombre && edad) {
      await addDoc(usuariosRef, { nombre, edad: Number(edad) });
      setNombre("");
      setEdad("");
      obtenerUsuarios();
    }
  };

  const actualizarUsuario = async (id) => {
    const usuarioDoc = doc(db, "usuarios", id);
    await updateDoc(usuarioDoc, { nombre, edad: Number(edad) });
    setEditId(null);
    setNombre("");
    setEdad("");
    obtenerUsuarios();
  };

  const eliminarUsuario = async (id) => {
    const usuarioDoc = doc(db, "usuarios", id);
    await deleteDoc(usuarioDoc);
    obtenerUsuarios();
  };

  // Datos para Chart.js
  const data = {
    labels: usuarios.map((u) => u.nombre),
    datasets: [
      {
        label: "Edad",
        data: usuarios.map((u) => u.edad),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div>
      <h1>CRUD Usuarios</h1>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
      />
      {editId ? (
        <button onClick={() => actualizarUsuario(editId)}>Actualizar</button>
      ) : (
        <button onClick={agregarUsuario}>Agregar</button>
      )}
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre} - {u.edad} años
            <button
              onClick={() => {
                setEditId(u.id);
                setNombre(u.nombre);
                setEdad(u.edad);
              }}
            >
              Editar
            </button>
            <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <h2>Reporte de Edades</h2>
      <Bar data={data} />
    </div>
  );
}

export default App;