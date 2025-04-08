package com.teledermatology.admin.service.serviceInterface;

import com.teledermatology.admin.bean.model.DiagnoseRequest;
import com.teledermatology.admin.bean.response.ImageResponse;
import com.teledermatology.admin.bean.response.PendingAppointmentsResponse;

import java.util.List;

public interface DoctorService {

    List<PendingAppointmentsResponse> getPendingAppointments();

    ImageResponse getImage(String aid);

    Integer diagnose(DiagnoseRequest diagnoseRequest);

}
