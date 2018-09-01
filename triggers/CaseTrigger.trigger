trigger CaseTrigger on Case(after update) {
  if(Trigger.isAfter) {
    if(Trigger.isUpdate) {
      CaseTriggerController.afterUpdate(Trigger.new,Trigger.oldMap);
    }
  }
}