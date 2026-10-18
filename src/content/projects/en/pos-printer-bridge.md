---
title: pos_printer_bridge
order: 2
platform: Dart · Kotlin · Flutter plugin
summary: >-
  From receipt to ESC/POS bytes in pure Dart — text, barcodes and logo — then a platform
  channel to TCP and USB thermal printers, with printer status delivered as events.
lead: >-
  The part of the pipeline that touches hardware: a Dart package that lays the receipt out as
  ESC/POS bytes — barcodes and logo included — and a Flutter plugin that carries them to the
  printer over the network or USB.
stats:
  - value: '2'
    label: packages on pub.dev
  - value: 160/160
    label: on pub.dev, both
  - value: '131'
    label: tests without a printer
stack:
  - Dart, Flutter plugin
  - Kotlin, Android USB host
  - MethodChannel and EventChannel
  - TCP sockets in pure Dart
links:
  repository: https://github.com/zanzaro-mirco/pos_printer_bridge
  architecture: https://github.com/zanzaro-mirco/pos_printer_bridge/blob/main/ARCHITECTURE.md
  packages:
    - name: esc_pos_builder
      url: https://pub.dev/packages/esc_pos_builder
    - name: pos_printer_bridge
      url: https://pub.dev/packages/pos_printer_bridge
choices:
  - title: Two packages, not one
    text: >-
      A plugin depends on Flutter, and whoever uses it inherits that. Computing bytes needs no
      UI framework, so `esc_pos_builder` stays usable from a service or the command line. And
      the plugin does not depend on the byte builder: a transport that knows what it carries
      can no longer carry anything else.
  - title: Kotlin just moves bytes
    text: >-
      The `PrinterTransport` contract knows only bytes. The network transport is pure Dart,
      USB goes through a `MethodChannel`. Status decoding is shared by both transports and
      lives in Dart, where it can be tested.
  - title: Status is an event, not a response
    text: >-
      Paper out and cover open arrive when they happen, not when asked for: they travel on an
      `EventChannel`. Native errors become a closed hierarchy.
  - title: The command everyone prints logos with goes unused
    text: >-
      `GS v 0` is in every example online, and it is also the command Epson's own reference
      marks as obsolete, stating that future models will not support it. The logo goes through
      the recommended graphics function instead. The price is declared: a cheap thermal printer
      that only accepts the obsolete command will not print the logo.
lesson: >-
  Against an emulated network printer, accented letters came out wrong: the emulator ignores
  the command that selects the character table. The bug was not in the code, and adapting to
  the emulator would have been the bug.
limits:
  - >-
    Not yet tested on real paper: the emulator verified the transport, not how text is encoded,
    and not the barcodes or the logo either. The bytes match the specification, but they have
    never come out of a printer.
  - The Kotlin code has a single automated check, building the example APK.
  - No iOS and no Bluetooth.
  - >-
    Four barcode systems out of fifteen, and the width is computed only for EAN13 and EAN8:
    for CODE39 and CODE128 it depends on the printer model, and a wrong estimate would reject
    valid codes.
updated: 2026-10-18
---

Calculating a receipt is not enough: sooner or later it has to be printed, and a thermal
printer does not take text but a stream of ESC/POS commands. In between lies the boundary
between Dart and native code, and a device that speaks up whenever it likes, for instance
when it runs out of paper.

It is the trade I have practiced for twelve years, across cash registers, field handhelds,
payment terminals and serial fiscal printers. This project brings it into the portfolio and
closes the pipeline: `receipt_engine` calculates the receipt, `esc_pos_builder` lays it out
as bytes, `pos_printer_bridge` sends it to the printer.
