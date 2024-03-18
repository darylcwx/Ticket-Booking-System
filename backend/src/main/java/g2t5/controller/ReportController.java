package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.service.EventManagerService;
import g2t5.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

public class ReportController {
    private final EventManagerService eventManagerService;
    private final ReportService reportService;

    @Autowired
    public ReportController(
            EventManagerService eventManagerService, ReportService reportService) {
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
