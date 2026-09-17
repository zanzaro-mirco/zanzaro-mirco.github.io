---
title: receipt_engine
order: 1
platform: Pure Dart · package
summary: >-
  The calculation engine for Italian fiscal receipts: multi-rate VAT, discounts, voids and
  returns, split payments, JSON serialization. Zero dependencies.
lead: >-
  Lines, discounts, VAT, returns and change for an Italian fiscal receipt, in pure Dart with
  no dependencies. Published on pub.dev, usable from an app, a backend or the command line.
stats:
  - value: 160/160
    label: on pub.dev
  - value: '110'
    label: tests
  - value: '7'
    label: properties on generated receipts
stack:
  - Dart 3, zero runtime dependencies
  - Hand-written property-based testing
  - pana and GitHub Actions
links:
  repository: https://github.com/zanzaro-mirco/receipt_engine
  architecture: https://github.com/zanzaro-mirco/receipt_engine/blob/main/ARCHITECTURE.md
  packages:
    - name: receipt_engine
      url: https://pub.dev/packages/receipt_engine
choices:
  - title: Amounts in cents, never double
    text: >-
      In binary floating point 0.1 + 0.2 is not 0.3, and that is not acceptable for money.
      Tax is derived as the difference from the taxable amount, so taxable amount plus tax
      always equals the gross.
  - title: A return is a second document
    text: >-
      An issued receipt is never edited: it is reversed. The return carries negative amounts,
      so the day's total is the sum of everything, with no special cases. And the refund is
      what the line actually collected, not its total: with a document-level discount the two
      figures differ.
  - title: Change only comes from the cash drawer
    text: >-
      Total €22, paid €25 by card: the €3 of change is not in the till. That is an error, not
      change. With split payments, change cannot exceed the cash received.
  - title: Reading back does not recalculate
    text: >-
      An issued fiscal document is read back as it is. If it went through the calculation
      again, a future fix to rounding would alter receipts already handed to customers. Every
      JSON document carries its schema version.
lesson: >-
  Tests on generated receipts found a bug no hand-written example would have caught: for
  goods sold by weight, the last portion of a return was rejected. And I learned that a
  property checked only on valid inputs does not notice when the code stops rejecting invalid
  ones.
limits:
  - >-
    The domain is Italian. VAT rates accept any percentage, but other countries' tax rules
    (which goods fall under which rate, reverse charge, document numbering) are not there.
  - >-
    Two partial returns can reverse one cent more tax than was collected, because each
    document rounds on its own, as the law requires. A test ties the gap to the number of
    documents.
  - A discount defined outside the package is calculated, but not serialized to JSON.
  - Meal vouchers with forfeited excess and the refund method of a return are not modeled.
updated: 2026-09-17
---

Calculating a receipt looks trivial until rounding shows up. If tax is computed line by line,
the sum can differ by a few cents from the tax computed on the total, and a receipt that is
off by one cent is an accounting problem, not a cosmetic detail.

The package comes from that problem, met while working on cash register software. It
isolates that logic in a module whose tests run in milliseconds.
