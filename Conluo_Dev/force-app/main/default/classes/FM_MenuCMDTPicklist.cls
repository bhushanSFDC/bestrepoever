global class FM_MenuCMDTPicklist extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('FM_HomeMenu','');
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        List<FM_Menu__mdt> menuResultList = [Select Id, DeveloperName from FM_Menu__mdt WITH SECURITY_ENFORCED];
        for (FM_Menu__mdt menuResult : menuResultList) {
            myValues.addRow(new VisualEditor.DataRow(menuResult.DeveloperName, menuResult.DeveloperName));
        }
        return myValues;
    }
}