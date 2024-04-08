package g2t5.database.entity;

import java.util.*;

public class Booking {
    private String bookingId;
    private String eventId;
    private String customerId;
    private List<Ticket> tickets;
    private String status;

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId){
        this.bookingId = bookingId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId){
        this.customerId = customerId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId){
        this.eventId = eventId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus (String status){
        this.status = status;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets){
        this.tickets = tickets;
    }

    public String toString() {
        return "Booking ID: [" + bookingId + "]" + " Event ID: [" + eventId + "]" + " Tickets: [" + tickets + "]" + " Status: [" + status + "]";
    }
}
