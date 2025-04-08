package com.teledermatology.patient.bean.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PastAppointmentRequest {
    private String pid;
    private String aid;
}
