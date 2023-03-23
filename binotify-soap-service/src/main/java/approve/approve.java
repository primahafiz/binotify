package approve;

import connector.connector;
import logger.logger;
import status.status;
import security.api_key;
import sun.net.www.http.HttpClient;

import javax.annotation.Resource;
import javax.jws.WebService;
import javax.xml.ws.WebServiceContext;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

@WebService(endpointInterface = "approve.approve_interface")
public class approve implements approve_interface {
    @Resource
    WebServiceContext wsContext;
    private final connector conn = new connector();
    private final logger logger = new logger();

    @Override
    public String verdict(String id_creator, String id_user, status verdict, String api_key) {
        String description = String.format("%s request from user %s for creator %s",
                verdict, id_user, id_creator);
        if(!security.api_key.authenticate("REST", api_key)){
            System.err.println("Authentication failed");
            return null;
        }
        if(!logger.log(wsContext, "approve", description)) {
            System.err.println("Logger failed");
            return null;
        }
        try{
            conn.connect();
            String query = String.format("UPDATE Subscription SET status='%s' WHERE creator_id=%s AND subscriber_id=%s",
                    verdict, id_creator, id_user);
            int res = conn.update(query);
            conn.close();

            URL url = new URL("http://[::1]:8080/api/song_premium/update");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            Map<String,String> arguments = new HashMap<>();
            arguments.put("creator_id", id_creator);
            arguments.put("subscriber_id", id_user);
            arguments.put("status", String.valueOf(verdict));
            StringJoiner sj = new StringJoiner("&");
            for(Map.Entry<String,String> entry : arguments.entrySet())
                sj.add(URLEncoder.encode(entry.getKey(), "UTF-8") + "="
                        + URLEncoder.encode(entry.getValue(), "UTF-8"));
            byte[] out = sj.toString().getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            http.connect();
            try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }
            http.getInputStream();

            if(res==1) return "Success";


        }catch(Exception ex){
            return ex.getMessage();
        }
        return "Failed";
    }

    @Override
    public ArrayList<String> pending(String api_key) {
        String description = "Get pending requests list";
        if(!logger.log(wsContext, "pending", description)){
            System.err.println("Logger failed");
            return null;
        }
        if(!security.api_key.authenticate("REST", api_key)){
            System.err.println("Authentication failed");
            return null;
        }
        ArrayList<String> ret = new ArrayList<>();
        try{
            conn.connect();
            String query = "SELECT creator_id, subscriber_id FROM Subscription WHERE status='PENDING'";
            ResultSet res = conn.query(query);
            String status = "NOT FOUND";
            while(res.next()) {
                String temp = String.format("%d:%d",
                        res.getInt("creator_id"),
                        res.getInt("subscriber_id"));
                ret.add(temp);
            }
            res.close();
            conn.close();
            return ret;
        }catch(Exception ex){
            System.err.println(ex.getMessage());
            return null;
        }

    }
}
