package g2t5.service;

import g2t5.database.entity.*;
import g2t5.database.repository.UserRepository;
import g2t5.database.repository.CustomerRepository;
import java.util.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;
  private CustomerRepository customerRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
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

  public ResponseEntity<Object> authenticateUser(
      String username,
      String password) {
    try {
      User user = getUserByUsername(username);
      String hashedPassword = user.getPassword();
      try {
        String hashedInputPassword = DigestUtils.sha256Hex(username + password);

        // TODO - remove
        //System.out.println("hashedinput: " + hashedInputPassword);
        //System.out.println("actualpass: " + hashedPassword);

        if (hashedInputPassword.equals(hashedPassword)) {
          return ResponseEntity.ok(
              "{\"message\": \"Login successful\", \"status\": 200}");
        } else {
          return ResponseEntity
              .badRequest()
              .body("{\"message\": \"Email or password does not match our records\", \"status\": 400}");
        }
      } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity
            .badRequest()
            .body("{\"message\": \"Email or password does not match our records\", \"status\": 400}");
      }
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
          .badRequest()
          .body("{\"message\": \"User not found\", \"status\": 400}");
    }
  }
}
