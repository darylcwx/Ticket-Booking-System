package g2t5;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import g2t5.database.repository.*;

@SpringBootApplication
@EnableMongoRepositories
public class TicketBookingSystemApplication {

  @Autowired
  UserRepository User;

  public static void main(String[] args) {
    SpringApplication.run(TicketBookingSystemApplication.class, args);
  }
}
