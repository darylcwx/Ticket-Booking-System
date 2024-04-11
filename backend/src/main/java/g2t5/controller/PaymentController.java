package g2t5.controller;

import java.util.*;

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
import org.springframework.web.bind.annotation.RestController;




@RestController
public class PaymentController {

    @Value("${stripe.apiKey}")
    private String key;
    private final PaymentService paymentService;
    private final CustomerService customerService;

    @Autowired
        public PaymentController(PaymentService paymentService, CustomerService customerService) {
                this.paymentService = paymentService;
                this.customerService = customerService;
        }

    @PostMapping("/payments/create-checkout-session")
    //public RedirectView createCheckoutSession( Long amount, String paymentObjID) throws StripeException {
    //public RedirectView createCheckoutSession(@RequestParam() String custID, @RequestParam String bookingID, @RequestParam Long amount) throws StripeException {
    public String createCheckoutSession() throws StripeException {
        Payment payment = paymentService.createPayment(15.8, "c");

        return paymentService.createCheckoutSession("c", 15.8, payment.getId()); 

        




        // //Long amount, String paymentObjID
        // Stripe.apiKey = key;

        // // Define the parameters for the checkout session
        // SessionCreateParams.Builder builder = new SessionCreateParams.Builder();
        // builder.addPaymentMethodType(SessionCreateParams.PaymentMethodType.PAYNOW);
        // builder.setMode(SessionCreateParams.Mode.PAYMENT);
        // builder.setSuccessUrl("http://localhost:5173/dashboard");
        // builder.setCancelUrl("http://localhost:5173/dashboard");
        // builder.putMetadata("paymentObjID", "paymentObjID");
        // builder.addLineItem(
        //         SessionCreateParams.LineItem.builder()
        //                 .setQuantity(1L)
        //                 .setPriceData(
        //                         SessionCreateParams.LineItem.PriceData.builder()
        //                                 .setCurrency("sgd")
        //                                 .setUnitAmount(1000L) // Amount in cents
        //                                 .setProductData(
        //                                         SessionCreateParams.LineItem.PriceData.ProductData.builder()
        //                                                 .setName("Top up" + (1000L / 100) + " sgd")
        //                                                 .setDescription("objid")
        //                                                 .build())
        //                                 .build())
        //                 .build());

        // // Create the checkout session
        // Session session = Session.create(builder.build());

        // RedirectView redirectView = new RedirectView();
        // redirectView.setUrl(session.getUrl());
        // return redirectView;
    }
}
