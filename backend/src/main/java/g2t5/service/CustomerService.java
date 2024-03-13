package g2t5.service;

import g2t5.database.entity.Customer;
import g2t5.database.entity.Event;
import g2t5.database.repository.CustomerRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

  @Autowired
  private CustomerRepository customerRepository;

  public Customer getCustomerByUsername(String username) {
    return customerRepository.findByUsername(username);
  }

  public ArrayList<Map<String, Object>> getCart(String username)
    throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    if (customer == null) {
      throw new Exception("User not found");
    }
    ArrayList<Map<String, Object>> cart = customer.getCart();
    return cart;
  }

  public void addToCart(String username, String eventId, int quantity)
    throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    ArrayList<Map<String, Object>> cart = customer.getCart();
    boolean eventInCart = false;
    if (cart.size() == 0) {
      System.out.println(eventId + quantity);
      Map<String, Object> newItem = new HashMap<>();
      newItem.put("id", eventId);
      newItem.put("quantity", quantity);
      cart.add(newItem);
    } else {
      for (Map<String, Object> cartItem : cart) {
        if (cartItem.get("id").equals(eventId)) {
          int currentQuantity = (int) cartItem.get("quantity");
          cartItem.put("quantity", currentQuantity + quantity);
          eventInCart = true;
          break;
        }
      }
      if (!eventInCart) {
        Map<String, Object> newItem = new HashMap<>();
        newItem.put("id", eventId);
        newItem.put("quantity", quantity);
        cart.add(newItem);
      }
    }
    customer.setCart(cart);
    customerRepository.save(customer);
  }

  public void removeFromCart(String username, String eventId)
    throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    ArrayList<Map<String, Object>> cart = customer.getCart();
    if (cart.size() != 0) {
      for (Map<String, Object> cartItem : cart) {
        if (cartItem.get("id").equals(eventId)) {
          cart.remove(cartItem);
          break;
        }
      }
    }
    customer.setCart(cart);
    customerRepository.save(customer);
  }
}
