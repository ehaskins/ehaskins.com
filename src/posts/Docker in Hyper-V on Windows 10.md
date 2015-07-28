---
title: Docker in Hyper-V on Windows 10
date: 2015-07-27
author: Eric Haskins
draft: true
tags:
	- Docker
	- Windows
	- Powershell
	- Note to self
---

These are my notes for setting up docker on Windows 10 10240. Don't take them
as any more.

I run all of this from a Git Shell PowerShell intance since that'll have SSH 
and git available. The only exception is the actual creation command, which has
to be run from an Administrative instance.

# Prep
- Install Hyper-V

## Download Docker-Machine and Docker
```
mkdir c:\docker
cd c:\docker
Invoke-WebRequest -Uri https://get.docker.com/builds/Windows/x86_64/docker-latest.exe  -OutFile docker.exe
Invoke-WebRequest -Uri https://github.com/docker/machine/releases/download/v0.3.0/docker-machine_windows-amd64.exe -OutFile docker-machine.exe
```

## Add docker folder to path for future PS instances
```
Add-Content -Path $profile -Value '$env:path += ";c:\docker\"'
$env:path += ";c:\docker\"
```

# Create Docker VM
You need to run this from an Administrative PowerShell instance, or you'll get very unhelpful errors.

If you don't have a VMSwitch created yet, you'll need to do that. 
```
#Create a new VMSwitch connected to the first connected NIC
New-VMSwitch -Name External -NetAdapterName (Get-NetAdapter | ? {$_.Status -eq 'Up'} | Select -First 1).Name

#Create the Docker VM
docker-machine create --driver hyper-v dev
```

# Setup for environment for connection with Docker cli

```
# Add environment variables docker expects
docker-machine env dev | Invoke-Expression

# List containers in your Docker VM
docker ps
```

# See it do something!
```
docker run hello-world
```

# Misc. commands I'll want to remember
```
# Prints available machines to manage
docker-machine ls

# Get IP of Docker VM
docker-machine ip dev

# Start machine
docker start dev

# Stop machine
docker-machine stop

# Add environment variables docker expects
docker-machine env --shell powershell dev | Invoke-Expression

# List containers in your Docker VM
docker ps
```
