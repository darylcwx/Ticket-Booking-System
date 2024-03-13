package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

  @Id
  private String id;

  private String username;
  private String password;
  private String role;

  public String getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String toString() {
    return (
      "User: [username: " +
      username +
      ", password: " +
      password +
      ", role: " +
      role +
      "]"
    );
  }
}
