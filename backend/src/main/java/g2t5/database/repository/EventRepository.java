package g2t5.database.repository;

import g2t5.database.entity.Event;
import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.bson.types.ObjectId;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
  Event findByName(String name);

  Optional<Event> findById(ObjectId id);

  List<Event> findAll();
}
