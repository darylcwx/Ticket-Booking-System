package g2t5.controller;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Charge;
import com.stripe.model.checkout.Session;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.beans.factory.annotation.Autowired;
import g2t5.service.*;


@RestController
public class WebhookController {

    @Value("${stripe.apiKey")
    String stripeApiKey;

    @Value("${stripe.secretkey}")
    String stripeWebhookSecret;


    @Autowired
    private PaymentService paymentService;

    @PostMapping(value = "/api/stripe-events")
    public ResponseEntity<String> webhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event = null;
        //System.out.println(payload);
        try {
          event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
          System.out.println("Failed signature verification");
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;

        if (dataObjectDeserializer.getObject().isPresent()) {
          stripeObject = dataObjectDeserializer.getObject().get();
        } else {
          // Deserialization failed, probably due to an API version mismatch.
          // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
          // instructions on how to handle this case, or return an error here.
        }

        Gson gson = new Gson();
        JsonObject jsonData = stripeObject.getRawJsonObject(); // Assuming event.getData() returns Event.Data
        //PaymentIntent paymentIntent  = (PaymentIntent) stripeObject;
        
        //System.out.println(paymentIntent.getMetadata());
        switch (event.getType()) {
          case "checkout.session.completed":
            // ...

            Session charge  = (Session) stripeObject;

            paymentService.updatePayment((charge.getMetadata().get("paymentObjID")));

            System.out.println(charge.getMetadata().get("paymentObjID"));
            System.err.println("success");
            break;
          case "payment_method.attached":
            // ...
            break;
            // ... handle other event types
          default:
            // Unexpected event type
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }
}