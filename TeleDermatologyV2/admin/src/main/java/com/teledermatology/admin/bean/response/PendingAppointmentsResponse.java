package com.teledermatology.admin.bean.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingAppointmentsResponse {
    private Date createdate;
    private String mldiagnosis;
    private String docdiagnosis;
    private String pcomments;
    private String dcomments;
    private Integer aid;
    private String status;
}
