---
title: receipt_engine
order: 1
platform: Dart puro · pacchetto
summary: >-
  Il motore di calcolo degli scontrini fiscali italiani: IVA multi-aliquota, sconti, storni
  e resi, pagamenti misti, serializzazione JSON. Zero dipendenze.
lead: >-
  Righe, sconti, IVA, resi e resto di uno scontrino fiscale italiano, in Dart puro e senza
  dipendenze. Pubblicato su pub.dev, usabile da un'app, da un backend o da riga di comando.
stats:
  - value: 160/160
    label: su pub.dev
  - value: '110'
    label: test
  - value: '7'
    label: proprietà su scontrini generati
stack:
  - Dart 3, zero dipendenze a runtime
  - Property-based testing scritto a mano
  - pana e GitHub Actions
links:
  repository: https://github.com/zanzaro-mirco/receipt_engine
  architecture: https://github.com/zanzaro-mirco/receipt_engine/blob/main/ARCHITECTURE.md
  packages:
    - name: receipt_engine
      url: https://pub.dev/packages/receipt_engine
choices:
  - title: Importi in centesimi, mai double
    text: >-
      In virgola mobile binaria 0,1 + 0,2 non fa 0,3, e sul denaro non è accettabile.
      L'imposta si ricava per differenza dall'imponibile, così imponibile più imposta
      fa sempre il lordo.
  - title: Il reso è un secondo documento
    text: >-
      Uno scontrino emesso non si modifica: si storna. Il reso porta importi negativi, così
      il totale di giornata è la somma di tutto, senza casi particolari. E si rimborsa quanto
      la riga ha incassato, non il suo totale: con uno sconto di documento le due cifre
      differiscono.
  - title: Il resto esce solo dal cassetto
    text: >-
      Totale 22 €, pagati 25 con la carta: i 3 € di resto non sono in cassa. È un errore,
      non un resto. Con i pagamenti misti il resto non può superare il contante ricevuto.
  - title: La rilettura non ricalcola
    text: >-
      Un documento fiscale emesso si rilegge com'è. Se ripassasse dal calcolo, una
      correzione futura agli arrotondamenti cambierebbe scontrini già consegnati. Ogni JSON
      porta la sua versione di schema.
lesson: >-
  I test su scontrini generati hanno trovato un difetto che nessun esempio scritto a mano
  avrebbe colto: su merce a peso, l'ultima tranche di un reso veniva rifiutata. E ho imparato
  che una proprietà verificata solo su input validi non si accorge se il codice smette di
  rifiutare quelli invalidi.
limits:
  - >-
    Il dominio è italiano. Le aliquote accettano qualunque percentuale, ma le regole fiscali
    di altri paesi (quale bene va a quale aliquota, il reverse charge, la numerazione) non ci
    sono.
  - >-
    Due resi parziali possono stornare un centesimo d'imposta più dell'incassato, perché ogni
    documento arrotonda per conto suo, come vuole la norma. Un test lega lo scarto al numero
    di documenti.
  - Uno sconto definito fuori dal pacchetto si calcola, ma non si serializza in JSON.
  - Il buono pasto con eccedenza persa e il metodo di rimborso del reso non sono modellati.
updated: 2026-09-17
---

Il calcolo di uno scontrino sembra banale finché non si incontrano gli arrotondamenti. Se
l'imposta si calcola riga per riga, la somma può differire di qualche centesimo da quella
calcolata sul totale, e uno scontrino che non quadra per un centesimo è un problema
contabile, non un dettaglio estetico.

Il pacchetto nasce da questo problema, incontrato lavorando su software per registratori di
cassa. Isola quella logica in un modulo che si testa in millisecondi.
