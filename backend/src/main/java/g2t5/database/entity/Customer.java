package g2t5.database.entity;

import java.util.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class Customer extends User {

  private List<Map<String, Object>> cart; 
  private double accountBalance;
  private List<Booking> bookings; 

  public double getAccountBalance() {
    return accountBalance;
  }

  public void setAccountBalance(double accountBalance) {
    this.accountBalance = accountBalance;
  }

  public List<Map<String, Object>> getCart() {
    return cart;
  }

  public void setCart(List<Map<String, Object>> cart) {
    this.cart = cart;
  }

  public List<Booking> getBookings() {
    return bookings;
  }

  public void setBookings(List<Booking> bookings) {
    this.bookings = bookings;
  }

  public String toString() {
    return " Account Balance: [" + accountBalance + "]" + " Cart: [" + cart + "]" + " Bookings: [" + bookings + "]";
  }
}
