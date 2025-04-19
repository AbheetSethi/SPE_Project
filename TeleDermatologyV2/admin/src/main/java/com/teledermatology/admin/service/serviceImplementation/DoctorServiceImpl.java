package com.teledermatology.admin.service.serviceImplementation;

import com.teledermatology.admin.bean.model.DiagnoseRequest;
import com.teledermatology.admin.bean.model.ViewImageRequest;
import com.teledermatology.admin.bean.response.ImageResponse;
import com.teledermatology.admin.bean.response.PendingAppointmentsResponse;
import com.teledermatology.admin.service.serviceInterface.DoctorService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {
    private RestTemplate restTemplate_patient;

    @Value("${patient_service.base.url}")
    private String patientBaseURL;

    public DoctorServiceImpl(@Value("${patient_service.base.url}"+"/api/v1")String patientBaseURL, RestTemplateBuilder builder) {
        this.restTemplate_patient= builder.rootUri(patientBaseURL).build();
    }

    public List<PendingAppointmentsResponse> getPendingAppointments(){
        HttpEntity<?> request = new HttpEntity<>("");
        String url="/doctor/get-pending-appointments";
        ResponseEntity<List<PendingAppointmentsResponse>> response = restTemplate_patient.exchange(url, HttpMethod.GET, request, new ParameterizedTypeReference<List<PendingAppointmentsResponse>>(){},"");
        if(response.getStatusCode().isSameCodeAs(HttpStatus.NOT_FOUND)){
            return null;
        }
        else{
            return response.getBody();
        }
    }

    @Override
    public ImageResponse getImage(String aid) {
        HttpEntity<?> request = new HttpEntity<>("");
        String url="/doctor/view-image/"+aid;
        ResponseEntity<ImageResponse> response = restTemplate_patient.exchange(url, HttpMethod.GET, request, new ParameterizedTypeReference<ImageResponse>(){},"");
        if(response.getStatusCode().isSameCodeAs(HttpStatus.NOT_FOUND)){
            return null;
        }
        else{
            return response.getBody();
        }
    }

    @Override
    public Integer diagnose(DiagnoseRequest diagnoseRequest) {
        HttpEntity<?> request = new HttpEntity<>(diagnoseRequest);
        String url="/doctor/diagnose";
        ResponseEntity response= restTemplate_patient.postForEntity(url,request, ResponseEntity.class,"");
        if(response.getStatusCode().isSameCodeAs(HttpStatus.OK)){
            return 0;
        }
        else{
            return -1;
        }
    }
}
