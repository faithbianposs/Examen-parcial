package fr.com.ms_producto.controller;


import fr.com.ms_producto.service.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import fr.com.ms_producto.entity.Producto;

import java.util.List;
@RestController
@RequestMapping("/producto")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    @GetMapping
    ResponseEntity<List<Producto>> lista(){
        return ResponseEntity.ok(productoService.lista());
    }
    @PostMapping
    ResponseEntity<Producto> guardar(@RequestBody Producto oferta) {
        return ResponseEntity.ok(productoService.guardar((oferta)));
    }

    @GetMapping("/{id}")
    ResponseEntity<Producto> buscarPorId(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok(productoService.buscarPorId(id).get());

    }

    @PutMapping
    ResponseEntity<Producto> actualizar(@RequestBody Producto oferta){
        return ResponseEntity.ok(productoService.actualizar((oferta)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<List<Producto>> eleminar(@PathVariable(required = true) Integer id){
        productoService.eleminar(id);
        return ResponseEntity.ok(productoService.lista());

    }
}
