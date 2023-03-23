package subscribe;

import connector.connector;
import javax.annotation.Resource;
import javax.jws.WebService;
import javax.xml.ws.WebServiceContext;
import logger.logger;
import mailer.Mailer;

@WebService(endpointInterface = "subscribe.subscribe_interface")
public class subscribe implements subscribe_interface {

  @Resource
  WebServiceContext wsContext;
  private final connector conn = new connector();
  private final logger logger = new logger();

  private final Mailer mailer = new Mailer();

  @Override
  public String request(String id_creator, String id_user, String api_key) {
    String description = String.format("Subscription request from user %s for creator %s",
        id_user, id_creator);
    if (!security.api_key.authenticate("PHP", api_key)) {
      System.err.println("Authentication failed");
      return null;
    }
    if (!logger.log(wsContext, "subscribe", description)) {
      System.err.println("Logger failed");
      return null;
    }
    try {
      conn.connect();
      String query = String.format("INSERT INTO Subscription VALUES (%s, %s, 'PENDING')",
          id_creator, id_user);
      int res = conn.update(query);
      conn.close();

      mailer.send(String.format(
          "Hi, Prima. We want to notify you that user %s just subscribe to user %s.",
          id_creator, id_user));

      if (res == 1) {
        return "Success";
      }

    } catch (Exception ex) {
      return ex.getMessage();
    }
    return "Failed";
  }
}
