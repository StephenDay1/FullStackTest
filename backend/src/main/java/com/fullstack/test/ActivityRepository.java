package com.fullstack.test;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByDateBetweenAndTypeIn(LocalDate start, LocalDate end, List<String> types);
    List<Activity> findByDateBetween(LocalDate start, LocalDate end);
    List<Activity> findByTypeIn(List<String> types);
}
