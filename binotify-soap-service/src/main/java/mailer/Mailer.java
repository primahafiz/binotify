package mailer;

import io.github.cdimascio.dotenv.Dotenv;
import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class Mailer {

  private final Dotenv dotenv = Dotenv.configure().load();

  public void send(String msg) throws MessagingException {

    Properties prop = new Properties();

    prop.put("mail.smtp.host", "smtp.gmail.com"); //SMTP Host
    prop.put("mail.smtp.port", "587"); //TLS Port
    prop.put("mail.smtp.auth", "true"); //enable authentication
    prop.put("mail.smtp.starttls.enable", "true"); //enable STARTTLS
    prop.put("mail.transport.protocol", "smtp");
    prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

    Session session = Session.getInstance(prop, new Authenticator() {
      @Override
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication("16520184@std.stei.itb.ac.id",
            dotenv.get("EMAIL_KEY"));
      }
    });

    Message message = new MimeMessage(session);
    message.setFrom(new InternetAddress("16520181@std.stei.itb.ac.id"));
    message.setRecipients(Message.RecipientType.TO,
        InternetAddress.parse("13520022@std.stei.itb.ac.id"));
    message.setSubject("WBD - Subscription Notification");

    MimeBodyPart mimeBodyPart = new MimeBodyPart();
    mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

    Multipart multipart = new MimeMultipart();
    multipart.addBodyPart(mimeBodyPart);

    message.setContent(multipart);

    Transport.send(message);

  }
}