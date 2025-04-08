package com.teledermatology.patient.repository;

import com.teledermatology.patient.bean.entity.Appointment;
import com.teledermatology.patient.bean.response.PastAppointmentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("SELECT new com.teledermatology.patient.bean.response.PastAppointmentResponse(t.createdate, t.mldiagnosis, t.docdiagnosis, t.pcomments, t.dcomments, t.aid, t.status) FROM Appointment t WHERE t.pid=:pid")
    List<PastAppointmentResponse> getPastAppointments(@Param("pid") String pid);

    Optional<List<Appointment>> getAppointmentByStatus(String status);

}
