package g2t5.service;

import g2t5.database.entity.User;
import g2t5.database.repository.UserRepository;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
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

  public User getUser(String emailAddress) {
    return userRepository.findByEmailAddress(emailAddress);
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public void deleteUser(String id) {
    userRepository.deleteById(id);
  }
}
