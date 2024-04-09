package g2t5.service;

import g2t5.database.entity.Booking;
import g2t5.database.entity.Ticket;
import g2t5.database.entity.Event;
import g2t5.database.entity.Customer;
import g2t5.database.repository.BookingRepository;
import g2t5.database.repository.CustomerRepository;
import g2t5.database.repository.EventRepository;
import java.util.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

  @Autowired
  private final BookingRepository bookingRepository;
  private final CustomerRepository customerRepository;
  private final EventRepository eventRepository;
  private final TicketService ticketService;

  @Autowired
  public BookingService(BookingRepository bookingRepository, CustomerRepository customerRepository, EventRepository eventRepository, TicketService ticketService){
    this.bookingRepository = bookingRepository;
    this.customerRepository = customerRepository;
    this.eventRepository = eventRepository;
    this.ticketService = ticketService;
  }

  public List<Booking> getByEventId(String eventId) throws Exception {
    List<Booking> bookings = bookingRepository.findAll();
    List<Booking> result = new ArrayList<>();

    for (Booking booking : bookings){
        if (booking.getEventId().equals(eventId)){
            result.add(booking);
        }
    }
    return result;

  }

  public Booking createBooking(String username, String eventId, int qty) throws Exception {
    Event event = eventRepository.findById(eventId).get();
    Date date = event.getDatetime();
    Date curr = new Date();

    Calendar calendar = Calendar.getInstance();
    calendar.setTime(date);
    calendar.add(Calendar.MONTH, -6);
    Date dateAvail = calendar.getTime();

    Calendar calendar2 = Calendar.getInstance();
    calendar2.setTime(date);
    calendar2.add(Calendar.HOUR_OF_DAY, -24);
    Date dateAvail2 = calendar2.getTime();

    if (dateAvail.after(curr) || curr.after(dateAvail2)) { 
        return null;
    }

    Booking booking = new Booking();
    // List<Tickets> tickets = ticketService.createTickets(); // need to create tickets
    List<Ticket> tickets = new ArrayList<>(); // temporary placeholder

    booking.setEventId(eventId);
    booking.setStatus("created");
    booking.setCustomerId(username);
    booking.setTickets(tickets);

    bookingRepository.save(booking);

    return booking;
  }

  public boolean cancelBooking(String bookingId) throws Exception {
    Booking booking = bookingRepository.findById(bookingId).get();
    Event event = eventRepository.findById(booking.getEventId()).get();
    Date date = event.getDatetime();
    Date curr = new Date();

    Calendar calendar = Calendar.getInstance();
    calendar.setTime(date);
    calendar.add(Calendar.HOUR_OF_DAY, -48);
    Date dateAvail = calendar.getTime();

    if (curr.after(dateAvail)) { 
        return false;
    }

    booking.setStatus("cancelled");
    List<Ticket> tickets = booking.getTickets();
    for (Ticket ticket : tickets) {
        ticketService.deactivateTicket(ticket);
    }
    
    bookingRepository.save(booking);
    return true;
  }

    public void cancelEventBookings(List<Booking> bookings) throws Exception {
        for (Booking booking : bookings) {
            Booking curr = bookingRepository.findById(booking.getBookingId()).get();
            curr.setStatus("cancelled");

            List<Ticket> tickets = curr.getTickets();
            for (Ticket ticket : tickets) {
                ticketService.deactivateTicket(ticket);
            }

            bookingRepository.save(curr);
        }
    }

}