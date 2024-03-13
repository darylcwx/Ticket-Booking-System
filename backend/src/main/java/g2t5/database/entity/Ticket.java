package g2t5.database.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ticket")
public class Ticket {
    @Id
    private String ticketId;

    private String ticketType;

    public Ticket(String ticketType){
        this.ticketType = ticketType;
    }

    public boolean verifyValidity(){
        return false;
    }
}
