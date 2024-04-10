package g2t5.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g2t5.database.entity.Booking;
import g2t5.database.entity.Concert;
import g2t5.database.entity.Customer;
import g2t5.database.entity.Event;
import g2t5.database.entity.Ticket;
import g2t5.database.repository.CustomerRepository;
import g2t5.database.repository.EventRepository;
import g2t5.database.repository.ReportRepository;
//import g2t5.database.repository.TicketingManagerRepository;
import g2t5.database.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class ReportService {
    // @Autowired
    // private TicketingManagerRepository ticketingManagerRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private EventRepository eventRepository;

    public Map<String, Integer> generateReportTicketsSales() {
        Map<String, Integer> reportTickets = new HashMap<>();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < events.size(); i++) {
            Event event = events.get(i);
            String name = event.getName();
            String eventId = event.getId();
            int ticketsSold = 0;
            try {
                List<Booking> bookingList = bookingService.getByEventId(eventId);
                for (Booking booking : bookingList) {
                    List<String> ticketList = booking.getTickets();
                    for(String ticketId : ticketList){
                        Ticket ticket = ticketService.getTicket(ticketId);
                        if(!ticket.getStatus().equals("cancelled")){
                            ticketsSold++;
                        }
                    }
                }
            } catch (Exception e) {

            }
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
            int ticketsSold = generateReportTicketsSales().get(name);
            double ticketPrice = ticketsSold * event.getTicketPrice();
            reportRevenue.put(name, ticketsSold * ticketPrice);
        }
        return reportRevenue;
    }

    public Map<String, Integer> generateTicketsCancelled() {
        Map<String, Integer> reportTickets = new HashMap<>();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < events.size(); i++) {
            Event event = events.get(i);
            String name = event.getName();
            String eventId = event.getId();
            int ticketsCancelled = 0;
            try {
                List<Booking> bookingList = bookingService.getByEventId(eventId);
                for (Booking booking : bookingList) {
                    if (booking.getStatus().equals("cancelled")) {
                        ticketsCancelled += booking.getTickets().size();
                    }
                }
            } catch (Exception e) {

            }
            reportTickets.put(name, ticketsCancelled);
        }
        return reportTickets;
    }

    public Map<String, Integer> generateAttendees() {
        Map<String, Integer> reportCustomer = new HashMap<>();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < events.size(); i++) {
            int total = 0;
            Event event = events.get(i);
            String name = event.getName();
            String eventId = event.getId();
            try {
                List<Booking> bookingList = bookingService.getByEventId(eventId);
                for (Booking booking : bookingList) {
                    List<String> ticketList = booking.getTickets();
                    for(String ticketId : ticketList){
                        Ticket ticket = ticketService.getTicket(ticketId);
                        if(ticket.getStatus().equals("inactive")){
                            total++;
                        }
                    }
                }
            } catch (Exception e) {

            }
            reportCustomer.put(name, total);
        }
        return reportCustomer;
    }

    public void exportReport(HttpServletResponse response) {
        Map<String, Double> revenue = generateReportRevenue();
        Map<String, Integer> ticketsSales = generateReportTicketsSales();
        Map<String, Integer> ticketsCancelled = generateTicketsCancelled();
        Map<String, Integer> customerAttendees = generateAttendees();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Event Report");

            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setBorderBottom(BorderStyle.THIN);
            headerCellStyle.setBorderTop(BorderStyle.THIN);
            headerCellStyle.setBorderLeft(BorderStyle.THIN);
            headerCellStyle.setBorderRight(BorderStyle.THIN);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerCellStyle.setFont(headerFont);

            headerRow.createCell(0).setCellValue("Event Name");
            headerRow.getCell(0).setCellStyle(headerCellStyle);

            headerRow.createCell(1).setCellValue("Date");
            headerRow.getCell(1).setCellStyle(headerCellStyle);

            headerRow.createCell(2).setCellValue("Total Tickets");
            headerRow.getCell(2).setCellStyle(headerCellStyle);

            headerRow.createCell(3).setCellValue("Tickets Sold");
            headerRow.getCell(3).setCellStyle(headerCellStyle);

            headerRow.createCell(4).setCellValue("Tickets Cancelled");
            headerRow.getCell(4).setCellStyle(headerCellStyle);

            headerRow.createCell(5).setCellValue("Revenue");
            headerRow.getCell(5).setCellStyle(headerCellStyle);

            headerRow.createCell(6).setCellValue("Number of Attendees");
            headerRow.getCell(6).setCellStyle(headerCellStyle);

            headerRow.createCell(7).setCellValue("Type");
            headerRow.getCell(7).setCellStyle(headerCellStyle);

            int rowNum = 1;
            List<Event> events = eventRepository.findAll();
            for (Event event : events) {
                String type = "null";
                if(event instanceof Concert){
                    type = "Concert";
                }
                String eventName = event.getName();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                // Convert Date to LocalDateTime
                Date date = event.getStartDate();
                Instant instant = date.toInstant();
                LocalDateTime localDateTime = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();

                // Format LocalDateTime to String
                String formattedDate = localDateTime.format(formatter);

                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(eventName);
                row.createCell(1).setCellValue(formattedDate);
                row.createCell(2).setCellValue(event.getTotalTickets());
                row.createCell(3).setCellValue(ticketsSales.get(eventName));
                row.createCell(4).setCellValue(ticketsCancelled.get(eventName));
                row.createCell(5).setCellValue(revenue.get(eventName));
                row.createCell(6).setCellValue(customerAttendees.get(eventName));
                row.createCell(7).setCellValue(type);
            }

            // Autosize columns
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                sheet.autoSizeColumn(i);
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
