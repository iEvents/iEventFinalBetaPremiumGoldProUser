/** @module controller */

/** Controller */
var EventAppController = function() {
	/** @lends EventAppController */
	var actEvent;
	// Aktuell bearbeitetes Event
	var valid = new Validator();

	/** Zurück auf Home.
	 * Quelle: event-details
	 * Ziel: event-home */
	function home() {
		if (EventApp.tablet == true) {
			$('#delDialog').popup('close');
			// Einfach schliessen, auch wenn nicht offen
			addEvent();
		} else
			$("body").pagecontainer("change", "#event-home");
	}

	/** Neue Event erstellen.
	 * Quelle: event-home
	 * Ziel: event-details */
	function addEvent() {
		$.mobile.silentScroll();

		// Datum ermitteln, leider muss das ganz genau stimmen
		var ldate = new Date();
		var disp_date = "";
		if ((ldate.getMonth() + 1) < 10) {
			if (ldate.getDate() < 10)
				disp_date = "0" + ldate.getDate() + ".0" + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
			else
				disp_date = ldate.getDate() + ".0" + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
		} else {
			if (ldate.getDate() < 10)
				disp_date = "0" + ldate.getDate() + "." + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
			else
				disp_date = ldate.getDate() + "." + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
		}

		// Neues Event mit Default-Werten löschen
		actEvent = new Event(disp_date, "", "", "", "", "", "", "", "");

		// und so tun, als ob es eine gäbe...
		edit();

		// EventApp.locAPI.start(actEvent.guid);

		valid.validate();
		// erstmalige Validierung
	}

	/** Event darstellen zum editieren
	 * Quelle: event-home
	 * Ziel: event-details */
	function edit(guid) {
		
		$.mobile.silentScroll();

		// aktuelle Event merken
		if (guid != undefined)
			actEvent = EventApp.happenings.getEventByID(guid);

		// Page wechseln
		if (EventApp.tablet == false)
			$("body").pagecontainer("change", "#event-details");

		// Werte setzen
		refreshEvent();
		valid.validate();

	}

	/** Event löschen.
	 * Quelle: event-details
	 * Ziel: event-home */
	function deleteEvent() {
		if (actEvent != null)
			EventApp.happenings.deleteID(actEvent.guid);

		if (EventApp.tablet == true)
			addEvent();

		$("body").pagecontainer("change", "#event-home");
	}

	/** Event speichern.
	 * Quelle: event-details
	 * Ziel: event-home */
	function saveEvent() {
		var e;
		// Eintrag hinzufügen
		if (actEvent == null)
			e = new Event();
		else// Event updaten
			e = actEvent;

		// validierung
		if (valid.validate() == false)
			return false;

		// Felder holen
		e.eventName = $('#eventName', $("body").pagecontainer("getActivePage")).val();
		e.description = $('#description', $("body").pagecontainer("getActivePage")).val();
		e.participants = $('#participants', $("body").pagecontainer("getActivePage")).val();
		e.ort = $('#ort', $("body").pagecontainer("getActivePage")).val();
		e.map = $('#map', $("body").pagecontainer("getActivePage")).val();
		e.date = $('#date', $("body").pagecontainer("getActivePage")).val();
		e.time = $('#time', $("body").pagecontainer("getActivePage")).val();

		// Eintrag hinzufügen/erzeugen (wird in Methode entschieden)
		EventApp.happenings.edit(e);

		if (EventApp.tablet == false)
			$("body").pagecontainer("change", "#event-home");
		else
			addEvent();
	}

	/** Refresh.
	 * Quelle: event-home
	 * Ziel: whiskey-home */
	function refresh() {
		location.reload();
	}

	/** Aktualisiert Events-Page
	 */
	function refreshEvent() {
		// Zuweisungen
		$('#eventName', $("body").pagecontainer("getActivePage")).val(actEvent.eventName);
		$('#description', $("body").pagecontainer("getActivePage")).val(actEvent.description);
		$('#participants', $("body").pagecontainer("getActivePage")).val(actEvent.participants);
		$('#ort', $("body").pagecontainer("getActivePage")).val(actEvent.ort);
		$('#map', $("body").pagecontainer("getActivePage")).val(actEvent.map);
		$('#date', $("body").pagecontainer("getActivePage")).val(actEvent.date);
		$('#time', $("body").pagecontainer("getActivePage")).val(actEvent.time);
	}

	/**Twitter-Veröffentlichung */
	function toTwitter () {
	  var e = actEvent;
	  	
	}

	/** Facebook-Veröffentlichung */
	function toFacebook() {
		var e = actEvent;
		e.eventName = $('#eventName', $("body").pagecontainer("getActivePage")).val();
		e.description = $('#description', $("body").pagecontainer("getActivePage")).val();
		e.Event = $("input:radio:checked[name='Event']", $("body").pagecontainer("getActivePage")).val();
		e.map = $('#map', $("body").pagecontainer("getActivePage")).val();
		EventApp.cloud.feedOnFacebook(e);
	}

	/** Init */
	return {
		initialize : function() {

			// Add-Button in der Liste
			$("#add").bind('vclick', function(event) {
				event.preventDefault();
				addEvent();
				return false;
			});

			// refresh
			$("#refresh").click(refresh);

			// Home-Button
			$("#home").click(home);

			// Delete-Button
			$("#delEvent").click(function() {
				$('#delDialog').popup('open')
			});
			$("#delRealy").click(function(event) {
				event.preventDefault();
				deleteEvent();
				return false;
			});
			$("#delNo").click(function() {
				$('#delDialog').popup('close')
			});

			// Save-Button
			$("#saveEvent").bind('vclick', function(event) {
				event.preventDefault();
				saveEvent();
				return false;
			});

			// Live-Validierung
			valid.autoValidate();

			// Twitter
			//$("#twitter").click(toTwitter);

			// Facebook
			$("#facebook").click(toFacebook);

		},
		/* click auf Eintrag */
		edit : function(guid) {
			edit(guid);
		},
		/* click auf Eintrag */
		firstView : function() {
			addEvent();
		},
		getGUID : function() {
			return actEvent.guid;
		},
		setOrt : function(locObj) {
			actEvent.ort = locObj;
		}
	};
}
/** Controller aufrufen, wenn pageinit von jQM geworfen wird. */
$(document).on("pagecreate", function(event) {// in jQM 1.4 statt pageinit neu pagecreate
	if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Event-Listener Buttons
		EventApp.controller.initialize();
	}
});

