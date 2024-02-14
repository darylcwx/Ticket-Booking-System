package g2t5.controller;

import g2t5.database.entity.*;
import g2t5.service.UserService;
import java.util.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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

  UserService userService = new UserService();

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
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }
}
