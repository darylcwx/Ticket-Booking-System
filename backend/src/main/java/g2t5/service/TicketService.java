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

  public List<String> createTickets(String eventId, String username, int qty) {
    Event event = eventRepository.findById(eventId).get();
    List<String> tickets = new ArrayList<>();
    for (int i = 0; i < qty; i++) {
      Ticket ticket = new Ticket(event.getId(), event.getName(), event.getVenue(), event.getStartDate(), event.getTicketPrice(), username, "active");

      ticketRepository.save(ticket);
      tickets.add(ticket.getTicketId());
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

  public List<Ticket> getBookingTickets(List<String> tids) {
    List<Ticket> tickets = new ArrayList<>();
    for (String tid : tids) {
      try{
        updateTicketInfo(tid);
        tickets.add(getTicket(tid));
      }catch(Exception e){
      }
    }

    return tickets;
  }

  public void deactivateTicket(Ticket ticket) throws Exception {
    try{
      Ticket ticket_new = ticketRepository.findById(ticket.getTicketId()).get();
      ticket.setStatus("cancelled");
      ticketRepository.save(ticket);

    }catch (Exception e){
      throw new Exception("ticket not found");
      
    }

  }

  public void updateTicket(Ticket ticket) throws Exception {
    try{
      Ticket ticket_new = ticketRepository.findById(ticket.getTicketId()).get();
      ticket.setStatus("inactive"); // when ticket is alr used for event
      ticketRepository.save(ticket);

    }catch (Exception e){
      throw new Exception("ticket not found");
      
    }

  }

  public void updateTicketInfo(String id ) throws Exception {
    try{
      Ticket ticket_new = ticketRepository.findById(id).get();
      //ticket.setStatus("inactive"); // when ticket is alr used for event
      Event event = eventRepository.findById(ticket_new.getEventId()).get();
      ticket_new.setEventName(event.getName());
      ticket_new.setDatetime(event.getStartDate());
      ticketRepository.save(ticket_new);

    }catch (Exception e){
      throw new Exception("ticket not found");
      
    }

  }
  /*
   * public Ticket buyTicket(Ticket ticket) {
   * return ticketRepository.save(ticket);
   * }
   */
}
