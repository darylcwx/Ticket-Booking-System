package g2t5.model;

public class CancelBookingRequest {

  private String username;
  private String bookingId;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getBookingId() {
    return eventId;
  }

  public void setBookingId(String bookingId) {
    this.bookingId = bookingId;
  }
}
