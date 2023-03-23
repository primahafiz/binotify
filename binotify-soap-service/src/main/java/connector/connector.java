package connector;

import java.sql.*;

public class connector
{
    private Connection conn;
    public connector(){
        conn = null;
    }
    public void connect() throws Exception
    {
        String host = "jdbc:mysql://20.5.48.98/soapwbd";
        String user = "soapservice";
        String password = "E&967A8c@-B5)=(E&Y";
        conn = DriverManager.getConnection(host, user, password);
    }

    public ResultSet query(String query) throws Exception{
        // create the java statement
        Statement st = conn.createStatement();

        // execute the query, and get a java resultset
        return st.executeQuery(query);
    }

    public int update(String query) throws Exception{
        // create the java statement
        Statement st = conn.createStatement();

        // execute the query, and get a java resultset
        return st.executeUpdate(query);
    }

    public void close(){
        try
        {
            conn.close();
        }
        catch (Exception e)
        {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }
}