package g2t5.controller;

import java.util.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import g2t5.database.entity.Ticket;
import g2t5.service.EventManagerService;
import g2t5.service.EventService;
import g2t5.service.ReportService;
import g2t5.service.TicketService;
import g2t5.service.UserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(
  origins = "http://localhost:5173/",
  methods = {
    RequestMethod.GET,
    RequestMethod.POST,
    RequestMethod.PUT,
    RequestMethod.DELETE,
  }
)
public class TicketController {

    @Autowired
    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
      this.ticketService = ticketService;
    }

    @PostMapping("/create-ticket")
    public ResponseEntity<String> createTicket(@RequestBody Ticket ticket) {
        //return ticketService.createTicket(ticket);
        try {
            
            return ResponseEntity.ok(ticketService.createTicket(ticket).getTicketId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating ticket" + e.getMessage());
        }
        
    }

    

    @GetMapping("/tickets")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTicket();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @PostMapping("/verify-ticket")
    public ResponseEntity<Boolean> verifyTicket(@RequestBody Ticket ticket) {
        Ticket ticket_new = ticketService.getTicket(ticket);
        if (ticket_new != null) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
    }

    @PostMapping("/delete-ticket")
    public ResponseEntity<String> deleteTicket(@RequestBody Ticket ticket) {
        try {
                ticketService.deactivateTicket(ticket);

            return ResponseEntity.ok("Tickets removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting ticket" + e.getMessage());
        }
    }
}
