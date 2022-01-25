({
	init: function (component, event, helper) {
        var jobList = component.get("v.jobList");
        //Add New Account Record
        jobList.push({
            'sobjectType': 'Job_Details__c',
            'Customer__c': '',
            'Furniture_Type__c': '',
            'Units__c': '',
            'Carpet_Type__c ': '', 
            
        });
        component.set("v.jobList", jobList);
    },
        addRow: function(component, event, helper) {
        //get the account List from component  
        var jobList = component.get("v.jobList");
        //Add New Account Record
        jobList.push({
            'sobjectType': 'Job_Details__c',
            'Customer__c': '',
            'Furniture_Type__c': '',
            'Units__c': '',
            'Carpet_Type__c ': '', 
            
        });
        component.set("v.jobList", jobList);
    },
    removeRecord: function(component, event, helper) {
        //Get the account list
        var jobList = component.get("v.jobList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        //Remove single record from account list
        jobList.splice(index, 1);
        //Set modified account list
        component.set("v.jobList", jobList);
    },
    onSubmit: function(component, event, helper) {      
        
            //Call Apex method and pass account list as a parameters
            var action = component.get("c.saveJobs");
            action.setParams({
                "jobList": component.get("v.jobList"),
                "item":component.get("v.servItem")
            });
            action.setCallback(this, function(response) {
                //get response status 
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    //String temp = result.replace(/['"]+/g, '');

                    //component.set("v.SId",result);

					 
                    //set empty account list
                    component.set("v.accountList", []);
                    component.find('notifLib').showToast({
                        "title": "Success!",
                        "message": "The Job has been Created successfully.",
                        "variant":"success"
                    });
                   // alert('Job saved successfully'+ JSON.stringify(result));
                    
                   /* var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result,
                        "slideDevName": "Detail"
                    });
                    navEvt.fire();
                    $A.get("e.force:closeQuickAction").fire();*/
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/lightning/r/Service_Items__c/"+result+"/view"
                    });
                    urlEvent.fire();
                    $A.get("e.force:closeQuickAction").fire();

                }else{
                    alert('ERROR');
                }
            }); 
            $A.enqueueAction(action);
        
    },
    handleSectionToggle: function (cmp, event) {
        var openSections = event.getParam('openSections');

        if (openSections.length === 0) {
            cmp.set('v.activeSectionsMessage', "All sections are closed");
        } else {
            cmp.set('v.activeSectionsMessage', "Open sections: " + openSections.join(', '));
        }
    }

})