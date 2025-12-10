package com.tanq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TanqApplication {

    public static void main(String[] args) {
        SpringApplication.run(TanqApplication.class, args);
        System.out.println("🚀 Tanq API rodando em: http://localhost:8080/api");
    }
}
