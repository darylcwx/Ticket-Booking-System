package g2t5.database.repository;

import g2t5.database.entity.EventManager;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends MongoRepository<EventManager, String> {

}
