---
title: pos_sync
order: 3
platform: Flutter · Android e Windows
summary: >-
  Raccolta ordini offline-first. Conflitti risolti con un orologio di Lamport,
  sincronizzazione fra tablet in LAN con mDNS ed elezione, interruttore remoto.
lead: >-
  Raccolta ordini in sala che funziona senza rete. Quando anche il server è irraggiungibile,
  i tablet si sincronizzano fra loro sulla Wi-Fi del locale.
stats:
  - value: '270'
    label: test
  - value: '4'
    label: test di integrazione su emulatore
  - value: v0.2.0
    label: Release firmata
stack:
  - Flutter, Cubit
  - Drift su SQLite, WorkManager
  - HTTP su dart:io, mDNS
  - Firebase Crashlytics, Remote Config, Analytics
  - GitHub Actions, su Android e Windows
links:
  repository: https://github.com/zanzaro-mirco/pos_sync
  architecture: https://github.com/zanzaro-mirco/pos_sync/blob/main/ARCHITECTURE.md
  releases: https://github.com/zanzaro-mirco/pos_sync/releases
choices:
  - title: Ordine e coda nella stessa transazione
    text: >-
      L'ordine e la sua voce nella coda di uscita si scrivono insieme o per niente, e l'id lo
      genera il client: se la risposta del server si perde, il ritentativo non crea un
      duplicato. La coda si svuota da sola quando la rete torna, e ad app chiusa ci pensa
      WorkManager.
  - title: Conflitti con un orologio di Lamport
    text: >-
      L'ora di sistema si cambia dalle impostazioni, un contatore logico no. Le righe
      dell'ordine si uniscono, lo stato del tavolo va all'ultima modifica. Il caso ambiguo, un
      tavolo pagato mentre un altro tablet aggiungeva righe, si mostra all'operatore invece
      di decidere in silenzio.
  - title: La rete locale senza toccare il worker
    text: >-
      Tre implementazioni dello stesso contratto: un server simulato, il registro sulla cassa
      e un client HTTP sui tablet. La cassa si trova con mDNS, e se sparisce se ne elegge
      un'altra. Il `SyncWorker` non è cambiato di una riga.
  - title: Un interruttore remoto
    text: >-
      Con Firebase Remote Config la sincronizzazione in LAN si spegne senza pubblicare una
      versione. Provato su un telefono vero: spenta dalla console, la cassa chiude la porta
      dopo circa cento secondi, senza reinstallare niente.
lesson: >-
  Rompendo apposta l'orologio logico, i dispositivi continuavano a mettersi d'accordo, ma
  scartando l'ultima decisione presa. La convergenza da sola non dice che un sistema
  distribuito è corretto.
limits:
  - >-
    Due casse elette insieme (split-brain) sono possibili. Il sistema ci sopravvive grazie
    alla politica di fusione, ma non le impedisce.
  - Lo spegnimento remoto arriva dopo circa cento secondi, e la causa non è ancora isolata.
  - >-
    I crash lato Dart non sono stati provati sul dispositivo, e gli adattatori verso Firebase
    non hanno test.
  - >-
    Il backend cloud è simulato dentro l'app: fra dispositivi diversi la sincronizzazione vera
    passa dalla rete locale.
updated: 2026-09-17
---

In un ristorante il Wi-Fi cade. In un negozio il terminale perde la rete a metà di una
transazione. L'approccio abituale, con l'interfaccia che chiama l'API e mostra uno spinner,
in queste condizioni produce un'app inutilizzabile e, peggio, ordini duplicati quando il
cameriere riprova.

Qui il database locale è la sorgente di verità, e la rete è un dettaglio di
sincronizzazione.
