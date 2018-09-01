({
    connectCometd : function(component) {
        var helper = this;
        // Configure CometD
        var cometdUrl = window.location.protocol+'//'+window.location.hostname+'/cometd/40.0/';
        var cometd = component.get('v.cometd');
        cometd.configure({
            url: cometdUrl,
            requestHeaders: { Authorization: 'OAuth '+ component.get('v.sessionId')},
            appendMessageTypeToURL : false
        });
        cometd.websocketEnabled = false;
        // Establish CometD connection
        console.log('Connecting to CometD: '+ cometdUrl);
        cometd.handshake(function(handshakeReply) {
            if (handshakeReply.successful) {
                console.log('Connected to CometD.');
                // Subscribe to platform event
                var newSubscription = cometd.subscribe('/event/Case_Notification__e',
                                                       function(platformEvent) {
                                                           console.log('Platform event received: '+ JSON.stringify(platformEvent));
                                                           helper.onReceiveNotification(component, platformEvent);
                                                       }
                                                      );
                // Save subscription for later
                var subscriptions = component.get('v.cometdSubscriptions');
                subscriptions.push(newSubscription);
                component.set('v.cometdSubscriptions', subscriptions);
            }
            else
                console.error('Failed to connected to CometD.');
        });
    },
    disconnectCometd : function(component) {
        var cometd = component.get('v.cometd');
        // Unsuscribe all CometD subscriptions
        cometd.batch(function() {
            var subscriptions = component.get('v.cometdSubscriptions');
            subscriptions.forEach(function (subscription) {
                cometd.unsubscribe(subscription);
            });
        });
        component.set('v.cometdSubscriptions', []);
        // Disconnect CometD
        cometd.disconnect();
        console.log('CometD disconnected.');
    },
    onReceiveNotification : function(component, platformEvent) {
        var helper = this;
        //Check if the message is for right User
		var recordOwnerId = platformEvent.data.payload.OwnerId__c.substring(0, 15);
        if( recordOwnerId == $A.get("$SObjectType.CurrentUser.Id")) {
            
            // Extract notification from platform event
            var newNotification = {
                time : $A.localizationService.formatDateTime(
                    platformEvent.data.payload.CreatedDate, 'HH:mm'),
                recordId : platformEvent.data.payload.Object_Id__c,
                recordName : platformEvent.data.payload.Object_Name__c,
                recordStatus : platformEvent.data.payload.Status__c
            };
    	
            // Save notification in history
            var notifications = component.get('v.notifications');
            notifications.push(newNotification);
            component.set('v.notifications', notifications);
            component.set('v.playSound',true);      
            setTimeout(function() {
                component.set('v.playSound',false);
            }, 2000);
            helper.displayToast(component, 'info', 'Case '+platformEvent.data.payload.Object_Name__c+
                                					'\'s status is updated to '+platformEvent.data.payload.Status__c);
        }
    },
    displayToast : function(component, type, message) {
        var toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            type: type,
            message: message
        });
        toastEvent.fire();
    }
})