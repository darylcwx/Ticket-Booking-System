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
import g2t5.database.entity.Customer;
import g2t5.database.entity.Event;
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
                    if (booking.getStatus().equals("confirm")) {
                        ticketsSold += booking.getTickets().size();
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

    public Map<String, String> generateCustomerDetails() {
        Map<String, String> reportCustomer = new HashMap<>();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < events.size(); i++) {
            String customerEmail = "";
            Event event = events.get(i);
            String name = event.getName();
            String eventId = event.getId();
            try {
                List<Booking> bookingList = bookingService.getByEventId(eventId);
                for (Booking booking : bookingList) {
                    Optional<Customer> customerOptional = customerRepository.findById(booking.getCustomerId());
                    Customer customer = customerOptional.get();
                    String email = customer.getUsername();
                    customerEmail = customerEmail + email + ",";
                }
                customerEmail = customerEmail.substring(0,customerEmail.length()-1);
            } catch (Exception e) {

            }
            reportCustomer.put(name, customerEmail);
        }
        return reportCustomer;
    }

    public void exportReport(HttpServletResponse response) {
        Map<String, Double> revenue = generateReportRevenue();
        Map<String, Integer> ticketsSales = generateReportTicketsSales();
        Map<String, Integer> ticketsCancelled = generateTicketsCancelled();
        Map<String, String> customerEmails = generateCustomerDetails();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Event Report");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Event Name");
            headerRow.createCell(1).setCellValue("Date");
            headerRow.createCell(2).setCellValue("Tickets Sold");
            headerRow.createCell(3).setCellValue("Revenue");
            headerRow.createCell(3).setCellValue("Tickets cancelled");
            headerRow.createCell(4).setCellValue("Customer emails");

            int rowNum = 1;
            List<Event> events = eventRepository.findAll();
            for (Event event : events) {
                String eventName = event.getName();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                // Convert Date to LocalDateTime
                Date date = event.getDatetime();
                Instant instant = date.toInstant();
                LocalDateTime localDateTime = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();

                // Format LocalDateTime to String
                String formattedDate = localDateTime.format(formatter);

                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(eventName);
                row.createCell(1).setCellValue(formattedDate);
                row.createCell(2).setCellValue(ticketsSales.get(eventName));
                row.createCell(3).setCellValue(revenue.get(eventName));
                row.createCell(3).setCellValue(ticketsCancelled.get(eventName));
                row.createCell(4).setCellValue(customerEmails.get(eventName));
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
