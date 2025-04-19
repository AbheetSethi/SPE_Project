package com.teledermatology.patient.security.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String pid;
    private String fname;
    private String lname;
    private String email;
    private String pass;
    private String aadhaar;
}
