package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;

public class Booking {
    private String bookingId;
    private String eventId;
    private ArrayList<Map<String, Object>> tickets;
    private String status; 
    // payment details?

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId){
        this.bookingId = bookingId;
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

    public ArrayList<Map<String, Object>> getTickets() {
        return tickets;
    }

    public void setTickets(ArrayList<Map<String, Object>> tickets){
        this.tickets = tickets;
    }

    public String toString() {
        return "Booking ID: [" + bookingId + "]" + " Event ID: [" + eventId + "]" + " Tickets: [" + tickets + "]" + " Status: [" + status + "]";
    }
}
