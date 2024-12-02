package fr.com.ms_producto.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import fr.com.ms_producto.dto.CategoriaDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@FeignClient(name = "ms-categoria-service", path = "/categoria")
public interface CategoriaFeign {
    @CircuitBreaker(name = "categoriaListarPorIdCB", fallbackMethod = "fallbackMethod")
    @GetMapping("/{id}")
    CategoriaDto buscarPorId(@PathVariable("id") Integer id);

    // Método de fallback
    default CategoriaDto fallbackMethod(Integer id, Throwable throwable) {
        // Devuelve un objeto categoriaDto con valores predeterminados
        CategoriaDto categoriaFallback = new CategoriaDto();
        categoriaFallback.setId(id);
        categoriaFallback.setFrNombre("Categoria no disponible"); // Corrected method name here
        return categoriaFallback;
    }
}