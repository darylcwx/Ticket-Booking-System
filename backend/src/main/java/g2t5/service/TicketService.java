package g2t5.service;

import g2t5.database.entity.Ticket;
import g2t5.database.repository.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
      this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(Ticket ticket) {
      ticketRepository.save(ticket);

      return getTicket(ticket);
    }

    public List<Ticket> getAllTicket() {
       return ticketRepository.findAll();
    }

    public Ticket getTicket(Ticket ticket) {
      return ticketRepository.findById(ticket.getTicketId()).get();
   }

   public void deactivateTicket(Ticket ticket) throws Exception {
      Ticket ticket_new = ticketRepository.findById(ticket.getTicketId()).get();
      if (ticket_new != null) {

        ticket.setStatus("cancelled");
        ticketRepository.save(ticket);
      } else {
          throw new Exception("ticket not found");
      }

 }

/*     public Ticket buyTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    } */
}
