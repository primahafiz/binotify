package logger;

import connector.connector;

import javax.xml.ws.WebServiceContext;
import javax.xml.ws.handler.MessageContext;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


public class logger{
    private final connector conn = new connector();

    public boolean log(WebServiceContext context, String endpoint, String description){
        try{
            conn.connect();
            MessageContext mc = context.getMessageContext();
            com.sun.net.httpserver.HttpExchange server = (com.sun.net.httpserver.HttpExchange)mc.get("com.sun.xml.internal.ws.http.exchange");
            String IP = String.format("%s", server.getRemoteAddress());
            String serverDatetime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
            String query = String.format("INSERT INTO Logging (IP, description, endpoint, requested_at) VALUES ('%s', '%s', '%s', '%s')",
                    IP, description, endpoint, serverDatetime);
            int res = conn.update(query);
            conn.close();
            if (res!=1){
                return false;
            }
        }catch(Exception ex){
            System.out.println(ex.getMessage());
            return false;
        }
        return true;
    }
}