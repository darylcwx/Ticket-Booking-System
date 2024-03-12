package g2t5.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g2t5.database.entity.Event;
import g2t5.database.repository.EventRepository;
import g2t5.database.repository.ReportRepository;
import g2t5.database.repository.TicketingManagerRepository;
import g2t5.database.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class ReportService {
    // @Autowired
    // private TicketingManagerRepository ticketingManagerRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private EventRepository eventRepository;

    public Map<String, Integer> generateReportTicketsSales() {
        Map<String, Integer> reportTickets = new HashMap<>();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < events.size(); i++) {
            Event event = events.get(i);
            String name = event.getName();
            int ticketsSold = event.getTicketsSold();
            reportTickets.put(name, ticketsSold);
        }
        return reportTickets;
    }

    public Map<String, Double> generateReportRevenue() {
        Map<String, Double> reportRevenue = new HashMap<>();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < events.size(); i++) {
            Event event = events.get(i);
            String name = event.getName();
            int ticketsSold = event.getTicketsSold();
            double ticketPrice = event.getTicketPrice();
            reportRevenue.put(name, ticketsSold * ticketPrice);
        }
        return reportRevenue;
    }

    // public Map<String,List<Customer>> GenerateReportCustomerAttendance() {
    //
    // }

    public void exportReport(HttpServletResponse response) {
        Map<String, Double> revenue = generateReportRevenue();
        Map<String, Integer> ticketsSales = generateReportTicketsSales();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Event Report");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Event Name");
            headerRow.createCell(1).setCellValue("Tickets Sold");
            headerRow.createCell(2).setCellValue("Revenue");

            int rowNum = 1;
            for (String eventName : ticketsSales.keySet()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(eventName);
                row.createCell(1).setCellValue(ticketsSales.get(eventName));
                row.createCell(2).setCellValue(revenue.get(eventName));
            }

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=EventReport.xlsx");

            try (OutputStream out = response.getOutputStream()) {
                workbook.write(out);
                System.out.println("Report exported successfully.");
            }
        } catch (IOException e) {
            System.err.println("Error exporting report: " + e.getMessage());
        }
    }

}
