package g2t5.database.entity;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class EventManager extends User {
    
}