package com.fullstack.test;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import java.time.LocalTime;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*") // Allows frontend to access this endpoint
@RestController
public class APIController {
    private final ActivityRepository repository;

    public APIController(ActivityRepository activityRepository) {
        this.repository = activityRepository;
    }

    @PostMapping("/api/activities")
    public Activity createActivity(@RequestBody Activity activity) {
        return repository.save(activity);
    }

    @GetMapping("/api/activities")
    public List<Activity> getAllActivities() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(Activity::getDate))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/api/activities/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @GetMapping("/api/activities/filter")
    public List<Activity> filterActivities(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(required = false) List<String> types) {

        if (start != null && types != null) {
            return repository.findByDateBetweenAndTypeIn(start, end, types);
        } else if (start != null && end != null) {
            return repository.findByDateBetween(start, end);
        } else if (types != null) {
            return repository.findByTypeIn(types);
        } else {
            return repository.findAll();
        }
    }


    @GetMapping("/api/time")
    public String time() {
        LocalTime currentTime = LocalTime.now();
        int hour = currentTime.getHour();
        int minute = currentTime.getMinute();
        int second = currentTime.getSecond();
        return String.format("%d:%02d:%02d %s", hour % 12, minute, second, hour % 12 == 0 ? "AM" : "PM");
    }
}
