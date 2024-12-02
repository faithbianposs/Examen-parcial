import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal, Button, Form } from 'react-bootstrap';
import { apiPost } from '../services/api'; // Asegúrate de que este archivo maneje tus solicitudes API correctamente

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false); // Para controlar la visibilidad del fondo
  const [isModalOpen, setIsModalOpen] = useState(false); // Para controlar la visibilidad del modal de creación de cuenta
  const navigate = useNavigate();

  // Mostrar animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Manejo del inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { userName: username, password: password };
      const response = await apiPost('/auth/login', data);

      const { role, token, authUserId } = response;

      // Guardar datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', authUserId);

      // Redirigir según el rol del usuario
      if (role === 'USER_ADMIN') {
        navigate('/admin');
      } else if (role === 'USER_DEFAULT') {
        navigate('/producto');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      alert('Usuario o contraseña incorrectos');
    }
  };

  // Manejo de cancelación
  const handleCancel = () => {
    navigate('/'); // Redirigir a la ruta principal
  };

  // Mostrar modal de creación de cuenta
  const handleCreateAccount = () => {
    setIsModalOpen(true);
  };

  // Cerrar modal de creación de cuenta
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Manejo de creación de usuario
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { userName: newUsername, password: newPassword };
      await apiPost('/auth/create', data);

      alert('Usuario creado exitosamente');
      setNewUsername('');
      setNewPassword('');
      handleCloseModal();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Ocurrió un error al crear el usuario');
    }
  };

  return (
    <div className={`min-vh-100 d-flex justify-content-center align-items-center bg-gradient ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-light rounded shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center text-success mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-success">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
              placeholder="Ingresar Usuario"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-success">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Ingresar Contraseña"
            />
          </div>

          <div className="d-flex justify-content-between mb-3">
            <button type="submit" className="btn btn-success">
              Iniciar Sesión
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-outline-secondary">
              Cancelar
            </button>
          </div>
        </form>

        <div className="text-center">
          <button onClick={handleCreateAccount} className="btn btn-outline-success">
            Crear Cuenta
          </button>
        </div>
      </div>

      {/* Modal para crear cuenta */}
      <Modal show={isModalOpen} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUserSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresar Usuario"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresar Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Crear Cuenta
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;