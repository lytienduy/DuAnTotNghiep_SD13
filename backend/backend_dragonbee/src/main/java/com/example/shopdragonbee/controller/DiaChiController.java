package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.service.DiaChiService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequestMapping("/dia-chi")
@CrossOrigin(origins = "http://localhost:3000")
public class DiaChiController {
    @Autowired
    private DiaChiService diaChiService;

    @DeleteMapping("/{id}")
    public void deleteDiaChi(@PathVariable Integer id) {
        diaChiService.deleteDiaChi(id);
    }

    @PutMapping("/{id}/mac-dinh")
    public void setMacDinh(@PathVariable Integer id) {
        diaChiService.setMacDinh(id);
    }
}
