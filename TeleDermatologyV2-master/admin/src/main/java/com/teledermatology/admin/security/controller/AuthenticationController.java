package com.teledermatology.admin.security.controller;

import com.teledermatology.admin.security.model.AuthenticationRequest;
import com.teledermatology.admin.security.model.AuthenticationResponse;
import com.teledermatology.admin.security.model.RegisterRequest;
import com.teledermatology.admin.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    private ResponseEntity sendResponse(AuthenticationResponse authenticationResponse, int status){
        ResponseCookie cookie = ResponseCookie.from("token", authenticationResponse.getToken())
                .path("/")
                .httpOnly(true)
                //.secure(true) //set true when working with browser, set false when working with postman
                .maxAge(86400)
                .build();
        if(status == 0){
            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(authenticationResponse);
        }
        else{
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(authenticationResponse);
        }

    }
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest){
        AuthenticationResponse authenticationResponse = authenticationService.register(registerRequest);
        System.out.println("Logging Registration");
        //return ResponseEntity.ok(authenticationResponse);
        if(!authenticationResponse.getToken().equals("FAILED TO LOGIN")){
            return sendResponse(authenticationResponse,0);
        }
        else{
            return sendResponse(authenticationResponse,-1);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest){
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(authenticationRequest);
        System.out.println("Logging Authentication");
        //return ResponseEntity.ok(authenticationResponse);
        if(!authenticationResponse.getToken().equals("FAILED TO LOGIN")){
            return sendResponse(authenticationResponse,0);
        }
        else{
            return sendResponse(authenticationResponse,-1);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity logout(){
        System.out.println("Logging user sign out");
        //return ResponseEntity.ok(authenticationResponse);
        ResponseCookie cookie = ResponseCookie.from("token", null)
                .path("/")
                .httpOnly(true)
                //.secure(true) //set true when working with browser, set false when working with postman
                .maxAge(0)
                .build();
        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Signed out");
    }
}
