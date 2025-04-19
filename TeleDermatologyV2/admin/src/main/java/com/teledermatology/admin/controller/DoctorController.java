package com.teledermatology.admin.controller;

import com.teledermatology.admin.bean.model.DiagnoseRequest;
import com.teledermatology.admin.bean.response.ImageResponse;
import com.teledermatology.admin.bean.response.PendingAppointmentsResponse;
import com.teledermatology.admin.service.serviceImplementation.ImageUtil;
import com.teledermatology.admin.service.serviceInterface.DoctorService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor")
@AllArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    @GetMapping("/test")
    public ResponseEntity test(){
        return ResponseEntity.ok("test");
    }

    @GetMapping("/view-appointments")
    public ResponseEntity viewAppointments(){
        List<PendingAppointmentsResponse> pendingAppointmentsResponseList =doctorService.getPendingAppointments();
        if(pendingAppointmentsResponseList == null){
            return ResponseEntity.ok("No pending appointments");
        }
        else{
            return ResponseEntity.ok(pendingAppointmentsResponseList);
        }
    }

    @GetMapping("/view-appointment-details/{aid}")
    public ResponseEntity viewAppointmentDetails(@PathVariable String aid){
        ImageResponse imageResponse = doctorService.getImage(aid);
        if(imageResponse == null){
            return ResponseEntity.ok("Not a valid appointment");
        }
        else{
            byte[] image = ImageUtil.decompressImage(imageResponse.getImagedata());
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("image/png"))
                    .body(image);
        }
    }

    @PostMapping("/diagnose")
    public ResponseEntity diagnose(@RequestBody DiagnoseRequest diagnoseRequest){
        if(doctorService.diagnose(diagnoseRequest)==0){
            return ResponseEntity.ok("Diagnosis stored successfully");
        }
        else{
            return ResponseEntity.ok("Failed to store diagnosis");
        }
    }
}
