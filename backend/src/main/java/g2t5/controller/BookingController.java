package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.service.CustomerService;
import g2t5.service.BookingService;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173/", methods = {
    RequestMethod.GET,
    RequestMethod.POST,
    RequestMethod.PUT,
    RequestMethod.DELETE,
})
public class BookingController {

  private final BookingService bookingService;
  private final CustomerService customerService;

  @Autowired
  public BookingController(
      BookingService bookingService,
      CustomerService customerService) {
    this.bookingService = bookingService;
    this.customerService = customerService;
      }


}
