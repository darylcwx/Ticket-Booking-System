package g2t5.database.entity;

import java.util.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "booking")
public class Booking {
    @Id
    private String bookingId;
    private String eventId;
    private String customerId;
    private List<String> tickets;
    private String status;
    private Date dateCreated;

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

    public List<String> getTickets() {
        return tickets;
    }

    public void setTickets(List<String> tickets){
        this.tickets = tickets;
    }

    public Date getDateCreated(){
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated){
        this.dateCreated = dateCreated;
    }

    public String toString() {
        return "Booking ID: [" + bookingId + "]" + " Event ID: [" + eventId + "]" + " Tickets: [" + tickets + "]" + " Status: [" + status + "]" + " Date Created: [" + dateCreated + "]";
    }
}
