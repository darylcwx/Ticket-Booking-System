package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;

public class Customer extends User {

  private ArrayList<Map<String, Integer>> cart;

  public ArrayList<Map<String, Integer>> getCart() {
    return cart;
  }

  public void setCart(ArrayList<Map<String, Integer>> cart) {
    this.cart = cart;
  }

  public String toString() {
    return super.toString() + " Cart: [" + cart + "]";
  }
}
