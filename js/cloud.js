/** @module cloud */

/** Cloud: Kommunikationen mit den Event-Diensten */
var EventCloud = Class.extend({
   // Konstruktor
   init : function() {
      this.distilleries = new Array();
      this.FBLogin = 0;

      // Facebook-Integration
      if ( typeof FB != "undefined") {
         var that = this;
         // FB Initi
         FB.init({appId: '162909123849416', status: true, cookie: true, xfbml: false});
         // Bereits angemeldet?
         FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
            } else if (response.status === 'not_authorized') {
               that.FBLogin = 1;
            } else {
               that.FBLogin = 1;
            }
         });
         FB.Event.subscribe('auth.authResponseChange',
            function(response) {
               FB.getLoginStatus(function(response) {
                  if (response.status === 'connected') {
                  } else if (response.status === 'not_authorized') {
                     that.FBLogin = 1;
                  } else {
                     that.FBLogin = 1;
                  }
               });
            }
         );
      } 
   },
   
   /** Auf Facebook anmelden */
   loginFacebook : function() {
      var that = this;
      if( ("standalone" in window.navigator) && !window.navigator.standalone ) {
         // iOS Safari Full Screen Mode (keine Popups)
         param = {scope:'publish_actions', redirect_uri: 'http://whisky.xapps.ch', display : 'touch'}
      }
      else {
         param = {scope:'publish_actions'}
      }
      
      FB.login(function(response) { 
         if (response.authResponse) {
            that.FBLogin = 0;
         }
         else {
            EventApp.gui.alert('Fehler beim Login');
         }
      }, param );
   },
   
   /** Event auf Facebook publizieren */
   feedOnFacebook : function(Event) {
      if ( typeof FB != "undefined") {
         var that = this;
         if( this.FBLogin == 1 ) {
            // nicht angemeldet, also anmelden
            this.loginFacebook();
            return false;
         }
         
         // Waiting Dialog
         $.mobile.loading( 'show', {text: "sendet an Facebook...", textVisible: true} );

         // Parameter für Feed

	// var params = {};
	// params['message'] = 'Ich habe ein Event erstellt:';
	// params['name'] = Event.eventName+' '+Event.description;
	// params['description'] = 'Kommentar: '+Event.map;
	// params['link'] = 'http://www.dpunkt.de/buecher/4007/web-apps-mit-jquery-mobile.html';
	// params['picture'] = 'http://'+EventApp.domain+'/img/whisky.png';
	// params['caption'] = Event.Event+' Sterne!';
	// if( ("standalone" in window.navigator) && !window.navigator.standalone ) {
	// // iOS Safari Full Screen Mode (keine Popups)
	// params['display'] = 'touch';
	// params['redirect_uri'] = 'http://whisky.xapps.ch';
	// }


         FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
               $.mobile.loading( 'hide' );
               FB.api('/me/feed', 'post', params, function(response) {
                  if (!response || response.error) {
                     EventApp.gui.alert('Fehler');
                  } else {
                     alert('Post ID: ' + response.id);
                  }
               }); 
            } else if (response.status === 'not_authorized') {
               $.mobile.loading( 'hide' );
               EventApp.gui.alert('Erneutes Facebook-Login notwendig. Nochmals ausführen bitte.');
               that.FBLogin = 1;
            } else {
               $.mobile.loading( 'hide' );
               EventApp.gui.alert('Erneutes Facebook-Login notwendig. Nochmals ausführen bitte.');
               that.FBLogin = 1;
            }
          });
      }
   }

});
