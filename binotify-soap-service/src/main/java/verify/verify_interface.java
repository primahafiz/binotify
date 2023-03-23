package verify;

import javax.jws.*;

@WebService
public interface verify_interface {
    @WebMethod
    public String check(String id_creator, String id_user, String api_key);
}
