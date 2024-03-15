package g2t5.database.entity;

import java.util.ArrayList;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



public class TicketingOfficer extends User{
    public void createTicket(String type) {
        //
    }
    
      public void verifyTicketValidity (Ticket ticket) {
        // ticket.verifyValidity(ticket);
    }
}
