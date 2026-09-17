---
title: pos_printer_bridge
order: 2
platform: Dart · Kotlin · plugin Flutter
summary: >-
  Dallo scontrino ai byte ESC/POS in Dart puro, poi un platform channel verso stampanti
  termiche TCP e USB, con gli stati della stampante come eventi.
lead: >-
  Il pezzo della filiera che tocca l'hardware: un pacchetto Dart che impagina lo scontrino in
  byte ESC/POS, e un plugin Flutter che li porta alla stampante via rete o USB.
stats:
  - value: '2'
    label: pacchetti su pub.dev
  - value: 160/160
    label: entrambi
  - value: '94'
    label: test senza stampante
stack:
  - Dart, plugin Flutter
  - Kotlin, USB host di Android
  - MethodChannel ed EventChannel
  - Socket TCP in Dart puro
links:
  repository: https://github.com/zanzaro-mirco/pos_printer_bridge
  architecture: https://github.com/zanzaro-mirco/pos_printer_bridge/blob/main/ARCHITECTURE.md
  packages:
    - name: esc_pos_builder
      url: https://pub.dev/packages/esc_pos_builder
    - name: pos_printer_bridge
      url: https://pub.dev/packages/pos_printer_bridge
choices:
  - title: Due pacchetti, non uno
    text: >-
      Un plugin dipende da Flutter, e chi lo usa se lo porta dietro. Calcolare byte non ha
      bisogno di un'interfaccia grafica, quindi `esc_pos_builder` resta usabile da un servizio
      o da riga di comando. E il plugin non dipende dal costruttore di byte: un trasporto che
      conosce ciò che trasporta non può trasportare altro.
  - title: Il Kotlin sposta byte e basta
    text: >-
      Il contratto `PrinterTransport` conosce solo byte. La rete è in Dart puro, l'USB passa da
      un `MethodChannel`. La decodifica degli stati è una sola per i due trasporti e sta in
      Dart, dove si può mettere alla prova.
  - title: Gli stati sono eventi, non risposte
    text: >-
      Carta finita e coperchio aperto arrivano quando capitano, non quando li si chiede:
      viaggiano su un `EventChannel`. Gli errori nativi diventano una gerarchia chiusa.
  - title: Byte per byte, senza barare
    text: >-
      Un'attesa costruita con gli stessi byte del codice sbaglia insieme a lui. I test
      confrontano il flusso con un documento scritto a mano, con un riferimento registrato e
      con un decodificatore indipendente che lo rilegge.
lesson: >-
  Contro una stampante di rete emulata il testo usciva con gli accenti sbagliati: l'emulatore
  ignora il comando che sceglie la tabella dei caratteri. Il difetto non era nel codice, e
  adeguarsi all'emulatore sarebbe stato il difetto.
limits:
  - >-
    Manca la prova su carta: l'emulatore ha verificato il trasporto, non la codifica del testo
    su una stampante termica reale.
  - Il codice Kotlin ha una sola verifica automatica, la compilazione dell'APK di esempio.
  - Niente iOS e niente Bluetooth, né codici a barre o logo.
updated: 2026-09-17
---

Calcolare uno scontrino non basta: prima o poi va stampato, e una stampante termica non
riceve testo ma un flusso di comandi ESC/POS. In mezzo c'è il confine fra Dart e il codice
nativo, e una periferica che risponde quando vuole, per esempio perché è finita la carta.

È il mestiere che faccio da dodici anni, fra registratori di cassa, palmari da campo,
terminali di pagamento e stampanti fiscali su seriale. Questo progetto lo porta nel
portfolio e chiude la filiera: `receipt_engine` calcola lo scontrino, `esc_pos_builder` lo
impagina in byte, `pos_printer_bridge` lo manda alla stampante.
