---
title: pos_sync
order: 3
platform: Flutter · Android and Windows
summary: >-
  Offline-first order taking. Conflicts resolved with a Lamport clock, tablet-to-tablet sync
  over the LAN with mDNS and election, remote kill switch.
lead: >-
  Order taking in the dining room that works without a network. When even the server is
  unreachable, the tablets sync with each other over the venue's Wi-Fi.
stats:
  - value: '270'
    label: tests
  - value: '4'
    label: integration tests on an emulator
  - value: v0.2.0
    label: signed release
stack:
  - Flutter, Cubit
  - Drift on SQLite, WorkManager
  - HTTP on dart:io, mDNS
  - Firebase Crashlytics, Remote Config, Analytics
  - GitHub Actions, on Android and Windows
links:
  repository: https://github.com/zanzaro-mirco/pos_sync
  architecture: https://github.com/zanzaro-mirco/pos_sync/blob/main/ARCHITECTURE.md
  releases: https://github.com/zanzaro-mirco/pos_sync/releases
choices:
  - title: Order and queue in one transaction
    text: >-
      The order and its outbox entry are written together or not at all, and the client
      generates the id: if the server's response is lost, the retry does not create a
      duplicate. The queue drains by itself when the network returns, and WorkManager takes
      over when the app is closed.
  - title: Conflicts with a Lamport clock
    text: >-
      System time can be changed from the settings; a logical counter cannot. Order lines are
      merged, the table status goes to the latest change. The ambiguous case, a table paid
      while another tablet was adding lines, is shown to the operator instead of being decided
      silently.
  - title: The local network without touching the worker
    text: >-
      Three implementations of the same contract: a simulated server, the ledger on the
      register, and an HTTP client on the tablets. The register is found through mDNS, and if
      it disappears another one is elected. The `SyncWorker` did not change by a single line.
  - title: A remote kill switch
    text: >-
      With Firebase Remote Config, LAN sync can be turned off without shipping a release.
      Tested on a real phone: switched off from the console, the register closed its port after
      about a hundred seconds, with nothing reinstalled.
lesson: >-
  When I broke the logical clock on purpose, the devices kept agreeing with each other, but
  they discarded the latest decision. Convergence alone does not tell you a distributed system
  is correct.
limits:
  - >-
    Two registers elected at once (split-brain) are possible. The system survives it thanks to
    its merge policy, but does not prevent it.
  - >-
    The remote switch takes effect after about a hundred seconds, and the cause has not been
    isolated yet.
  - >-
    Dart-side crashes have not been tested on the device, and the Firebase adapters have no
    tests.
  - >-
    The cloud backend is simulated inside the app: between different devices, real sync goes
    through the local network.
updated: 2026-09-17
---

In a restaurant, the Wi-Fi drops. In a shop, the terminal loses the network halfway through a
transaction. The usual approach, a UI that calls the API and shows a spinner, becomes an
unusable app under these conditions and, worse, produces duplicate orders when the waiter
tries again.

Here the local database is the source of truth, and the network is a synchronization detail.
