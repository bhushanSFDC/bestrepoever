public class pdfController {
    @AuraEnabled
    public static Attachment generatePDF(Id recordId, String htmlData){
        Pagereference page = Page.renderAsPDF;
        //page.getParameters().put('pdfText', htmlData.left(2000));
        page.getParameters().put('pdfText', htmlData);
        page.getParameters().put('recordId', recordId);

        //Contact con = new Contact(Id=recordId);
        Attachment objAttachment = new Attachment();
         objAttachment.Name='invoice.pdf';
        objAttachment.ParentId = recordId;
        objAttachment.Body = page.getContentaspdf();
        objAttachment.IsPrivate = false;
        insert objAttachment; 

        String yourFilesContent = 'TheBlogReaders.com File upload content';
 	//system.debug('paramlength:'+page.getParameters().get('pdfText').length());
        ContentVersion conVer = new ContentVersion();
        conVer.ContentLocation = 'S'; // to use S specify this document is in Salesforce, to use E for external files
        conVer.PathOnClient = 'Quote.pdf'; // The files name, extension is very important here which will help the file in preview.
        conVer.Title = 'Quote'; // Display name of the files
        conVer.VersionData = page.getContentaspdf(); // converting your binary string to Blog
        insert conVer;    //Insert ContentVersion


        // First get the Content Document Id from ContentVersion Object
        Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
        //create ContentDocumentLink  record 
        ContentDocumentLink conDocLink = New ContentDocumentLink();
        conDocLink.LinkedEntityId = recordId; // Specify RECORD ID here i.e Any Object ID (Standard Object/Custom Object)
        conDocLink.ContentDocumentId = conDoc;  //ContentDocumentId Id from ContentVersion
        conDocLink.shareType = 'V';
        insert conDocLink;




        return objAttachment;
    }

    @AuraEnabled(cacheable=true)
    public static string returnHTMLContent(String htmlTemplate, String RecId){
        string Htmltmpbody;
        system.debug('!!! htmlTemplate: '+htmlTemplate);
        try {
            list<EmailTemplate> emptmp = new list<EmailTemplate>([SELECT Id, DeveloperName, Name FROM EmailTemplate where DeveloperName =:htmlTemplate]);
            Messaging.SingleEmailMessage mail = Messaging.renderStoredEmailTemplate(emptmp[0].Id, UserInfo.getUserId(), RecId);    
            system.debug('mail===>>>'+mail);
            Htmltmpbody=mail.gethtmlBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return Htmltmpbody;
    }
}