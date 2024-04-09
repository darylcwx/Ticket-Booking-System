package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "events")
public class Event {

  @Id
  private String id;

  private String name;
  private String description;
  private Date datetime = new Date();
  private double ticketPrice;
  private int ticketsAvailable;
  private int ticketsSold;
  private String status;
  private double cancellationFee;
  private int guestsAllowed;
  private String image;
  private String venue;

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Date getDatetime() {
    return datetime;
  }

  public void setDatetime(Date datetime) {
    this.datetime = datetime;
  }

  public double getTicketPrice() {
    return ticketPrice;
  }

  public void setTicketPrice(double ticketPrice) {
    this.ticketPrice = ticketPrice;
  }

  public int getTicketsAvailable() {
    return ticketsAvailable;
  }

  public void setTicketsAvailable(int ticketsAvailable) {
    this.ticketsAvailable = ticketsAvailable;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public double getCancellationFee() {
    return cancellationFee;
  }

  public void setCancellationFee(double cancellationFee) {
    this.cancellationFee = cancellationFee;
  }

  public int getGuestsAllowed() {
    return guestsAllowed;
  }

  public void setGuestsAllowed(int guestsAllowed) {
    this.guestsAllowed = guestsAllowed;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public int getTicketsSold() {
    return this.ticketsSold;
  }

  public void setTicketsSold(int ticketsSold){
    this.ticketsSold = ticketsSold;
  }

  public String getVenue(){
    return this.venue;
  }

  public void setVenue(String venue){
    this.venue = venue;
  }
}
