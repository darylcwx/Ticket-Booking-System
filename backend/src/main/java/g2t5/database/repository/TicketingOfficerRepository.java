package g2t5.database.repository;

import g2t5.database.entity.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketingOfficerRepository extends MongoRepository<TicketingOfficer, String>  {
    
}
