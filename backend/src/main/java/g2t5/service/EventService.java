package g2t5.service;

import g2t5.database.entity.Event;
import g2t5.database.repository.EventRepository;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventService {

  @Autowired
  private EventRepository eventRepository;

  public EventService(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  public void saveEvent(Event event) {
    eventRepository.save(event);
  }

  public Event getEvent(String name) {
    return eventRepository.findByName(name);
  }

  public List<Event> getAllEvents() {
    return eventRepository.findAll();
  }

  public void deleteEvent(String id) {
    eventRepository.deleteById(id);
  }
}
