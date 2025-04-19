package com.teledermatology.patient.service.serviceImplementation;

import com.teledermatology.patient.bean.entity.Appointment;
import com.teledermatology.patient.bean.entity.ImageEntity;
import com.teledermatology.patient.bean.model.DiagnoseRequest;
import com.teledermatology.patient.bean.response.PastAppointmentResponse;
import com.teledermatology.patient.repository.AppointmentRepository;
import com.teledermatology.patient.repository.ImageRepository;
import com.teledermatology.patient.repository.PatientRepository;
import com.teledermatology.patient.service.serviceInterface.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Override
    public List<PastAppointmentResponse> getPastAppointments(String pid) {
        return appointmentRepository.getPastAppointments(pid);
    }

    @Override
    public Integer createAppointment(Appointment appointment) {
        appointment.setCreatedate(new Date());
        try{
            appointmentRepository.save(appointment);
            System.out.println("HI There");
        }
        catch(Exception e){
            System.out.println("Exception in saving appointment:\n\n"+e);
            return 1;
        }
        return 0;
    }

    @Override
    public Integer uploadImage(MultipartFile file) {
        try{
            System.out.println("Length of image: "+ ImageUtil.compressImage(file.getBytes()).length);
            ImageEntity image = imageRepository.save(ImageEntity.builder()
                    .name(file.getOriginalFilename())
                    .type(file.getContentType())
                    .imagedata(ImageUtil.compressImage(file.getBytes())).build());
            return image.getAid();
        }
        catch(Exception e){
            System.out.println("Error uploading image:\n\n"+e);
            return -1;
        }
    }

    public byte[] viewImage(Integer aid) {
        Optional<ImageEntity> blob = imageRepository.findByAid(aid);
        byte[] image = ImageUtil.decompressImage(blob.get().getImagedata());
        return image;
    }

    @Override
    public ImageEntity fetchImage(Integer aid) {
        return imageRepository.findByAid(aid).orElse(null);
    }

    public List<PastAppointmentResponse> getPendingAppointments(){
        List<Appointment> appointmentList = appointmentRepository.getAppointmentByStatus("Pending").orElse(null);
        if(appointmentList==null){
            return null;
        }
        List<PastAppointmentResponse> pastAppointmentResponseList = new ArrayList<>();
        for(Appointment appointment : appointmentList){
            pastAppointmentResponseList.add(new PastAppointmentResponse(
                    appointment.getCreatedate(),
                    appointment.getMldiagnosis(),
                    appointment.getDocdiagnosis(),
                    appointment.getPcomments(),
                    appointment.getDcomments(),
                    appointment.getAid(),
                    appointment.getStatus()));
        }
        return pastAppointmentResponseList;
    }

    @Override
    public Integer diagnose(DiagnoseRequest diagnoseRequest) {
        Appointment appointment = appointmentRepository.findById(Integer.valueOf(diagnoseRequest.getAid())).orElse(null);
        if(appointment!=null){
            appointment.setDcomments(diagnoseRequest.getDcomments());
            appointment.setDocdiagnosis(diagnoseRequest.getDocdiagnosis());
            appointment.setStatus(diagnoseRequest.getStatus());
            appointmentRepository.save(appointment);
            return 0;
        }
        else{
            System.out.println("--LOGGING--\nNo appointment matching provided appointment ID");
            return 1;
        }
    }
}
