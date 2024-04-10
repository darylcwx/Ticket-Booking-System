package g2t5.database.entity;

import java.util.*;

public class BookingComparator implements Comparator<Booking>{
    public int compare(Booking b1, Booking b2) {
        Date d1 = b1.getDateCreated();
        Date d2 = b2.getDateCreated();
        
        if (d1.after(d2)) {
            return -1;
        }

        return 1;
    }
}