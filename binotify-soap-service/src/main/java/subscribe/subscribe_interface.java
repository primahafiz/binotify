package subscribe;

import status.status;

import javax.jws.*;
@WebService
public interface subscribe_interface {
    public String request(String id_creator, String id_user, String api_key);
}
