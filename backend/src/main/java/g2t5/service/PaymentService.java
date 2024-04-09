package g2t5.service;

import g2t5.database.entity.Payment;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import g2t5.database.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

@Service
public class PaymentService {

    @Value("${stripe.apiKey}")
    private String apiKey;

    @Autowired
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(Double amount, String customerId){
        Payment payment = new Payment(amount, customerId, new Date());

        paymentRepository.save(payment);

        return payment;

    }

    public PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException {
        Stripe.apiKey = apiKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .build();

        return PaymentIntent.create(params);
    }



    // You can add more methods for handling other Stripe functionalities as needed
}