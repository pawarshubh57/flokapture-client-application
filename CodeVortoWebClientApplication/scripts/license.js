$(document).ready(function() {
   var message = "Your tool license is expired please contact your admin or reseller." +
                       "If you think there was some error then please contact Flokapture support at: " +
                       "<a dir='ltr' href='mailto:support@flokapture.solutions' target='_blank' " +
                       "style='text-decoration:underline; color: #15c'>support@flokapture.solutions</a> ";
    displayMessage(message, "medium");
    return false;

});

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

