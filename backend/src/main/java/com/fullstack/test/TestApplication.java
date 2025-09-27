package com.fullstack.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // Allows frontend to access this endpoint
@RestController
@SpringBootApplication
public class TestApplication {
	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
//        APIController controller = new APIController(new );
	}
}
