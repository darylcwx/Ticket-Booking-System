package g2t5.service;

import g2t5.database.entity.Customer;
import g2t5.database.entity.Event;
import g2t5.database.entity.Booking;
import g2t5.database.repository.CustomerRepository;
import g2t5.database.repository.EventRepository;
import java.util.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;

@Service
public class CustomerService {

  @Autowired
  private CustomerRepository customerRepository;
  private EventRepository eventRepository;

  public CustomerService(CustomerRepository customerRepository, EventRepository eventRepository) {
    this.customerRepository = customerRepository;
    this.eventRepository = eventRepository;
  }

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
    customer.setBookings(new ArrayList<Booking>());
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

  public boolean addToCart(String username, String eventId, int quantity) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    ArrayList<Map<String, Object>> cart = customer.getCart();
    List<Booking> bookings = customer.getBookings();
    Event event = eventRepository.findById(new ObjectId(eventId)).get();
    int guestsAllowed = event.getGuestsAllowed();
    int qty = 0;

    if (quantity > guestsAllowed) {
      return false;
    }

    if (bookings.isEmpty() == false) {
      for (Booking booking : bookings) {
        if (booking.getEventId().equals(eventId)) {
          qty += booking.getTickets().size();
        }
      }
    }

    boolean eventInCart = false;
    if (cart.isEmpty() == false) {
      for (Map<String, Object> cartItem : cart) {
        if (cartItem.get("id").equals(eventId)) {
          int cartqty = (int) cartItem.get("quantity");
          if (qty + cartqty + quantity > guestsAllowed) {
            return false;
          }
          cartItem.put("quantity", cartqty + quantity);
          eventInCart = true;
          break;
        }
      }
    }
    if (!eventInCart) {
      if (qty + quantity > guestsAllowed) {
        return false;
      }
      Map<String, Object> newItem = new HashMap<>();
      newItem.put("id", eventId);
      newItem.put("quantity", quantity);
      cart.add(newItem);
    }
    customer.setCart(cart);
    customerRepository.save(customer);
    return true;
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

  public List<Booking> getBookings(String username)
      throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    if (customer == null) {
      throw new Exception("User not found");
    }
    return customer.getBookings();
  }

  public boolean checkBalance(String username, String eventId, int qty) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    Event event = eventRepository.findById(new ObjectId(eventId)).get();
    double total = event.getTicketPrice() * qty;
    double balance = customer.getAccountBalance();

    if (balance - total < 0) {
      return false;
    }

    return true;
  }

  public void createBooking(String username, Booking booking, int qty) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    List<Booking> custBookings = customer.getBookings();
    custBookings.add(booking);
    customer.setBookings(custBookings);

    Event event = eventRepository.findById(new ObjectId(booking.getEventId())).get();
    double totalPrice = event.getTicketPrice() * qty;
    double balance = customer.getAccountBalance();
    customer.setAccountBalance(balance - totalPrice);

    customerRepository.save(customer);

  }

  public void cancelAndRefundBooking(String username, String bookingid) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    List<Booking> bookings = customer.getBookings();
    for (Booking booking : bookings) {
      if (booking.getBookingId().equals(bookingid)) {
        booking.setStatus("cancelled");
        Event event = eventRepository.findById(new ObjectId(booking.getEventId())).get();
        double totalPrice = event.getTicketPrice() * booking.getTickets().size();
        double balance = customer.getAccountBalance();
        double cancellationFee = event.getCancellationFee() * booking.getTickets().size();

        customer.setAccountBalance(balance + totalPrice - cancellationFee);
        customer.setBookings(bookings);
        customerRepository.save(customer);
        break;
      }
    }
  }

  public void refundEventBookings(List<Booking> bookings) throws Exception {
    for (Booking booking : bookings) {
      String username = booking.getCustomerId();
      Customer customer = customerRepository.findByUsername(username);
      List<Booking> custBookings = customer.getBookings();

      for (Booking custBook : custBookings) {
        if (booking.getBookingId().equals(custBook.getBookingId())) {
          custBook.setStatus("cancelled");
          customer.setBookings(custBookings);
          customerRepository.save(customer);
        }
      }
    }
  }

}
