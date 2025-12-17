package com.tanq;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class TanqApplicationTests {

    @Test
    void contextLoads() {
        // Verifica se o contexto do Spring Boot carrega corretamente
    }
}
