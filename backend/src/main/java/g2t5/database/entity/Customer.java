package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;

public class Customer extends User {

  private ArrayList<Map<String, Object>> cart;

  public ArrayList<Map<String, Object>> getCart() {
    return cart;
  }

  public void setCart(ArrayList<Map<String, Object>> cart) {
    this.cart = cart;
  }

  public String toString() {
    return super.toString() + " Cart: [" + cart + "]";
  }
}
