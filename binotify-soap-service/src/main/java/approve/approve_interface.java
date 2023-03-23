package approve;

import status.status;

import javax.jws.*;
import java.util.ArrayList;

@WebService
public interface approve_interface {
    @WebMethod
    public String verdict(String id_creator, String id_user, status verdict, String api_key);
    @WebMethod
    public ArrayList<String> pending(String api_key);
}

