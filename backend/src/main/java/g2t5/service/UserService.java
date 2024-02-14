package g2t5.service;

import g2t5.database.entity.*;
import g2t5.database.repository.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private UserRepository repository;

  public void saveUser(User user) {
    repository.save(user);
  }

  public User getUser(String emailAddress) {
    return repository.findByEmailAddress(emailAddress);
  }

  public List<User> getAllUsers() {
    return repository.findAll();
  }

  public void deleteUser(String id) {
    repository.deleteById(id);
  }
}
