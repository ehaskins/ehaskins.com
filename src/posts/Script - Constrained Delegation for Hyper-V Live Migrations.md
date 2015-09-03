---
title: Script - Constrained Delegation for Hyper-V Live Migrations
author: Eric Haskins
date: 2015-09-02
tags:
  - PowerShell
  - Script
  - Hyper-V
  - Active Directory
draft: false
---
# Background
There are two options for Live Migration security in Hyper-V.
1. Credential Security Support Provider (CredSSP)
	- No configuration
	- Must login locally/RDP to origin host to initiate the transfer
2. Kerberos
	- Allows you to initiate the migration from any machine
	- Requres you configure constrained delegation on between the hosts

It's not a hard job to add the delegation for a pair of servers, but once you have a few it quickly becomes a pain. We're going to write a little PowerShell script to setup constrained delegation between any number of hosts.

## Resources
[TechNet Article on configuring Live Migration](https://technet.microsoft.com/en-us/library/jj134199.aspx)

# What do we need to do?
I've enabled constrained delegation between two servers (`host` and `host2`) using Active Directory Users and Computers. We'll use `host2` as the source, and `host` for the destination.

Let's see what kind of changes we see of the `host2`'s account after setting up constrained delegation.

```
PS C:\Users\ehaskins> Get-ADComputer host2 -Properties * | fc * -Depth 1

class ADComputer
{
  ...
  DistinguishedName = CN=HOST2,OU=Servers,OU=IT,OU=EHNet,DC=ehnet,DC=ehaskins,D
  C=net
  DNSHostName = HOST2.ehnet.ehaskins.net
  ...
  msDS-AllowedToDelegateTo =
    [
      Microsoft Virtual System Migration Service/HOST.ehnet.ehaskins.net
      Microsoft Virtual System Migration Service/HOST
      cifs/HOST.ehnet.ehaskins.net
      cifs/HOST
    ]
  ...
  PropertyCount = 85
}
PS C:\Users\ehaskins>
```

Looking through that output we can see what the constained delegation dialog is doing. It's just adding items to `msDS-AllowedToDelegateTo` property of the source host. They seem to just be in the form of `service/machine`. For some reason it added both the qualified and unqualified names. I don't know why, but we can replicate that behavior...

I also figured out from experimenting that you can list a server in it's own AllowedToDeledateTo list without breaking anything. That's helpful since that means we can set all the hosts the same.

# The plan
We need to:
1. Create a list of values to put in `msDS-AllowedToDelegateTo`
2. Set the `msDS-AllowedToDelegateTo` property on each server
  - We're going to replace any existing content there, but could make this smarter in the future.
3. Celebrate

## Build the `msDS-AllowedToDelegateTo` list
We can do something list this.
```
$domain = 'ehnet.ehaskins.net'
$servers = @(
  'host', 
  'host2'
)

$services = @(
  'Microsoft Virtual System Migration Service',
  'cifs'
)

$allowDelgationTo = foreach ($server in $servers){
    foreach ($service in $services){
        '{0}/{1}' -f $service, $server
        '{0}/{1}.{2}' -f $service, $server, $domain
    }
}

$allowDelgationTo
```

When we run that we get this, which other than some capitalization differences looks a lot like the output from above. I think it'll work.
```
Microsoft Virtual System Migration Service/host
Microsoft Virtual System Migration Service/host.ehnet.ehaskins.net
cifs/host
cifs/host.ehnet.ehaskins.net
Microsoft Virtual System Migration Service/host2
Microsoft Virtual System Migration Service/host2.ehnet.ehaskins.net
cifs/host2
cifs/host2.ehnet.ehaskins.net
```

## Write the value to AD

Normally we could just use `Set-AdComputer`, but unfortunately it doesn't have a parameter to set this property. Instead, we're going to use `Set-AdComputer -Instance` to save an object we've modified.
```
foreach ($server in $servers){
    $acct = get-adcomputer host -Properties msDS-AllowedToDelegateTo

    # Note we're putting the property name in quotes since in contains a "-" which is't allowed normally.
    $acct."msDS-AllowedToDelegateTo" = $allowDelgationTo
    Set-ADComputer -Instance $acct
}
```

# Completed Script

<script src="https://gist.github.com/ehaskins/90302dc2356d28e724a1.js"></script>
