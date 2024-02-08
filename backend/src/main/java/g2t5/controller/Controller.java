package g2t5.controller;

import g2t5.config.Cors;
import java.util.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

  @GetMapping("/hello")
  public Map<String, String> hello() {
    Map<String, String> response = new HashMap<>();
    response.put("data", "Hello from backend!");
    response.put("status", "200");
    return response;
  }
}
