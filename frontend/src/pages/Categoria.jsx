import React, { useState, useEffect } from 'react';
import { apiPost, apiPut, apiGet, apiDelete } from '../services/api'; // Asegúrate de que estas funciones estén importadas correctamente

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5em',
    color: '#1d3557',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #a8dadc',
    backgroundColor: '#f1faee',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#1d3557',
    border: 'none',
    color: '#fff',
    fontSize: '1.1em',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#457b9d',
  },
  categoryList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '30px',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '12px',
    backgroundColor: '#f1faee',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  categoryButtons: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#2a9d8f',  // Verde claro para editar
  },
  deleteButton: {
    backgroundColor: '#e63946',  // Rojo para eliminar
  },
};

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [newCategoria, setNewCategoria] = useState({
    frNombre: '',
    frCategoria: '',
  });
  const [categoria, setCategoria] = useState(null);

  // Obtener todas las categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await apiGet('/categoria');
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener las categorías', error);
      }
    };
    fetchCategorias();
  }, []);

  // Obtener una categoría por su ID
  const fetchCategoriaById = async (id) => {
    try {
      const data = await apiGet(`/categoria/${id}`);
      setCategoria(data);
    } catch (error) {
      console.error('Error al obtener la categoría', error);
    }
  };

  // Crear una nueva categoría
  const handleCreateCategoria = async () => {
    try {
      const data = await apiPost('/categoria', newCategoria);
      setCategorias([...categorias, data]);
      setNewCategoria({ frNombre: '', frCategoria: '' });
      alert('Categoría creada con éxito');
    } catch (error) {
      console.error('Error al crear la categoría', error);
      alert('Hubo un error al crear la categoría');
    }
  };

  // Actualizar una categoría
  const handleUpdateCategoria = async (id) => {
    try {
      const updatedCategoria = {
        id: categoria.id,
        frNombre: categoria.frNombre,
        frCategoria: categoria.frCategoria,
      };
      const data = await apiPut(`/categoria`, updatedCategoria);
      setCategorias(categorias.map((cat) => (cat.id === id ? data : cat)));
      alert('Categoría actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la categoría', error);
      alert('Hubo un error al actualizar la categoría');
    }
  };

  // Eliminar una categoría
  const handleDeleteCategoria = async (id) => {
    try {
      await apiDelete(`/categoria/${id}`);
      setCategorias(categorias.filter((cat) => cat.id !== id));
      alert('Categoría eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la categoría', error);
      alert('Hubo un error al eliminar la categoría');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Categorías</h1>

      {/* Crear nueva categoría */}
      <div>
        <h3>Agregar Categoría</h3>
        <input
          type="text"
          placeholder="Nombre de la Categoría"
          value={newCategoria.frNombre}
          onChange={(e) => setNewCategoria({ ...newCategoria, frNombre: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Descripción de la Categoría"
          value={newCategoria.frCategoria}
          onChange={(e) => setNewCategoria({ ...newCategoria, frCategoria: e.target.value })}
          style={styles.input}
        />
        <button
          onClick={handleCreateCategoria}
          style={styles.button}
        >
          Crear Categoría
        </button>
      </div>

      {/* Lista de categorías */}
      <div>
        <h3>Lista de Categorías</h3>
        <ul style={styles.categoryList}>
          {categorias.map((cat) => (
            <li key={cat.id} style={styles.categoryItem}>
              <span>
                {cat.frNombre} - {cat.frCategoria}
              </span>
              <div style={styles.categoryButtons}>
                <button
                  onClick={() => fetchCategoriaById(cat.id)}
                  style={{ ...styles.button, ...styles.editButton }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCategoria(cat.id)}
                  style={{ ...styles.button, ...styles.deleteButton }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Detalles y actualización de categoría */}
      {categoria && (
        <div>
          <h3>Detalles de la Categoría</h3>
          <input
            type="text"
            value={categoria.frNombre}
            onChange={(e) => setCategoria({ ...categoria, frNombre: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            value={categoria.frCategoria}
            onChange={(e) => setCategoria({ ...categoria, frCategoria: e.target.value })}
            style={styles.input}
          />
          <button
            onClick={() => handleUpdateCategoria(categoria.id)}
            style={styles.button}
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};

export default Categoria;