package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;

public class Customer extends User {

  private ArrayList<Map<String, Object>> cart;
  private double accountBalance;
  private ArrayList<String> bookingHistory; // store booking IDs

  public double getAccountBalance() {
    return accountBalance;
  }

  public void setAccountBalance(double accountBalance) {
    this.accountBalance = accountBalance;
  }

  public ArrayList<Map<String, Object>> getCart() {
    return cart;
  }

  public void setCart(ArrayList<Map<String, Object>> cart) {
    this.cart = cart;
  }

  public ArrayList<String> getBookingHistory() {
    return bookingHistory;
  }

  public void setBookingHistory(ArrayList<String> bookingHistory) {
    this.bookingHistory = bookingHistory;
  }

  public String toString() {
    return super.toString() + " Account Balance: [" + accountBalance + "]" + " Cart: [" + cart + "]" + " Booking History: [" + bookingHistory + "]";
  }
}
