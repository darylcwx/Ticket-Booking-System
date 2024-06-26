package g2t5.controller;

import g2t5.database.entity.Customer;
import g2t5.database.entity.Booking;
import g2t5.database.entity.User;
import g2t5.database.entity.Ticket;
import g2t5.database.entity.Payment;
import g2t5.model.AddToCartRequest;
import g2t5.model.CreateBookingRequest;
import g2t5.model.CancelBookingRequest;
import g2t5.model.GetBookingsRequest;
import g2t5.model.TopupRequest;
import g2t5.model.LoginRequest;
import g2t5.model.ChangePasswordRequest;
import g2t5.model.RemoveFromCartRequest;
import g2t5.service.CustomerService;
import g2t5.service.EventManagerService;
import g2t5.service.EventService;
import g2t5.service.UserService;
import g2t5.service.BookingService;
import g2t5.service.TicketService;
import g2t5.service.PaymentService;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.stripe.exception.StripeException;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@CrossOrigin(origins = "http://localhost:5173/", methods = {
    RequestMethod.GET,
    RequestMethod.POST,
    RequestMethod.PUT,
    RequestMethod.DELETE,
})
public class CustomerController {

  private final UserService userService;
  private final CustomerService customerService;
  private final BookingService bookingService;
  private final TicketService ticketService;
  private final PaymentService paymentService;

  @Autowired
  public CustomerController(
      UserService userService,
      CustomerService customerService,
      BookingService bookingService,
      TicketService ticketService,
      PaymentService paymentService) {
    this.userService = userService;
    this.customerService = customerService;
    this.bookingService = bookingService;
    this.ticketService = ticketService;
    this.paymentService = paymentService;
  }

  @PostMapping("/register")
  public ResponseEntity<Object> register(@RequestBody LoginRequest request) {
    String username = request.getUsername();
    String password = request.getPassword();
    try {
      customerService.registerCustomer(username, password);
      return ResponseEntity.ok("{\"message\": \"Customer registered\", \"status\": 200}");
    } catch (Exception e) {
      return ResponseEntity
          .badRequest()
          .body("{\"message\": \"Something went wrong\", \"status\": 400}");
    }
  }

  @PostMapping("/adminChangePassword")
  public ResponseEntity<Object> changePassword(@RequestBody LoginRequest request) {
    String username = request.getUsername();
    String password = request.getPassword();
    try {
      customerService.changePassword(username, password);
      return ResponseEntity.ok("{\"message\": \"Password changed\", \"status\": 200}");
    } catch (Exception e) {
      return ResponseEntity
          .badRequest()
          .body("{\"message\": \"Something went wrong\", \"status\": 400}");
    }
  }

  @PostMapping("/changePassword")
  public ResponseEntity<Object> resetPassword(@RequestBody ChangePasswordRequest request) {
    String username = request.getUsername();
    String oldPassword = request.getOldPassword();
    String newPassword = request.getNewPassword();
    try {
      ResponseEntity<Object> auth = userService.authenticateUser(username, oldPassword);
      if (auth.getBody().toString().contains("Login successful")) {
        customerService.changePassword(username, newPassword);
        return ResponseEntity.ok("{\"message\": \"Password changed\", \"status\": 200}");
      } else {
        return ResponseEntity
            .badRequest()
            .body("{\"message\": \"Old password incorrect\", \"status\": 400}");
      }
    } catch (Exception e) {
      return ResponseEntity
          .badRequest()
          .body("{\"message\": \"Something went wrong\", \"status\": 400}");
    }
  }

  @GetMapping("/cart/{username}")
  public ResponseEntity<Object> getCartByUsername(
      @PathVariable String username) {
    try {
      List<Map<String, Object>> cart = customerService.getCart(username);
      return ResponseEntity.ok(cart);
    } catch (Exception e) {
      return ResponseEntity
          .badRequest()
          .body("{\"message\": \"User not found\"}");
    }
  }

