package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.model.LoginRequest;
import g2t5.service.EventService;
import g2t5.service.UserService;
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
public class Controller {

  private final UserService userService;
  private final EventService eventService;

  @Autowired
  public Controller(UserService userService, EventService eventService) {
    this.userService = userService;
    this.eventService = eventService;
  }

  //=================================================================================================================
  //SECTION - GET
  //=================================================================================================================
  @GetMapping("/hello")
  public Map<String, String> hello() {
    Map<String, String> response = new HashMap<>();
    response.put("data", "Hello from backend!");
    response.put("status", "200");
    return response;
  }

  @GetMapping("/error")
  public Map<String, String> error() {
    Map<String, String> response = new HashMap<>();
    response.put("data", "not found!");
    response.put("status", "404");
    return response;
  }

  @GetMapping("/users")
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.getAllUsers();
    return users == null
      ? ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(Collections.emptyList())
      : ResponseEntity.ok(users);
  }

  @GetMapping("/user/{username}")
  public ResponseEntity<Object> getUserByUsername(
    @PathVariable String username
  ) {
    User user = userService.getUserByUsername(username);
    return user == null
      ? ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body("{\"message\": \"User not found\"}")
      : ResponseEntity.ok(user);
  }

  @GetMapping("/events")
  public ResponseEntity<List<Event>> getAllEvents() {
    List<Event> events = eventService.getAllEvents();
    return events == null
      ? ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(Collections.emptyList())
      : ResponseEntity.ok(events);
  }

  @GetMapping("/event/{id}")
  public ResponseEntity<Object> getEventById(@PathVariable String id) {
    Event event = eventService.getEventById(id);
    return event == null
      ? ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body("{\"message\": \"Event not found\"}")
      : ResponseEntity.ok(event);
  }

  //=================================================================================================================
  //SECTION - POST
  //=================================================================================================================
  @PostMapping("/login")
  public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest) {
    String username = loginRequest.getUsername();
    String password = loginRequest.getPassword();
    return userService.authenticateUser(username, password);
  }
}
