package com.example.shopdragonbee.service;

import com.example.shopdragonbee.repository.VaiTroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VaiTroService {
    @Autowired
    private VaiTroRepository vaiTroRepository;
}
