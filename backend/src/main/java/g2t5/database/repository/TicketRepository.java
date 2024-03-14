package g2t5.database.repository;

import g2t5.database.entity.Ticket;
import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String>{
    List<Ticket> findAll();
}
