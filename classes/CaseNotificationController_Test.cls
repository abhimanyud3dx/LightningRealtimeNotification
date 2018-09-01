@isTest
private class CaseNotificationController_Test {

	private static testMethod void test() {
    System.assertNotEquals(null, CaseNotificationController.getSessionId());
    Case c = new Case();
    insert c;
    List<Case> caseList = new List<Case>();
    caseList.add(c);
    CaseNotificationController.publishNotifications(caseList);
	}

}