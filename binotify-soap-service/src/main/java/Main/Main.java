package Main;

import javax.xml.ws.Endpoint;

import verify.*;
import approve.*;
import subscribe.*;

public class Main {

    public static void main(String[] args) {
        try {
            int port = 9080;
            Endpoint.publish(String.format("http://0.0.0.0:%d/verify", port), new verify());
            Endpoint.publish(String.format("http://0.0.0.0:%d/approve", port), new approve());
            Endpoint.publish(String.format("http://0.0.0.0:%d/subscribe", port), new subscribe());
            System.out.printf("Server is running on %d%n", port);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }

}
