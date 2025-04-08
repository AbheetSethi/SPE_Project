package com.teledermatology.patient.controller;

import com.teledermatology.patient.bean.entity.Appointment;
import com.teledermatology.patient.bean.model.PastAppointmentRequest;
import com.teledermatology.patient.bean.model.ViewImageRequest;
import com.teledermatology.patient.bean.response.ImageUploadResponse;
import com.teledermatology.patient.bean.response.PastAppointmentResponse;
import com.teledermatology.patient.service.serviceInterface.PatientService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@AllArgsConstructor
public class PatientController {
    private final PatientService patientService;
    @GetMapping("/test")
    public ResponseEntity test(){
        System.out.println("here");
        return ResponseEntity.ok("testing");
    }

    @GetMapping("/past-appointments")
    public ResponseEntity getPastAppointments(@RequestParam("pid") String pid){
        List<PastAppointmentResponse> pastAppointmentResponseList = patientService.getPastAppointments(pid);
        if(pastAppointmentResponseList.isEmpty()){
            return ResponseEntity.ok("Empty no data");
        }
        else{
            return ResponseEntity.ok(pastAppointmentResponseList);
        }
    }

    @PostMapping("/create-appointment")
    public ResponseEntity createAppointment(@RequestBody Appointment appointment){
        if(patientService.createAppointment(appointment)==0){
            return ResponseEntity.ok("Appointment created successfully");
        }
        else{
            return ResponseEntity.ok("Appointment creation failed");
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity uploadImage(@RequestParam("image") MultipartFile file){
        Integer aid = patientService.uploadImage(file);
        if(aid==-1){
            return ResponseEntity.ok("Failed to upload the image");
        }
        else{
            return ResponseEntity.ok(new ImageUploadResponse(aid));
        }
    }

//    @GetMapping("/view-image")
//    public ResponseEntity viewImage(@RequestBody ViewImageRequest viewImageRequest){
//        byte[] image = patientService.viewImage(Integer.valueOf(viewImageRequest.getAid()));
//        return ResponseEntity.ok()
//                .contentType(MediaType.valueOf("image/png"))
//                .body(image);
//    }
        @GetMapping("/view-image")
        public ResponseEntity viewImage(@RequestParam("aid") String aid){
        byte[] image = patientService.viewImage(Integer.valueOf(aid));
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("image/jpeg"))
                .body(image);
    }

}
