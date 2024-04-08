package g2t5.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.poi.hpsf.Array;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g2t5.database.entity.*;
import g2t5.database.repository.*;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class EventManagerService {
    // @Autowired
    // private TicketingManagerRepository ticketingManagerRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ReportService reportService;

    @Autowired
    private EventService eventService;

    @Autowired
    private TicketingOfficerRepository ticketingOfficerRepository;

    public void addEvent(Event event) {
        eventRepository.save(event);
    }

    public void editEvent(Event updatedEvent) throws Exception {

        Optional<Event> optionalEvent = eventRepository.findById(updatedEvent.getId());
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();

            event.setName(updatedEvent.getName());
            event.setDescription(updatedEvent.getDescription());
            event.setDatetime(updatedEvent.getDatetime());
            event.setTicketPrice(updatedEvent.getTicketPrice());
            event.setTicketsAvailable(updatedEvent.getTicketsAvailable());
            event.setStatus(updatedEvent.getStatus());
            event.setCancellationFee(updatedEvent.getCancellationFee());
            event.setGuestsAllowed(updatedEvent.getGuestsAllowed());
            event.setImage(updatedEvent.getImage());
            event.setVenue(updatedEvent.getVenue());

            eventRepository.save(event);
        } else {
            throw new Exception("Error updating event");
        }
    }

    public void cancelEvent(Event cancelEvent) throws Exception {

        Optional<Event> optionalEvent = eventRepository.findById(cancelEvent.getId());
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();

            event.setStatus("cancelled");

            eventRepository.save(event);
        } else {
            throw new Exception("No event found");
        }

    }

    public void addTicketingOfficer(TicketingOfficer ticketingOfficer) {
        String password = ticketingOfficer.getPassword();
        String username = ticketingOfficer.getUsername();
        String hashPassword = DigestUtils.sha256Hex(username + password);
        ticketingOfficer.setPassword(hashPassword);
        ticketingOfficerRepository.save(ticketingOfficer);
    }

    public void getStatistics(HttpServletResponse response) {
        reportService.exportReport(response);
    }

    public List<TicketingOfficer> getAllTicketingOfficers() {
        return ticketingOfficerRepository.findAll();
    }

    public void editTicketingOfficer(TicketingOfficer updatedTicketingOfficer) throws Exception {

        Optional<TicketingOfficer> optionalTicketingOfficer = ticketingOfficerRepository
                .findById(updatedTicketingOfficer.getId());
        if (optionalTicketingOfficer.isPresent()) {
            TicketingOfficer ticketingOfficer = optionalTicketingOfficer.get();
            String password = ticketingOfficer.getPassword();
            String username = ticketingOfficer.getUsername();
            String hashPassword = DigestUtils.sha256Hex(username + password);
            ticketingOfficer.setUsername(updatedTicketingOfficer.getUsername());
            ticketingOfficer.setPassword(hashPassword);

            ticketingOfficerRepository.save(ticketingOfficer);
        } else {
            throw new Exception("Error updating ticketing officer");
        }
    }

    public void deleteTicketingOfficer(String id) throws Exception {
        Optional<TicketingOfficer> optionalTicketingOfficer = ticketingOfficerRepository.findById(id);
        if (optionalTicketingOfficer.isPresent()) {
            ticketingOfficerRepository.deleteById(id);
        } else {
            throw new Exception("Ticketing officer with ID " + id + " not found");
        }
    }

    public List<String> getEmailsByEventId(String eventId) {
        ArrayList<String> emailList = new ArrayList<>();
        try{
            Event e = eventService.getEventById(eventId);
            ArrayList<Customer> bookingList = e.getBookingList();
            for(Customer customer : bookingList){
                emailList.add(customer.getUsername());
            }
            return emailList;
        } catch(Exception e){
            return new ArrayList<>();
        }
    }

}
