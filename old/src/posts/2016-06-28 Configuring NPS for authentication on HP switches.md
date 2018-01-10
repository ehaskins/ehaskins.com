---
title: Configuring NPS for authentication on HP switches
author: Eric Haskins
date: 2016-06-28
tags:
  - Switching
  - NPS
  - Windows
  - RADIUS
  - HP
---

# Prereqs

I'm assuming you have the NPS role installed on a Windows server, and a switch configured to the point where it can communicate with (can ping) the NPS server.

# Setup NPS

## Create RADIUS Client
Create a new RADIUS client as follows:
 - Friendly Name - Anything you want
   - Switches
 - IP Address - The address of a specific switch, or the subnet that contains all your switch in CIDR format.
   - 10.0.1.0/24
 - Shared Secret - A 32 char (or less) secret. You'll need it later.
 
## Create the Connection Request Policy
Create a new Connection Request Policy with the following settings:
 - Name - Switch Connection Policy
 - Type of server
  - Unspecified
 - Conditions - Add the following
  - Client Friendly Name = Friendly Name from above
    
## Create Network Policy
Create a new network policy with:
 - Name - Anything you'd like
  - Switch Admin Policy
 - Type of server
  - Unspecified
 - Conditions:
  - Windows Group - Used to filter to only admin users
   - Add it and select an appropriate security group to have access to the switches.
  - Client Friendly Name - Limit this policy to your switches. Use the friendly name from the RADIUS client.
   - Switches
 - Permissions
   - Access granted
 - EAP Types
  - Add PEAP
 - Less Secure authentication methods
  - Unselect all
 - Under RADIUS Attributes>Standard
  - Set Service-Type to Administrative (under "Others" drop-down)

# Configure Switch

Here are the relevant commands for the switch. 

```
;Disable the telnet server since we don't want domain creds flying around in plain text
no telnet-server

;Setup the RADIUS server info
radius-server host <NPS Server IP>
radius-server key "<Your Secret Key from the RADIUS Client in NPS>"

;Set switch to go immediately to enable mode once authenticated
aaa authentication login privilege-mode

;Configure specific interfaces to use the RADIUS server
aaa authentication web login peap-mschapv2
aaa authentication web enable peap-mschapv2
aaa authentication ssh login peap-mschapv2
aaa authentication ssh enable peap-mschapv2

;I omitted console since I want a backdoor in case of network issues, and have adequate physical access controls
;aaa authentication console login peap-mschapv2 local
;aaa authentication console enable peap-mschapv2 local
```
 
 

    
  