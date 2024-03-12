package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class EventManager extends User {
    private Report report;
}