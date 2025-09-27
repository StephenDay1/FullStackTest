package com.fullstack.test;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.time.LocalTime;

@CrossOrigin(origins = "*") // Allows frontend to access this endpoint
@RestController
public class APIController {
    private final ActivityRepository repository;

    public APIController(ActivityRepository activityRepository) {
        this.repository = activityRepository;
    }

////    TODO: Do I still need the ActivityRequest class?
//    @PostMapping("/api/activity")
//    public ActivityResponse activity(@RequestBody ActivityRequest request) {
////        Activity saved = repository.save(new Activity(request.getDate(), request.getType(), request.getAmount(), request.getNotes()));
//        String message = String.format("%s: $%.2f (%s)",
//                request.getType(), request.getAmount(), request.getDate());
//        System.out.println(message);
//        System.out.println(repository.count());
//        return new ActivityResponse(message, request.getNotes());
//    }

    @PostMapping("/api/activities")
    public Activity createActivity(@RequestBody Activity activity) {
        return repository.save(activity);
    }

    @GetMapping("/api/activities")
    public List<Activity> getAllActivities() {
        return repository.findAll();
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
