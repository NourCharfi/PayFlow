package org.ms.produit_service.web;

import org.ms.produit_service.entities.Produit;
import org.ms.produit_service.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class ProduitRestController {
    @Autowired
    private ProduitRepository produitRepository;

    @GetMapping(path = "/produits")
    public List<Produit> list() {
        return produitRepository.findAll();
    }

    @GetMapping(path = "/produits/{id}")
    public Produit getOne(@PathVariable Long id) {
        return produitRepository.findById(id).get();
    }

    @PostMapping(path = "/produits")
    public Produit save(@RequestBody Produit produit) {
        return produitRepository.save(produit);
    }

    @PutMapping(path = "/produits/{id}")
    public Produit update(@PathVariable Long id, @RequestBody Produit produit) {
        produit.setId(id);
        return produitRepository.save(produit);
    }

    @DeleteMapping(path = "/produits/{id}")
    public void delete(@PathVariable Long id) {
        produitRepository.deleteById(id);
    }

    // New method to check available quantity
    @GetMapping(path = "/produits/{id}/available")
    public long getAvailableQuantity(@PathVariable Long id) {
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return produit.getQuantity() - produit.getQuantiteVendue();
    }

    // New method to update sold quantity
    @PutMapping(path = "/produits/{id}/updateQuantiteVendue")
    public Produit updateQuantiteVendue(@PathVariable Long id, @RequestParam long newQuantity) {
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
            
        long availableQuantity = produit.getQuantity() - produit.getQuantiteVendue();
        if (newQuantity > availableQuantity) {
            throw new RuntimeException("Insufficient quantity available. Only " + availableQuantity + " units left.");
        }
        
        produit.setQuantiteVendue(produit.getQuantiteVendue() + newQuantity);
        return produitRepository.save(produit);
    }
}