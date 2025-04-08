package com.teledermatology.patient.repository;

import com.teledermatology.patient.bean.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<ImageEntity,Integer> {
    Optional<ImageEntity> findByAid(Integer aid);
}
