package g2t5.database.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ticket")
public class Ticket {
    @Id
    private String ticketId;
    
    private String eventName;

    private String venue;

    private String datetime;

    private double price;

    private String customerName;

    private String customerEmail;

    private String status;

    public Ticket() {}

    public Ticket(String eventName, String venue, String datetime, double price, String customerName, String customerEmail, String status) {
        this.eventName = eventName;
        this.venue = venue;
        this.datetime = datetime;
        this.price = price;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.status = status;
    }



    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }


    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDatetime() {
        return datetime;
    }

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getStatus() {
        return status;
    }  

    public void setStatus(String status) {
        this.status = status;
    }


    
}
