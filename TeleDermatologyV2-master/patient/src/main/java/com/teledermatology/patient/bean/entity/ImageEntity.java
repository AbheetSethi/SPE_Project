package com.teledermatology.patient.bean.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="image")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageEntity {
    @Id
    @GeneratedValue
    private Integer aid;
    private String name;
    private String type;
    @Lob
    @Column(name = "imagedata", length = 1000000)
    private byte[] imagedata;
}
