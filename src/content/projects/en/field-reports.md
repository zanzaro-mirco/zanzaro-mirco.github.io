---
title: field-reports
order: 4
platform: Kotlin · Jetpack Compose
summary: >-
  Field service reports available offline, with Room as the single source of data, Hilt, and
  a UI verified at 200% text size with touch targets for gloves.
lead: >-
  A deliberately small Android app for reading field service reports, offline too, written the
  way Android is written today: Compose, coroutines, state as a closed hierarchy.
stats:
  - value: '122'
    label: tests in CI
  - value: '8'
    label: states checked for accessibility
  - value: v0.3.0
    label: signed release
stack:
  - Kotlin, Jetpack Compose, Navigation
  - Room, Retrofit, kotlinx-serialization
  - Hilt, WorkManager
  - Robolectric, Roborazzi, Turbine
  - Macrobenchmark and Baseline Profile
links:
  repository: https://github.com/zanzaro-mirco/field-reports
  architecture: https://github.com/zanzaro-mirco/field-reports/blob/main/ARCHITECTURE.md
  releases: https://github.com/zanzaro-mirco/field-reports/releases
choices:
  - title: The cache is the single source
    text: >-
      The UI always reads from Room, and the network only updates it. There is not a single
      `if (isOnline)` in the presentation layer. If a sync fails the cache is left untouched,
      and a network error on data already downloaded becomes a notice above the list. When
      the network comes back, WorkManager makes up the missed sync on its own, even with the
      app closed.
  - title: Real data, with its flaws
    text: >-
      The app reads public GitHub issues instead of made-up JSON. The mapper has to drop pull
      requests, infer the "in progress" state from a label and handle Windows line endings: a
      real API teaches more than a perfect schema.
  - title: An event that does not repeat
    text: >-
      The ViewModel's only event travels on a `Channel`: a `StateFlow` would replay it after a
      rotation, a `SharedFlow` without replay would lose it. Each of those two mistakes has its
      own test.
  - title: Accessibility is a test
    text: >-
      At 200% text size on a handheld-sized screen, a test checks eight states: descriptions,
      56 dp touch targets, no clipped text, and WCAG AA contrast measured on the rendered
      pixels.
lesson: >-
  The 56 dp target declared in the theme was not enough: the space was there, but the area
  that accepts touches stayed at 48 dp until the view configuration changed too. The screen
  looked built for gloves, and only a test that really taps the screen found out.
limits:
  - >-
    TalkBack and use with gloves have not been tested on a device: 56 dp is a choice, not a
    measurement.
  - >-
    It is read-only: GitHub issues are read without authentication, so there is no edit form.
  - >-
    The Baseline Profile gave no gains beyond noise on a Galaxy S20, and it has not been
    measured on a low-end phone.
  - Navigation in the obfuscated APK has not been verified on a device.
  - >-
    The sync that resumes when the network comes back is verified in tests, on a simulated
    WorkManager: that the phone really wakes the closed app has not been observed yet.
updated: 2026-10-18
---

People working off-site read service reports on devices that are often slow, with patchy
connectivity, and sometimes while wearing gloves. It is the field I have worked in the
longest.

The app is deliberately small: it is meant to show how Android is written today. Compose
instead of XML, coroutines and `StateFlow` instead of callbacks and `LiveData`, and state
modeled as a closed hierarchy instead of a handful of booleans.
