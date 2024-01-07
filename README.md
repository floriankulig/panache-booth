# Panache Booth

Web Engineering 2 Online Shop.

[GitHub](https://github.com/floriankulig/panache-booth)

## Authoren

- [Lars Huzel](https://github.com/lars-1503)
- [Florian Kulig](https://github.com/floriankulig)

## How to run

1. Stelle sicher, dass du [Node.js](https://nodejs.org/en) inkl. npm auf deinem Rechner installiert haben.
2. Öffne ein Terminal oder eine Eingabeaufforderung.
3. Führe folgenden All-In-One-Command aus:

```bash
npm run web-engineering
```

- Einige Client-seitigen Daten, wie z.B. der Warenkorb, werden im LocalStorage zwischengespeichert. Zum parallelen Testen mit unterschiedlichen User-Accounts sollten also keine Tabs verwendet werden, sondern eigene Fenster (im Inkognito-Modus).

## Features

### Non-Funktional

- Etablierter Code Style Guide für bestmögliche Code-Qualität
- Implementieren von brandguide-konformen Komponenten-Selektoren per config-default.

### Funktional

#### Technisch

- Lagern des Application-State per URL-Query-Parameter für bestmögliche Datenpersistenz auch nach Neuladen der Seite (z.B. Suche, Kategorien)
  - Navigieren über native Browser-History
- Selbstgehostete Schriftarten
  - Bessere Performance
  - Keine Anfragen zusätzlichen an Hosting-Server
- Micro Interaktionen für bessere User Experience: Nutzer sieht visuell wie er mit der App interagiert
  - Optimieren von Animationen für WebKit Browser Engine: Keine größeren _transform_-Animationen auf **flex**-Elementen (Sidebar, Modals).

#### Fachlich

- Schutz von Nutzerdaten: nur das jeweils eigene und Verkäuferprofile können eingesehen werden
- Verkäufer können selbst zu Käufern werden.
- Einteilung der Produkte in Kategorien und eine Filteransicht für das Suchen nach/in Kategorien.
- Verkäufer geben ein Inventar/den Bestand des Produkts an, das sie verkaufen
  - Simulieren eines echten Warenhauses
  - Verkäufer kann FOMO erzeugen, um Käufe zu provozieren
- Nutzer sehen, wie oft ein Produkt gekauft wurde.
- Verkäufer können Produkte rabattieren.
- Käufer werden mit Notification-Indikator (im Header) bei App-Load darüber informiert, wenn sich der Status einer Bestellung geändert hat.
- Warenkorb bleibt auch nach Schließen des Browsers bestehen
