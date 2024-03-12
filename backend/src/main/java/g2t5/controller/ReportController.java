package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.model.LoginRequest;
import g2t5.service.EventManagerService;
import g2t5.service.EventService;
import g2t5.service.ReportService;
import g2t5.service.UserService;
import jakarta.servlet.http.HttpServletResponse;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

public class ReportController {
    private final UserService userService;
    private final EventService eventService;
    private final EventManagerService eventManagerService;
    private final ReportService reportService;

    @Autowired
    public ReportController(UserService userService, EventService eventService,
            EventManagerService eventManagerService, ReportService reportService) {
        this.userService = userService;
        this.eventService = eventService;
        this.eventManagerService = eventManagerService;
        this.reportService = reportService;
    }

    @GetMapping("/ticket-sales-report")
    public ResponseEntity<Map<String, Integer>> generateReportTicketsSales() {
        Map<String, Integer> report = reportService.generateReportTicketsSales();
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping("/revenue-report")
    public ResponseEntity<Map<String, Double>> generateReportRevenue() {
        Map<String, Double> report = reportService.generateReportRevenue();
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @PostMapping("/cancel-event")
    public ResponseEntity<String> cancelEvent(@RequestBody Event event) {
        try {
            eventManagerService.cancelEvent(event);
            return ResponseEntity.ok("Event cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding event: " + e.getMessage());
        }
    }

     @GetMapping("/export-report")
    public void exportReport(HttpServletResponse response) {
        // Set response headers
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=EventReport.xlsx");

        // Call the exportReport() method
        reportService.exportReport(response);
    }
}
