public class CaseNotificationController {
  @AuraEnabled
  public static String getSessionId() {
    return UserInfo.getSessionId();
  }
  
  public static void publishNotifications(List<Case> caseList) {
    
    List<Case_Notification__e> notificationList = new List<Case_Notification__e>();
    
    // Create Notifiation records from Case
    for(Case c:caseList) {
        Case_Notification__e notification = new Case_Notification__e();
        notification.Object_Id__c = c.Id;
        notification.Object_Name__c = c.CaseNumber;
        notification.Status__c = c.Status;
        notification.OwnerId__c = c.OwnerId;
        notificationList.add(notification);
    }
    
    List<Database.SaveResult> results = EventBus.publish(notificationList);
    // Inspect publishing results
    for (Database.SaveResult result : results) {
      if (!result.isSuccess()) {
        for (Database.Error error : result.getErrors()) {
          System.debug('Error returned: ' +
                 error.getStatusCode() +' - '+
                 error.getMessage());
        }
      }
    }
  }
}