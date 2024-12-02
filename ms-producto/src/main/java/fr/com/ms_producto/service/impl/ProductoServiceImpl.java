package fr.com.ms_producto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import fr.com.ms_producto.entity.Producto;
import fr.com.ms_producto.dto.CategoriaDto;
import fr.com.ms_producto.feign.CategoriaFeign;
import fr.com.ms_producto.repository.ProductoRepository;
import fr.com.ms_producto.service.ProductoService;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaFeign categoriaFeign;

    @Override
    public List<Producto> lista() {
        List<Producto> productos = productoRepository.findAll();
        // Cargar datos de categoriaDto para cada producto
        for (Producto producto : productos) {
            if (producto.getCategoriaId() != null) {
                CategoriaDto categoriaDto = categoriaFeign.buscarPorId(producto.getCategoriaId());
                producto.setCategoriaDto(categoriaDto); // Ensure correct method name here
            }
        }
        return productos;
    }

    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> buscarPorId(Integer id) {
        Optional<Producto> productoOptional = productoRepository.findById(id);
        if (productoOptional.isPresent()) {
            Producto producto = productoOptional.get();
            if (producto.getCategoriaId() != null) {
                CategoriaDto categoriaDto = categoriaFeign.buscarPorId(producto.getCategoriaId());
                producto.setCategoriaDto(categoriaDto); // Correct method name here
            }
            return Optional.of(producto);
        }
        return Optional.empty();
    }

    @Override
    public Producto actualizar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public void eleminar(Integer id) {
        productoRepository.deleteById(id);
    }

    // Método para obtener información de la Categoria desde ms-gestion_Categoria
    public CategoriaDto obtenerCategoriaPorId(Integer id) {
        return categoriaFeign.buscarPorId(id);
    }
}