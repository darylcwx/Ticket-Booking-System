package g2t5.database.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
@Document(collection = "payment")
public class Payment {

    @Id
    private String paymentId;
    
    private Long amount;
    private String currency;    
    private String customerId;

    public Payment() {}

    public Payment(Long amount, String customerId) {
        this.amount = amount;
        this.currency = "sgd";
        this.customerId = customerId;
    }

    public Payment(Long amount) {
        this.amount = amount;
        this.currency = "sgd";
        this.customerId = "onsite";
    }

    // Getters and setters
    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
