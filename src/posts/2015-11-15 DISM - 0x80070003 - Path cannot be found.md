---
title: DISM - 0x80070003 - The system cannot find the path specified
author: Eric Haskins
date: 2015-11-15
tags:
  - DISM
  - Windows Updates
---

```
PS C:\Windows Image Update Working> dism /image:"C:\Windows Image Update Working\Mount" /add-package /packagePath:"C:\Windows Image Update Working\Updates"
Deployment Image Servicing and Management tool
Version: 6.3.9600.17031

Image Version: 6.1.7600.16385

An error occurred trying to open - C:\Windows Image Update Working\Updates Error: 0x80070003

Error: 3

The system cannot find the path specified.

The DISM log file can be found at C:\Windows\Logs\DISM\dism.log
```

I just spent way too much time figuring out why this command was failing.

Turns out DISM doesn't like spaces in the paths. Renamed a couple directories, and now everything is happy.

```
PS C:\WindowsImageUpdateWorkingDir> dism /image:"C:\WindowsImageUpdateWorkingDir\Mount" /add-package /packagePath:"C:\WindowsImageUpdateWorkingDir\Updates"
Dployment Image Servicing and Management tool
Version: 6.3.9600.17031

Image Version: 6.1.7600.16385

Processing 1 of 212 - Adding package Package_for_KB3100773~31bf3856ad364e35~amd64~~
10.2.1.0
Processing 2 of 212 - Adding package Package_for_KB3100773~31bf3856ad364e35~amd64~~
11.2.1.0
Processing 3 of 212 - Adding package Package_for_KB3100773~31bf3856ad364e35~amd64~~
9.4.1.0
Processing 4 of 212 - Adding package Package_for_KB2393802~31bf3856ad364e35~amd64~~
6.1.1.1
Processing 5 of 212 - Adding package Package_for_KB2479943~31bf3856ad364e35~amd64~~
6.1.1.0
...
```