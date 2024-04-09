package g2t5.database.repository;

import java.util.*;
import g2t5.database.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findAll();

    Optional<Booking> findById(String bookingId);
}

