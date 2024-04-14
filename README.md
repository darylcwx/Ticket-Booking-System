# TicketBookingSystem

## Table of Contents

- [Description](##description)
  - [Built with](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Development](#development)

## Description

To develop a comprehensive ticket booking system that allows users to easily browse, book & manage tickets for various types of events

### Built with

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Material UI](https://mui.com/material-ui/)
- [Spring boot on Maven](https://spring.io/projects/spring-boot)
- [MongoDB](https://www.mongodb.com/)
- [EmailJS](https://www.emailjs.com/)

### For Project Purposes

Refer to Supporting Documents for sample files such as MongoDB schema, .env, and application.properties.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x)
- [npm](https://www.npmjs.com/get-npm) (v9.6.x)
- [Apache Maven](https://maven.apache.org/download.cgi) (v3.9.x)
- [Stripe CLI](https://github.com/stripe/stripe-cli/releases/tag/v1.19.4) (v1.19.4)
- [EmailJS](https://www.emailjs.com/) (Configure Service and Templates)
  - [Sample template](SampleEmailJsTemplate.html) 


### Frontend

In frontend directory, add a file called .env with the following:

```properties
VITE_EMAILJS_PUBLIC_KEY=<EmailJS public key>
VITE_EMAILJS_PRIVATE_KEY=<EmailJS private key>
VITE_EMAILJS_SERVICE_ID=<EmailJS service id>
VITE_EMAILJS_EVENT_TEMPLATE_ID=<EmailJS template id>
VITE_EMAILJS_OTHER_TEMPLATE_ID=<EmailJS template id>

```

Then run the commands below.

```bash
# In root directory
cd frontend
npm install

```

### Backend

1. In backend/src/main/resources, add a file called application.properties with the following:

```properties
spring.data.mongodb.uri=<MongoDB URI>
spring.data.mongodb.database=<MongoDB database name>
stripe.apiKey=<Stripe API key>
stripe.secretkey=<Stripe secret key>

```


## Development

```bash
# In root directory
cd frontend
npm run dev

cd ../backend
mvn spring-boot:run

```

1. Extract stripe.exe into a folder.
2. Open command prompt

```bash

cd C:/your_stripe_folder
stripe.exe
stripe login --interactive
(enter stripe api key)
(enter device identifier)
stripe listen --forward-to localhost:8080/api/stripe-events

```

If you face a java.lang.IllegalStateException, insert the code commented out into your backend/pom.xml

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <!-- <configuration>
        <mainClass>g2t5.TicketBookingSystemApplication</mainClass>
      </configuration> -->
    </plugin>
  </plugins>
</build>
```
