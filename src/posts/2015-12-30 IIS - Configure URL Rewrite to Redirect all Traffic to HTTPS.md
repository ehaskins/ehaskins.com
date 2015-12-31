---
title: IIS - Configure URL Rewrite to Redirect all Traffic to HTTPS
author: Eric Haskins
date: 2015-12-30
tags:
  - IIS
  - URL Rewrite
---

# Get URL Rewrite
Install URL Rewrite from http://www.iis.net/downloads/microsoft/url-rewrite or the Web Platform Installer.

# Configure it
Merge this into your existing `web.config`, and all traffic will be redirected to HTTPS.

```
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Redirect to HTTPS" stopProcessing="true">
                    <match url="(.*)" />
                    <conditions>
                        <add input="{HTTPS}" pattern="OFF" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```