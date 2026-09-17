---
title: pos_printer_bridge
order: 2
platform: Dart · Kotlin · Flutter plugin
summary: >-
  From receipt to ESC/POS bytes in pure Dart, then a platform channel to TCP and USB thermal
  printers, with printer status delivered as events.
lead: >-
  The part of the pipeline that touches hardware: a Dart package that lays the receipt out as
  ESC/POS bytes, and a Flutter plugin that carries them to the printer over the network or USB.
stats:
  - value: '2'
    label: packages on pub.dev
  - value: 160/160
    label: both
  - value: '94'
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
  - title: Byte for byte, without cheating
    text: >-
      An expectation built from the same bytes as the code is wrong whenever the code is. The
      tests compare the stream with a hand-written document, a recorded reference, and an
      independent decoder that reads it back.
lesson: >-
  Against an emulated network printer, accented letters came out wrong: the emulator ignores
  the command that selects the character table. The bug was not in the code, and adapting to
  the emulator would have been the bug.
limits:
  - >-
    Not yet tested on real paper: the emulator verified the transport, not how text is encoded
    on an actual thermal printer.
  - The Kotlin code has a single automated check, building the example APK.
  - No iOS and no Bluetooth, nor barcodes or logos.
updated: 2026-09-17
---

Calculating a receipt is not enough: sooner or later it has to be printed, and a thermal
printer does not take text but a stream of ESC/POS commands. In between lies the boundary
between Dart and native code, and a device that speaks up whenever it likes, for instance
when it runs out of paper.

It is the trade I have practiced for twelve years, across cash registers, field handhelds,
payment terminals and serial fiscal printers. This project brings it into the portfolio and
closes the pipeline: `receipt_engine` calculates the receipt, `esc_pos_builder` lays it out
as bytes, `pos_printer_bridge` sends it to the printer.
