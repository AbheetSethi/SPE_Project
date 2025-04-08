package com.teledermatology.patient;

import com.teledermatology.patient.bean.entity.Appointment;
import com.teledermatology.patient.bean.response.PastAppointmentResponse;
import com.teledermatology.patient.repository.AppointmentRepository;
import com.teledermatology.patient.security.model.AuthenticationRequest;
import com.teledermatology.patient.security.service.AuthenticationService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class 	PatientApplicationTests {
	@Autowired
	AppointmentRepository appointmentRepository;
	@Autowired
	AuthenticationService authenticationService;
	AuthenticationRequest authenticationRequest=new AuthenticationRequest();
	@BeforeAll
	static void testInit(){
		System.out.println("PATIENT TESTING STARTED");
	}

	@Test
	void testPositiveLoginDetails() {
		authenticationRequest.setEmail("test@test.com");
		authenticationRequest.setPass("Test123");
		assertEquals("0", authenticationService.authenticate(authenticationRequest).getPid());
	}

	@Test
	void testNegativeLoginDetails() {
		authenticationRequest.setEmail("test@test.com");
		authenticationRequest.setPass("Wrong Password");
		assertEquals("FAILED TO LOGIN", authenticationService.authenticate(authenticationRequest).getToken());
	}

	@Test
	void testAppointmentDetails() {
		List<PastAppointmentResponse> appointmentList = appointmentRepository.getPastAppointments("0");
		assertEquals(0, appointmentList.get(0).getAid());
		assertEquals("status", appointmentList.get(0).getStatus());
		assertEquals("doctor comment", appointmentList.get(0).getDcomments());
		assertEquals("doctor diagnosis", appointmentList.get(0).getDocdiagnosis());
		assertEquals("mldiagnosis", appointmentList.get(0).getMldiagnosis());
	}

	@AfterAll
	static void testComplete(){
		System.out.println("PATIENT TESTING ENDED");
	}
}
