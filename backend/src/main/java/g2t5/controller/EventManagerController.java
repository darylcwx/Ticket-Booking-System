package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.service.EventManagerService;
import g2t5.service.EventService;
import g2t5.service.UserService;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173/", methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
})

public class EventManagerController {
    private final EventManagerService eventManagerService;

    @Autowired
    public EventManagerController(UserService userService, EventService eventService,
            EventManagerService eventManagerService) {
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

    @PostMapping("/add-concert")
    public ResponseEntity<String> addConcert(@RequestBody Concert concert) {
        try {
            eventManagerService.addEvent(concert);
            return ResponseEntity.ok("concert added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding concert: " + e.getMessage());
        }
    }

    @PutMapping("/edit-event")
    public ResponseEntity<String> editEvent(@RequestBody Event event) {
        try {
            eventManagerService.editEvent(event);
            return ResponseEntity.ok("Event edited successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error editing event: " + e.getMessage());
        }
    }

    @PutMapping("/cancel-event")
    public ResponseEntity<String> cancelEvent(@RequestBody Event event) {
        try {
            eventManagerService.cancelEvent(event);
            return ResponseEntity.ok("Event cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error cancelling event: " + e.getMessage());
        }
    }

    @GetMapping("/get-statistics")
    public ResponseEntity<String> exportReport(HttpServletResponse response) {
        // Set response headers
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=EventReport.xlsx");
        try {
            eventManagerService.getStatistics(response);
            return ResponseEntity.ok("report exported successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating report\n" + e);
        }
    }

    @PostMapping("/add-ticketing-officer")
    public ResponseEntity<String> addTicketingOfficer(@RequestBody TicketingOfficer ticketingOfficer) {
        try {
            eventManagerService.addTicketingOfficer(ticketingOfficer);
            return ResponseEntity.ok("ticketing manager added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding ticketing manager: " + e.getMessage());
        }
    }

    @GetMapping("/get-all-ticketing-officers")
    public ResponseEntity<List<TicketingOfficer>> getAllTicketingOfficers() {
        List<TicketingOfficer> ticketingOfficers = eventManagerService.getAllTicketingOfficers();
        Iterator<TicketingOfficer> iterator = ticketingOfficers.iterator();
        while (iterator.hasNext()) {
            TicketingOfficer ticketingOfficer = iterator.next();
            if (ticketingOfficer.getRole() == null || !ticketingOfficer.getRole().equals("ticketing officer")) {
                iterator.remove();
            }
        }
        return ticketingOfficers == null
                ? ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Collections.emptyList())
                : ResponseEntity.ok(ticketingOfficers);
    }

    @PutMapping("/edit-ticketing-officer")
    public ResponseEntity<String> editTicketingOfficer(@RequestBody TicketingOfficer ticketingOfficer) {
        try {
            eventManagerService.editTicketingOfficer(ticketingOfficer);
            return ResponseEntity.ok("ticketing officer edited successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error editing ticketing officer: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-ticketing-officer/{id}")
    public ResponseEntity<?> deleteTicketingOfficerById(@PathVariable("id") String id) {
        try {
            eventManagerService.deleteTicketingOfficer(id);
            return ResponseEntity.ok().body("Ticketing officer deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error deleting ticketing officer: " + e.getMessage());
        }
    }

    @GetMapping("/get-customers-email-by-event-id/{eventId}")
    public ResponseEntity<List<String>> getCustomerEmailssByEventId(@PathVariable("eventId") String eventId) {
        try{
            ArrayList<String> customerEmails = new ArrayList<>();
            List<Customer> userList = eventManagerService.getCustomersByEventId(eventId);
            for(Customer customer : userList){
                if(!customerEmails.contains(customer.getUsername())){
                    customerEmails.add(customer.getUsername());
                }
            }
            return ResponseEntity.ok(customerEmails);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }


    @GetMapping("/get-customers-by-event-id/{eventId}")
    public ResponseEntity<List<Customer>> getCustomersByEventId(@PathVariable("eventId") String eventId) {
        try{
            List<Customer> userList = eventManagerService.getCustomersByEventId(eventId);
            return ResponseEntity.ok(userList);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
}
