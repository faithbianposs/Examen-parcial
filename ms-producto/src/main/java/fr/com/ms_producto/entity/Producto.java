package fr.com.ms_producto.entity;


import fr.com.ms_producto.dto.CategoriaDto;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String frNombre;
    private String frProducto;

    // Campo para almacenar el ID de la empresa asociada
    private Integer categoriaId;

    // Campo transitorio para almacenar datos de la empresa sin persistencia
    @Transient
    private CategoriaDto CategoriaDto;
}