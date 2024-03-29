package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.model.AddToCartRequest;
import g2t5.model.CreateBookingRequest;
// import g2t5.model.CancelBookingRequest;
import g2t5.model.LoginRequest;
import g2t5.model.RemoveFromCartRequest;
import g2t5.service.CustomerService;
import g2t5.service.EventManagerService;
import g2t5.service.EventService;
import g2t5.service.UserService;
import java.util.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
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

@RestController
@CrossOrigin(
  origins = "http://localhost:5173/",
  methods = {
    RequestMethod.GET,
    RequestMethod.POST,
    RequestMethod.PUT,
    RequestMethod.DELETE,
  }
)
public class CustomerController {

  private final UserService userService;
  private final CustomerService customerService;

  @Autowired
  public CustomerController(
    UserService userService,
    CustomerService customerService
  ) {
    this.userService = userService;
    this.customerService = customerService;
  }

  @GetMapping("/cart/{username}")
  public ResponseEntity<Object> getCartByUsername(
    @PathVariable String username
  ) {
    try {
      ArrayList<Map<String, Object>> cart = customerService.getCart(username);
      return ResponseEntity.ok(cart);
    } catch (Exception e) {
      return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body("{\"message\": \"User not found\"}");
    }
  }

  @PostMapping("/cart/add")
  public ResponseEntity<String> addToCart(
    @RequestBody AddToCartRequest request
  ) {
    String username = request.getUsername();
    String eventId = request.getEventId();
    int quantity = request.getQuantity();
    try {
      customerService.addToCart(username, eventId, quantity);
      return ResponseEntity.ok("{\"message\": \"Added to cart successfully\"}");
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @PostMapping("/cart/remove")
  public ResponseEntity<String> removeFromCart(
    @RequestBody RemoveFromCartRequest request
  ) {
    String username = request.getUsername();
    String eventId = request.getEventId();
    try {
      customerService.removeFromCart(username, eventId);
      return ResponseEntity.ok(
        "{\"message\": \"Removed from cart successfully\"}"
      );
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("{\"message\": \"Something went wrong\"}");
    }
  }

  @PostMapping("/bookings/{username}")
  public ResponseEntity<Object> getBookings(@PathVariable String username) {
    try {
      ArrayList<Map<String, Object>> bookings = customerService.getBookings(
        username
      );
      return ResponseEntity.ok(bookings);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body("{\"message\": \"User not found\"}");
    }
  }
  // @PostMapping("/booking/create")
  // public ResponseEntity<String> createBooking(
  //   @RequestBody CreateBookingRequest request
  // ) {
  //   String username = request.getUsername();
  //   String eventId = request.getEventId();
  //   int numberOfTickets = request.getNumberOfTickets();
  //   try {
  //     customerService.createBooking(username, eventId, numberOfTickets);
  //     return ResponseEntity.ok("{\"message\": \"Created booking successfully\"}");
  //   } catch (Exception e) {
  //     System.out.println(e.getMessage());
  //     return ResponseEntity
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .body("{\"message\": \"Something went wrong\"}");
  //   }
  // }

  // @PostMapping("/booking/cancel")
  // public ResponseEntity<String> cancelBooking(
  //   @RequestBody CancelBookingRequest request
  // ) {
  // }
}
