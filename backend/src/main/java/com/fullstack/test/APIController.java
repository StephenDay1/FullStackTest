package com.fullstack.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/api/time")
    public String time() {
        LocalTime currentTime = LocalTime.now();
        int hour = currentTime.getHour();
        int minute = currentTime.getMinute();
        int second = currentTime.getSecond();
        return String.format("%d:%02d:%02d %s", hour % 12, minute, second, hour % 12 == 0 ? "AM" : "PM");
    }
}
