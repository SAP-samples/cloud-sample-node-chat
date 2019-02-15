# cloud-sample-node-chat

# Description: 
A Simple chat application that is built on NodeJS.

Features:
* Login with name, email id.
* Chat with a person who has logged into the same chat room. 
* Only 2 people are allowed per room. If more people enter, they will be directed to a different room.

# Requirements
- [Node js](https://nodejs.org/en/download/)
- [CF CLI](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/4ef907afb1254e8286882a2bdef0edf4.html)
- If you do not yet have a Cloud Foundry environment trial or enterprise account, signup for a Cloud Foundry environment trial account by following the [documentation](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/76e79d62fa0149d5aa7b0698c9a33687.html)
   
# Download and Installation
Running the application

#### 1. Clone the repository
#### 2. Login to Cloud Foundry

```
cf api <api>
cf login -u <username> -p <password> -o <org> -s <space>
```
#### 3. Bind to postgres service on CF
```
cf create-service postgresql v9.4-dev <serviceInstanceName>
```
#### 4. Edit Manifest

Open the manifest.yml file and edit the following
Replace <serviceInstanceName> placeholder with the DB instance name created in previous step and <i/D/C number> placeholders with your ```I/D/C numbers``` so that the application name and host name is unique in the CF landscape.

#### 5. Push the application

```cf push -f manifest.yml```

# How to Obtain Support

In case you find a bug/need support please create github issues

# License

Copyright (c) 2018 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under SAP Sample Code License Agreement, except as noted otherwise in the [LICENSE](/LICENSE) or [CREDITS](/CREDITS) file.
