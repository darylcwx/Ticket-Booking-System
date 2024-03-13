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

  public ArrayList<Map<String, Integer>> getCart(String username)
    throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    if (customer == null) {
      throw new Exception("User not found");
    }
    ArrayList<Map<String, Integer>> cart = customer.getCart();
    return cart;
  }

  public void addToCart(String username, String eventId, Integer quantity)
    throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    ArrayList<Map<String, Integer>> cart = customer.getCart();
    boolean eventInCart = false;
    if (cart.size() == 0) {
      System.out.println(eventId + quantity);
      Map<String, Integer> newItem = new HashMap<>();
      newItem.put(eventId, quantity);
      cart.add(newItem);
    } else {
      for (Map<String, Integer> eachEvent : cart) {
        if (eachEvent.containsKey(eventId)) {
          int currentQuantity = eachEvent.get(eventId);
          eachEvent.put(eventId, currentQuantity + quantity);
          eventInCart = true;
          break;
        }
      }
      if (!eventInCart) {
        Map<String, Integer> newItem = new HashMap<>();
        newItem.put(eventId, quantity);
        cart.add(newItem);
      }
    }
    customer.setCart(cart);
    customerRepository.save(customer);
  }
}
