package g2t5.database.repository;

import g2t5.database.entity.Event;
import g2t5.database.entity.EventManager;
import g2t5.database.entity.TicketingManager;

import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends MongoRepository<EventManager, String> {

}
