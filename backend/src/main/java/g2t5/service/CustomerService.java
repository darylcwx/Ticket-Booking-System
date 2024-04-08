package g2t5.service;

import g2t5.database.entity.Customer;
import g2t5.database.entity.Event;
import g2t5.database.repository.CustomerRepository;
import g2t5.database.repository.EventRepository;
import java.util.ArrayList;
import org.apache.commons.codec.digest.DigestUtils;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

  @Autowired
  private CustomerRepository customerRepository;

  private EventRepository eventRepository;

  public Customer getCustomerByUsername(String username) {
    return customerRepository.findByUsername(username);
  }

  public void registerCustomer(String username, String password) {
    Customer customer = new Customer();
    customer.setUsername(username);
    customer.setPassword(DigestUtils.sha256Hex(username + password));
    customer.setRole("customer");
    customer.setCart(new ArrayList<Map<String, Object>>());
    customer.setAccountBalance(1000);
    customer.setBookings(new ArrayList<Map<String, Object>>());
    customerRepository.save(customer);
  }

  public void changePassword(String username, String newPassword) {
    Customer customer = customerRepository.findByUsername(username);
    customer.setPassword(DigestUtils.sha256Hex(username + newPassword));
    customerRepository.save(customer);
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
    if (cart.isEmpty() == false) {
      for (Map<String, Object> cartItem : cart) {
        if (cartItem.get("id").equals(eventId)) {
          int currentQuantity = (int) cartItem.get("quantity");
          cartItem.put("quantity", currentQuantity + quantity);
          eventInCart = true;
          break;
        }
      }
    }
    if (!eventInCart) {
      Map<String, Object> newItem = new HashMap<>();
      newItem.put("id", eventId);
      newItem.put("quantity", quantity);
      cart.add(newItem);
    }
    customer.setCart(cart);
    customerRepository.save(customer);
  }

  public void removeFromCart(String username, String eventId) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    ArrayList<Map<String, Object>> cart = customer.getCart();
    if (cart.size() != 0) {
      for (Map<String, Object> cartItem : cart) {
        if (cartItem.get("id").equals(eventId)) {
          int currentQuantity = (int) cartItem.get("quantity");
          if (currentQuantity == 1) {
            cart.remove(cartItem);
          } else {
            cartItem.put("quantity", currentQuantity - 1);
          }
          break;
        }
      }
    }
    customer.setCart(cart);
    customerRepository.save(customer);
  }

  public ArrayList<Map<String, Object>> getBookings(String username)
      throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    if (customer == null) {
      throw new Exception("User not found");
    }
    return customer.getBookings();
  }
  // public ArrayList<Map<String, Object>> createBooking(String username, String
  // eventId, int numberOfTickets)
  // throws Exception {
  // Customer customer = customerRepository.findByUsername(username);
  // ArrayList<Map<String, Object>> bookings = customer.getBookings();
  // Event event = eventRepository.findbyId(eventId);
  // int guestsAllowed = event.getGuestsAllowed();
  // boolean bookingExist = false;

  // if (event.getTicketsAvailable() >= numberOfTickets && numberOfTickets <=
  // guestsAllowed){
  // for (int i = 0; i < bookings.size(); i++){
  // Map<String, Object> booking = bookings.get(i);
  // int numTix = (booking.get("tickets")).size();
  // if (booking.get("eventId") == eventId && numberOfTickets <= guestsAllowed -
  // numTix){
  // // booking.put("bookingId", bookingId); // how to generate IDs?
  // booking.put("eventId", eventId);
  // ArrayList<Map<String, Object>> tickets = new ArrayList<>();
  // // for (int i = 0; i < numberOfTickets; i++){
  // // // add new ticket
  // // }
  // booking.put("tickets", tickets);
  // booking.put("status", "processing"); // what are the diff status?
  // bookings.add(booking);
  // bookingExist = true;
  // break;
  // }
  // }

  // if (!bookingExist || bookings.size() == 0){
  // Map<String, Object> booking = new HashMap<>();
  // // booking.put("bookingId", bookingId); // how to generate IDs?
  // booking.put("eventId", eventId);
  // ArrayList<Map<String, Object>> tickets = new ArrayList<>();
  // // for (int i = 0; i < numberOfTickets; i++){
  // // // add new ticket
  // // }
  // booking.put("tickets", tickets);
  // booking.put("status", "processing"); // what are the diff status?
  // bookings.add(booking);
  // }

  // customer.setBookings(bookings);
  // customerRepository.save(customer);
  // }
  // }
}
