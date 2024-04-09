package g2t5.database.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import java.util.*;

import org.springframework.data.annotation.Id;
@Document(collection = "payment")
public class Payment {

    @Id
    private String paymentId;
    private Date date;
    private Double amount;
    private String customerId;
    private String status;


    public Payment() {}

    public Payment(Double amount, String customerId, Date date) {
        this.amount = amount;
        this.customerId = customerId;
        this.date = date;
        this.status = "";
    }

    // Getters and setters
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getId() {
        return paymentId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
