package com.teledermatology.patient.bean.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="appointment")
public class Appointment {
    private String pid;
    @Id
    private Integer aid;
    private Date createdate;
    private String mldiagnosis;
    private String docdiagnosis;
    private String pcomments;
    private String dcomments;
    private String status;

}
