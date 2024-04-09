package g2t5.database.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Date;

import org.springframework.data.annotation.Id;
@Document(collection = "payment")
public class Payment {

    @Id
    private String paymentId;
    private Date date;
    private Long amount;


    public Payment() {}

    public Payment(Long amount, Date date) {
        this.amount = amount;
        this.date = date;
    }

    // Getters and setters
    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getId() {
        return paymentId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
