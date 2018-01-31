---
title: WTF is the DAA instruction?
author: Eric Haskins
date: 2018-01-30
tags:
  - Z80
  - Gameboy
  - WTF
---

# Background

I've been writing a Gameboy emulator. One of the last CPU instructions I have left to implement is `DAA`. I couldn't find a good explaination of what DAA is, let alone why it's behavior is what it is.

I'm writing this post as I try to understand how DAA works and why it exists.

# Binary Coded Decimal

Numbers are normally represented in binary, but sometimes (for reasons I'm not sure about) we encode each decimal digit into binary seperately. We call this seperate encoding of each digit "binary coded decimal".

The table below has a few examples. All of the binary and the first 4 BCD values are each 8 bits (1 byte).

| Decimal | Binary    | BCD                        |
| ------- | --------- | -------------------------- |
| 1       | 0000 0001 | 0000 (0) 0001 (1)          |
| 10      | 0000 1010 | 0001 (1) 0000 (0)          |
| 32      | 0010 0000 | 0011 (3) 0010 (2)          |
| 99      | 0110 0011 | 1001 (9) 1001 (9)          |
| 100     | 0110 0100 | 0001 (1) 0000 (0) 0000 (0) |

So, BCD is pretty ineffecient. Wastes 6 of the 16 possible values each 4 bits can hold. I'm not sure why it's particularly useful. But, apearantly somebody does.

# BCD Math

What happens if we add(or subtract) two BCD values using CPU instuctions designed to be used with regular binary values?

## Addition

Let's look at a simple case.

```
1 + 1

(1) 0001
(1) 0001 +
------
(2) 0010
```

So that worked, let try something a little harder.

```
5 + 5

(5)  0101
(5)  0101 +
-----------
(10) 1010
```

That looks ok, but we're working in BCD, so the output should be in BCD as well.

Since 10 is too big to fit in a decimal digit, we need to fix it. It turns out if we add 6 to the result, it produces a valid BCD value.

```
(10) 1010
(6)  0110 +
-----------
(16) 0001 (1) 0000 (0)
```

If the sum in greater, than 9, add 6.

It turns out this works for any single decimal digit addition, even when it overflows into a 5th bit.

```
(7)       0111
(9)       1001 +
----------
(16) 0001 0000

16 > 9, so

(16) 0001     0000
(6)  0000     0110 +
----------------
     0001 (1) 0110 (6)
```

## Two Digit Addition

Turns out this even works for two digit addition.

```
19 + 28 = 47

       11 (carries)
(19) 0001 (1) 1001 (9)
(28) 0010 (2) 1000 (8) +
------------------------
     0100 (4)   0001 (1)
```

Looking at the first 4 bits, they're only 1 which according to our rule wouldn't need to be corrected, but we need to look at the carry from the 4th to the 5th bit.

Since there was a carry from the 4th to 5th bit, it the first 4 bit addition really producted `0001 0001`. which is greater than `9`.

```
0100 (4)   0001 (1)
0000 (0)   0110 (6) +
---------------------
0100 (4)   0111 (7)
```

## Subtraction

So addition, even with multiple deciaml digits works with the same rule.

What about subtraction? Well, computers don't really do subtraction like humans do. They do subtraction by adding the "two's complement" of the value being subtracted to the value it's being subtracted from.

To compute a "two's complement", you invert all the bits, then add 1. Odd, I know, but it works.

```
47-28=19

Complement of 28
(28) 0010 (2) 1000 (8)
     1101     0111 (invert bits)
                 1 + (add 1)
    ----------------
     1101     1000
```

So now we subtract by adding.

```
47-28=19

   1 1
(48) 0100 (4) 0111 (7)
     1101     1000
------------------------
     0001 (1) 1111 (15)
```

Our first 4 bits are `1111 (15)`, we know our answer should be `9`. When adding we add 6 to any digit greater than 9. When subtracting, we subtract 6 from any digit greater than 9.

```
Complement 06
0000 0110
1111 1001
Add 1
1111 1010

1
  0001 (1) 1111 (15)
  1111     1010 +
---------------------
  0001 (1) 1001 (9)
```

There's carry out of the 8th bit, but we'll ignore that.

# Isn't This Post About DAA?

Now that we know what BCD is, how to correct when it's added or subtracted in a binary added, we can figure out the logic for DAA.

DAA is intended to be run immediately after an addition or subtraction operation, where the operands were BCD encoded. It then makes the corrections described above, so the result (stored in the A register) is the BCD encoded result of the previous operation.

However, DAA doesn't know what the original values were, and has minimal information about the calculation.

|                       |                                               |
| --------------------- | --------------------------------------------- |
| Value to be corrected | Stored in register A                          |
| Half carry (H) flag   | 1 if there was a carry from bit 4 to 5        |
| Carry (C) flag        | 1 if there was a carry from bit 8             |
| Subtraction (N)       | 1 if the previous operation was a subtraction |

We can distill our rules into

* If adding
  * Add 6 to each digit greater than 9, or if it carried
* If subtracting
  * Subtract 6 from each digit greater than 9, or if it carried

On a Z80, at least, the DAA instruction sets a couple of flags based on the final value. The logic for these is at the end of the function.

| Flag      | Condition     |
| --------- | ------------- |
| Carry (C) | Output > 0x99 |
| Zero (Z)  | Output == 0   |

```typescript
function DAA(value: number, subtraction: bool, carry: bool, halfCarry: bool) {
  let correction = 0;

  // Split apart each 4 bit digit
  let lowerNibble = value & 0x0f;
  let upperNibble = value & 0xf0;

  if (lowerNibble > 0x09 || halfCarry) {
    correction += 0x06;
  }

  if (upperNibble > 0x90 || carry) {
    correction += 0x60;
  }

  // If subtracting, negate the correction
  if (subtraction) {
    correction = -correction;
  }

  // Calculate flag values, and cleanup from overflows
  let output = value + correction;
  let carry = output > 0x99;

  // Mask off any bits above the 8th bit.
  output = output & 0xff;

  let zero = output === 0;

  return { output, carry, zero };
```

So that's the DAA instruction, though I'm still not sure why you'd want to use BCD.
