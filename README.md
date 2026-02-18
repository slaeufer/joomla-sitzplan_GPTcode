# Joomla Sitzplan-Komponente (`com_sitzplan`)

Diese Repository enthält eine lauffähige Joomla-Komponente, die die bereitgestellte Sitzplan-App als Joomla MVC-Komponente umsetzt.

## Inhalt

- **Site-Teil** unter `components/com_sitzplan`
- **Administrator-Bootstrap/Service Provider** unter `administrator/components/com_sitzplan`
- **Assets (CSS/JS)** unter `media/com_sitzplan`
- **Installationsmanifest** `com_sitzplan.xml`

## Installation in Joomla

1. Repository als ZIP paketieren (Root mit `com_sitzplan.xml` muss enthalten sein).
2. In Joomla im Backend: **System → Erweiterungen → Installieren**.
3. Nach Installation einen Menüpunkt vom Typ **Sitzplan** bzw. `com_sitzplan` anlegen.

## Hinweise

- Die App arbeitet aktuell mit einer statischen Teilnehmerliste im Frontend-JavaScript.
- Die Sitzverteilung ist clientseitig (im Browser) gehalten und wird nicht in der Datenbank persistiert.
