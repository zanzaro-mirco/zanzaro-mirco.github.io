---
title: device_commissioning
order: 5
platform: Flutter · Kotlin · C su ESP32
summary: >-
  Messa in servizio di una centralina via Bluetooth LE, dal firmware all'app. Una scrittura
  può finire in tre modi, e l'app riconosce e risolve quello incerto.
lead: >-
  L'app con cui un installatore trova una centralina, si collega e ne cambia i parametri, con
  il firmware per ESP32-S3 dall'altra parte. Il protocollo è scritto perché l'app sappia
  sempre se una modifica è arrivata.
stats:
  - value: '456'
    label: controlli sul nucleo in C
  - value: '87'
    label: test in Dart, Flutter e Kotlin
  - value: '17'
    label: difese falsificate
  - value: 4 su 4
    label: punti provati con la scheda vera
stack:
  - Flutter, Cubit
  - Kotlin, Pigeon, JNI
  - C, CMake, vettori generati in Python
  - ESP-IDF 6.1 e NimBLE su ESP32-S3
  - GitHub Actions, con firmware ed emulatore
links:
  repository: https://github.com/zanzaro-mirco/device_commissioning
  architecture: https://github.com/zanzaro-mirco/device_commissioning/blob/main/ARCHITECTURE.md
choices:
  - title: Un solo codice per il filo, in C
    text: >-
      La trama e il CRC stanno una volta sola in C: li usano il firmware e il plugin Android
      via JNI, e li userà il lato Swift. I byte attesi dei test non li calcola il nostro
      codice ma la libreria standard di Python: un vettore generato dal codice da verificare
      sbaglierebbe insieme a lui.
  - title: Tre esiti, non due
    text: >-
      Se la connessione cade prima della risposta, la scrittura è incerta. Ogni scrittura
      porta la revisione su cui si basa, come un ETag: ripeterla non applica due volte, e un
      tentativo arrivato in ritardo non cancella una modifica più recente. L'app mostra come
      valore corrente solo quello confermato.
  - title: Un'operazione GATT alla volta
    text: >-
      Il GATT di Android ne esegue una per volta, e una seconda chiesta troppo presto viene
      rifiutata o va persa, a seconda del telefono. Una coda in Kotlin puro le mette in fila,
      e ogni operazione ha una chiave: la risposta tardiva di una scaduta non chiude quella
      dopo. Si prova sulla JVM con un orologio finto.
  - title: Il guasto provato sull'hardware
    text: >-
      Il firmware di debug ha un comando che salva la modifica e riavvia la scheda senza
      rispondere. Con la scheda e un Galaxy S20 l'app ha mostrato «Modifica non confermata», e
      la verifica ha ricevuto «già applicata»: la revisione è avanzata di uno, non di due.
lesson: >-
  Davanti a una scrittura incerta, rileggere lo stato e costruire una richiesta nuova sembra la
  scelta prudente, ed è quella sbagliata: se la prima era arrivata, la seconda la applica di
  nuovo. Togliendo la difesa, due test sono diventati rossi con la revisione avanti di due. Il
  nuovo tentativo deve essere la stessa richiesta.
limits:
  - Gira su Android. Il lato Swift del plugin, per iOS e macOS, non c'è ancora.
  - >-
    Il firmware è il minimo: temperatura simulata, una connessione alla volta, niente
    associazione né cifratura, niente aggiornamento via Bluetooth.
  - La prova con l'hardware è fatta a mano, con una sola scheda e un solo telefono.
  - >-
    Il test del C chiamato via JNI gira su emulatore in CI, ma non è stato falsificato.
updated: 2026-09-19
---

Chi installa un'automazione, un regolatore o una pompa la configura dal telefono, in campo,
spesso con il Bluetooth che va e viene. Quando la connessione cade a metà di una scrittura,
l'app non sa se la centralina ha applicato il valore.

Trattarla come fallita porta l'installatore a riprovare, e un tentativo arrivato in ritardo
può cancellare una modifica più recente. Trattarla come riuscita mostra un valore che forse la
centralina non ha. Qui l'incertezza è un esito a sé, e si risolve senza rischi.
