package fr.com.ms_producto.service;


import fr.com.ms_producto.entity.Producto;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public interface ProductoService {
    List<Producto> lista();
    Producto guardar(Producto oferta);
    Optional<Producto> buscarPorId(Integer id);
    Producto actualizar(Producto oferta);
    void eleminar(Integer id);
}