---
title: Script - List Inactive Users or Computers in AD
author: Eric Haskins
date: 2015-11-05
tags:
  - Script
  - PowerShell
  - Active Directory
---

# Why
I'm cleaning up an Active Directory domain, and needed to get an idea of how many computers are in use vs. inactive.

# Script
I'm doing some other spluking with this, so I'm going to stick a list of all computers in a variable. I'm including the `lastLogonTimeStamp` we're going to use to figure out which computers are active.
```
$rawComputers = Get-ADComputer -Filter * -Properties lastLogonTimestamp
```

`lastLogonTimeStamp` is represented as a file timestamp, not a `DateTime`. Let's fix that an get rid of some extra properties.
```
$computers = $rawComputers | select Name, DistinguishedName, Enabled, @{Name="Timestamp"; Expression={[DateTime]::FromFileTime($_.lastLogonTimestamp)}}
```

How many have a `lastLogonTimeStamp` more than 30 days old?
```
$cutoff = [DateTime]::Now.Subtract([TimeSpan]::FromDays(30))
($computers | ? {$_.Timestamp -lt $cutoff}).Count
```

Let's export that to a CSV.
```
$computers | ? {$_.Timestamp -lt $cutoff} | Export-CSV -NoTypeInformation -Path InactiveComputers.csv
```


# Resources
  - [Ask the Directory Services Team - “The LastLogonTimeStamp Attribute” – “What it was designed for and how it works”](http://blogs.technet.com/b/askds/archive/2009/04/15/the-lastlogontimestamp-attribute-what-it-was-designed-for-and-how-it-works.aspx?PageIndex=2#comments)