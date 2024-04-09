package g2t5.database.entity;

import java.util.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "events")
public class Concert extends Event {
    private String type = "Concert";

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
