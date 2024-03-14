package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;

public class Customer extends User {

  private ArrayList<Map<String, Object>> cart;
  private double accountBalance;
  private ArrayList<Map<String, Object>> bookings; 

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

  public ArrayList<Map<String, Object>> getBookings() {
    return bookings;
  }

  public void setBookings(ArrayList<Map<String, Object>> bookings) {
    this.bookings = bookings;
  }

  public String toString() {
    return super.toString() + " Account Balance: [" + accountBalance + "]" + " Cart: [" + cart + "]" + " Bookings: [" + bookings + "]";
  }
}
