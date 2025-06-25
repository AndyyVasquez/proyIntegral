import { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from "firebase/firestore";

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [users, setUsers] = useState([]);
  const [editingID, setEditingID] = useState(null);

  
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async () => {
    if (name.trim() && age.trim()) {
      await addDoc(collection(db, "users"), {name, age: Number(age)});
      setName("");
      setAge("");
      fetchUsers();
    }}

  const updateUser = async () => {
    if (editingID && name.trim() && age.trim()){
      await updateDoc(doc(db, "users", editingID), {name, age: Number(age)});
      setEditingID(null);
      setName("");
      setAge("");
      fetchUsers();
    }
  };

  
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const chartData = {
    labels: users.map(user => user.name),
    datasets: [
      {
        label: 'Edad',
        data: users.map(user => user.age),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderWidth: 1
      }
    ] 
  };

  return(
    <div style={{textAlign: "center", marginTop: "50px"}}>
      <h1>CRUD con Firebase y reportes</h1>

      <input
        type='text'
        value={name}
        onchange={ (e) => setName(e.target.value)}
        placeholder='Edad'
      />
      {editingID ? (
        <button onClick={updateUser}>Actualizar Usuario</button>
      ) : (
        <button onClick={addUser}>Agregar Usuario</button>
      )}

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.age} años
            <button onClick={() => {setName(user.name); setAge(user.age); setEditingID(user.id);}}>Editar</button>
            <button onClick={() => deleteUser(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

        <h2>Reporte de Edades</h2>
        <Bar data={chartData}/>
    </div>
  );
}

export default App;