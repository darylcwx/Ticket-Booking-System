package g2t5.model;

public class CreateBookingRequest {

  private String username;
  private String eventId;
  private int numberOfTickets;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEventId() {
    return eventId;
  }

  public void setEventId(String eventId) {
    this.eventId = eventId;
  }

  public int getNumberOfTickets() {
    return numberOfTickets;
  }

  public void setNumberOfTickets(int numberOfTickets) {
    this.numberOfTickets = numberOfTickets;
  }
}
