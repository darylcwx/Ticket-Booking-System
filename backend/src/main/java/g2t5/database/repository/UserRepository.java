package g2t5.database.repository;

import g2t5.database.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
  //User findByUsername(String username);
  //User findByEmail(String email);
}
