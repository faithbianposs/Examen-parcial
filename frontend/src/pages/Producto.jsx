import React, { useState, useEffect } from 'react';
import { apiPost, apiGet, apiPut, apiDelete } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// Estilos en línea (puedes moverlos a un archivo CSS si lo prefieres)
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',  // Fondo blanco para resaltar los productos
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5em',
    color: '#1d3557',  // Color oscuro para el título
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.7em',
    marginBottom: '20px',
    color: '#457b9d',  // Un tono azul claro para los subtítulos
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #a8dadc', // Borde azul claro
    backgroundColor: '#f1faee',  // Fondo suave
    boxSizing: 'border-box',  // Para que el padding no afecte el tamaño del input
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#1d3557',  // Azul oscuro
    border: 'none',
    color: '#fff',
    fontSize: '1.1em',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    marginTop: '10px',
    gap: '2px',
  },
  buttonHover: {
    backgroundColor: '#457b9d',  // Azul claro cuando el botón se pasa por encima
  },
  productList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '30px',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '12px',
    backgroundColor: '#f1faee',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  productButtons: {
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

export const Producto = () => {
  const [producto, setProducto] = useState(null);
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    frNombre: '',
    frProducto: '',
    categoriaId: '',
  });
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías

  const navigate = useNavigate(); // Hook para la navegación

  // Obtener los productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await apiGet('/producto');
        console.log('Productos obtenidos:', data); // Verificar la estructura de la respuesta
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener los productos', error);
      }
    };
    fetchProductos();
  }, []);

  // Obtener las categorías disponibles
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await apiGet('/categoria');
        setCategorias(data);  // Guardamos las categorías en el estado
      } catch (error) {
        console.error('Error al obtener las categorías', error);
      }
    };
    fetchCategorias();
  }, []);

  const fetchProductoById = async (id) => {
    try {
      const data = await apiGet(`/producto/${id}`);
      setProducto(data);
    } catch (error) {
      console.error('Error al obtener el producto', error);
    }
  };

  const handleCreateProducto = async () => {
    try {
      const data = await apiPost('/producto', newProducto);
      setProductos([...productos, data]);
      setNewProducto({ frNombre: '', frProducto: '', categoriaId: 1 });
      alert('Producto creado con éxito');
      // Refrescar la lista de productos después de agregar
      fetchProductos();
    } catch (error) {
      console.error('Error al crear el producto', error);
    }
  };

  const handleUpdateProducto = async (id) => {
    const updatedProducto = {
      id: producto.id,
      frNombre: producto.frNombre,
      frProducto: producto.frProducto,
      categoriaId: producto.categoriaId,
      categoriaDto: {
        id: producto.categoriaId,
        frNombre: producto.categoriaDto?.frNombre || '', // Aseguramos que la categoría no sea nula
        frCategoria: producto.categoriaDto?.frCategoria || '', // Default 'electro'
      },
    };
    try {
      const data = await apiPut(`/producto`, updatedProducto);
      setProductos(productos.map((prod) => (prod.id === id ? data : prod)));
      alert('Producto actualizado con éxito');
      // Refrescar la lista de productos después de actualizar
      fetchProductos();
    } catch (error) {
      console.error('Error al actualizar el producto', error);
      alert('Hubo un error al actualizar el producto');
    }
  };

  const handleDeleteProducto = async (id) => {
    try {
      await apiDelete(`/producto/${id}`);
      setProductos(productos.filter((prod) => prod.id !== id));
      alert('Producto eliminado con éxito');
      // Refrescar la lista de productos después de eliminar
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar el producto', error);
      alert('Hubo un error al eliminar el producto');
    }
  };

  const handleViewCategories = () => {
    navigate('/categoria'); // Redirige a la ruta de categorías
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Productos</h1>

      <div>
        <h3 style={styles.sectionTitle}>Agregar Producto</h3>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={newProducto.frNombre}
          onChange={(e) => setNewProducto({ ...newProducto, frNombre: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Descripción del Producto"
          value={newProducto.frProducto}
          onChange={(e) => setNewProducto({ ...newProducto, frProducto: e.target.value })}
          style={styles.input}
        />

        {/* Select de categorías */}
        <select
          value={newProducto.categoriaId}
          onChange={(e) => setNewProducto({ ...newProducto, categoriaId: e.target.value })}
          style={styles.input}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.frNombre}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreateProducto}
          style={{ ...styles.button, ':hover': styles.buttonHover }}
        >
          Crear Producto
        </button>
      </div>

      <div>
        <h3 style={styles.sectionTitle}>Lista de Productos</h3>
        <ul style={styles.productList}>
          {productos.map((prod) => (
            <li key={prod.id} style={styles.productItem}>
              <span>
                {prod.frNombre} - {prod.frProducto} - Categoría: {prod.categoriaDto ? prod.categoriaDto.frCategoria : ''}
              </span>
              <div style={styles.productButtons}>
                <button
                  onClick={() => fetchProductoById(prod.id)}
                  style={{ ...styles.button, ...styles.editButton }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProducto(prod.id)}
                  style={{ ...styles.button, ...styles.deleteButton }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleViewCategories}
        style={{ ...styles.button, backgroundColor: '#f1faee', color: '#1d3557', ':hover': { backgroundColor: '#a8dadc' } }}
      >
        Ver Categorías
      </button>

      {producto && (
        <div>
          <h3 style={styles.sectionTitle}>Detalles del Producto</h3>
          <input
            type="text"
            value={producto.frNombre}
            onChange={(e) => setProducto({ ...producto, frNombre: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            value={producto.frProducto}
            onChange={(e) => setProducto({ ...producto, frProducto: e.target.value })}
            style={styles.input}
          />

          {/* Select para elegir la categoría del producto */}
          <select
            value={producto.categoriaId}
            onChange={(e) => setProducto({
              ...producto,
              categoriaId: e.target.value,
            })}
            style={styles.input}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.frNombre}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleUpdateProducto(producto.id)}
            style={{ ...styles.button, ':hover': styles.buttonHover }}
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};