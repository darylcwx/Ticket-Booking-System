package g2t5.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g2t5.database.entity.Event;
import g2t5.database.repository.EventRepository;
//import g2t5.database.repository.TicketingManagerRepository;
import g2t5.database.repository.UserRepository;

@Service
public class EventManagerService {
    // @Autowired
    // private TicketingManagerRepository ticketingManagerRepository;

    @Autowired
    private EventRepository eventRepository;

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

    //void addTicketingOfficer(TicketingManager ticketingManager) {
    //ticketingManagerRepository.save(ticketingManager);
    // }

    // void getStatistics() {
    //
    // }
}
