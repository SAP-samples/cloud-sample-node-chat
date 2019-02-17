# NodeJS Chat Application

## Description: 
This is a simple chat application that is built on NodeJS. It uses socket.io library which enables real-time, event-based communication. It shows how socket.io rooms can be used to create different chat rooms.
This application can be run locally as well as on cloud foundry landscape.  

Features:
* Login with name, email id.
* Chat with a person who has logged into the same chat room. 
* Only 2 people are allowed per room. If more people enter, they will be directed to a different room.

## Requirements
- [Node js](https://nodejs.org/en/download/)
- [Cloud Foundry Command Line Interface (CLI)](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/4ef907afb1254e8286882a2bdef0edf4.html)
- Cloud Foundry trial or enterprise account, [sign up for a Cloud Foundry environment trial account on SAP Cloud Platform](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/76e79d62fa0149d5aa7b0698c9a33687.html)
   
## Download and Installation
Running the application

1. [Clone this repository](https://help.github.com/articles/cloning-a-repository/)
2. Login to Cloud Foundry by typing the below commands on command prompt
    ```
    cf api <api>
    cf login -u <username> -p <password> -o <org> -s <space> 
    ```
    api - URL of the cloud Foundry landscape that you are trying to connect to.
    
3. Edit Manifest

    Open the manifest.yml file and replace <I/D/C numbers> placeholders with your ```I/D/C numbers``` so that the host name is unique in the CF landscape.

4. Push the application

    ```cf push -f manifest.yml```
5. Once the application has been pushed successfully, open the URl in a web browser. 
You can test by opening the same chat room in different browser tabs. 


## How to Obtain Support

In case you find a bug, or you need additional support, please open an issue here in GitHub.

## License

Copyright (c) 2018 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under SAP Sample Code License Agreement, except as noted otherwise in the [LICENSE](/LICENSE) file.
