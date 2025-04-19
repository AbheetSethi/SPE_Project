package com.teledermatology.admin;

import com.teledermatology.admin.repository.DoctorRepository;
import com.teledermatology.admin.security.model.AuthenticationRequest;
import com.teledermatology.admin.security.service.AuthenticationService;
import com.teledermatology.admin.service.serviceInterface.DoctorService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class AdminApplicationTests {

	@Autowired
	DoctorService doctorService;
	@Autowired
	DoctorRepository doctorRepository;
	@Autowired
	AuthenticationService authenticationService;
	AuthenticationRequest authenticationRequest=new AuthenticationRequest();
	@BeforeAll
	static void testInit(){
		System.out.println("ADMIN TESTING STARTED");
	}

	@Test
	void testPositiveLoginDetails() {
		authenticationRequest.setEmail("test@test.com");
		authenticationRequest.setPass("Test123");
		assertEquals("0", authenticationService.authenticate(authenticationRequest).getDid());
	}

	@Test
	void testNegativeLoginDetails() {
		authenticationRequest.setEmail("test@test.com");
		authenticationRequest.setPass("WrongPassword");
		assertEquals("FAILED TO LOGIN", authenticationService.authenticate(authenticationRequest).getToken());
	}

	@AfterAll
	static void testComplete(){
		System.out.println("ADMIN TESTING ENDED");
	}
}
