package security;

public class api_key {
    private static final String REST_API_KEY="bmFoaWRhaXNvcGFzZjQyM280ajMyNDBj";
    private static final String PHP_API_KEY="WU9JbWl5YWFJc0Fsc29PUDIwam5pMzRu";
    public static boolean authenticate(String user, String api_key){
        if(user.equals("REST") && api_key.equals(REST_API_KEY)){
            return true;
        }
        else if(user.equals("PHP") && api_key.equals(PHP_API_KEY)){
            return true;
        }
        return false;
    }
}
