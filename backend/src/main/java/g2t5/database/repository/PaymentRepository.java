package g2t5.database.repository;

import g2t5.database.entity.Payment;
import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String>{
    List<Payment> findAll();
}
