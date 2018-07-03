---
title: Architecture of a Gameboy Emulator
author: Eric Haskins
date: 2018-07-02
tags:
  - Emulator
  - Gameboy
---

# Intro

I'm building a Gameboy (Original and Color) emulator for the browser. It's written in a combination of Rust, compiled to WASM, and JS for browser integration.

This is a stream of conciousness post, as I'm figuring out a refactor.

## Original vs Color

I'm not going to address differences between original Gameboy and GB Color in the post. The Gameboy color is supprisingly similar hardware, and only adds a couple requirements:

- Be able to swap GBC peripherals/boot ROM
- Be able to change CPU speed at runtime, since GBC can run at either 4mhz or 8mhz.

# GameBoy system

## Clock speeds

### Machine vs. Clock Cycles

The Gameboy's CPU is clocked at ~4mhz, but it can only execute instuction once every 4 cycles. Some instructions take longer than 4 clock cycles, but they're all in fact multiples of 4. So it makes sense to think of the instruction timing as higher level "Machine" cycles which are equal to 4 clock "Time" cycle.

I'll use a convention often seen when discussing GB hardware. Using the shorthand "M-cycle" or just "M" for machine cycles, and "T-cycle" or "T" for clock cycles.

### Impact on Emulation

For the most part any behavior or timing only needs to be accurate to the M-cycle, but there are cases where within a 3-4 M-cycle instruction the timing of reads/writes/peripheral behavior is important.

Therefore, emulation of > 1 M-cycle instructions must include appropriate read/write timing, and allow peripherals to run at the correct times.

# Memory Map

## Types of memory

The Gameboy has several difference types of memory. Main (Working) RAM and a boot ROM, video RAM, "high" RAM used for stack and IO, but also the cartidge that can contain a combination of RAM, ROM and battery back RAM for saves.

This memory is seperated onto two buses. Each with 16 address lines, and 8 data. These buses share the same address space. That measn the Gameboy has 64k of address space, and can read/write one 8bit byte at a time.

The busess are seperate because during certain portions of rendering the PPU takes exclusive access to the DRAM bus, preventing the CPU from reading or writing to the video RAM.

## IO

Unlike 8080 and Z80 machines, the Gameboy exclusively uses memory mapped IO. So all IO is done by reading or writing particular memory addresses.

These IO address use the same 64k of address space as RAM and ROM.

## Memory Map

## Peripherals

Many of these components are actually on a single IC, the DMG-CPU chip, I consider these all logically as peripherals.

Some of the peripherals on the Gameboy

- Pixel Processing Unit (PPU)
- Audio Processing Unit (APU)
- Timers
- Serial Communication (GameLink cable)
- Joypad
- Cartridge
  - RAM
  - ROM
  - Vibration
- Interrupt hardware
- RAM
- High Ram
