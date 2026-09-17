---
title: field-reports
order: 4
platform: Kotlin · Jetpack Compose
summary: >-
  Rapporti di intervento consultabili offline, con Room come unica sorgente dei dati, Hilt e
  un'interfaccia verificata con il testo al 200% e bersagli per i guanti.
lead: >-
  Un'app Android volutamente piccola per consultare rapporti di intervento tecnico, anche
  offline, scritta come si scrive Android oggi: Compose, coroutine, stato come gerarchia
  chiusa.
stats:
  - value: '108'
    label: test in CI
  - value: '8'
    label: stati verificati per l'accessibilità
  - value: v0.3.0
    label: Release firmata
stack:
  - Kotlin, Jetpack Compose, Navigation
  - Room, Retrofit, kotlinx-serialization
  - Hilt
  - Robolectric, Roborazzi, Turbine
  - Macrobenchmark e Baseline Profile
links:
  repository: https://github.com/zanzaro-mirco/field-reports
  architecture: https://github.com/zanzaro-mirco/field-reports/blob/main/ARCHITECTURE.md
  releases: https://github.com/zanzaro-mirco/field-reports/releases
choices:
  - title: La cache è la sorgente unica
    text: >-
      La UI legge sempre da Room, e la rete si limita ad aggiornarlo. Nella presentazione non
      c'è un solo `if (isOnline)`. Se la sincronizzazione fallisce la cache non si tocca, e un
      errore di rete su dati già scaricati diventa un avviso sopra la lista.
  - title: Dati veri, con le loro imperfezioni
    text: >-
      L'app legge le issue pubbliche di GitHub invece di un JSON inventato. Il mapper deve
      scartare le pull request, dedurre lo stato «in lavorazione» da un'etichetta e ripulire
      gli a capo di Windows: un'API vera insegna più di uno schema perfetto.
  - title: Un evento che non si ripete
    text: >-
      L'unico evento del ViewModel viaggia su un `Channel`: uno `StateFlow` lo ripeterebbe
      dopo una rotazione, uno `SharedFlow` senza replay lo perderebbe. Ognuno dei due errori ha
      il suo test.
  - title: L'accessibilità è un test
    text: >-
      Con il testo al 200% su uno schermo da palmare, un test controlla otto stati:
      descrizioni, bersagli da 56 dp, nessun testo tagliato e contrasto WCAG AA misurato sui
      pixel disegnati.
lesson: >-
  Il bersaglio da 56 dp dichiarato nel tema non bastava: lo spazio c'era, ma l'area che
  accetta il tocco restava a 48 dp finché non si cambiava anche la configurazione della vista.
  Lo schermo sembrava fatto per i guanti, e solo un test che tocca davvero lo ha scoperto.
limits:
  - >-
    TalkBack e l'uso con i guanti non sono stati provati su un dispositivo: 56 dp è una scelta,
    non una misura.
  - >-
    È in sola lettura: le issue di GitHub si leggono senza autenticazione, quindi non c'è un
    form di modifica.
  - >-
    Il Baseline Profile non ha dato guadagni oltre il rumore su un Galaxy S20, e su un telefono
    di fascia bassa non è stato misurato.
  - La navigazione nell'APK offuscato non è stata verificata su un dispositivo.
updated: 2026-09-17
---

Chi lavora fuori sede consulta i rapporti di intervento su dispositivi spesso lenti, con una
connettività incerta, e a volte con i guanti. È l'ambito in cui ho lavorato più a lungo.

L'app è volutamente piccola: serve a mostrare come si scrive Android oggi. Compose al posto
degli XML, coroutine e `StateFlow` al posto di callback e `LiveData`, e lo stato modellato
come gerarchia chiusa invece che come una manciata di booleani.
