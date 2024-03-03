package g2t5.service;

import g2t5.database.entity.User;
import g2t5.database.repository.UserRepository;
import java.util.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public void saveUser(User user) {
    userRepository.save(user);
  }

  public User getUserByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public void deleteUser(String id) {
    userRepository.deleteById(id);
  }

  public ResponseEntity<Object> addToCart(
    String username,
    String eventId,
    int quantity
  ) {
    try {
      User user = getUserByUsername(username);
      ArrayList<Map<String, Integer>> cart = user.getCart();
      boolean eventExists = false;
      for (Map<String, Integer> item : cart) {
        if (item.containsKey(eventId)) {
          // If the event exists, update the quantity
          int currentQuantity = item.get(eventId);
          item.put(eventId, currentQuantity + quantity);
          eventExists = true;
          break;
        }
      }
      if (!eventExists) {
        Map<String, Integer> newItem = new HashMap<>();
        newItem.put(eventId, quantity);
        cart.add(newItem);
      }
      user.setCart(cart);
      userRepository.save(user);
      return ResponseEntity.ok(
        "{\"message\": \"Added to cart\", \"status\": 200}"
      );
    } catch (Exception e) {
      return ResponseEntity
        .badRequest()
        .body("{\"message\": \"Couldn't add to cart\", \"status\": 400}");
    }
  }

  public ResponseEntity<Object> authenticateUser(
    String username,
    String password
  ) {
    try {
      User user = getUserByUsername(username);
      String hashedPassword = user.getPassword();
      try {
        String hashedInputPassword = DigestUtils.sha256Hex(username + password);

        //TODO - remove
        System.out.println(hashedInputPassword);
        System.out.println(hashedPassword);

        if (hashedInputPassword.equals(hashedPassword)) {
          return ResponseEntity.ok(
            "{\"message\": \"Login successful\", \"status\": 200}"
          );
        } else {
          return ResponseEntity
            .badRequest()
            .body("{\"message\": \"Password wrong\", \"status\": 400}");
        }
      } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity
          .badRequest()
          .body("{\"message\": \"Password wrong\", \"status\": 400}");
      }
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
        .badRequest()
        .body("{\"message\": \"User not found\", \"status\": 400}");
    }
  }
}
