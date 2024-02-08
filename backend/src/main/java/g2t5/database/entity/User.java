package g2t5.database.entity;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Users")
public class User {

  private String id;
  private String username;
  private String email;
}
