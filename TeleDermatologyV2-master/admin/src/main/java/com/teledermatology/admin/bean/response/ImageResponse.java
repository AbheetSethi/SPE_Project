package com.teledermatology.admin.bean.response;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {
    private Integer aid;
    private String name;
    private String type;
    @Lob
    @Column(name = "imagedata", length = 1000000)
    private byte[] imagedata;
}
