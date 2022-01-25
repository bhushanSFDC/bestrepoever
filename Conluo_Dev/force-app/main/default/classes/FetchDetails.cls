public class FetchDetails {
    public List<Contact> contactList{get;set;}
    public FetchDetails(){
        contactList=[select Id,Name,Phone,Email from Contact where Name!=null and phone!=null LIMIT 10];
    }


}