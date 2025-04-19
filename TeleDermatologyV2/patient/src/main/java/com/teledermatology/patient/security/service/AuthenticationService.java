package com.teledermatology.patient.security.service;

import com.teledermatology.patient.bean.entity.PatientEntity;
import com.teledermatology.patient.bean.entity.Role;
import com.teledermatology.patient.repository.PatientRepository;
import com.teledermatology.patient.security.model.AuthenticationRequest;
import com.teledermatology.patient.security.model.AuthenticationResponse;
import com.teledermatology.patient.security.model.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        var patient = PatientEntity.builder()
                .aadhaar(registerRequest.getAadhaar())
                .pid(registerRequest.getPid())
                .fname(registerRequest.getFname())
                .lname(registerRequest.getLname())
                .email(registerRequest.getEmail())
                .pass(passwordEncoder.encode(registerRequest.getPass()))
                .role(Role.USER)
                .build();
        patientRepository.save(patient);
        String jwt_token = jwtService.generateToken(patient);
        return AuthenticationResponse.builder()
                .token(jwt_token)
                .pid(patient.getPid())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        System.out.println(authenticationRequest.getEmail());
        System.out.println(authenticationRequest.getPass());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getPass()
                    )
            );
        }
        catch(Exception e){
            System.out.println(e);
            return AuthenticationResponse.builder()
                    .token("FAILED TO LOGIN")
                    .pid("FAILED TO LOGIN")
                    .build();
        }
        PatientEntity patient = patientRepository.findByEmail(authenticationRequest.getEmail()).orElseThrow();
        String jwt_token = jwtService.generateToken(patient);
        return AuthenticationResponse.builder()
                .token(jwt_token)
                .pid(patient.getPid())
                .build();
    }
}
