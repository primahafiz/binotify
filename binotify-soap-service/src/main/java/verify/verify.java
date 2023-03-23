package verify;

import connector.connector;
import logger.logger;

import javax.annotation.Resource;
import javax.jws.*;
import javax.xml.ws.WebServiceContext;
import java.sql.ResultSet;

@WebService(endpointInterface = "verify.verify_interface")
public class verify implements verify_interface {

    @Resource
    WebServiceContext wsContext;
    private final connector conn = new connector();
    private final logger logger = new logger();
    @Override
    public String check(String id_creator, String id_user, String api_key){
        String description = String.format("Verify subscription from user %s for creator %s",
                id_user, id_creator);
        if(!security.api_key.authenticate("REST", api_key)){
            System.err.println("Authentication failed");
            return null;
        }
        if(!logger.log(wsContext, "verify", description)){
            System.err.println("Logger failed");
            return null;
        }
        try{
            conn.connect();
            String query = String.format("SELECT status FROM Subscription WHERE creator_id=%s AND subscriber_id=%s",
                    id_creator, id_user);
            ResultSet res = conn.query(query);
            int count = 0;
            String status = "NOT FOUND";
            while(res.next()) {
                status = res.getString("status");
                count++;
            }
            res.close();
            conn.close();
            if(count==0){
                return "MISSING";
            }else if(count>1){
                return "ERROR";
            }else{
                return status;
            }
        }catch(Exception ex){
            return ex.getMessage();
        }
    }

}
