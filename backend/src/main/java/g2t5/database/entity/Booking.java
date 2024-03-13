package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;

public class Booking {
    private String bookingId;
    private String eventId;
    // private ArrayList<Ticket> ticketIds;
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

    // public int getNumberOfTickets() {
    //     return ticketIds.size();
    // }

    // public ArrayList<Ticket> getTicketIds() {
    //     return ticketIds;
    // }

    // public void setTicketIds(ArrayList<Ticket> ticketIds){
    //     this.ticketIds = ticketIds;
    // }

    // public String toString() {
    //     return "Booking ID: [" + bookingId + "]" + " Event ID: [" + eventId + "]" + " Number of tickets: [" + getNumberOfTickets() + "]" + " Status: [" + status + "]";
    // }
}
