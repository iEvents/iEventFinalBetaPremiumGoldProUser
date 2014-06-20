/** @module main */

/* Juni 2014: Update auf jQM 1.3.2 
   Juni 2014: Update auf jQM 1.4.2 */

/** EventApp-Objekt, Referenzen auf alle Module */
var EventApp = {
   happenings : new Happenings(),
   controller : new EventAppController(),
   gui : new EventView(),
   tablet : false,
   // db : new EventDB(),
   // locAPI : new Location(),
   cloud : new EventCloud(),
   debug : false
}

/* jQM 1.4: Verwendung des Datepickers aus jQuery.ui */
$.datepicker.setDefaults({
   dateFormat: "dd.mm.yy",
   prevText: '&#x3c;zurück', prevStatus: '',
   prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
   nextText: 'Vor&#x3e;', nextStatus: '',
   nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
   currentText: 'heute', currentStatus: '',
   todayText: 'heute', todayStatus: '',
   clearText: '-', clearStatus: '',
   closeText: 'schließen', closeStatus: '',
   monthNames: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
   monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun', 'Jul','Aug','Sep','Okt','Nov','Dez'],
   dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
   dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
   dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
   showMonthAfterYear: false
});


if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Nativ oder Web? -> Kapitel 9
   // Observer auf Happenings
   EventApp.happenings.addObserver(EventApp.gui, "update");
   EventApp.happenings.addObserver(EventApp.db, "update");
   // EventApp.db.readEvents();

   // Observer auf GEO-Location
   EventApp.locAPI.addObserver(EventApp.gui, "location_update");

}