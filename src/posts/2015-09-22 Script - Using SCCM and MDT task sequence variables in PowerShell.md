---
title: Script - Using SCCM and MDT task sequence variables in PowerShell
date: 2015-09-22
author: Eric Haskins
tags: 
	- PowerShell
	- SCCM
	- MDT
---

# Just the code

## Get TSEnv instance
```
$ts = New-Object -COMObject Microsoft.SMS.TSEnvironment 
```

## Read a variable
```
$foo = $ts.Value("Foo")
```

## Set or create a variable
```
$ts.Value("Bar") = $bar
```

## Get all of the variables
```
$ts.GetVariables() | ForEach-Object {
	New-Object psobject -Property @{
		Name=$_;
		Value=$ts.Value($_)
	}
}
```

## Write a subset of the variables to a JSON file
Building on the last snippet we can write that to a JSON file on disk.
```
$ts.GetVariables() `
| Where-Object {$_ -notlike "_*"} `
| ForEach-Object {
	New-Object psobject -Property @{
		Name=$_;
		Value=$ts.Value($_)
	}
} `
| ConvertTo-Json `
| Set-Content 'tsVariables.json'
```

## Read the variables back, and update them from the JSON file
```
$json = Get-Content 'tsVariables.json' | ConvertFrom-Json
$json | ForEach-Object {$ts.Value($_.Name) = $_.Value}
```