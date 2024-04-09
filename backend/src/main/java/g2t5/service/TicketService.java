package g2t5.service;

import g2t5.database.entity.Ticket;
import g2t5.database.entity.Event;
import g2t5.database.repository.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
    private final EventRepository eventRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository, EventRepository eventRepository) {
      this.ticketRepository = ticketRepository;
      this.eventRepository = eventRepository;
    }

    public Ticket createTicket(Ticket ticket) {
      ticketRepository.save(ticket);

      return getTicket(ticket);
    }

    public List<Ticket> createTickets(String eventId, String username, int qty){
      Event event = eventRepository.findById(eventId).get();
      List<Ticket> tickets = new ArrayList<>();
      for (int i = 0; i < qty; i++) {
        // change customer name thingy
        Ticket ticket = new Ticket(event.getName(), event.getVenue(), event.getDatetime().toString(), event.getTicketPrice(), username, username, "active");
        tickets.add(ticket);
        ticketRepository.save(ticket);
      }

      return tickets;
    }

    public List<Ticket> getAllTicket() {
       return ticketRepository.findAll();
    }

    public Ticket getTicket(Ticket ticket) {
      return ticketRepository.findById(ticket.getTicketId()).get();
   }

   public Ticket getTicket(String id) {
    return ticketRepository.findById(id).get();
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
