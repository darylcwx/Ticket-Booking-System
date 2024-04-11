package g2t5.service;

import java.util.*;
import java.math.*;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import g2t5.database.entity.Payment;
import g2t5.database.entity.Customer;
import g2t5.service.*;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.stereotype.Service;

import g2t5.database.repository.*;





@Service
public class PaymentService {

    @Value("${stripe.apiKey}")
    private String key;

    @Autowired
    private PaymentRepository paymentRepository;
    //@PostMapping("/payments/create-checkout-session")
    //public RedirectView createCheckoutSession( Long amount, String paymentObjID) throws StripeException {
    //public RedirectView createCheckoutSession(@RequestParam() String custID, @RequestParam String bookingID, @RequestParam Long amount) throws StripeException {
    public String createCheckoutSession(String username, Double amount, String paymentObjID) throws StripeException {

        //Long amount, String paymentObjID
        Stripe.apiKey = key;

        // Define the parameters for the checkout session
        SessionCreateParams.Builder builder = new SessionCreateParams.Builder();
        builder.addPaymentMethodType(SessionCreateParams.PaymentMethodType.PAYNOW);
        builder.setMode(SessionCreateParams.Mode.PAYMENT);
        builder.setSuccessUrl("http://localhost:5173/profile");
        builder.setCancelUrl("http://localhost:5173/profile");
        builder.putMetadata("paymentObjID", paymentObjID);
        builder.putMetadata("amount", amount.toString());
        builder.putMetadata("customer", username); // change
        builder.addLineItem(
                SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("sgd")
                                        .setUnitAmount((long) (amount * 100)) // Amount in cents
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Top up " + amount + " sgd")
                                                        .setDescription("Ticket " + paymentObjID)
                                                        .build())
                                        .build())
                        .build());

        // Create the checkout session
        Session session = Session.create(builder.build());

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(session.getUrl());
        return redirectView.getUrl();
    }

    public Payment createPayment( Double amount, String customer) {
        Payment payment = new Payment(amount, customer, new Date(), "unpaid");
        paymentRepository.save(payment);
  
        return payment;
    }

    public Payment getPayment( String paymentId) {
        return paymentRepository.findById(paymentId).get();
    }

    public void updatePayment( String paymentId) {
        //Payment payment = new Payment(amount, customer, new Date(), "unpaid");
        Payment payment = getPayment(paymentId);
        payment.setStatus("paid");
        paymentRepository.save(payment);
      }
}
