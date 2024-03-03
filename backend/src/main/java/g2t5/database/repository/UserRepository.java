package g2t5.database.repository;

import g2t5.database.entity.User;
import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
  User findByUsername(String username);
  List<User> findAll();
}