  @PostMapping("/cart/add")
  public ResponseEntity<String> addToCart(
      @RequestBody AddToCartRequest request) {
    String username = request.getUsername();
    String eventId = request.getEventId();
    int quantity = request.getQuantity();
    try {
      boolean success = customerService.addToCart(username, eventId, quantity);
      if (success) {
        return ResponseEntity.ok("{\"message\": \"Added to cart successfully\"}");
      } else {
        return ResponseEntity.ok("{\"message\": \"Maximum quantity reached\"}");
      }

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @PostMapping("/cart/remove")
  public ResponseEntity<String> removeFromCart(
      @RequestBody RemoveFromCartRequest request) {
    String username = request.getUsername();
    String eventId = request.getEventId();
    try {
      customerService.removeFromCart(username, eventId);
      return ResponseEntity.ok(
          "{\"message\": \"Removed from cart successfully\"}");
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @GetMapping("/bookings/{username}")
  public ResponseEntity<Object> getBookings(@PathVariable String username,
      @RequestParam Map<String, String> queryParams) {
    String status = queryParams.get("status");
    try {
      List<Booking> bookings = customerService.getBookings(username, status); // created, cancelled, completed
      List<Map<String, Object>> result = new ArrayList<>();

      for (Booking booking : bookings) {
        Map<String, Object> arr = new HashMap<>();
        List<Ticket> tickets = ticketService.getBookingTickets(booking.getTickets());
        arr.put("booking", booking);
        arr.put("tickets", tickets);
        result.add(arr);

      }

      return ResponseEntity.ok(result);

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.NOT_FOUND)
          .body("{\"message\": \"User not found\"}");
    }
  }

  @PostMapping("/booking/create")
  public ResponseEntity<String> createBooking(@RequestBody CreateBookingRequest request) {
    String username = request.getUsername();
    String eventId = request.getEventId();
    int numberOfTickets = request.getNumberOfTickets();

    try {
      boolean check = customerService.checkBalance(username, eventId, numberOfTickets);

      if (check) {
        Booking booking = bookingService.createBooking(username, eventId, numberOfTickets);
        if (booking != null) {
          customerService.createBooking(username, booking, numberOfTickets);
          return ResponseEntity.ok("{\"message\": \"Created booking successfully\"}");
        } else {
          return ResponseEntity.ok("{\"message\": \"Unable to book for event\"}");
        }

      } else {
        return ResponseEntity.ok("{\"message\": \"Insufficient balance\"}");
      }

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @PostMapping("/booking/cancel")
  public ResponseEntity<String> cancelBooking(@RequestBody CancelBookingRequest request) {
    String username = request.getUsername();
    String bookingId = request.getBookingId();

    try {
      boolean check = bookingService.cancelBooking(bookingId);
      System.out.println(check);
      if (check) {
        customerService.cancelAndRefundBooking(username, bookingId);
        return ResponseEntity.ok("{\"message\": \"Cancelled booking successfully\"}");
      } else {
        return ResponseEntity.ok("{\"message\": \"Unable to cancel booking\"}");
      }

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @PostMapping("/topup")
  public ResponseEntity<String> topupAccount(@RequestBody TopupRequest request) throws StripeException {
    String username = request.getUsername();
    Double amount = request.getAmount();

    try {
      Payment payment = paymentService.createPayment(amount, username);

      customerService.updatePendingPayment(username, payment.getId());

      String url = paymentService.createCheckoutSession(username, payment.getAmount(), payment.getId());

      return ResponseEntity.ok("{\"message\": \"" + url + "\"}");

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @GetMapping("/payment-status/{username}")
  public ResponseEntity<String> getPaymentStatus(@PathVariable String username) {

    try {
      String status = customerService.getPaymentStatus(username);
      customerService.updatePendingPayment(username, null);

      if (status == null) {
        return ResponseEntity.ok("{\"message\": \"No pending payments\"}");

      } else if (status.equals("success")) {
        return ResponseEntity.ok("{\"message\": \"Payment Successful\"}");

      } else {
        return ResponseEntity.ok("{\"message\": \"Payment Unsuccessful\"}");

      }

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("{\"message\": \"Something went wrong\"}");
    }
  }
}
