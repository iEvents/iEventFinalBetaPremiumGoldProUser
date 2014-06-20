/** Objekt Event repräsentiert eine einzelnes Event */
var Event = Class.extend({
	init : function(date, eventName, description, participants, time, ort, map, guid) {
		// GUID als ID (somit keine Probleme bei Verteilten Einträgen)
		if (guid == null)
			this.guid = this.generateGUID();
		else
			this.guid = guid;

		// Allgemeine Parameter
		this.date = date;
		this.eventName = eventName;
		this.description = description;
		this.participants = participants;
		this.time = time;
		this.ort = ort;
		this.map = map;

		// Ort des Events
		// if(ort == null)
		// this.ort = "";
		// else
		// this.ort = ort;

	},

	/** Gibt eine Bezeichnung des Events zurück.
	 */
	getName : function() {
		return this.eventName + ": " + this.description + " - am " + this.date;
	}
});

/** Objekt Happenings - Container für Events
 *  mit den üblichen CRUD-Funktionen.
 */
var Happenings = Observer.extend({
	init : function() {
		this._super();
		this.EventAr = new Array();
	},

	// Nun die CRUD Funktionen
	/** Events setzen und DB aktualisieren */
	setEventWithDB : function(array) {
		// Alle Events löschen
		for (var i = 0; i < this.EventAr.length; i++) {
			var deleted = this.EventAr.splice(i, 1);
			//this.notify({obj: deleted[0], crud: "D"});
		}
		EventApp.db.delAll();

		var dt = new Date();
		dt.setTime(dt.getTime() + 1000);
		while (new Date().getTime() < dt.getTime());

		// Events hinzufügen
		for (var i = 0; i < array.length; i++) {
			this.add(array[i]);
		}
	},

	/** Events setzen */
	setEvents : function(array) {
		this.EventAr = array;

		// update
		this.notify({
			obj : this.EventAr,
			crud : "R"
		});
	},

	/** (C) Erzeugt eine Event und fügt diese hinzu.
	 */
	create : function(date, eventName, description, participants, time, ort, map) {

		// Event erzeugen
		var Event = new Event(date, eventName, description, participants, time, ort, map);

		// dem Array hinzufügen
		this.EventAr.push(Event);

		// update
		this.notify({
			obj : Event,
			crud : "C"
		});
	},

	/** (C) Fügt einen Eintrag hinzu, mit Events-Objekt
	 */
	add : function(Event) {
		// dem Array hinzufügen
		this.EventAr.push(Event);

		// update
		this.notify({
			obj : Event,
			crud : "C"
		});
	},

	/** (R) Sucht den Event mit der GUID.
	 */
	getEventByID : function(guid) {
		for (var i = 0; i < this.EventAr.length; i++) {
			if (this.EventAr[i].guid == guid) {
				return this.EventAr[i];
			}
		}
	},

	/** (R) Array mit Events zurückgeben
	 */
	getEvents : function() {
		return this.EventAr;
	},

	/** (U) Aktualisiert die Event.
	 * Wenn diese nicht vorhanden ist, wird eine neue erzeugt.
	 */
	edit : function(Event) {
		var gefunden = 0;

		for (var i = 0; i < this.EventAr.length; i++) {
			if (this.EventAr[i].guid == Event.guid) {
				// Event gefunden, nun ersetzen
				this.EventAr[i] = Event;
				gefunden = 1;
				this.notify({
					obj : Event,
					crud : "U"
				});
			}
		}

		// existiert keine, dann hinzufügen
		if (gefunden == 0)
			this.add(Event);
	},

	/** (D) Löscht die Event mit der GUID.
	 */
	deleteID : function(guid) {
		for (var i = 0; i < this.EventAr.length; i++) {
			if (this.EventAr[i].guid == guid) {
				var deleted = this.EventAr.splice(i, 1);
				this.notify({
					obj : deleted[0],
					crud : "D"
				});
				return;
			}
		}
	}
});
