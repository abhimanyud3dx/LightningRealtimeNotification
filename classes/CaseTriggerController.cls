public class CaseTriggerController {

  public static void afterUpdate(List<Case> newList,Map<Id,Case> oldMap) {
    List<Case> caseNotifiedList = new List<Case>();
    for(Case c:newList) {
      // filter out cases with has status field updated
      if(c.Status != oldMap.get(c.Id).Status) {
        caseNotifiedList.add(c);
      }
    }
    // Pass the filtered case to generate notification
    CaseNotificationController.publishNotifications(caseNotifiedList); 
  }
}