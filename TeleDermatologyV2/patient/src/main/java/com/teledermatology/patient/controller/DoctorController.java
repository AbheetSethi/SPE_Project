package com.teledermatology.patient.controller;

import com.teledermatology.patient.bean.entity.Appointment;
import com.teledermatology.patient.bean.entity.ImageEntity;
import com.teledermatology.patient.bean.model.DiagnoseRequest;
import com.teledermatology.patient.bean.model.ViewImageRequest;
import com.teledermatology.patient.bean.response.PastAppointmentResponse;
import com.teledermatology.patient.service.serviceInterface.PatientService;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.Objects.isNull;

@RestController
@RequestMapping("/api/v1/doctor")
@AllArgsConstructor
public class DoctorController {
    private final PatientService patientService;
    @GetMapping("/get-pending-appointments")
    public ResponseEntity getPendingAppointments(){
        List<PastAppointmentResponse> pastAppointmentResponseList= patientService.getPendingAppointments();
        if(isNull(pastAppointmentResponseList)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        else{
            return ResponseEntity.ok(pastAppointmentResponseList);
        }
    }

    @GetMapping("/view-image/{aid}")
    public ResponseEntity fetchImage(@PathVariable String aid){
        ImageEntity image = patientService.fetchImage(Integer.valueOf(aid));
        if(isNull(image)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(image);
    }

    @PostMapping("/diagnose")
    public ResponseEntity diagnose(@RequestBody DiagnoseRequest diagnoseRequest){
        if(patientService.diagnose(diagnoseRequest)==0){
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
