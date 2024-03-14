package g2t5.service;

import g2t5.database.entity.Ticket;
import g2t5.database.repository.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepo;

    public TicketService(TicketRepository ticketRepo) {
        this.ticketRepo = ticketRepo;
      }
      
}
