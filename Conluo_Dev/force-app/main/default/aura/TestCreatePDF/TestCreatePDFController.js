({
    savePDF : function(cmp, event, helper) {
        var action = cmp.get("c.savePDFOpportunity");
        alert('cmp.'+cmp.get("v.recordId"));
        action.setParams({
            'parentId' : cmp.get("v.recordId")
        })

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                alert('Attachment saved successfully');
                
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);
    }
})