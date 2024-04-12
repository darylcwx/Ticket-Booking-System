package g2t5.service;

import g2t5.database.entity.Customer;
import g2t5.database.entity.Event;
import g2t5.database.entity.Booking;
import g2t5.database.entity.Payment;
import g2t5.database.entity.BookingComparator;
import g2t5.database.repository.CustomerRepository;
import g2t5.database.repository.EventRepository;
import g2t5.database.repository.BookingRepository;
import java.util.*;
import java.math.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

  @Autowired
  private final CustomerRepository customerRepository;
  private final EventRepository eventRepository;
  private final BookingRepository bookingRepository;
  private final BookingService bookingService;
  private final PaymentService paymentService;

  @Autowired
  public CustomerService(CustomerRepository customerRepository, EventRepository eventRepository,
      BookingRepository bookingRepository, BookingService bookingService, PaymentService paymentService) {
    this.customerRepository = customerRepository;
    this.eventRepository = eventRepository;
    this.bookingRepository = bookingRepository;
    this.bookingService = bookingService;
    this.paymentService = paymentService;
  }

  public Customer getCustomerByUsername(String username) {
    return customerRepository.findByUsername(username);
  }

  public void registerCustomer(String username, String password) {
    Customer customer = new Customer();
    customer.setUsername(username);
    customer.setPassword(DigestUtils.sha256Hex(username + password));
    customer.setRole("customer");
    customerRepository.save(customer);
  }

  public void changePassword(String username, String newPassword) {
    Customer customer = customerRepository.findByUsername(username);
    customer.setPassword(DigestUtils.sha256Hex(username + newPassword));
    customerRepository.save(customer);
  }

  public List<Map<String, Object>> getCart(String username) throws Exception {
    Customer customer = customerRepository.findByUsername(username);

    if (customer == null) {
      throw new Exception("User not found");
    }

    List<Map<String, Object>> cart = customer.getCart();
    return cart;
  }

  public boolean addToCart(String username, String eventId, int quantity) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    List<Map<String, Object>> cart = customer.getCart();
    List<String> bookings = customer.getBookings();

    Event event = eventRepository.findById(eventId).get();
    int tixAvail = event.getTicketsAvailable();
    int guestsAllowed = event.getGuestsAllowed();

    int qty = 0;

    if (quantity > tixAvail || quantity > guestsAllowed) {
      return false;
    }

    if (bookings.isEmpty() == false) {
      for (String bid : bookings) {
        Booking booking = bookingRepository.findById(bid).get();
        if (booking.getEventId().equals(eventId) && booking.getStatus().equals("created")) {
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
    List<Map<String, Object>> cart = customer.getCart();
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

  public List<Booking> getBookings(String username, String status) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    if (customer == null) {
      throw new Exception("User not found");
    }
    List<String> bookings = customer.getBookings();
    List<Booking> lst = new ArrayList<>();
    for (String bid : bookings) {
      Booking booking = bookingRepository.findById(bid).get();
      if (status.equals("all")) {
        lst.add(booking);
      } else if (booking.getStatus().equals(status)) {
        lst.add(booking);
      }
    }
    Collections.sort(lst, new BookingComparator());
    return lst;
  }

  public boolean checkBalance(String username, String eventId, int qty) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    Event event = eventRepository.findById(eventId).get();
    double total = event.getTicketPrice() * qty;
    double balance = customer.getAccountBalance();

    if (balance - total < 0) {
      return false;
    }

    return true;
  }

  public void createBooking(String username, Booking booking, int qty) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    List<String> custBookings = customer.getBookings();
    custBookings.add(booking.getBookingId());
    customer.setBookings(custBookings);

    Event event = eventRepository.findById(booking.getEventId()).get();
    double totalPrice = event.getTicketPrice() * qty;
    double balance = customer.getAccountBalance();
    customer.setAccountBalance(balance - totalPrice);

    List<Map<String, Object>> cart = customer.getCart();
    for (Map<String, Object> item : cart) {
      if (item.get("id").equals(booking.getEventId())) {
        cart.remove(item);
        break;
      }
    }

    customerRepository.save(customer);

  }

  public void cancelAndRefundBooking(String username, String bookingid) throws Exception {
    Customer customer = customerRepository.findByUsername(username);
    List<String> bookings = customer.getBookings();
    for (String bid : bookings) {
      if (bid.equals(bookingid)) {
        Booking booking = bookingRepository.findById(bid).get();
        Event event = eventRepository.findById(booking.getEventId()).get();
        double totalPrice = event.getTicketPrice() * booking.getTickets().size();
        double balance = customer.getAccountBalance();
        double cancellationFee = event.getCancellationFee() * booking.getTickets().size();

        customer.setAccountBalance(balance + totalPrice - cancellationFee);
        customerRepository.save(customer);
        break;
      }
    }
  }

  public void refundEventBookings(String eventId) throws Exception {
    List<Booking> bookings = bookingService.getByEventId(eventId);
    Event event = eventRepository.findById(eventId).get();
    Double ticketPrice = event.getTicketPrice();

    for (Booking booking : bookings) {
      String username = booking.getCustomerId();
      Customer customer = customerRepository.findByUsername(username);
      List<String> custBookings = customer.getBookings();
      double balance = customer.getAccountBalance();

      for (String custBook : custBookings) {
        if (booking.getBookingId().equals(custBook)) {
          customer.setAccountBalance(balance + (ticketPrice * booking.getTickets().size()));
          customerRepository.save(customer);
          break;
        }
      }
    }
  }

  public boolean topupAccount(String username, Double amount, String paymentId) throws Exception {
    Payment payment = paymentService.getPayment(paymentId);
    Customer customer = customerRepository.findByUsername(username);
    List<Payment> payments = customer.getPaymentHistory();
    payments.add(0, payment);

    if (payment.getStatus().equals("paid")) {
      BigDecimal bd = new BigDecimal(amount + customer.getAccountBalance());
      bd = bd.setScale(2, RoundingMode.HALF_UP);
      customer.setAccountBalance(bd.doubleValue());

      customerRepository.save(customer);
      return true;
    }

    customerRepository.save(customer); 
    return false;
  }

  public void updatePendingPayment(String username, String pid){
    Customer customer = customerRepository.findByUsername(username);
    customer.setPendingPayment(pid);
    customerRepository.save(customer);
  }

  public String getPaymentStatus(String username){
    Customer customer = customerRepository.findByUsername(username);
    String pid = customer.getPendingPayment();
    if (pid == null){
      return null;

    }else {
      Payment payment = paymentService.getPayment(pid);

      if (payment.getStatus().equals("paid")){
        return "success";

      }else{
        return "fail";
      }
    }
  }


}
