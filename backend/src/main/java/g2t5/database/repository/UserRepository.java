package g2t5.database.repository;

import g2t5.database.entity.User;
import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
  User findByEmailAddress(String emailAddress);
  List<User> findAll();
}
