package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.model.LoginRequest;
import g2t5.service.EventManagerService;
import g2t5.service.EventService;
import g2t5.service.UserService;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173/", methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
})

public class EventManagerController {
    private final UserService userService;
    private final EventService eventService;
    private final EventManagerService eventManagerService;

    @Autowired
    public EventManagerController(UserService userService, EventService eventService,
            EventManagerService eventManagerService) {
        this.userService = userService;
        this.eventService = eventService;
        this.eventManagerService = eventManagerService;
    }

    @PostMapping("/add-event")
    public ResponseEntity<String> addEvent(@RequestBody Event event) {
        try {
            eventManagerService.addEvent(event);
            return ResponseEntity.ok("Event added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding event: " + e.getMessage());
        }
    }

    @PutMapping("/edit-event")
    public ResponseEntity<String> editEvent(@RequestBody Event event) {
        try {
            eventManagerService.editEvent(event);
            return ResponseEntity.ok("Event added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding event: " + e.getMessage());
        }
    }

    @PutMapping("/cancel-event")
    public ResponseEntity<String> cancelEvent(@RequestBody Event event) {
        try {
            eventManagerService.cancelEvent(event);
            return ResponseEntity.ok("Event cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding event: " + e.getMessage());
        }
    }

   // @PostMapping("/add-ticketing-manager")
   // public ResponseEntity<String> addTicketingManager(@RequestBody TicketingManager ticketingManager) {
   //     try {
   //         eventManagerService.addTicketingManager(ticketingManager);
   //         return ResponseEntity.ok("ticketing manager added successfully");
   //     } catch (Exception e) {
   //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
   //                 .body("Error adding ticketing manager: " + e.getMessage());
   //     }
   // }
}
