/** @module view */

/**
 *  UPDATE METHODE
 *  Aktualisiert die Events-Liste */
var EventView = View.extend({
	init : function() {
		this._super();
	},
	/** Sortierung des Event-Arrays */
	sortAlg : function(a, b) {
		return (a == b) ? 0 : (a > b) ? 1 : -1;
	},
	/** GUI aktualisieren */
	update : function(scope, data) {
		var actTitel = "";
		var count = 0;
		var line = "";

		// (1) Alte Listview löschen
		$('#eventlist ul li').remove();

		var ar = scope.getEvents();
		// (2) alle Events lesen
		ar.sort(this.sortAlg);
		// und sortieren

		// (3) Durch die Events gehen
		for (var i = 0; i < ar.length; i++) {
			// Titel
			if (ar[i].date != actTitel) {
				if (newEntryRowTitle != null) {
					// Anzahl Events am gleichen Datum setzen
					newEntryRowTitle.find('.ui-li-count').text(count);
					count = 0;
				}
				var newEntryRowTitle = $('#titleTemplate').clone();
				actTitel = ar[i].date;
				newEntryRowTitle.find('#label').text(actTitel);
				newEntryRowTitle.appendTo('#eventlist ul');
			}

			// (4) Allg. Informationen
			count++;
			var newEntryRow = $('#entryTemplate').clone();
			newEntryRow.jqmData('entryId', ar[i].guid);
			newEntryRow.find('#ui-li-title').text(ar[i].eventName);
			newEntryRow.find('#ui-li-description').text("Beschreibung: " + ar[i].description);
			newEntryRow.find('#ui-li-participants').html("Teilnehmer: " + ar[i].participants);
			newEntryRow.find('#ui-li-zeit').html("Zeit: " + ar[i].time);
			newEntryRow.find('#ui-li-ort').html("Ort: " + ar[i].ort);
			// newEntryRow.find('#ui-li-map').html(ar[i].map);

			newEntryRow.find('#forsearch').text(ar[i].eventName);

			// Event-Listener setzen auf Clicken
			newEntryRow.click(function(event) {
				event.preventDefault();
				EventApp.controller.edit($(this).jqmData('entryId'));
				return false;
			});

			// (5) Der Liste hinzufügen
			newEntryRow.appendTo('#eventlist ul');
		}

		// Anzahl Event am gleichen Datum setzen
		if (newEntryRowTitle != null) {
			newEntryRowTitle.find('.ui-li-count').text(count);
		}

	},

	/** GEO-Location update */
	location_update : function(scope, data) {
		if (EventApp.debug)
			console.log("Update Location");

		if (scope.getGUID() == EventApp.controller.getGUID()) {
			var locObj = scope.getLocObj();
			EventApp.controller.setOrt(locObj);
			this.setLocation(locObj);
		}
	},

	setLocation : function(ort) {
		$('#adresse').text(ort.string);
		$('#adrimg').remove();
		if (navigator.onLine)
			$('#adr').prepend('<img src="https://maps.googleapis.com/maps/api/staticmap?center=' + ort.pos + '&amp;zoom=14&amp;size=280x200&amp;markers=' + ort.pos + '&amp;sensor=false" height="200" width="280" id="adrimg" />');
	}
});

/**
 * Bevor die Seite erzeugt wird, je nach Auflösung die Pages/Contents umhängen. */
$(document).bind("pagebeforecreate", function() {
	var winwidth = $(window).width();

	// Je nach Auflösung...
	if (winwidth >= 650) {
		var element = $('#eventdetail').html();
		$('#eventdetails').append(element);
		$('#event-details').remove();
		EventApp.tablet = true;
	} else {
		$('#eventlist').removeClass("content-list");
		$('#eventdetails').remove();
	}

	// Facebook-Button entfernen, wenn API nicht geladen wurde
	if ( typeof FB == "undefined") {
		$('#facebookBar').remove();
	}
});

/**
 * Event für neues Happening darstellen. */
$(document).on("pagecontainershow", function(event, ui) {// in jQM 1.4 nicht mehr pageshow sondern pagecontainershow
	if ($("body").pagecontainer("getActivePage").attr("id") == "event-home") {
		if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Nativ oder Web? -> Kapitel 9
			if (EventApp.tablet == true)
				EventApp.controller.firstView();
		}
	}
});
