# Panache Booth

Web Engineering 2 Online Shop.

[GitHub](https://github.com/floriankulig/panache-booth)

## Authoren

- [Lars Huzel](https://github.com/lars-1503)
- [Florian Kulig](https://github.com/floriankulig)

## How to run

1. Stellen Sie sicher, dass Sie [Node.js](https://nodejs.org/en) inkl. npm auf Ihrem Rechner installiert haben.
2. Öffnen Sie ein Terminal oder eine Eingabeaufforderung.
3. Führen Sie folgenden All-In-One-Command aus:

```bash
npm run web-engineering
```

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
- Käufer werden mit Notification-Indikator (im Header) bei App-Load darüber informiert, wenn sich der Status einer Bestellung geändert hat.
- Warenkorb bleibt auch nach Schließen des Browsers bestehen
