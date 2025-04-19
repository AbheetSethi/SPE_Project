package com.teledermatology.patient.repository;

import com.teledermatology.patient.bean.entity.PatientEntity;
import com.teledermatology.patient.bean.response.PastAppointmentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface PatientRepository extends JpaRepository<PatientEntity,String> {
    Optional<PatientEntity> findByEmail(String email);
}
