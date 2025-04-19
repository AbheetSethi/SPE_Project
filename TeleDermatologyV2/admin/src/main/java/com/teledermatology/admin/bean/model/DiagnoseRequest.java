package com.teledermatology.admin.bean.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiagnoseRequest {
    private String aid;
    private String dcomments;
    private String docdiagnosis;
    private String status;
}
