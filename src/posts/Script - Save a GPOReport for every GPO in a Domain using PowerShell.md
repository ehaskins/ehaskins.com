---
title: Script - Save a GPOReport for every GPO in a Domain using PowerShell
author: Eric Haskins
date: 2015-09-07
tags:
  - Script
  - PowerShell
  - Active Directory
  - Group Policy
---

# Backgroud
You can generate a report from Group Policy Management Console that includes all of the setting, links, permissions and other settings for a GPO. 

I want to generate that report for every GPO in my domain, but not have to open every one in GPMC to do so.

# The Sript
This is a pretty simple one-liner, so I'll get straigt to it.

We can get a list of all of the GPOs in a domain with this:
```
Get-GPO -All
```

Then we can get a GPO Report like this:
```
Get-GPOReport -Name MyGPO -ReportType Html -Path report.html
```

We can even get a single report with all of the GPOs in a single html file like this:
```
Get-GPOReport -All -ReportType Html -Path report.html
```

If that works for you, then stip here, but I want a directory with a file for each GPO.

Luckily we can combine those two cmdlets like this to get what I want.
```
Get-GPO -All | ForEach-Object {$_ | Get-GPOReport -ReportType HTML -Path "c:\GPOReports\$($_.DisplayName).html"}
```

Notice I didn't pipe directly to the `Get-GPOReport` cmdlet. That allows me to include the name of the GPO in the path parameter provided to Get-GPOReport.

# Resources
- [TechNet GroupPolicy Cmdlets in Windows PowerShell](https://technet.microsoft.com/en-us/library/ee461027.aspx)
