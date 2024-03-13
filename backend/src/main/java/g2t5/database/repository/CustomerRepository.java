package g2t5.database.repository;

import g2t5.database.entity.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
  Customer findByUsername(String username);
}
